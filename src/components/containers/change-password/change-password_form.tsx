"use client";
import { useEffect, useState } from "react";
import styles from "./change-password_form.module.css";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";

const ChangePasswordForm = () => {
    const [oldPassword, setOldPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmNewPassowrd, setConfirmNewPassword] = useState("");
    const router = useRouter();

    useEffect(() => {
        const form = document.getElementById("cp__form");
        form?.addEventListener("submit", async (e) => {
            e.preventDefault();
            try {
                const request = await fetch("/api/change-password", {
                    body: JSON.stringify({
                        oldPassword: oldPassword,
                        newPassword: newPassword
                    }),
                    method: "POST",
                    mode: "same-origin"
                })
                const data = await request.json();
                if (data.success) {
                    // login logic frontend
                    router.replace("/dashboard");
                } else {
                    toast.error("Invalid password");
                }
            } catch (error) {
                toast.error("Invalid password");
            }
        });
        const oldPassword = document.getElementById("old_password_input");
        oldPassword?.addEventListener("focusout", async (e) => {
            e.preventDefault();
            try {
                const request = await fetch("/api/check-password", {
                    body: JSON.stringify({
                        oldPassword: oldPassword
                    }),
                    method: "POST",
                    mode: "same-origin"
                });
                const data = await request.json();
                if (data.success) {
                    // check password logic frontend
                    if (data.correct) {

                    }
                } else {
                    toast.error("Invalid password");
                }
            } catch (error) {
                toast.error("Invalid password");
            }
        });
    }, []);

    return (
        <form className={styles.cp__form} id="cp__form">
            <div className={styles.cp__title__container}>
                <h1 className={styles.cp__title}>Change <span className="red">Password</span></h1>
                <hr className={styles.cp__titleline} />
            </div>
            <div className={styles.cp__container}>
                <div className={styles.cp__column}>
                    <div className={styles.input__block}>
                        <label className={styles.input__label}>New Password</label>
                        <input className={styles.input__text} type="password" placeholder="********" onChange={(e) => {
                            setNewPassword(e.target.value);
                        }} />
                    </div>
                    <div className={styles.input__block}>
                        <label className={styles.input__label}>Confirm New Password</label>
                        <input className={styles.input__text} type="password" placeholder="********" onChange={(e) => {
                            setConfirmNewPassword(e.target.value);
                        }} />
                    </div>
                </div>
                <div className={styles.cp__column}>
                    <div className={styles.input__block}>
                        <label className={styles.input__label}>Old Password</label>
                        <span className={styles.old__password__block}>
                            <input className={styles.input__text} type="text" placeholder="********" onChange={(e) => {
                                setOldPassword(e.target.value);
                            }} id="old_password_input" />
                            <i className={styles.check__password + " fa-duotone fa-check"}></i>
                        </span>
                    </div>
                    <div className={styles.input__block}>
                        <label className={styles.input__label}>Click to change the password</label>
                        <button className={styles.change__password__btn} type="submit">Change Password</button>
                    </div>
                </div>
            </div>
        </form>
    );
}

export default ChangePasswordForm;