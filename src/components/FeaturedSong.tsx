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
        <div className="p-4 sm:p-6 max-w-md w-full text-center">
            <img
                src={artworkUrl}
                alt={`${title} artwork`}
                className="w-48 h-48 sm:w-64 sm:h-64 object-cover rounded-xl mx-auto shadow-md mb-4"
            />
            <div className="mb-2">
                <h2 className="text-xl sm:text-2xl font-semibold">{title}</h2>
                <p className="text-gray-500 text-sm sm:text-base">{artist}</p>
            </div>

            <div className="w-full mt-4">
                <iframe
                    src={embedUrl}
                    width="100%"
                    height="80"
                    allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
                    loading="lazy"
                    className="rounded-md border-none"
                />
            </div>


            {/* Apple Music Button */}
            <a
                href={appleMusicUrl || fallbackUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block mt-4 text-sm font-medium text-black underline hover:text-gray-700"
            >
                Listen on Apple Music →
            </a>
        </div>
    );
}

export default FeaturedSong;
