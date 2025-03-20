import Link from "next/link";
import styles from "./not-found.module.css";

const NotFound = () => {
    return (
        <main className={styles.container}>
            <h1><span className="red">4</span>0<span className="red">4</span></h1>
            <h3>Not Found</h3>
            <h5>Click <Link href="/" className="red">here</Link> to go back to login</h5>
        </main>
    );
}

export default NotFound;