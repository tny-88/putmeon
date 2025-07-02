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

// Loading skeleton component
const LoadingSkeleton = () => (
    <div className="h-screen bg-white flex flex-col relative overflow-hidden">
        <Header />
        <main className="flex-1 flex items-center justify-center px-4 sm:px-6 lg:px-8 min-h-0">
            <div className="w-full max-w-sm sm:max-w-md flex flex-col items-center">
                {/* Skeleton for artwork */}
                <div className="w-32 h-32 sm:w-40 sm:h-40 md:w-48 md:h-48 bg-gray-200 rounded-lg mb-3 sm:mb-4 animate-pulse flex-shrink-0"></div>

                {/* Skeleton for song title */}
                <div className="h-5 sm:h-6 md:h-7 bg-gray-200 rounded mb-2 w-3/4 animate-pulse"></div>

                {/* Skeleton for artist */}
                <div className="h-4 sm:h-5 bg-gray-200 rounded w-1/2 mb-3 sm:mb-4 animate-pulse"></div>

                {/* Skeleton for embed player */}
                <div className="h-20 sm:h-24 md:h-28 bg-gray-200 rounded mb-2 sm:mb-3 w-full animate-pulse flex-shrink-0"></div>

                {/* Skeleton for Apple Music button */}
                <div className="h-4 w-28 bg-gray-200 rounded animate-pulse"></div>
            </div>
        </main>
        <SecretButton
            onUnlock={() => {}}
            onEdit={() => {}}
        />
    </div>
);

function Home() {
    const [song, setSong] = useState<CuratedSong | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [isEditOpen, setIsEditOpen] = useState(false);
    const [isAdmin, setIsAdmin] = useState(false);
    const [contentReady, setContentReady] = useState(false);

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

    // Add smooth transition after data loads
    useEffect(() => {
        if (!loading) {
            const timer = setTimeout(() => {
                setContentReady(true);
            }, 1500); // Small delay for smooth transition

            return () => clearTimeout(timer);
        }
    }, [loading]);

    // Show loading animation while fetching data or content isn't ready
    if (loading || !contentReady) {
        return <LoadingSkeleton />;
    }

    if (error) {
        return (
            <div className="h-screen bg-white flex flex-col relative overflow-hidden animate-fadeIn">
                <Header />
                <main className="flex-1 flex items-center justify-center px-4 sm:px-6 min-h-0">
                    <div className="text-center max-w-sm sm:max-w-md">
                        <p className="text-red-600 mb-4 text-sm sm:text-base px-2">
                            Error loading featured song: {error}
                        </p>
                        <button
                            onClick={fetchSong}
                            className="bg-black text-white px-4 py-2 rounded hover:bg-gray-800 transition text-sm sm:text-base"
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
        <div className="h-screen bg-white flex flex-col relative overflow-hidden animate-fadeIn">
            <Header />
            <main className="flex-1 flex items-center justify-center px-4 sm:px-6 lg:px-8 min-h-0">
                {song ? (
                    <div className="animate-slideIn w-full flex justify-center">
                        <FeaturedSong
                            title={song.title}
                            artist={song.artist}
                            artworkUrl={song.artwork_url || ""}
                            embedUrl={song.link || ""}
                            appleMusicUrl={song.apple_music_url}
                        />
                    </div>
                ) : (
                    <p className="text-gray-400 animate-fadeIn text-center text-sm sm:text-base">
                        No featured song yet.
                    </p>
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