function Header() {
    return (
        <header className="sticky top-0 z-50 bg-white flex justify-between items-center p-4 sm:p-6 md:p-8 lg:p-10 pb-3 sm:pb-4 md:pb-5 border-b border-gray-100">
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
                    className="text-black font-bold hover:underline text-base sm:text-lg md:text-xl lg:text-2xl leading-tight transition-all duration-200 hover:text-gray-700"
                >
                    FOR <br className="sm:hidden" />
                    <span className="hidden sm:inline"><br /></span>
                    MOI
                </a>
            </div>
        </header>
    );
}

export default Header;