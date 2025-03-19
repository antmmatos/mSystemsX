import type { Metadata } from "next";
import { ToastContainer } from 'react-toastify';
import "./globals.css";
import 'react-toastify/dist/ReactToastify.css';
import '@fortawesome/fontawesome-svg-core/styles.css';
import Background from "@/components/background/background";

export const metadata: Metadata = {
    title: "MainSystemsX"
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en">
            <head>
                <script src="https://cdnjs.cloudflare.com/ajax/libs/particles.js/2.0.0/particles.min.js" integrity="sha512-Kef5sc7gfTacR7TZKelcrRs15ipf7+t+n7Zh6mKNJbmW+/RRdCW9nwfLn4YX0s2nO6Kv5Y2ChqgIakaC6PW09A==" crossOrigin="anonymous" referrerPolicy="no-referrer"></script>
            </head>
            <body>
                <div id="particles"></div>
                <ToastContainer
                    theme="dark"
                    toastStyle={{
                        backgroundColor: "transparent",
                        border: "2px solid var(--second-color)"
                    }}
                    closeButton={false}
                    closeOnClick={true}
                    hideProgressBar={true}
                    pauseOnHover={false}
                    autoClose={2000}
                />
                {children}
                <Background />
            </body>
        </html>
    );
}
