type Props = {
    title: string;
    artist: string;
    artworkUrl: string;
    embedUrl: string;
    appleMusicUrl?: string | null;
};

function FeaturedSong({ title, artist, artworkUrl, embedUrl, appleMusicUrl }: Props) {
    const fallbackUrl = "/fallback";

    return (
        <div className="p-3 sm:p-4 md:p-6 max-w-xs sm:max-w-sm md:max-w-md w-full text-center mx-auto">
            {/* Artwork with responsive sizing */}
            <div className="relative mb-3 sm:mb-4 md:mb-6">
                <img
                    src={artworkUrl}
                    alt={`${title} artwork`}
                    className="w-48 h-48 sm:w-56 sm:h-56 md:w-64 md:h-64 object-cover rounded-xl mx-auto shadow-lg"
                />
            </div>

            {/* Song info with responsive text sizing */}
            <div className="mb-3 sm:mb-4 px-2">
                <h2 className="text-lg sm:text-xl md:text-2xl font-semibold text-black leading-tight mb-1 sm:mb-2">
                    {title}
                </h2>
                <p className="text-gray-500 text-sm sm:text-base md:text-lg">
                    {artist}
                </p>
            </div>

            {/* Spotify/Music embed with responsive height */}
            <div className="w-full mb-3 sm:mb-4 rounded-lg overflow-hidden">
                <iframe
                    src={embedUrl}
                    allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
                    loading="lazy"
                    className="w-full h-20 sm:h-23 md:h-26 border-none rounded-lg"
                    title={`${title} by ${artist}`}
                />
            </div>

            {/* Apple Music Button with responsive styling */}
            <div className="mt-3 sm:mt-4">
                <a
                    href={appleMusicUrl || fallbackUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-xs sm:text-sm md:text-base font-medium text-black underline hover:text-gray-700 transition-colors duration-200 px-2 py-1"
                >
                    Listen on Apple Music
                    <span className="text-xs sm:text-sm">→</span>
                </a>
            </div>
        </div>
    );
}

export default FeaturedSong;