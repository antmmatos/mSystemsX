import styles from "./footer.module.css";

const Footer = () => {
    return (
        <footer className={styles.footer}>
            Made by Matos, powered by <span className="red">MainSystems</span>
        </footer>
    );
}

export default Footer;