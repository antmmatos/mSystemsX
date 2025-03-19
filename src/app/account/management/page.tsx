import AccountManagementForm from "@/components/containers/management/management_form";
import Footer from "@/components/footer/footer";
import Header from "@/components/header/header";
import styles from "./management.module.css";

const AccountManagement = () => {
    return (
        <div className={styles.page}>
            <Header />            
            <AccountManagementForm />
            <Footer />
        </div>
    );
}

export default AccountManagement;