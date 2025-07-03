import { useState, useEffect } from "react";
import { supabase } from "../supabaseClient";
import { toast } from "sonner";

type Props = {
    onSuccess: () => void;
    onClose: () => void;
};

function CheckPasswordModal({ onSuccess, onClose }: Props) {
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);

    // Handle ESC key and form submission
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

    const handleCheck = async (e?: React.FormEvent) => {
        if (e) e.preventDefault();
        if (!password.trim()) return;

        setLoading(true);
        const { data, error } = await supabase
            .from("curated_song")
            .select("admin_pass")
            .eq("id", 1)
            .single();

        setLoading(false);

        if (error || !data) {
            toast.error("Failed to load admin password.");
            return;
        }

        if (data.admin_pass === password) {
            toast.success("Access granted.");
            onSuccess();
            onClose();
        } else {
            toast.error("Incorrect password.");
        }
    };

    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm transform transition-all duration-300 scale-100 animate-in fade-in-0 zoom-in-95">
                <div className="p-6 sm:p-8">
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-xl font-bold text-gray-900">Admin Access</h2>
                        <button
                            onClick={onClose}
                            className="text-gray-400 hover:text-gray-600 transition-colors p-1"
                        >
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>

                    <form onSubmit={handleCheck} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
                            <input
                                type="password"
                                placeholder="Enter admin password"
                                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition-all duration-200 bg-gray-50 hover:bg-white"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                autoFocus
                            />
                        </div>

                        <div className="flex justify-between items-center pt-4">
                            <button
                                type="button"
                                className="px-6 py-3 text-gray-600 hover:text-gray-800 font-medium rounded-xl transition-colors order-2 sm:order-1"
                                onClick={onClose}
                                disabled={loading}
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                className={`px-6 py-3 rounded-xl font-medium transition-all duration-200 flex items-center justify-center gap-2 order-1 sm:order-2 ${
                                    password.trim() && !loading
                                        ? 'bg-black text-white hover:bg-gray-800'
                                        : 'bg-gray-200 text-gray-500 cursor-not-allowed'
                                }`}
                                disabled={loading || !password.trim()}
                            >
                                {loading ? (
                                    <>
                                        <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                        Checking...
                                    </>
                                ) : (
                                    'Submit'
                                )}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default CheckPasswordModal;