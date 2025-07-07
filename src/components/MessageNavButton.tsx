import { IconMessageCircle } from "@tabler/icons-react";

function MessageNavButton() {
    return (
        <div className="fixed bottom-6 right-6 w-14 h-14 rounded-full bg-black text-white flex items-center justify-center shadow-lg hover:bg-gray-800 transition-all"
        >
            <a
                href="/messages"
                aria-label="Admin Access"
            >
                <IconMessageCircle size={24} stroke={2} />
            </a>


        </div>
    );
}

export default MessageNavButton;
