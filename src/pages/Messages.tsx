import { useEffect, useState, useCallback } from 'react';
import { supabase } from '../supabaseClient';
import UserMessagesButton from "../components/UserMessagesButton";
import UserMessagesModal from "../components/UserMessagesModal";
import { toast } from 'sonner';
import { IconHeart, IconMessageCircle, IconChevronDown } from '@tabler/icons-react';

type Message = {
    id: number;
    created_at: string;
    message: string;
    author: string;
    message_reply: number | null;
    likes: number;
};

type SortOption = 'time' | 'rating' | 'replies';

function Messages() {
    const [messages, setMessages] = useState<Message[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [visibleCount, setVisibleCount] = useState(5);
    const [replyingTo, setReplyingTo] = useState<number | null>(null);
    const [sortBy, setSortBy] = useState<SortOption>('time');
    const [showSortDropdown, setShowSortDropdown] = useState(false);
    const [likedMessages, setLikedMessages] = useState<Set<number>>(() => {
        const saved = localStorage.getItem('likedMessages');
        return saved ? new Set(JSON.parse(saved)) : new Set();
    });

    useEffect(() => {
        localStorage.setItem('likedMessages', JSON.stringify(Array.from(likedMessages)));
    }, [likedMessages]);

    const formatDateTime = (dateTimeString: string) => {
        const date = new Date(dateTimeString);
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const year = date.getFullYear();
        const time = date.toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit',
            hour12: true
        });

        return <div className="text-right">{`${day}/${month}/${year}`}<br />{time}</div>;
    };

    const fetchMessages = useCallback(async () => {
        try {
            setError(null);
            const { data, error } = await supabase
                .from('messages')
                .select('*')
                .order('created_at', { ascending: false });

            if (error) throw error;
            setMessages(data || []);
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Failed to fetch messages';
            setError(errorMessage);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchMessages();
    }, [fetchMessages]);

    useEffect(() => {
        const channel = supabase
            .channel('messages-updates')
            .on(
                'postgres_changes',
                { event: '*', schema: 'public', table: 'messages' },
                () => fetchMessages()
            )
            .subscribe();

        return () => {
            supabase.removeChannel(channel);
        };
    }, [fetchMessages]);

    const handleLike = async (id: number) => {
        const message = messages.find(m => m.id === id);
        if (!message) return;

        const isLiked = likedMessages.has(id);
        const currentLikes = message.likes;
        const newLikes = isLiked ? currentLikes - 1 : currentLikes + 1;

        // Optimistic UI update
        setMessages(prev => prev.map(m => m.id === id ? { ...m, likes: newLikes } : m));
        setLikedMessages(prev => {
            const newSet = new Set(prev);
            if (isLiked) {
                newSet.delete(id);
            } else {
                newSet.add(id);
            }
            return newSet;
        });

        // Update the database
        const { error } = await supabase
            .from('messages')
            .update({ likes: newLikes })
            .eq('id', id);

        if (error) {
            toast.error("Failed to update like count.");
            // Revert UI on error
            setMessages(prev => prev.map(m => m.id === id ? { ...m, likes: currentLikes } : m));
            setLikedMessages(prev => {
                const newSet = new Set(prev);
                if (isLiked) {
                    newSet.add(id);
                } else {
                    newSet.delete(id);
                }
                return newSet;
            });
        }
    };

    const loadMore = () => {
        setVisibleCount(prev => prev + 5);
    };

    const getReplies = (messageId: number) => {
        return messages.filter(m => m.message_reply === messageId);
    };

    const getSortedMessages = () => {
        const topLevelMessages = messages.filter(m => m.message_reply === null);

        switch (sortBy) {
            case 'rating':
                return topLevelMessages.sort((a, b) => b.likes - a.likes);
            case 'replies':
                return topLevelMessages.sort((a, b) => getReplies(b.id).length - getReplies(a.id).length);
            case 'time':
            default:
                return topLevelMessages.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
        }
    };

    const getSortLabel = (option: SortOption) => {
        switch (option) {
            case 'time':
                return 'Most Recent';
            case 'rating':
                return 'Highest Rated';
            case 'replies':
                return 'Most Replies';
            default:
                return 'Most Recent';
        }
    };

    const handleSortChange = (option: SortOption) => {
        setSortBy(option);
        setShowSortDropdown(false);
        setVisibleCount(5); // Reset visible count when sorting changes
    };

    const renderMessage = (message: Message, isReply: boolean = false) => (
        <li
            key={message.id}
            className={`bg-white border border-gray-100 rounded-lg p-4 transition-all duration-200 hover:shadow-md hover:border-gray-200 relative ${
                isReply ? 'ml-6 mt-2' : ''
            }`}>
            <div className="flex justify-between items-start">
                <div className="flex-1 pr-10">
                    <p className="text-gray-800 break-all">{message.message}</p>
                    <p className="text-xs text-gray-500 mt-2">- {message.author}</p>
                </div>
                <div className="text-xs text-gray-400 flex-shrink-0">{formatDateTime(message.created_at)}</div>
            </div>
            <div className="flex items-center gap-4 mt-3 pt-3 border-t border-gray-50">
                <button
                    onClick={() => handleLike(message.id)}
                    className={`flex items-center gap-1.5 text-xs text-gray-500 hover:text-red-500 transition-colors ${likedMessages.has(message.id) ? 'text-red-500' : ''}`}>
                    <IconHeart size={16} />
                    <span>{message.likes}</span>
                </button>
                {!isReply && (
                    <button
                        onClick={() => setReplyingTo(message.id)}
                        className="flex items-center gap-1.5 text-xs text-gray-500 hover:text-blue-500 transition-colors">
                        <IconMessageCircle size={16} />
                        <span>Reply</span>
                    </button>
                )}
            </div>
            {!isReply && getReplies(message.id).length > 0 && (
                <ul className="mt-3 space-y-2">
                    {getReplies(message.id).map(reply => renderMessage(reply, true))}
                </ul>
            )}
        </li>
    );

    return (
        <div className="min-h-screen bg-white flex flex-col relative pb-24">
            <header className="sticky top-0 z-50 bg-white flex justify-between items-center p-4 sm:p-6 md:p-8 lg:p-10 pb-3 sm:pb-4 md:pb-5 border-b border-gray-100">
                <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-semibold text-black leading-tight">
                    WYS <br /> BRO
                </h1>
                <div className="flex-shrink-0 flex flex-col items-center text-center">
                    <a
                        href="/home"
                        className="bg-black text-white font-bold px-4 py-2 sm:px-6 sm:py-3 md:px-8 md:py-4 rounded-full text-base sm:text-lg md:text-xl lg:text-2xl leading-tight transition-all duration-200 hover:bg-gray-800 hover:scale-105 active:scale-95 shadow-lg hover:shadow-xl flex items-center gap-2"
                    >
                        HOME
                    </a>
                </div>
            </header>

            {!loading && !error && messages.length > 0 && (
                <div className="px-3 sm:px-6 py-4 border-b border-gray-100">
                    <div className="max-w-3xl mx-auto">
                        <div className="relative">
                            <button
                                onClick={() => setShowSortDropdown(!showSortDropdown)}
                                className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-800 transition-colors font-medium"
                            >
                                Sort by: {getSortLabel(sortBy)}
                                <IconChevronDown size={16} className={`transform transition-transform ${showSortDropdown ? 'rotate-180' : ''}`} />
                            </button>

                            {showSortDropdown && (
                                <div className="absolute top-full left-0 mt-2 bg-white border border-gray-200 rounded-lg shadow-lg py-2 min-w-[160px] z-10">
                                    <button
                                        onClick={() => handleSortChange('time')}
                                        className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-50 transition-colors ${sortBy === 'time' ? 'text-black font-medium' : 'text-gray-600'}`}
                                    >
                                        Most Recent
                                    </button>
                                    <button
                                        onClick={() => handleSortChange('rating')}
                                        className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-50 transition-colors ${sortBy === 'rating' ? 'text-black font-medium' : 'text-gray-600'}`}
                                    >
                                        Highest Rated
                                    </button>
                                    <button
                                        onClick={() => handleSortChange('replies')}
                                        className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-50 transition-colors ${sortBy === 'replies' ? 'text-black font-medium' : 'text-gray-600'}`}
                                    >
                                        Most Replies
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}

            <main className="flex-1 px-3 sm:px-6 py-6">
                {loading ? (
                    <div className="text-center py-20">
                        <p className="text-lg text-gray-500">Loading messages...</p>
                    </div>
                ) : error ? (
                    <div className="flex-1 flex flex-col items-center justify-center p-4 sm:p-6">
                        <p className="text-red-600 mb-4 text-center">Error: {error}</p>
                        <button
                            onClick={fetchMessages}
                            className="bg-black text-white px-4 py-2 rounded hover:bg-gray-800 transition">
                            Try Again
                        </button>
                    </div>
                ) : messages.length === 0 ? (
                    <div className="text-center py-20">
                        <p className="text-lg text-gray-500">No messages yet.</p>
                        <p className="text-sm text-gray-400">What's on your mind tho?</p>
                    </div>
                ) : (
                    <>
                        <ul className="space-y-4 max-w-3xl mx-auto">
                            {getSortedMessages().slice(0, visibleCount).map(message => renderMessage(message))}
                        </ul>
                        {visibleCount < getSortedMessages().length && (
                            <div className="text-center mt-8">
                                <button
                                    onClick={loadMore}
                                    className="bg-black text-white px-6 py-3 rounded-full hover:bg-gray-800 transition-colors font-medium">
                                    Load More ({getSortedMessages().length - visibleCount} remaining)
                                </button>
                            </div>
                        )}
                    </>
                )}
            </main>

            <UserMessagesButton onSuccess={fetchMessages} />

            {replyingTo !== null && (
                <UserMessagesModal
                    replyTo={replyingTo}
                    onClose={() => setReplyingTo(null)}
                    onSuccess={() => {
                        setReplyingTo(null);
                        fetchMessages();
                    }}
                />
            )}
        </div>
    );
}

export default Messages;