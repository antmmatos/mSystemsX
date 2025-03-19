import ChangePasswordForm from "@/components/containers/change-password/change-password_form";
import Footer from "@/components/footer/footer";
import Header from "@/components/header/header";
import styles from "./changepassword.module.css";

const ChangePassword = () => {
    return (
        <div className={styles.page}>
            <Header />
            <ChangePasswordForm />
            <Footer />
        </div>
    );
}

export default ChangePassword;