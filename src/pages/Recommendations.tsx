import { useEffect, useState, useCallback } from 'react';
import { supabase } from '../supabaseClient';
import RecommendButton from "../components/RecommendButton";
import SecretButton from "../components/SecretButton";

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
    const [error, setError] = useState<string | null>(null);
    const [isAdmin, setIsAdmin] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [visibleCount, setVisibleCount] = useState(3);
    const [updatingRating, setUpdatingRating] = useState(false);

    const fetchRecs = useCallback(async () => {
        try {
            setError(null);
            const { data, error } = await supabase
                .from('recommendations')
                .select('*')
                .order('created_at', { ascending: false });

            if (error) throw error;

            setRecs(data || []);
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Failed to fetch recommendations';
            console.error('Error fetching recommendations:', errorMessage);
            setError(errorMessage);
        } finally {
            setLoading(false);
        }
    }, []);

    const updateRating = useCallback(async (recId: string, newRating: number) => {
        setUpdatingRating(true);
        try {
            const { error } = await supabase
                .from('recommendations')
                .update({ rating: newRating })
                .eq('id', recId);

            if (error) throw error;

            setEditingId(null);
            // Optimistically update local state
            setRecs(prev => prev.map(rec =>
                rec.id === recId ? { ...rec, rating: newRating } : rec
            ));
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Failed to update rating';
            console.error('Error updating rating:', errorMessage);
            alert('Failed to update rating: ' + errorMessage);
        } finally {
            setUpdatingRating(false);
        }
    }, []);

    useEffect(() => {
        fetchRecs();
    }, [fetchRecs]);

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
    }, [fetchRecs]);

    const loadMore = useCallback(() => {
        setVisibleCount(prev => prev + 3);
    }, []);

    if (loading) {
        return (
            <div className="min-h-screen bg-white flex flex-col relative pb-24">
                <header className="sticky top-0 z-50 bg-white flex justify-between items-center p-10 pb-5">
                    <h1 className="text-5xl font-semibold text-black">RE <br /> CS</h1>
                    <a href="/" className="text-black font-bold hover:underline text-2xl">Home</a>
                </header>
                <p className="flex items-center justify-center">Loading...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-white flex flex-col relative pb-24">
                <header className="sticky top-0 z-50 bg-white flex justify-between items-center p-10 pb-5">
                    <h1 className="text-5xl font-semibold text-black">RE <br /> CS</h1>
                    <a href="/" className="text-black font-bold hover:underline text-2xl">Home</a>
                </header>
                <div className="flex flex-col items-center justify-center p-4">
                    <p className="text-red-600 mb-4">Error: {error}</p>
                    <button
                        onClick={fetchRecs}
                        className="bg-black text-white px-4 py-2 rounded hover:bg-gray-800 transition"
                    >
                        Try Again
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-white flex flex-col relative pb-24">
            <header className="sticky top-0 z-50 bg-white flex justify-between items-center p-10 pb-5">
                <h1 className="text-5xl font-semibold text-black">RE <br /> CS</h1>
                <a href="/" className="text-black font-bold hover:underline text-2xl">Home</a>
            </header>

            {recs.length === 0 ? (
                <p className="flex items-center justify-center text-lg font-bold">No recs yet.</p>
            ) : (
                <>
                    <ul className="space-y-3 px-4 sm:px-6 lg:px-8 pb-6 sm:pb-8 lg:pb-12">
                        {recs.slice(0, visibleCount).map((rec) => (
                            <li key={rec.id} className="p-10 transition hover:shadow-md">
                                <div>
                                    <span className="mb-1 text-base font-light">{rec.song_title} - </span>
                                    <span className="mb-1 text-sm font-bold">{rec.artist}</span>
                                </div>
                                <div className="text-sm text-gray-500 mb-2">From: {rec.name}</div>
                                <div className="text-sm flex items-center gap-2 mt-1">
                                    {editingId === rec.id ? (
                                        <>
                                            <select
                                                value={rec.rating ?? ''}
                                                onChange={(e) => {
                                                    const newRating = parseInt(e.target.value);
                                                    if (!isNaN(newRating)) {
                                                        updateRating(rec.id, newRating);
                                                    }
                                                }}
                                                disabled={updatingRating}
                                                className="border border-gray-300 rounded px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-black disabled:opacity-50"
                                            >
                                                <option value="">—</option>
                                                {Array.from({ length: 10 }, (_, i) => i + 1).map((n) => (
                                                    <option key={n} value={n}>{n}</option>
                                                ))}
                                            </select>
                                            <button
                                                onClick={() => setEditingId(null)}
                                                disabled={updatingRating}
                                                className="text-xs text-gray-500 hover:underline disabled:opacity-50"
                                            >
                                                Cancel
                                            </button>
                                            {updatingRating && <span className="text-xs text-gray-500">Saving...</span>}
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
                            </li>
                        ))}
                    </ul>
                    {visibleCount < recs.length && (
                        <div className="text-center mt-4 pb-10">
                            <button
                                onClick={loadMore}
                                className="bg-black text-white px-4 py-2 rounded-full hover:bg-gray-800 transition"
                            >
                                Load More
                            </button>
                        </div>
                    )}
                </>
            )}

            <RecommendButton />
            {!isAdmin && (
                <SecretButton onUnlock={() => setIsAdmin(true)} />
            )}
        </div>
    );
}

export default Recommendations;