// spotifyAPI.ts
interface SpotifyTrack {
    name: string;
    artists: { name: string }[];
    album: {
        images: { url: string; height: number; width: number }[];
    };
}

interface SpotifyTokenResponse {
    access_token: string;
    token_type: string;
    expires_in: number;
}

class SpotifyAPI {
    private static instance: SpotifyAPI;
    private accessToken: string | null = null;
    private tokenExpiresAt: number = 0;

    private constructor() {}

    static getInstance(): SpotifyAPI {
        if (!SpotifyAPI.instance) {
            SpotifyAPI.instance = new SpotifyAPI();
        }
        return SpotifyAPI.instance;
    }

    // Extract track ID from Spotify URL
    private extractTrackId(url: string): string | null {
        const regex = /spotify\.com\/track\/([a-zA-Z0-9]+)/;
        const match = url.match(regex);
        return match ? match[1] : null;
    }

    // Convert regular Spotify URL to embed URL
    convertToEmbedUrl(url: string): string {
        const trackId = this.extractTrackId(url);
        if (!trackId) return url;

        // Extract query parameters from original URL
        const urlObj = new URL(url);
        const searchParams = urlObj.searchParams.toString();

        // Build embed URL
        let embedUrl = `https://open.spotify.com/embed/track/${trackId}`;
        if (searchParams) {
            embedUrl += `?${searchParams}`;
        }

        return embedUrl;
    }

    // Get access token from Spotify
    private async getAccessToken(): Promise<string> {
        // Check if we have a valid token
        if (this.accessToken && Date.now() < this.tokenExpiresAt) {
            return this.accessToken;
        }

        const clientId = import.meta.env.VITE_SPOTIFY_CLIENT_ID;
        const clientSecret = import.meta.env.VITE_SPOTIFY_CLIENT_SECRET;

        if (!clientId || !clientSecret) {
            throw new Error('Spotify credentials not found in environment variables');
        }

        const response = await fetch('https://accounts.spotify.com/api/token', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'Authorization': `Basic ${btoa(clientId + ':' + clientSecret)}`,
            },
            body: 'grant_type=client_credentials',
        });

        if (!response.ok) {
            throw new Error('Failed to get Spotify access token');
        }

        const data: SpotifyTokenResponse = await response.json();
        this.accessToken = data.access_token;
        this.tokenExpiresAt = Date.now() + (data.expires_in * 1000) - 60000; // Subtract 1 minute for safety

        return this.accessToken;
    }

    // Fetch track information from Spotify
    async getTrackInfo(url: string): Promise<{ title: string; artist: string; artworkUrl: string; embedUrl: string } | null> {
        try {
            const trackId = this.extractTrackId(url);
            if (!trackId) {
                throw new Error('Invalid Spotify URL');
            }

            const accessToken = await this.getAccessToken();

            const response = await fetch(`https://api.spotify.com/v1/tracks/${trackId}`, {
                headers: {
                    'Authorization': `Bearer ${accessToken}`,
                },
            });

            if (!response.ok) {
                throw new Error('Failed to fetch track information');
            }

            const track: SpotifyTrack = await response.json();

            // Get the best quality artwork (usually the first one)
            const artworkUrl = track.album.images[0]?.url || '';

            return {
                title: track.name,
                artist: track.artists.map(artist => artist.name).join(', '),
                artworkUrl,
                embedUrl: this.convertToEmbedUrl(url)
            };
        } catch (error) {
            console.error('Error fetching track info:', error);
            return null;
        }
    }
}

export const spotifyAPI = SpotifyAPI.getInstance();