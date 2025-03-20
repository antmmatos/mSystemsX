import styles from "./header.module.css";

const Header = () => {
    return (
        <a href="/dashboard">
            <div className={styles.container}>
                <h1 className={styles.title}>mSystems<span className={styles.titlex}>X</span></h1>
                <h2 className={styles.subtitle}><span className="red">Homelab</span> Controller</h2>
            </div>
        </a>
    );
}

export default Header;