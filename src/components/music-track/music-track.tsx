"use client";
import { faListMusic } from "@awesome.me/kit-ad5a070521/icons/duotone/solid";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const MusicTrack = ({ styles, track, button_action, animation_delay }: any) => {
    return (
        <div className={styles.track__item} style={{ animationDelay: animation_delay }}>
            <div className={styles.track__search__item}>
                <div className={styles.track__search__item__content}>
                    <img src={track.album.images?.[0]?.url || "/disk.png"} alt={track.name} className={styles.track__search__img} />
                    <div className={styles.track__search__text}>
                        <h3 className={styles.track__search__title}>{track.name}</h3>
                        <h4 className={styles.track__search__artist}>{track.album.name} • {track.artists.map((artist: any) => artist.name).join(", ")}</h4>
                    </div>
                </div>
                <div>
                    <button className={styles.track__search__btn} onClick={() => button_action(track)}><FontAwesomeIcon icon={faListMusic} /> Add to queue</button>
                </div>
            </div>
        </div>
    );
}

export default MusicTrack;