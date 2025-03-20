"use client";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import styles from "./sound-system_container.module.css";
import { faBackward, faForward, faMagnifyingGlassMusic, faPause, faPlay, faTrash } from "@awesome.me/kit-ad5a070521/icons/duotone/solid";
import React, { useEffect, useState } from "react";
import MusicTrack from "@/components/music-track/music-track";
import { toast } from "react-toastify";
import axios from "axios";

const SoundSystemContainer = () => {
    // Page details
    const [queue, setQueue] = useState([]);
    const [searchTracks, setSearchTracks] = useState([]);
    const [newBarValue, setNewBarValue] = useState(0 as number | null);

    // Music details    
    const [playing, setPlaying] = useState(false);
    const [trackUri, setTrackUri] = useState("");
    const [trackName, setTrackName] = useState("Not playing");
    const [trackArtistAlbum, setTrackArtistAlbum] = useState("");
    const [trackImg, setTrackImg] = useState("/disk.png");
    const [trackTime, setTrackTime] = useState("00:00");
    const [maxTrackTime, setMaxTrackTime] = useState("00:00");

    function formatMilliseconds(ms: number) {
        const minutes = Math.floor(ms / 60000);
        const seconds = Math.floor((ms % 60000) / 1000);
        return `${minutes}:${seconds.toString().padStart(2, '0')}`;
    }

    useEffect(() => {
        const bar = document.getElementById("player__progress__bar") as HTMLDivElement;
        const socket = new WebSocket('ws://localhost:3000/api/music/play');
        fetch("/api/music/playlist").then((res) => res.json()).then((data) => {
            setTimeout(() => {
                setSearchTracks(data);
            }, 1500);
        });
        socket.onopen = () => {
            console.log("Websocket connection established");
        }
        socket.onmessage = function (event) {
            const track_data = JSON.parse(event.data);
            setPlaying(track_data.track.playing);
            setTrackUri(track_data.track.uri || "");
            setTrackName(track_data.track.name || "Not playing");
            setTrackArtistAlbum(!track_data.track.artist || !track_data.track.album ? "" : track_data.track.artist + " • " + track_data.track.album);
            setTrackImg(track_data.track.img || "/disk.png");
            setTrackTime(formatMilliseconds(track_data.track.time));
            setMaxTrackTime(formatMilliseconds(track_data.track.maxTime));
            setQueue(track_data.queue);
            const time = track_data.track.time;
            const maxTime = track_data.track.maxTime;
            const progress = time / maxTime;
            bar.style.width = `${newBarValue || (progress * 100)}%`;
            const check_size = document.getElementsByClassName("check_size");
            for (let i = 0; i < check_size.length; i++) {
                const container = check_size[i] as HTMLSpanElement;
                if (container.parentElement!!.scrollWidth > container.parentElement!!.offsetWidth) {
                    const pxDifference = container.parentElement!!.scrollWidth - container.parentElement!!.offsetWidth;
                    document.documentElement.style.setProperty(`--${container.id}-width`, `-${pxDifference}px`);
                    container.style.animationPlayState = "running";
                } else {
                    container.style.animationPlayState = "paused";
                }
            }
        };
    }, []);

    // Add music to queue button inside music track component
    const handleAddToQueue = async (track: any) => {
        const queue = await fetch("/api/music/queue");
        const queueResponse = await queue.json();
        if (queueResponse.queue.length === 0 && !playing && trackUri === "") {
            setTrackUri(track.uri);
            setTrackName(track.name);
            setTrackArtistAlbum(track.artists.map((artist: any) => artist.name).join(", ") + " • " + track.album.name);
            setTrackImg(track.album.images?.[0]?.url || "/disk.png");
            setTrackTime("0:00");
            setMaxTrackTime(formatMilliseconds(track.duration_ms));
            const play_request = await axios.post(`/api/music/play`, {
                uri: track.uri,
                name: track.name,
                album: track.album.name,
                artist: track.artists.map((artist: any) => artist.name).join(", "),
                img: track.album.images?.[0]?.url || "/disk.png",
                maxTime: track.duration_ms,
                playing: true,
            });
            if (!play_request.data.success) {
                toast.error(play_request.data.message);
                return;
            }
            setPlaying(true);
        } else {
            const queue = await fetch(`/api/music/queue`, {
                method: "POST",
                body: JSON.stringify({
                    uri: track.uri,
                    name: track.name,
                    album: track.album.name,
                    artist: track.artists.map((artist: any) => artist.name).join(", "),
                    img: track.album.images?.[0]?.url || "/disk.png",
                    maxTime: track.duration_ms,
                }),
            });
            const queueResponse = await queue.json();
            if (!queueResponse.success) {
                toast.error("An error occurred while trying to add the music to the queue.");
                return;
            }
            setQueue(queueResponse.queue);
        }
    }

    // Start/stop music button
    const handlePlayMusic = async () => {
        const play_request = await axios.post(`/api/music/play`, {
            uri: trackUri,
            name: trackName,
            album: trackArtistAlbum,
            artist: trackArtistAlbum,
            img: trackImg,
            maxTime: maxTrackTime,
            playing: !playing,
        });
        if (!play_request.data.success) {
            toast.error(play_request.data.message);
            return;
        }
        setPlaying(play_request.data.playing);
    }

    // Skip music button
    const handleSkipMusic = async () => {
        const skip_request = await axios.post(`/api/music/skip`);
        if (!skip_request.data.success) {
            toast.error(skip_request.data.message);
            return;
        }
        setPlaying(skip_request.data.playing);
    }

    // Previous music button
    const handlePreviousMusic = async () => {
        const previous_request = await axios.post(`/api/music/previous`);
        if (!previous_request.data.success) {
            toast.error(previous_request.data.message);
            return;
        }
        setPlaying(previous_request.data.playing);
    }

    // Delete music from queue
    const handleDeleteMusic = async (order: number) => {
        const delete_request = await axios.delete(`/api/music/queue`, {
            params: {
                order,
            },
        });
        if (!delete_request.data.success) {
            toast.error(delete_request.data.message);
            return;
        }
        setQueue(delete_request.data.queue);
    }

    // Search for music
    const handleSearch = async (e: any) => {
        e.preventDefault();
        const btn = e.target as HTMLButtonElement;
        btn.disabled = true;
        const searchInput = document.getElementById("search_data") as HTMLInputElement;
        const searchValue = searchInput.value;
        if (!searchValue) {
            btn.disabled = false;
            return;
        }
        const data = await fetch(`/api/music/search?music=${searchValue}`);
        const response = await data.json();
        setSearchTracks(response.data);
        btn.disabled = false;
    }

    return (
        <div className={styles.sound__div}>
            <div className={styles.sound__title__container}>
                <h1 className={styles.sound__title}>Sound <span className="red">System</span></h1>
                <hr className={styles.sound__titleline} />
            </div>
            <div className={styles.sound__div_container}>
                <div className={styles.queue__container}>
                    <div className={styles.queue__div}>
                        <h3 className={styles.queue__title}>Queue</h3>
                        <div className={styles.queue__scrollable}>
                            {queue.map((track: any, index: number) => {
                                return (
                                    <div className={styles.queue__item} style={{ animationDelay: `${(index * 0.2)}s` }} key={index}>
                                        <div className={styles.queue__item__content}>
                                            <div className={styles.queue__item__img__div}>
                                                <img src={track.music_img} alt={track.music_name} className={styles.queue__item__img} />
                                                <div className={styles.queue__delete__btn__div} onClick={() => handleDeleteMusic(track.order)}>
                                                    <FontAwesomeIcon className={styles.queue__delete__btn} icon={faTrash} />
                                                </div>
                                            </div>
                                            <div className={styles.queue__item__text}>
                                                <span className={styles.queue__item__title__container}><h3 id="queue-title" className={[styles.queue__item__title, "check_size"].join(" ")}>{track.music_name}</h3></span>
                                                <span className={styles.queue__item__artist__container}><h4 id="queue-artists" className={[styles.queue__item__artist, "check_size"].join(" ")}>{track.music_artist} • {track.music_album}</h4></span>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                        <button className={styles.queue__empty}>Empty queue</button>
                    </div>
                </div>
                <div className={styles.sound__container}>
                    <div className={styles.musics__div}>
                        <form className={styles.search__div} onSubmit={(e) => handleSearch(e)}>
                            <input type="text" placeholder="Search for music" className={styles.search__input} id="search_data" />
                            <button className={styles.search__btn} type="submit"><span className={styles.search__btn__text}><FontAwesomeIcon icon={faMagnifyingGlassMusic} /> Search</span></button>
                        </form>
                        <div className={styles.musics__content}>
                            <div className={styles.musics__content__scrollable}>
                                {searchTracks.map((track: any, index: number) => {
                                    return (
                                        <MusicTrack styles={styles} track={track} button_action={handleAddToQueue} animation_delay={`${index * 0.2}s`} key={index} />
                                    );
                                })}
                            </div>
                        </div>
                        <div className={styles.player__div}>
                            <div className={styles.track__info}>
                                <div className={styles.track__img}>
                                    <svg width="0" height="0" className={styles.dvd__svg__image}>
                                        <defs>
                                            <pattern id="dvd-image"
                                                patternContentUnits="objectBoundingBox" width="1" height="1">
                                                <image x="0" y="0" width="1" height="1" preserveAspectRatio="xMidYMid slice"
                                                    xlinkHref={trackImg} />
                                            </pattern>
                                        </defs>
                                    </svg>
                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" className={styles.dvd__svg}>
                                        <path className={["fa-secondary", styles.dvd__icon].join(" ")} opacity=".4" d="M0 256a256 256 0 1 0 512 0A256 256 0 1 0 0 256zm64-16c0-45.4 22.3-89.2 54.5-121.5S194.6 64 240 64c8.8 0 16 7.2 16 16s-7.2 16-16 16c-35 0-71.1 17.5-98.8 45.2S96 205 96 240c0 8.8-7.2 16-16 16s-16-7.2-16-16zm288 16a96 96 0 1 1 -192 0 96 96 0 1 1 192 0z" />
                                        <path className={["fa-primary", styles.dvd__icon].join(" ")} d="M256 224a32 32 0 1 0 0 64 32 32 0 1 0 0-64zm96 32a96 96 0 1 1 -192 0 96 96 0 1 1 192 0z" />
                                    </svg>
                                </div>
                                <div className={styles.track__text}>
                                    <span className={styles.track__title__container}><h3 id="player-title" className={[styles.track__title, "check_size"].join(" ")}>{trackName}</h3></span>
                                    <span className={styles.track__artist__container}><h4 id="player-artists" className={[styles.track__artist, "check_size"].join(" ")}>{trackArtistAlbum}</h4></span>
                                </div>
                            </div>
                            <div className={styles.player__info}>
                                <span className={styles.player__start__time}>{trackTime}</span>
                                <div className={styles.player__progress} onClick={async (event: any) => {
                                    if (!playing) return;
                                    const bar = document.getElementById("player__progress__bar") as HTMLDivElement;
                                    const element = event.target;
                                    const rect = element.getBoundingClientRect();
                                    const x = event.clientX - rect.left;
                                    const musicPercentage = (x * 100) / element.offsetWidth;
                                    bar.style.width = `${musicPercentage}%`;
                                    setNewBarValue(musicPercentage);
                                    await axios.post("/api/music/seek", { percentage: musicPercentage });
                                    setNewBarValue(null);
                                }}>
                                    <hr className={styles.player__progress__bar} id="player__progress__bar" />
                                    <hr className={styles.player__progress__bar__bg} />
                                </div>
                                <span className={styles.player__end__time}>{maxTrackTime}</span>
                            </div>
                            <div className={styles.player__controls}>
                                <button className={styles.player__btn} onClick={handlePreviousMusic}><FontAwesomeIcon icon={faBackward} /></button>
                                <button className={styles.player__btn} onClick={handlePlayMusic} style={{ width: "45px", height: "45px" }}><FontAwesomeIcon style={{ fontSize: "20px" }} icon={playing ? faPause : faPlay} /></button>
                                <button className={styles.player__btn} onClick={handleSkipMusic}><FontAwesomeIcon icon={faForward} /></button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SoundSystemContainer;