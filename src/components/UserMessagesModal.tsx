import { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';
import { toast } from 'sonner';

type Props = {
    replyTo?: number | null;
    onClose: () => void;
    onSuccess: () => void;
};

function UserMessagesModal({ replyTo = null, onClose, onSuccess }: Props) {
    const [message, setMessage] = useState('');
    const [author, setAuthor] = useState('');
    const [loading, setLoading] = useState(false);
    const MAX_CHARACTERS = 100;

    useEffect(() => {
        const handleEsc = (e: KeyboardEvent) => {
            if (e.key === 'Escape') onClose();
        };
        document.addEventListener('keydown', handleEsc);
        document.body.style.overflow = 'hidden';
        return () => {
            document.removeEventListener('keydown', handleEsc);
            document.body.style.overflow = 'unset';
        };
    }, [onClose]);

    const handleMessageChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        const newMessage = e.target.value;
        if (newMessage.length <= MAX_CHARACTERS) {
            setMessage(newMessage);
        }
    };

    const isValid = message.trim() !== '' && author.trim() !== '';

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!isValid || loading) return;

        setLoading(true);
        const { error } = await supabase.from('messages').insert([
            {
                message,
                author,
                message_reply: replyTo,
                likes: 0, // Initialize likes to 0
            },
        ]);
        setLoading(false);

        if (error) {
            toast.error("Failed to post message: " + error.message);
        } else {
            toast.success(replyTo ? "Reply posted!" : "Message posted!");
            onSuccess();
        }
    };

    const isAtLimit = message.length >= MAX_CHARACTERS;

    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-y-auto transform transition-all duration-300 scale-100 animate-in fade-in-0 zoom-in-95">
                <div className="p-6 sm:p-8">
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-2xl font-bold text-gray-900">{replyTo ? 'Post a Reply' : 'Leave a Message'}</h2>
                        <button
                            onClick={onClose}
                            className="text-gray-400 hover:text-gray-600 transition-colors p-1"
                        >
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Your name</label>
                            <input
                                type="text"
                                placeholder="Who are you?"
                                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition-all duration-200 bg-gray-50 hover:bg-white"
                                value={author}
                                onChange={(e) => setAuthor(e.target.value)}
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Message</label>
                            <textarea
                                placeholder="What's on your mind?"
                                className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:border-transparent transition-all duration-200 bg-gray-50 hover:bg-white resize-none ${
                                    isAtLimit
                                        ? 'border-red-300 focus:ring-red-500'
                                        : 'border-gray-200 focus:ring-black'
                                }`}
                                value={message}
                                onChange={handleMessageChange}
                                rows={4}
                                maxLength={MAX_CHARACTERS}
                                required
                            />
                            <div className={`text-right mt-2 text-xs font-medium ${isAtLimit ? 'text-red-600' : 'text-gray-500'}`}>
                                {message.length}/{MAX_CHARACTERS}
                            </div>
                        </div>

                        <div className="flex justify-between items-center pt-6">
                            <button
                                type="button"
                                onClick={onClose}
                                className="px-6 py-3 text-gray-600 hover:text-gray-800 font-medium rounded-xl transition-colors order-2 sm:order-1"
                                disabled={loading}
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                disabled={!isValid || loading}
                                className={`px-6 py-3 rounded-xl font-medium transition-all duration-200 flex items-center justify-center gap-2 order-1 sm:order-2 ${
                                    isValid && !loading
                                        ? 'bg-black text-white hover:bg-gray-800'
                                        : 'bg-gray-200 text-gray-500 cursor-not-allowed'
                                }`}
                            >
                                {loading ? (
                                    <>
                                        <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                        Posting...
                                    </>
                                ) : (
                                    'Post'
                                )}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default UserMessagesModal;
