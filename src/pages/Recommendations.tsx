import { useEffect, useState, useCallback } from 'react';
import { supabase } from '../supabaseClient';
import RecommendButton from "../components/RecommendButton";
import SecretButton from "../components/SecretButton";
import MessageModal from "../components/MessageModal";
import { toast } from 'sonner';
import { IconChevronDown } from '@tabler/icons-react';

type Recommendation = {
    id: string;
    name: string;
    song_title: string;
    artist: string;
    link: string | null;
    rating: number | null;
    created_at: string;
    message: string | null;
};

type SortOption = 'time' | 'rating' | 'with_message';

function Recommendations() {
    const [recs, setRecs] = useState<Recommendation[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [isAdmin, setIsAdmin] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [visibleCount, setVisibleCount] = useState(3);
    const [updatingRating, setUpdatingRating] = useState(false);
    const [editingMessageId, setEditingMessageId] = useState<string | null>(null);
    const [sortBy, setSortBy] = useState<SortOption>('time');
    const [showSortDropdown, setShowSortDropdown] = useState(false);

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

    const fetchRecs = useCallback(async () => {
        try {
            setError(null);
            const { data, error } = await supabase
                .from('recommendations')
                .select('*')
                .order('created_at', { ascending: false });

            if (error) throw error;
            setRecs(data || []);
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Failed to fetch recommendations';
            console.error('Error fetching recommendations:', errorMessage);
            setError(errorMessage);
        } finally {
            setLoading(false);
        }
    }, []);

    const updateRating = useCallback(async (recId: string, newRating: number) => {
        setUpdatingRating(true);
        try {
            const { error } = await supabase
                .from('recommendations')
                .update({ rating: newRating })
                .eq('id', recId);

            if (error) throw error;
            setEditingId(null);
            // Optimistically update local state
            setRecs(prev => prev.map(rec =>
                rec.id === recId ? { ...rec, rating: newRating } : rec
            ));
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Failed to update rating';
            console.error('Error updating rating:', errorMessage);
            alert('Failed to update rating: ' + errorMessage);
        } finally {
            setUpdatingRating(false);
        }
    }, []);

    const updateMessage = useCallback((recId: string, newMessage: string | null) => {
        setRecs(prev => prev.map(rec =>
            rec.id === recId ? { ...rec, message: newMessage } : rec
        ));
        setEditingMessageId(null);
    }, []);

    const copyToClipboard = useCallback(async (artist: string, songTitle: string) => {
        try {
            const textToCopy = `${artist} ${songTitle}`;
            await navigator.clipboard.writeText(textToCopy);
            toast.success('Song details copied to clipboard');
        } catch (err) {
            console.error('Failed to copy:', err);
            toast.error('Failed to copy');
        }
    }, []);

    const getSortedRecs = () => {
        switch (sortBy) {
            case 'rating':
                return recs.sort((a, b) => {
                    // Sort by rating, highest first, null ratings go to the end
                    if (a.rating === null && b.rating === null) return 0;
                    if (a.rating === null) return 1;
                    if (b.rating === null) return -1;
                    return b.rating - a.rating;
                });
            case 'with_message':
                return recs.sort((a, b) => {
                    // Sort by having a message first, then by time
                    if (a.message && !b.message) return -1;
                    if (!a.message && b.message) return 1;
                    return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
                });
            case 'time':
            default:
                return recs.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
        }
    };

    const getSortLabel = (option: SortOption) => {
        switch (option) {
            case 'time':
                return 'Most Recent';
            case 'rating':
                return 'Highest Rated';
            case 'with_message':
                return 'With Message';
            default:
                return 'Most Recent';
        }
    };

    const handleSortChange = (option: SortOption) => {
        setSortBy(option);
        setShowSortDropdown(false);
        setVisibleCount(3); // Reset visible count when sorting changes
    };

    useEffect(() => {
        fetchRecs();
    }, [fetchRecs]);

    useEffect(() => {
        const channel = supabase
            .channel('recommendations-updates')
            .on(
                'postgres_changes',
                { event: '*', schema: 'public', table: 'recommendations' },
                () => fetchRecs()
            )
            .subscribe();

        return () => {
            supabase.removeChannel(channel);
        };
    }, [fetchRecs]);

    const loadMore = useCallback(() => {
        setVisibleCount(prev => prev + 3);
    }, []);

    if (loading) {
        return (
            <div className="min-h-screen bg-white flex flex-col relative pb-16 sm:pb-20 md:pb-24">
                <header className="sticky top-0 z-50 bg-white flex justify-between items-center p-4 sm:p-6 md:p-8 lg:p-10 pb-3 sm:pb-4 md:pb-5 border-b border-gray-100">
                    <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-semibold text-black leading-tight">
                        PUT ME <br /> ON
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
                <div className="flex-1 flex items-center justify-center p-4">
                    <p className="text-base sm:text-lg text-gray-600">Loading...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-white flex flex-col relative pb-16 sm:pb-20 md:pb-24">
                <header className="sticky top-0 z-50 bg-white flex justify-between items-center p-4 sm:p-6 md:p-8 lg:p-10 pb-3 sm:pb-4 md:pb-5 border-b border-gray-100">
                    <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-semibold text-black leading-tight">
                        RE <br /> CS
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
                <div className="flex-1 flex flex-col items-center justify-center p-4 sm:p-6">
                    <p className="text-red-600 mb-4 text-sm sm:text-base text-center px-2">
                        Error: {error}
                    </p>
                    <button
                        onClick={fetchRecs}
                        className="bg-black text-white px-4 py-2 rounded hover:bg-gray-800 transition text-sm sm:text-base"
                    >
                        Try Again
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-white flex flex-col relative pb-16 sm:pb-20 md:pb-24">
            {/* Mobile-optimized header */}
            <header className="sticky top-0 z-50 bg-white flex justify-between items-center p-4 sm:p-6 md:p-8 lg:p-10 pb-3 sm:pb-4 md:pb-5 border-b border-gray-100">
                <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-semibold text-black leading-tight">
                    PUT ME <br /> ON
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

            {recs.length === 0 ? (
                <div className="flex-1 flex items-center justify-center p-4">
                    <p className="text-base sm:text-lg font-bold text-gray-600">No recs yet.</p>
                </div>
            ) : (
                <>
                    {/* Sorting section */}
                    <div className="px-3 sm:px-4 md:px-6 lg:px-8 py-4 border-b border-gray-100">
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
                                        onClick={() => handleSortChange('with_message')}
                                        className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-50 transition-colors ${sortBy === 'with_message' ? 'text-black font-medium' : 'text-gray-600'}`}
                                    >
                                        With Message
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Mobile-optimized recommendations list */}
                    <div className="flex-1 px-3 sm:px-4 md:px-6 lg:px-8 py-4 sm:py-6">
                        <ul className="space-y-3 sm:space-y-4 md:space-y-6">
                            {getSortedRecs().slice(0, visibleCount).map((rec) => (
                                <li
                                    key={rec.id}
                                    className="bg-white border border-gray-100 rounded-lg p-4 sm:p-5 md:p-6 lg:p-8 transition-all duration-200 hover:shadow-md hover:border-gray-200 relative"
                                >
                                    {/* Date/Time in top right */}
                                    <div className="absolute top-4 right-4 text-xs text-gray-500">
                                        {formatDateTime(rec.created_at)}
                                    </div>

                                    {/* Song title and artist */}
                                    <div className="mb-2 sm:mb-3 pr-20 sm:pr-24">
                                        <div className="flex flex-col sm:flex-row sm:items-baseline gap-1 sm:gap-2">
                                            <span className="text-sm sm:text-base md:text-lg font-medium text-black leading-tight">
                                                {rec.song_title}
                                            </span>
                                            <span className="text-xs sm:text-sm md:text-base text-gray-600">
                                                by {rec.artist}
                                            </span>
                                        </div>
                                    </div>

                                    {/* Recommender name */}
                                    <div className="text-xs sm:text-sm text-gray-500 mb-2 sm:mb-3">
                                        From: {rec.name}
                                    </div>

                                    {/* Rating section */}
                                    <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3 mb-2 sm:mb-3">
                                        {editingId === rec.id ? (
                                            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2">
                                                <select
                                                    value={rec.rating ?? ''}
                                                    onChange={(e) => {
                                                        const newRating = parseInt(e.target.value);
                                                        if (!isNaN(newRating)) {
                                                            updateRating(rec.id, newRating);
                                                        }
                                                    }}
                                                    disabled={updatingRating}
                                                    className="border border-gray-300 rounded px-2 py-1 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-black disabled:opacity-50 w-16"
                                                >
                                                    <option value="">—</option>
                                                    {Array.from({ length: 10 }, (_, i) => i + 1).map((n) => (
                                                        <option key={n} value={n}>{n}</option>
                                                    ))}
                                                </select>
                                                <div className="flex items-center gap-2">
                                                    <button
                                                        onClick={() => setEditingId(null)}
                                                        disabled={updatingRating}
                                                        className="text-xs text-gray-500 hover:underline disabled:opacity-50"
                                                    >
                                                        Cancel
                                                    </button>
                                                    {updatingRating && (
                                                        <span className="text-xs text-gray-500">Saving...</span>
                                                    )}
                                                </div>
                                            </div>
                                        ) : (
                                            <div className="flex items-center gap-2">
                                                <span className="text-xs sm:text-sm text-gray-700 font-medium">
                                                    {rec.rating !== null ? `Rating: ${rec.rating}/10` : 'No rating yet'}
                                                </span>
                                                {isAdmin && (
                                                    <button
                                                        onClick={() => setEditingId(rec.id)}
                                                        className="text-gray-400 hover:text-black transition-colors duration-200 p-1"
                                                        title="Edit rating"
                                                    >
                                                        <span className="text-xs">✏️</span>
                                                    </button>
                                                )}
                                            </div>
                                        )}
                                    </div>

                                    {/* Message section */}
                                    {rec.message && (
                                        <div className="pb-3">
                                            <div className="flex items-start gap-2">
                                                <p className="text-xs sm:text-sm text-black">
                                                    <span className="font-bold">Mastermind's Notes</span>
                                                    : {rec.message}
                                                </p>
                                                {isAdmin && (
                                                    <button
                                                        onClick={() => setEditingMessageId(rec.id)}
                                                        className="text-gray-400 hover:text-black transition-colors duration-200 flex-shrink-0"
                                                        title="Edit message"
                                                    >
                                                        <span className="text-xs">✏️</span>
                                                    </button>
                                                )}
                                            </div>
                                        </div>
                                    )}

                                    {/* Add message button for admin when no message exists */}
                                    {isAdmin && !rec.message && (
                                        <div className="mb-2 sm:mb-3">
                                            <button
                                                onClick={() => setEditingMessageId(rec.id)}
                                                className="text-xs text-gray-500 hover:text-black transition-colors duration-200 flex items-center gap-1"
                                            >
                                                <span>💬</span>
                                                Add message
                                            </button>
                                        </div>
                                    )}

                                    {/* Action buttons row */}
                                    <div className="flex items-center gap-3">
                                        {/* Listen link */}
                                        {rec.link && (
                                            <a
                                                href={rec.link}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="inline-flex items-center gap-1 text-xs sm:text-sm text-black underline hover:text-gray-700 transition-colors duration-200"
                                            >
                                                Listen
                                                <span className="text-xs">→</span>
                                            </a>
                                        )}
                                    </div>

                                    {/* Copy button positioned at bottom right */}
                                    <div className="pt-2">
                                        <button
                                            onClick={() => copyToClipboard(rec.artist, rec.song_title)}
                                            className="absolute bottom-4 right-4 bg-black text-white px-3 py-1 rounded text-xs sm:text-sm hover:bg-gray-800 transition-colors duration-200"
                                        >
                                            Copy
                                        </button>
                                    </div>
                                </li>
                            ))}
                        </ul>

                        {/* Load more button */}
                        {visibleCount < getSortedRecs().length && (
                            <div className="text-center mt-6 sm:mt-8 md:mt-10">
                                <button
                                    onClick={loadMore}
                                    className="bg-black text-white px-4 sm:px-6 py-2 sm:py-3 rounded-full hover:bg-gray-800 transition-colors duration-200 text-sm sm:text-base font-medium"
                                >
                                    Load More ({getSortedRecs().length - visibleCount} remaining)
                                </button>
                            </div>
                        )}
                    </div>
                </>
            )}

            {/* Fixed action buttons */}
            <RecommendButton />
            {!isAdmin && (
                <SecretButton onUnlock={() => setIsAdmin(true)} />
            )}

            {/* Message Modal */}
            {editingMessageId && (
                <MessageModal
                    recommendationId={editingMessageId}
                    existingMessage={recs.find(r => r.id === editingMessageId)?.message || null}
                    onClose={() => setEditingMessageId(null)}
                    onUpdate={(message) => updateMessage(editingMessageId, message)}
                />
            )}
        </div>
    );
}

export default Recommendations;