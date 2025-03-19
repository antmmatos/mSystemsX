import { auth } from "@/lib/auth";
import styles from "./management_form.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash } from "@awesome.me/kit-ad5a070521/icons/duotone/solid";

const AccountManagementForm = async () => {
    const session = await auth();
    let accounts: any = await fetch(process.env.BASE_URL + "/api/accounts");

    try {
        accounts = await accounts.json();
    } catch (error) {
        accounts = []
    }

    return (
        <div className={styles.management__div}>
            <div className={styles.management__title__container}>
                <h1 className={styles.management__title}>Account <span className="red">management</span></h1>
                <hr className={styles.management__titleline} />
            </div>
            <div className={styles.management__accounts__container}>
                <div className={styles.management__accounts__header}>
                    <p className={styles.management__accounts__description}>ID</p>
                    <p className={styles.management__accounts__description}>Name</p>
                    <p className={styles.management__accounts__description}>Username</p>
                    <p className={styles.management__accounts__description}>Actions</p>
                </div>
                <div className={styles.management__accounts__scrollable}>
                    {accounts.map((account, index) => (
                        <div key={account.id} className={styles.management__account__container} style={{ animationDelay: `${1.5 + (index * 0.2)}s` }}>
                            <p className={styles.management__account__description}>#{account.id}</p>
                            <p className={styles.management__account__description}>{account.firstname} {account.lastname}</p>
                            <p className={styles.management__account__description}>{account.username}</p>
                            <p className={styles.management__account__description}><button disabled={account.id == session?.user.id} className={styles.management__account__erase}><FontAwesomeIcon icon={faTrash} /></button></p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

export default AccountManagementForm;