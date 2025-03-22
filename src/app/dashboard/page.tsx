import Footer from "@/components/footer/footer";
import Header from "@/components/header/header";
import styles from "./dashboard.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeftFromBracket, faEnvelope, faKey, faNetworkWired, faServer, faSignal, faUsers, faWaveformLines } from "@awesome.me/kit-ad5a070521/icons/duotone/solid";

export default async function Home() {
    return (
        <div className={styles.page}>
            <Header />
            <div className={styles.container}>
                <div className={styles.category__title}>
                    <h3>Dashboard</h3>
                    <hr />
                </div>
                <ul className={styles.navbar}>
                    <a href={"http://" + process.env.PUBLIC_PROXMOX_HOST + "/"} target="_blank" rel="noopener noreferrer">
                        <li className={styles.navbar__element} data-anim={1}>
                            <FontAwesomeIcon icon={faNetworkWired} />
                            Proxmox System
                        </li>
                    </a>
                    <a href="/dashboard/virtual-machines">
                        <li className={styles.navbar__element} data-anim={2}>
                            <FontAwesomeIcon icon={faServer} />
                            Virtual Machines
                        </li>
                    </a>
                    <a href="/dashboard/sound-system">
                        <li className={styles.navbar__element} data-anim={3}>
                            <FontAwesomeIcon icon={faWaveformLines} />
                            Sound System
                        </li>
                    </a>
                    <a href="">
                        <li className={styles.navbar__element} data-anim={4}>
                            <FontAwesomeIcon icon={faEnvelope} />
                            Email
                        </li>
                    </a>
                    <a href="">
                        <li className={styles.navbar__element} data-anim={5}>
                            <FontAwesomeIcon icon={faSignal} />
                            Status
                        </li>
                    </a>
                </ul>
            </div>
            <div className={styles.container}>
                <div className={styles.category__title}>
                    <h3>Authentication Settings</h3>
                    <hr />
                </div>
                <ul className={styles.auth__manager}>
                    <a href="/api/auth/logout">
                        <li className={styles.auth__manager__element} data-anim={1}>
                            <FontAwesomeIcon icon={faArrowLeftFromBracket} />
                            Logout
                        </li>
                    </a>
                    <a href="/account/change-password">
                        <li className={styles.auth__manager__element} data-anim={2}>
                            <FontAwesomeIcon icon={faKey} />
                            Change password
                        </li>
                    </a>
                    <a href="/account/management">
                        <li className={styles.auth__manager__element} data-anim={3}>
                            <FontAwesomeIcon icon={faUsers} />
                            Account Management
                        </li>
                    </a>
                </ul>
            </div>
            <Footer />
        </div>
    );
}
