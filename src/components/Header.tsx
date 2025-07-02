function Header() {
    return (
        <header className="sticky top-0 z-50 bg-white flex justify-between items-center px-6 pt-6 pb-4">
        <h1 className="text-5xl font-semibold text-black">PUT ME <br/> ON</h1>
            <a href="/recs" className="text-black font-bold hover:underline text-2xl">Your <br/> Recs</a>
        </header>
    );
}

export default Header;
