function Header() {
    return (
        <header className="flex justify-between items-center p-10">
            <h1 className="text-5xl font-semibold text-black">PUT ME <br/> ON</h1>
            <a href="/recs" className="text-black font-bold hover:underline text-2xl">Your <br/> Recs</a>
        </header>
    );
}

export default Header;
