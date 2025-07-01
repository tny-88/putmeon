import { useState } from 'react';
import { supabase } from '../supabaseClient';
import { toast } from 'sonner';

type RecommendModalProps = {
    isOpen: boolean;
    onClose: () => void;
};

function RecommendModal({ isOpen, onClose }: RecommendModalProps) {
    const [name, setName] = useState('');
    const [title, setTitle] = useState('');
    const [artist, setArtist] = useState('');
    const [link, setLink] = useState('');
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);

    if (!isOpen) return null;

    const isValid = name.trim() !== '' && title.trim() !== '' && artist.trim() !== '';


    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!isValid || loading) return;

        setLoading(true);
        const { error } = await supabase.from('recommendations').insert([
            {
                name,
                song_title: title,
                artist,
                link: link || null,
            },
        ]);
        setLoading(false);

        if (error) {
            toast.error("Failed to submit: " + error.message);
        } else {
            setSuccess(true);
            setName('');
            setTitle('');
            setArtist('');
            setLink('');
            setTimeout(() => {
                setSuccess(false);
                onClose();
            }, 1200);
            toast.success("Thanks lil bro");
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-md shadow-xl max-h-[90vh] overflow-y-auto sm:p-8">
            <h2 className="text-xl font-semibold mb-4">Recommend a Song</h2>

                <form onSubmit={handleSubmit} className="space-y-3">
                    <input
                        type="text"
                        placeholder="Your name"
                        className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-black"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                    />
                    <input
                        type="text"
                        placeholder="Song title"
                        className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-black"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        required
                    />
                    <input
                        type="text"
                        placeholder="Artist"
                        className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-black"
                        value={artist}
                        onChange={(e) => setArtist(e.target.value)}
                        required
                    />
                    <input
                        type="url"
                        placeholder="Link (optional)"
                        className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-black"
                        value={link}
                        onChange={(e) => setLink(e.target.value)}
                    />

                    <div className="flex justify-between items-center pt-3">
                        <button
                            type="button"
                            onClick={onClose}
                            className="text-sm text-gray-600 hover:underline"
                            disabled={loading}
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={!isValid || loading}
                            className={`px-4 py-2 text-sm rounded ${
                                isValid
                                    ? 'bg-black text-white hover:bg-gray-800'
                                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                            } transition-all`}
                        >
                            {loading ? 'Sending...' : 'Submit'}
                        </button>
                    </div>

                    {success && (
                        <p className="text-green-600 text-sm text-right pt-2">✓ Submitted!</p>
                    )}
                </form>
            </div>
        </div>
    );
}

export default RecommendModal;
