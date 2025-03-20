"use client";

import { useEffect } from "react";

const Background = () => {

    useEffect(() => {
        //@ts-expect-error
        particlesJS.load('particles', '/particles.json');
    }, []);

    return (<></>);
}

export default Background;