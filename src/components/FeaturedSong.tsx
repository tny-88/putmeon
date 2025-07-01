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

            <div className="w-full max-w-[660px] mx-auto overflow-hidden rounded-md shadow-sm">
                <iframe
                    className="w-full h-[150px] bg-transparent"
                    src={embedUrl}
                    allow="autoplay *; encrypted-media *;"
                    sandbox="allow-forms allow-popups allow-same-origin allow-scripts allow-storage-access-by-user-activation allow-top-navigation-by-user-activation"
                />
            </div>

        </div>
    );
}

export default FeaturedSong;
