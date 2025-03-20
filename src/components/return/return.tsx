import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft } from "@awesome.me/kit-ad5a070521/icons/duotone/solid";
import styles from "./return.module.css";

const Return = () => {
    return (
        <div className={styles.btn__container}>
            <a href="/dashboard" className={styles.return__btn}><FontAwesomeIcon icon={faArrowLeft} /> Return</a>
            <hr className={styles.return__btn__line} />
        </div>
    );
}

export default Return;