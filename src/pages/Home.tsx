import { useEffect, useState } from 'react';
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
    const [isEditOpen, setIsEditOpen] = useState(false);
    const [isAdmin, setIsAdmin] = useState(false);

    const fetchSong = async () => {
        const { data, error } = await supabase.from("curated_song").select("*").single();
        if (error) {
            console.error("Error fetching song:", error.message);
        } else {
            setSong(data);
        }
    };

    useEffect(() => {
        fetchSong();

    }, []);
    
    useEffect(() => {
        const channel = supabase
            .channel("curated-song-updates")
            .on(
                "postgres_changes",
                {
                    event: "*", // You can also use 'UPDATE' only
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
    }, []);


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
                    onClose={() => setIsEditOpen(false)}
                    onUpdate={fetchSong}
                />
            )}

            {/* ✅ Use SecretButton to trigger admin mode */}
            <SecretButton
                onUnlock={() => setIsAdmin(true)}
                onEdit={() => setIsEditOpen(true)}
            />
        </div>
    );
}

export default Home;
