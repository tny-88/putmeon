import { useState, useEffect } from "react";
import { supabase } from "../supabaseClient";
import { toast } from 'sonner';
import {spotifyAPI} from "../../services/SpotifyAPI.tsx";

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
    const [spotifyUrl, setSpotifyUrl] = useState("");
    const [artwork, setArtwork] = useState(existingSong.artwork_url || "");
    const [loading, setLoading] = useState(false);
    const [appleMusicUrl, setAppleMusicUrl] = useState(existingSong.apple_music_url || "");
    const [fetchingSpotify, setFetchingSpotify] = useState(false);

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

    // Extract original Spotify URL from embed URL if it exists
    useEffect(() => {
        if (existingSong.link) {
            const embedUrl = existingSong.link;
            // Convert embed URL back to regular URL for display
            const trackIdMatch = embedUrl.match(/embed\/track\/([a-zA-Z0-9]+)/);
            if (trackIdMatch) {
                const trackId = trackIdMatch[1];
                const urlObj = new URL(embedUrl);
                const searchParams = urlObj.searchParams.toString();
                let originalUrl = `https://open.spotify.com/track/${trackId}`;
                if (searchParams) {
                    originalUrl += `?${searchParams}`;
                }
                setSpotifyUrl(originalUrl);
            }
        }
    }, [existingSong.link]);

    const handleSpotifyUrlChange = async (url: string) => {
        setSpotifyUrl(url);

        if (url.includes('spotify.com/track/')) {
            setFetchingSpotify(true);
            try {
                const trackInfo = await spotifyAPI.getTrackInfo(url);
                if (trackInfo) {
                    setTitle(trackInfo.title);
                    setArtist(trackInfo.artist);
                    setArtwork(trackInfo.artworkUrl);
                    toast.success("Track info fetched successfully!");
                } else {
                    toast.error("Failed to fetch track info from Spotify");
                }
            } catch (error) {
                toast.error("Error fetching track info");
                console.error(error);
            } finally {
                setFetchingSpotify(false);
            }
        }
    };

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!title.trim() || !artist.trim()) return;

        setLoading(true);

        // Convert Spotify URL to embed URL
        const embedUrl = spotifyUrl ? spotifyAPI.convertToEmbedUrl(spotifyUrl) : "";

        const { data, error } = await supabase
            .from("curated_song")
            .update({
                title,
                artist,
                link: embedUrl,
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
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Spotify URL
                                <span className="text-xs text-gray-500 ml-1">(paste any Spotify track link)</span>
                            </label>
                            <input
                                type="url"
                                placeholder="https://open.spotify.com/track/..."
                                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition-all duration-200 bg-gray-50 hover:bg-white"
                                value={spotifyUrl}
                                onChange={(e) => handleSpotifyUrlChange(e.target.value)}
                            />
                            {fetchingSpotify && (
                                <div className="flex items-center gap-2 mt-2 text-sm text-gray-600">
                                    <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    Fetching track info...
                                </div>
                            )}
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
                            <label className="block text-sm font-medium text-gray-700 mb-2">Song title</label>
                            <div className="w-full px-4 py-3 border border-gray-200 rounded-xl bg-gray-100 text-gray-700 min-h-[48px] flex items-center">
                                {title || "Will be filled automatically from Spotify"}
                            </div>
                        </div>



                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Artist</label>
                            <div className="w-full px-4 py-3 border border-gray-200 rounded-xl bg-gray-100 text-gray-700 min-h-[48px] flex items-center">
                                {artist || "Will be filled automatically from Spotify"}
                            </div>
                        </div>



                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Artwork URL
                                <span className="text-xs text-gray-500 ml-1">(auto-filled from Spotify)</span>
                            </label>
                            <div className="w-full px-4 py-3 border border-gray-200 rounded-xl bg-gray-100 text-gray-700 min-h-[48px] flex items-center">
                                {artwork ? (
                                    <span className="text-sm truncate">{artwork}</span>
                                ) : (
                                    "Will be filled automatically from Spotify"
                                )}
                            </div>
                            {artwork && (
                                <div className="mt-2">
                                    <img
                                        src={artwork}
                                        alt="Artwork preview"
                                        className="w-20 h-20 object-cover rounded-lg"
                                    />
                                </div>
                            )}
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
                                disabled={loading || !title.trim() || !artist.trim() || fetchingSpotify || !spotifyUrl.trim()}
                                className={`px-6 py-3 rounded-xl font-medium transition-all duration-200 flex items-center justify-center gap-2 order-1 sm:order-2 ${
                                    title.trim() && artist.trim() && !loading && !fetchingSpotify && spotifyUrl.trim()
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