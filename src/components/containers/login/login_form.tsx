"use client";
import { FormEvent } from "react";
import styles from "./login_form.module.css";
import { toast } from 'react-toastify';
import { useRouter } from "next/navigation";
import { authenticate } from "@/app/api/auth/authenticate";

const LoginForm = () => {
    const router = useRouter();

    const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        try {
            const formData = new FormData(event.currentTarget);
            const request = await authenticate(formData);
            if (request.success) {
                toast.success("Logged in successfully");
                router.push(`https://accounts.spotify.com/authorize?client_id=${process.env.PUBLIC_SPOTIFY_CLIENT_ID}&response_type=code&redirect_uri=http://localhost:3000/api/music/auth/&scope=user-read-playback-state user-modify-playback-state`);
            } else {
                toast.error("Invalid username or password");
            }
        } catch (error) {
            toast.error("Invalid username or password");
        }
    }

    return (
        <form className={styles.login__form} onSubmit={handleSubmit}>
            <div className={styles.login__title__container}>
                <h1 className={styles.login__title}>Login</h1>
                <hr className={styles.login__titleline} />
            </div>
            <div className={styles.login__container}>
                <div className={styles.input__block}>
                    <label className={styles.input__label}>Username</label>
                    <input className={styles.input__text} type="text" placeholder="Username" name="username" />
                </div>
                <div className={styles.input__block}>
                    <label className={styles.input__label}>Password</label>
                    <input className={styles.input__text} type="password" placeholder="Password" name="password" />
                </div>
                <div className={styles.login__btn__container}>
                    <button className={styles.login__btn} type="submit">Login</button>
                </div>
            </div>
        </form>
    );
}

export default LoginForm;