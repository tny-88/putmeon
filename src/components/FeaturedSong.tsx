type Props = {
    title: string;
    artist: string;
    artworkUrl: string;
    embedUrl: string;
};

function FeaturedSong({ title, artist, artworkUrl, embedUrl }: Props) {
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

            <div className="aspect-video mt-4">
                <iframe
                    src={embedUrl}
                    allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
                    allowFullScreen
                    loading="lazy"
                    className="w-full h-full"
                />
            </div>
        </div>
    );
}

export default FeaturedSong;
