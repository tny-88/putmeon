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
        <div className="flex flex-col items-center justify-center h-full max-w-xs sm:max-w-sm md:max-w-md w-full text-center px-3 sm:px-4">
            {/* Artwork with compact responsive sizing */}
            <div className="relative mb-2 sm:mb-3 flex-shrink-0">
                <img
                    src={artworkUrl}
                    alt={`${title} artwork`}
                    className="w-32 h-32 sm:w-40 sm:h-40 md:w-48 md:h-48 lg:w-56 lg:h-56 object-cover rounded-xl mx-auto shadow-lg"
                />
            </div>

            {/* Song info with compact spacing */}
            <div className="mb-2 sm:mb-3 px-2 flex-shrink-0">
                <h2 className="text-base sm:text-lg md:text-xl lg:text-2xl font-semibold text-black leading-tight mb-1">
                    {title}
                </h2>
                <p className="text-gray-500 text-xs sm:text-sm md:text-base lg:text-lg">
                    {artist}
                </p>
            </div>

            {/* Spotify/Music embed with compact height */}
            <div className="w-full mb-2 sm:mb-3 rounded-lg overflow-hidden flex-shrink-0">
                <iframe
                    src={embedUrl}
                    allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
                    loading="lazy"
                    className="w-full h-20 sm:h-24 md:h-28 lg:h-32 border-none rounded-lg"
                    title={`${title} by ${artist}`}
                />
            </div>

            {/* Apple Music Button with compact styling */}
            <div className="flex-shrink-0">
                <a
                    href={appleMusicUrl || fallbackUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-xs sm:text-sm md:text-base font-medium text-black underline hover:text-gray-700 transition-colors duration-200 px-1 py-1"
                >
                    Listen on Apple Music
                    <span className="text-xs sm:text-sm">→</span>
                </a>
            </div>
        </div>
    );
}

export default FeaturedSong;