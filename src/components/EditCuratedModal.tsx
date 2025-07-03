import { useState, useEffect } from "react";
import { supabase } from "../supabaseClient";
import { toast } from 'sonner';

type CuratedSong = {
    title: string;
    artist: string;
    link: string | null;
    artwork_url: string | null;
    apple_music_url?: string | null;
};

type Props = {
    existingSong: CuratedSong;
    onClose: () => void;
    onUpdate: (song: CuratedSong) => void;
};

function EditCuratedModal({ existingSong, onClose, onUpdate }: Props) {
    const [title, setTitle] = useState(existingSong.title);
    const [artist, setArtist] = useState(existingSong.artist);
    const [link, setLink] = useState(existingSong.link || "");
    const [artwork, setArtwork] = useState(existingSong.artwork_url || "");
    const [loading, setLoading] = useState(false);
    const [appleMusicUrl, setAppleMusicUrl] = useState(existingSong.apple_music_url || "");

    // Handle ESC key
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

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!title.trim() || !artist.trim()) return;

        setLoading(true);

        const { data, error } = await supabase
            .from("curated_song")
            .update({
                title,
                artist,
                link,
                artwork_url: artwork,
                apple_music_url: appleMusicUrl
            })
            .eq("id", 1)
            .select()
            .single();

        setLoading(false);

        if (error) {
            toast.error("Failed to update: " + error.message);
        } else {
            onUpdate(data);
            toast.success("Successfully updated");
            onClose();
        }
    };

    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-y-auto transform transition-all duration-300 scale-100 animate-in fade-in-0 zoom-in-95">
                <div className="p-6 sm:p-8">
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-2xl font-bold text-gray-900">Edit Featured Song</h2>
                        <button
                            onClick={onClose}
                            className="text-gray-400 hover:text-gray-600 transition-colors p-1"
                        >
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>

                    <form onSubmit={handleSave} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Song title</label>
                            <input
                                type="text"
                                placeholder="Enter song title"
                                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition-all duration-200 bg-gray-50 hover:bg-white"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Artist</label>
                            <input
                                type="text"
                                placeholder="Enter artist name"
                                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition-all duration-200 bg-gray-50 hover:bg-white"
                                value={artist}
                                onChange={(e) => setArtist(e.target.value)}
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Spotify Embed Link</label>
                            <input
                                type="url"
                                placeholder="Enter Spotify embed URL"
                                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition-all duration-200 bg-gray-50 hover:bg-white"
                                value={link}
                                onChange={(e) => setLink(e.target.value)}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Apple Music Link</label>
                            <input
                                type="url"
                                placeholder="Enter Apple Music URL"
                                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition-all duration-200 bg-gray-50 hover:bg-white"
                                value={appleMusicUrl}
                                onChange={(e) => setAppleMusicUrl(e.target.value)}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Artwork URL</label>
                            <input
                                type="url"
                                placeholder="Enter artwork image URL"
                                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition-all duration-200 bg-gray-50 hover:bg-white"
                                value={artwork}
                                onChange={(e) => setArtwork(e.target.value)}
                            />
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
                                disabled={loading || !title.trim() || !artist.trim()}
                                className={`px-6 py-3 rounded-xl font-medium transition-all duration-200 flex items-center justify-center gap-2 order-1 sm:order-2 ${
                                    title.trim() && artist.trim() && !loading
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
                                        Saving...
                                    </>
                                ) : (
                                    'Save'
                                )}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default EditCuratedModal;