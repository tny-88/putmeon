import { useState } from "react";
import { IconMoodWink } from "@tabler/icons-react";
import CheckPasswordModal from "./CheckPasswordModal";

type Props = {
    onUnlock: () => void;
    onEdit?: () => void;
};

function SecretButton({ onUnlock, onEdit }: Props) {
    const [showPasswordModal, setShowPasswordModal] = useState(false);

    return (
        <>
            <button
                onClick={() => setShowPasswordModal(true)}
                className="fixed bottom-6 left-6 w-14 h-14 rounded-full bg-black text-white flex items-center justify-center shadow-lg hover:bg-gray-800 transition-all"
                aria-label="Admin Access"
            >
                <IconMoodWink size={24} stroke={2} />
            </button>

            {showPasswordModal && (
                <CheckPasswordModal
                    onSuccess={() => {
                        onUnlock();
                        onEdit?.(); // Optional: only call if defined
                        setShowPasswordModal(false);
                    }}
                    onClose={() => setShowPasswordModal(false)}
                />
            )}
        </>
    );
}

export default SecretButton;
