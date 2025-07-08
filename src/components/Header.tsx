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

            {/* Navigation link with responsive sizing */}
            <div className="flex-shrink-0 text-justify">
                <a
                    href="/recs"
                    className="inline-flex items-center gap-2 bg-black text-white font-bold px-5 py-2 rounded-full shadow-lg hover:bg-gray-800 transition-all duration-200 text-base sm:text-lg md:text-xl lg:text-2xl leading-tight hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black"
                >
                    FOR&nbsp;
                    <span className="font-bold">MOI</span>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
                </a>
                <p className="text-xs text-gray-500 mt-1 text-center">Click to see your recommendations</p>
            </div>
        </header>
    );
}

export default Header;