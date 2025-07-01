import { useEffect, useState } from 'react';
import { supabase } from '../supabaseClient';
import RecommendButton from "../components/RecommendButton";
import CheckPasswordModal from "../components/CheckPasswordModal";
import {IconMoodWink} from "@tabler/icons-react";


type Recommendation = {
    id: string;
    name: string;
    song_title: string;
    artist: string;
    link: string | null;
    rating: number | null;
};

function Recommendations() {
    const [recs, setRecs] = useState<Recommendation[]>([]);
    const [loading, setLoading] = useState(true);
    const [isAdmin, setIsAdmin] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [showPasswordModal, setShowPasswordModal] = useState(false);
    const [visibleCount, setVisibleCount] = useState(3); // Load 5 at a time

    const fetchRecs = async () => {
        const { data, error } = await supabase
            .from('recommendations')
            .select('*')
            .order('created_at', { ascending: false });
        if (error) {
            console.error('Error fetching recommendations:', error.message);
        } else {
            setRecs(data);
        }
        setLoading(false);
    };

    // Initial fetch
    useEffect(() => {
        fetchRecs();
    }, []);

    // Real-time updates
    useEffect(() => {
        const channel = supabase
            .channel('recommendations-updates')
            .on(
                'postgres_changes',
                { event: '*', schema: 'public', table: 'recommendations' },
                () => fetchRecs()
            )
            .subscribe();

        return () => {
            supabase.removeChannel(channel);
        };
    }, []);

    const handleRequestAdmin = () => {
        setShowPasswordModal(true);
    };

    return (
        <div className="min-h-screen bg-white flex flex-col relative">
            <header className="sticky top-0 z-50 bg-white flex justify-between items-center p-10 pb-5">
                <h1 className="text-5xl font-semibold text-black">RE <br /> CS</h1>
                <a href="/" className="text-black font-bold hover:underline">Home</a>
            </header>

            {loading ? (
                <p className="flex items-center justify-center">Loading...</p>
            ) : recs.length === 0 ? (
                <p className="flex items-center justify-center text-lg font-bold">No recs yet.</p>
            ) : (
                <>
                    <ul className="space-y-3 px-4 sm:px-6 lg:px-8 pb-6 sm:pb-8 lg:pb-12">
                        {recs.slice(0, visibleCount).map((rec) => (
                            <li key={rec.id} className="p-10 transition hover:shadow-md">
                                <div>
                                    <span className="mb-1 text-xl font-light">{rec.song_title} - </span>
                                    <span className="mb-1 text-sm font-bold">{rec.artist}</span>
                                </div>
                                <div className="text-sm text-gray-500 mb-2">From: {rec.name}</div>
                                {rec.link && (
                                    <a
                                        href={rec.link}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="inline-block text-sm text-black underline mb-2"
                                    >
                                        Listen
                                    </a>
                                )}
                                <div className="text-sm flex items-center gap-2 mt-1">
                                    {editingId === rec.id ? (
                                        <>
                                            <select
                                                value={rec.rating ?? ''}
                                                onChange={async (e) => {
                                                    const newRating = parseInt(e.target.value);
                                                    const { error } = await supabase
                                                        .from('recommendations')
                                                        .update({ rating: newRating })
                                                        .eq('id', rec.id);
                                                    if (!error) {
                                                        setEditingId(null); // List auto-refreshes
                                                    } else {
                                                        alert('Failed to update rating: ' + error.message);
                                                    }
                                                }}
                                                className="border border-gray-300 rounded px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-black"
                                            >
                                                <option value="">—</option>
                                                {Array.from({ length: 10 }, (_, i) => i + 1).map((n) => (
                                                    <option key={n} value={n}>{n}</option>
                                                ))}
                                            </select>
                                            <button
                                                onClick={() => setEditingId(null)}
                                                className="text-xs text-gray-500 hover:underline"
                                            >
                                                Cancel
                                            </button>
                                        </>
                                    ) : (
                                        <>
                                            <span>{rec.rating !== null ? `${rec.rating}/10` : 'No rating yet'}</span>
                                            {isAdmin && (
                                                <button
                                                    onClick={() => setEditingId(rec.id)}
                                                    className="text-gray-400 hover:text-black transition"
                                                    title="Edit rating"
                                                >
                                                    ✏️
                                                </button>
                                            )}
                                        </>
                                    )}
                                </div>
                            </li>
                        ))}
                    </ul>

                    {/* Load More Button */}
                    {visibleCount < recs.length && (
                        <div className="text-center mt-4 pb-10">
                            <button
                                onClick={() => setVisibleCount((prev) => prev + 3)}
                                className="bg-black text-white px-4 py-2 rounded-full hover:bg-gray-800 transition"
                            >
                                Load More
                            </button>
                        </div>
                    )}
                </>
            )}

            <RecommendButton />

            {/* Admin unlock */}
            {!isAdmin && (
                <button
                    onClick={handleRequestAdmin}
                    className="fixed bottom-6 left-6 w-14 h-14 rounded-full bg-black text-white flex items-center justify-center shadow-lg hover:bg-gray-800 transition-all"
                >
                    <IconMoodWink size={24} stroke={2} />
                </button>
            )}

            {showPasswordModal && (
                <CheckPasswordModal
                    onSuccess={() => setIsAdmin(true)}
                    onClose={() => setShowPasswordModal(false)}
                />
            )}
        </div>
    );
}

export default Recommendations;
