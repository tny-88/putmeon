
function Header() {
    return (
        <header className="flex justify-between items-start sm:items-center p-4 sm:p-6 md:p-8 lg:p-10">
            {/* Logo/Title with responsive sizing */}
            <div className="flex-shrink-0">
                <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-semibold text-black leading-tight">
                    FOR <br className="sm:hidden" />
                    <span className="hidden sm:inline"><br /></span>
                    YOU
                </h1>
            </div>

            {/* Navigation button with description */}
            <div className="flex-shrink-0 flex flex-col items-center text-center">
                <a
                    href="/recs"
                    className="bg-black text-white font-bold px-4 py-2 sm:px-6 sm:py-3 md:px-8 md:py-4 rounded-full text-base sm:text-lg md:text-xl lg:text-2xl leading-tight transition-all duration-200 hover:bg-gray-800 hover:scale-105 active:scale-95 shadow-lg hover:shadow-xl flex items-center gap-2"
                >
                    PUT ME ON
                </a>
                <p className="text-black text-xs sm:text-sm md:text-base mt-2 sm:mt-3 font-medium opacity-70">
                    Click here to recommend
                </p>
            </div>
        </header>
    );
}

export default Header;