function Header() {
    return (
        <header className="sticky top-0 z-50 bg-white flex justify-between items-center p-10 pb-5">
            <h1 className="text-5xl font-semibold text-black">PUT ME <br/> ON</h1>
            <a href="/recs" className="text-black font-bold hover:underline">Recommendations</a>
        </header>
    );
}

export default Header;
