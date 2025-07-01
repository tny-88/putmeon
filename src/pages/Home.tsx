import { useEffect, useState } from 'react';
import Header from "../components/Header";
import FeaturedSong from "../components/FeaturedSong";
import RecommendButton from "../components/RecommendButton";
import EditCuratedModal from "../components/EditCuratedModal";
import CheckPasswordModal from "../components/CheckPasswordModal"; // ✅ new
import { supabase } from "../supabaseClient";

type CuratedSong = {
    title: string;
    artist: string;
    link: string | null;
    artwork_url: string | null;
    admin_pass?: string;
};

function Home() {
    const [song, setSong] = useState<CuratedSong | null>(null);
    const [isEditOpen, setIsEditOpen] = useState(false);
    const [isAdmin, setIsAdmin] = useState(false);
    const [showPasswordModal, setShowPasswordModal] = useState(false);

    const fetchSong = async () => {
        const { data, error } = await supabase
            .from("curated_song")
            .select("*")
            .single();

        if (error) {
            console.error("Error fetching song:", error.message);
        } else {
            setSong(data);
        }
    };

    useEffect(() => {
        fetchSong();
    }, []);

    const handleRequestEdit = () => {
        if (isAdmin) {
            setIsEditOpen(true);
        } else {
            setShowPasswordModal(true);
        }
    };

    return (
        <div className="min-h-screen bg-white flex flex-col relative">
            <Header />
            <main className="flex-1 flex items-center justify-center px-4">
                {song ? (
                    <FeaturedSong
                        title={song.title}
                        artist={song.artist}
                        artworkUrl={song.artwork_url || ""}
                        embedUrl={song.link || ""}
                    />
                ) : (
                    <p className="text-gray-400">No featured song yet.</p>
                )}
            </main>

            <RecommendButton />

            {/* Admin button */}
            <button
                onClick={handleRequestEdit}
                className="fixed bottom-4 left-4 bg-black text-white px-4 py-2 text-sm rounded-full shadow hover:bg-gray-800 transition"
            >
                Secret :)
            </button>

            {/* Password check modal */}
            {showPasswordModal && (
                <CheckPasswordModal
                    onSuccess={() => {
                        setIsAdmin(true);
                        setIsEditOpen(true);
                    }}
                    onClose={() => setShowPasswordModal(false)}
                />
            )}

            {/* Edit modal */}
            {isEditOpen && song && (
                <EditCuratedModal
                    existingSong={song}
                    onClose={() => setIsEditOpen(false)}
                    onUpdate={() => {
                        fetchSong(); // Refresh after update
                    }}
                />
            )}
        </div>
    );
}

export default Home;
