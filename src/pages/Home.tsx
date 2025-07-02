import { useEffect, useState, useCallback } from 'react';
import Header from "../components/Header";
import FeaturedSong from "../components/FeaturedSong";
import EditCuratedModal from "../components/EditCuratedModal";
import SecretButton from "../components/SecretButton";
import { supabase } from "../supabaseClient";

type CuratedSong = {
    title: string;
    artist: string;
    link: string | null;
    artwork_url: string | null;
    apple_music_url: string | null;
};

function Home() {
    const [song, setSong] = useState<CuratedSong | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [isEditOpen, setIsEditOpen] = useState(false);
    const [isAdmin, setIsAdmin] = useState(false);

    const fetchSong = useCallback(async () => {
        try {
            setError(null);
            const { data, error } = await supabase
                .from("curated_song")
                .select("*")
                .single();

            if (error) {
                // Handle the case where no song exists yet
                if (error.code === 'PGRST116') {
                    setSong(null);
                    return;
                }
                throw error;
            }

            setSong(data);
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Failed to fetch featured song';
            console.error("Error fetching song:", errorMessage);
            setError(errorMessage);
        } finally {
            setLoading(false);
        }
    }, []);

    const handleSongUpdate = useCallback(() => {
        fetchSong();
    }, [fetchSong]);

    const handleEditOpen = useCallback(() => {
        setIsEditOpen(true);
    }, []);

    const handleEditClose = useCallback(() => {
        setIsEditOpen(false);
    }, []);

    const handleAdminUnlock = useCallback(() => {
        setIsAdmin(true);
    }, []);

    useEffect(() => {
        fetchSong();
    }, [fetchSong]);

    useEffect(() => {
        const channel = supabase
            .channel("curated-song-updates")
            .on(
                "postgres_changes",
                {
                    event: "*",
                    schema: "public",
                    table: "curated_song",
                },
                () => {
                    fetchSong();
                }
            )
            .subscribe();

        return () => {
            supabase.removeChannel(channel);
        };
    }, [fetchSong]);

    if (loading) {
        return (
            <div className="min-h-screen bg-white flex flex-col relative pb-24">
                <Header />
                <main className="flex-1 flex items-center justify-center px-4">
                    <p className="text-gray-400">Loading featured song...</p>
                </main>
                <SecretButton
                    onUnlock={handleAdminUnlock}
                    onEdit={handleEditOpen}
                />
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-white flex flex-col relative pb-24">
                <Header />
                <main className="flex-1 flex items-center justify-center px-4">
                    <div className="text-center">
                        <p className="text-red-600 mb-4">Error loading featured song: {error}</p>
                        <button
                            onClick={fetchSong}
                            className="bg-black text-white px-4 py-2 rounded hover:bg-gray-800 transition"
                        >
                            Try Again
                        </button>
                    </div>
                </main>
                <SecretButton
                    onUnlock={handleAdminUnlock}
                    onEdit={handleEditOpen}
                />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-white flex flex-col relative pb-24">
            <Header />
            <main className="flex-1 flex items-center justify-center px-4">
                {song ? (
                    <FeaturedSong
                        title={song.title}
                        artist={song.artist}
                        artworkUrl={song.artwork_url || ""}
                        embedUrl={song.link || ""}
                        appleMusicUrl={song.apple_music_url}
                    />
                ) : (
                    <p className="text-gray-400">No featured song yet.</p>
                )}
            </main>

            {/* Edit modal only shown if admin is true */}
            {isAdmin && isEditOpen && song && (
                <EditCuratedModal
                    existingSong={song}
                    onClose={handleEditClose}
                    onUpdate={handleSongUpdate}
                />
            )}

            {/* Use SecretButton to trigger admin mode */}
            <SecretButton
                onUnlock={handleAdminUnlock}
                onEdit={handleEditOpen}
            />
        </div>
    );
}

export default Home;