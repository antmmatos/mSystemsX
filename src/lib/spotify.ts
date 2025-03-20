import axios from "axios";
import { readFromJson, writeToJson } from "./file";

const CLIENT_ID = process.env.PUBLIC_SPOTIFY_CLIENT_ID;
const CLIENT_SECRET = process.env.SPOTIFY_CLIENT_SECRET;
const REDIRECT_URI = "http://localhost:3000/api/music/auth/";

export const Spotify = {
    IsAuthenticated: false,

    async VerifyTokenAndRefresh() {
        const refresh_token = await readFromJson("refresh_token");
        const expires_in = await readFromJson("expires_in");
        if (expires_in < Date.now()) {
            try {
                const token_request = await axios.post(
                    "https://accounts.spotify.com/api/token",
                    {
                        grant_type: "refresh_token",
                        refresh_token: refresh_token,
                    },
                    {
                        headers: {
                            "Content-Type": "application/x-www-form-urlencoded",
                            Authorization: `Basic ${Buffer.from(
                                `${CLIENT_ID}:${CLIENT_SECRET}`
                            ).toString("base64")}`,
                        },
                    }
                );
                const json = token_request.data;
                writeToJson("access_token", json.access_token);
                writeToJson("refresh_token", json.refresh_token);
                writeToJson("expires_in", json.expires_in + Date.now());
            } catch (error: any) {
                console.log(error);
            }
        }
    },

    async Authenticate(access_token: string) {
        const token_request = await axios.post(
            "https://accounts.spotify.com/api/token",
            {
                grant_type: "authorization_code",
                code: access_token,
                redirect_uri: REDIRECT_URI,
            },
            {
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded",
                    Authorization: `Basic ${Buffer.from(
                        `${CLIENT_ID}:${CLIENT_SECRET}`
                    ).toString("base64")}`,
                },
            }
        );
        const json = token_request.data;
        writeToJson("access_token", json.access_token);
        writeToJson("refresh_token", json.refresh_token);
        writeToJson("expires_in", json.expires_in + Date.now());
        Spotify.IsAuthenticated = true;
    },

    async SearchSong(query: string) {
        await Spotify.VerifyTokenAndRefresh();
        try {
            const search_request = await axios.get(
                "https://api.spotify.com/v1/search",
                {
                    headers: {
                        Authorization: `Bearer ${await readFromJson(
                            "access_token"
                        )}`,
                    },
                    params: {
                        q: query,
                        type: "track",
                        limit: 10,
                    },
                }
            );
            return search_request.data.tracks?.items || [];
        } catch (error: any) {
            console.log(error);
        }
    },

    async MusicPlayer(songData: Music, forceSkip: boolean = false) {
        await Spotify.VerifyTokenAndRefresh();
        
        const { devices } = await Spotify.GetDevices();
        const device = devices.find((d: any) => d.name === "Controller");
        
        if (!device) {
            console.log("Device not found");
            return;
        }
    
        try {
            const playback_state = await Spotify.GetCurrentPlaybackState();
            const isPaused = playback_state?.item?.uri && !playback_state.is_playing && playback_state.progress_ms > 0;
    
            if (isPaused && !forceSkip) {
                await axios.put(
                    "https://api.spotify.com/v1/me/player/play",
                    {},
                    {
                        headers: {
                            Authorization: `Bearer ${await readFromJson("access_token")}`,
                        },
                        params: {
                            device_id: device.id,
                        },
                    }
                );
            } else {
                await axios.put(
                    "https://api.spotify.com/v1/me/player/play",
                    {
                        uris: [songData.uri],
                        position_ms: 0,
                    },
                    {
                        headers: {
                            Authorization: `Bearer ${await readFromJson("access_token")}`,
                            "Content-Type": "application/json",
                        },
                        params: {
                            device_id: device.id,
                        },
                    }
                );
            }
        } catch (error) {
            console.log(error);
        }
    },
    
    async StopMusic() {
        await Spotify.VerifyTokenAndRefresh();
        const { devices } = await Spotify.GetDevices();
        const device = devices.find((d: any) => d.name === "Controller");
        if (!device) {
            return console.log("Device not found");
        }
        try {
            const pause_request = await axios.put(
                "https://api.spotify.com/v1/me/player/pause",
                {},
                {
                    headers: {
                        Authorization: `Bearer ${await readFromJson(
                            "access_token"
                        )}`,
                    },
                    params: {
                        device_id: device.id,
                    },
                }
            );
            return pause_request.data;
        } catch (error: any) {
            console.log(error);
        }
    },

    async GetDevices() {
        await Spotify.VerifyTokenAndRefresh();
        try {
            const devices_request = await axios.get(
                "https://api.spotify.com/v1/me/player/devices",
                {
                    headers: {
                        Authorization: `Bearer ${await readFromJson(
                            "access_token"
                        )}`,
                    },
                }
            );
            return devices_request.data;
        } catch (error: any) {
            console.log(error);
        }
    },

    async GetCurrentPlaybackState() {
        try {
            const playback_request = await axios.get(
                "https://api.spotify.com/v1/me/player",
                {
                    headers: {
                        Authorization: `Bearer ${await readFromJson(
                            "access_token"
                        )}`,
                    },
                }
            );
            return playback_request.data;
        } catch (error: any) {
            console.log(error);
        }
    },

    async Seek(percentage: number) {
        await Spotify.VerifyTokenAndRefresh();
        const track_data = await Spotify.GetCurrentPlaybackState();
        const musicMs = Math.floor(
            (percentage / 100) * track_data.item.duration_ms
        );
        try {
            const seek_request = await axios.put(
                "https://api.spotify.com/v1/me/player/seek?position_ms=" +
                    musicMs,
                {},
                {
                    headers: {
                        Authorization: `Bearer ${await readFromJson(
                            "access_token"
                        )}`,
                    },
                }
            );
            return seek_request.data;
        } catch (error: any) {
            console.log(error);
        }
    },

    async LoadDefaultPlaylist() {
        await Spotify.VerifyTokenAndRefresh();
        const playlists = await axios.get(
            "https://api.spotify.com/v1/me/playlists",
            {
                headers: {
                    Authorization: `Bearer ${await readFromJson(
                        "access_token"
                    )}`,
                },
                params: {
                    limit: 50,
                },
            }
        );
        const playlist = playlists.data.items.find(
            (playlist: any) => playlist.name === "Pista"
        );
        if (!playlist) {
            return [];
        }
        const playlistId = playlist.id;
        const playlistTracks = await axios.get(
            `https://api.spotify.com/v1/playlists/${playlistId}/tracks`,
            {
                headers: {
                    Authorization: `Bearer ${await readFromJson(
                        "access_token"
                    )}`,
                },
                params: {
                    limit: 50,
                },
            }
        );
        return playlistTracks.data.items.map((item: any) => {
            const track = item.track;
            return {
                id: track.id,
                name: track.name,
                artists: track.artists,
                uri: track.uri,
                playing: false,
                album: track.album,
                duration_ms: track.duration_ms,
            };
        });
    },
};
