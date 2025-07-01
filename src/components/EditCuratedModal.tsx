import { useState } from "react";
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


    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
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
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-4/5 max-w-md shadow-xl max-h-[90vh] overflow-y-auto sm:p-8">
            <h2 className="text-xl font-semibold mb-4">Edit Featured Song</h2>

                <form onSubmit={handleSave} className="flex flex-col gap-3">
                    <input
                        type="text"
                        placeholder="Song title"
                        className="px-3 py-2 border rounded"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        required
                    />
                    <input
                        type="text"
                        placeholder="Artist"
                        className="px-3 py-2 border rounded"
                        value={artist}
                        onChange={(e) => setArtist(e.target.value)}
                        required
                    />
                    <input
                        type="url"
                        placeholder="Embed link for Spotify"
                        className="px-3 py-2 border rounded"
                        value={link}
                        onChange={(e) => setLink(e.target.value)}
                        required
                    />
                    <input
                        type="url"
                        placeholder="Apple Music link"
                        className="px-3 py-2 border rounded"
                        value={appleMusicUrl}
                        onChange={(e) => setAppleMusicUrl(e.target.value)}
                    />
                    <input
                        type="url"
                        placeholder="Artwork URL"
                        className="px-3 py-2 border rounded"
                        value={artwork}
                        onChange={(e) => setArtwork(e.target.value)}
                    />

                    <div className="flex justify-between mt-4">
                        <button
                            type="button"
                            onClick={onClose}
                            className="text-sm text-gray-600 hover:underline"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className="bg-black text-white px-4 py-2 rounded hover:bg-gray-800"
                        >
                            {loading ? "Saving..." : "Save"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default EditCuratedModal;
