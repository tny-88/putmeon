import { useState } from 'react';
import RecommendModal from './RecommendModal';

function RecommendButton() {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <>
            <div className="fixed bottom-4 right-4">
                <button
                    onClick={() => setIsOpen(true)}
                    className="bg-gray-900 text-white px-4 py-2 rounded-lg shadow-lg hover:bg-gray-800 transition">
                    Recommend
                </button>
            </div>


            <RecommendModal isOpen={isOpen} onClose={() => setIsOpen(false)} />
        </>
    );
}

export default RecommendButton;



