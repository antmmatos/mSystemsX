import styles from "./login.module.css";
import LoginForm from '@/components/containers/login/login_form';
import Footer from "@/components/footer/footer";
import Header from "@/components/header/header";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";

const Login = async () => {
    const session = await auth();
    if (session) {
        redirect("https://accounts.spotify.com/authorize?client_id=ee9a2c359dd647d19cb1fd7123c9a8cf&response_type=code&redirect_uri=http://localhost:3000/api/music/auth/&scope=user-read-playback-state user-modify-playback-state");
    }

    return (
        <main className={styles.page}>
            <Header />
            <LoginForm />
            <Footer />
        </main>
    );
}

export default Login;