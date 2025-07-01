import { useState } from "react";
import RecommendModal from "./RecommendModal";
import { IconPlus } from "@tabler/icons-react";

function RecommendButton() {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <>
            <button
                onClick={() => setIsOpen(true)}
                aria-label="Recommend a Song"
                className="fixed bottom-6 right-6 w-14 h-14 rounded-full bg-black text-white flex items-center justify-center shadow-lg hover:bg-gray-800 transition-all"
            >
                <IconPlus size={24} stroke={2} />
            </button>
            <RecommendModal isOpen={isOpen} onClose={() => setIsOpen(false)} />
        </>
    );
}

export default RecommendButton;
