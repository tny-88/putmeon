function Header() {
    return (
        <header className="flex justify-between items-start sm:items-center p-4 sm:p-6 md:p-8 lg:p-10">
            {/* Logo/Title with responsive sizing */}
            <div className="flex-shrink-0">
                <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-semibold text-black leading-tight">
                    PUT ME <br className="sm:hidden" />
                    <span className="hidden sm:inline"><br /></span>
                    ON
                </h1>
            </div>

            {/* Navigation link with responsive sizing */}
            <div className="flex-shrink-0 text-right">
                <a
                    href="/recs"
                    className="text-black font-bold hover:underline text-base sm:text-lg md:text-xl lg:text-2xl leading-tight transition-all duration-200 hover:text-gray-700"
                >
                    Your <br className="sm:hidden" />
                    <span className="hidden sm:inline"><br /></span>
                    Recs
                </a>
            </div>
        </header>
    );
}

export default Header;