function Header() {
    return (
        <header className="flex justify-between items-start sm:items-center p-3 sm:p-4 md:p-6 lg:p-8 flex-shrink-0">
            {/* Logo/Title with compact responsive sizing */}
            <div className="flex-shrink-0">
                <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-semibold text-black leading-tight">
                    PUT ME <br className="sm:hidden" />
                    <span className="hidden sm:inline"><br /></span>
                    ON
                </h1>
            </div>

            {/* Navigation link with compact responsive sizing */}
            <div className="flex-shrink-0 text-right">
                <a
                    href="/recs"
                    className="text-black font-bold hover:underline text-sm sm:text-base md:text-lg lg:text-xl xl:text-2xl leading-tight transition-all duration-200 hover:text-gray-700"
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