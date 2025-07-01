import { useState } from "react";
import { supabase } from "../supabaseClient";
import { toast } from "sonner";

type Props = {
    onSuccess: () => void;
    onClose: () => void;
};

function CheckPasswordModal({ onSuccess, onClose }: Props) {
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);

    const handleCheck = async () => {
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
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-4/5 max-w-sm shadow-xl">
                <h2 className="text-lg font-semibold mb-4">Enter Admin Password</h2>
                <input
                    type="password"
                    placeholder="Password"
                    className="w-full px-3 py-2 border rounded mb-4"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />
                <div className="flex justify-end gap-2">
                    <button
                        className="text-gray-500 text-sm hover:underline"
                        onClick={onClose}
                    >
                        Cancel
                    </button>
                    <button
                        className="bg-black text-white text-sm px-4 py-2 rounded hover:bg-gray-800"
                        onClick={handleCheck}
                        disabled={loading}
                    >
                        {loading ? "Checking..." : "Submit"}
                    </button>
                </div>
            </div>
        </div>
    );
}

export default CheckPasswordModal;
