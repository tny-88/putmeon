import { useEffect, useState, useCallback } from 'react';
import Header from "../components/Header";
import Footer from "../components/Footer";
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
    <div className="min-h-screen bg-white flex flex-col relative pb-15 sm:pb-20">
        <Header />
        <main className="flex-1 flex items-center justify-center px-4 sm:px-6 lg:px-8">
            <div className="w-full max-w-sm sm:max-w-md">
                {/* Skeleton for artwork */}
                <div className="w-48 h-48 sm:w-56 sm:h-56 md:w-64 md:h-64 bg-gray-200 rounded-lg mx-auto mb-4 sm:mb-6 animate-pulse"></div>

                {/* Skeleton for song title */}
                <div className="h-6 sm:h-7 md:h-8 bg-gray-200 rounded mb-2 sm:mb-3 animate-pulse"></div>

                {/* Skeleton for artist */}
                <div className="h-4 sm:h-5 md:h-6 bg-gray-200 rounded w-3/4 mx-auto mb-3 sm:mb-4 animate-pulse"></div>

                {/* Skeleton for embed player */}
                <div className="h-32 sm:h-36 md:h-40 bg-gray-200 rounded mb-3 sm:mb-4 animate-pulse"></div>

                {/* Skeleton for Apple Music button */}
                <div className="h-6 w-32 bg-gray-200 rounded mx-auto animate-pulse"></div>
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
            <div className="min-h-screen bg-white flex flex-col relative sm:pb-24 animate-fadeIn">
                <Header />
                <main className="flex-1 flex items-center justify-center px-4 sm:px-6">
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
        <div className="min-h-screen bg-white flex flex-col relative pb-7 sm:pb-10 animate-fadeIn">
            <Header />
            <main className="flex-1 flex items-center justify-center px-4 sm:px-6 lg:px-8">
                {song ? (
                    <div className="animate-slideIn w-full">
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
            <Footer />
        </div>


    );
}

export default Home;