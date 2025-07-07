

function Messages() {

    return (
        <div className="h-screen bg-white flex flex-col relative overflow-hidden">
            {/* Main content centered */}
            <main className="flex-1 flex items-center justify-center px-4 sm:px-6 lg:px-8 min-h-0">
                <div className="text-center max-w-sm sm:max-w-md md:max-w-lg lg:max-w-xl">


                    {/* Purpose message */}
                    <div className="mb-6 sm:mb-8 md:mb-10 px-2">
                        <p className="text-xl sm:text-2xl md:text-3xl lg:text-4xl text-black leading-tight font-light text-left pb-15">
                            Page in progress
                        </p>
                        <p className="text-xs sm:text-sm md:text-base lg:text-lag text-gray-400 leading-relaxed font-light text-right">
                            ~ Terence, Mastermind Again
                        </p>
                    </div>

                    {/* CTA Button */}
                    <div>
                        <a
                            href="/home"
                            className="inline-block bg-black text-white px-6 sm:px-8 py-3 sm:py-4 rounded-full hover:bg-gray-800 transition-all duration-300 text-sm sm:text-base md:text-lg font-medium hover:shadow-lg transform hover:scale-105"
                        >
                            Head back lil bro
                        </a>
                    </div>
                </div>
            </main>

        </div>
    );

}

export default Messages;