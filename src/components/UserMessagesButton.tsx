import { useState } from "react";
import UserMessagesModal from "./UserMessagesModal.tsx";
import { IconPencilPlus } from "@tabler/icons-react";

type Props = {
    onSuccess: () => void;
};

function UserMessagesButton({ onSuccess }: Props) {
    const [isOpen, setIsOpen] = useState(false);

    const handleClose = () => setIsOpen(false);

    const handleSuccess = () => {
        onSuccess();
        handleClose();
    };

    return (
        <>
            <button
                onClick={() => setIsOpen(true)}
                aria-label="Create a Message"
                className="fixed bottom-6 right-6 w-14 h-14 rounded-full bg-black text-white flex items-center justify-center shadow-lg hover:bg-gray-800 transition-all"
            >
                <IconPencilPlus size={24} stroke={2} />
            </button>
            {isOpen && (
                <UserMessagesModal
                    onClose={handleClose}
                    onSuccess={handleSuccess}
                />
            )}
        </>
    );
}

export default UserMessagesButton;
