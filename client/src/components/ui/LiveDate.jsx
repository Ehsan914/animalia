import { useState, useEffect } from "react";

const LiveDate = () => {
    const getFormattedDate = () => {
        return new Date().toLocaleDateString("en-US", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
        });
    };

    const [date, setDate] = useState(getFormattedDate());

    useEffect(() => {
        const interval = setInterval(() => {
        setDate(getFormattedDate());
        }, 1000);
        return () => clearInterval(interval);
    }, []);

    return <span className="font-pixel-alt text-[20px]">{date}</span>;
};

export default LiveDate;