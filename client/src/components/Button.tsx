import React from 'react';
import LoadingSpinner from './LoadingSpinner';

interface ButtonProps {
    children?: React.ReactNode;
    onClick?: Function;
    type?: "button" | "submit" | "reset";
    colour?: "red" | "green"
    textColour?: "dark" | "light";
    loading?: boolean;
}

const backgroundColourMapping = {
    red: "bg-nord-11",
    green: "bg-nord-14",
    default: "bg-nord-2"
}

const hoverBackgroundColourMapping = {
    red: "bg-nord-12",
    green: "bg-nord-7",
    default: "hover:bg-nord-3"
}

const textColourMapping = {
    dark: "text-gray-800",
    light: "text-nord-4",
}

export default function Button({ loading, colour, textColour, children, onClick, type }: ButtonProps) {
    const backgroundColour = backgroundColourMapping[colour || "default"];
    const hoverBackgroundColour = hoverBackgroundColourMapping[colour || "default"]
    const textColourCss = textColour ? textColourMapping[textColour] : "text-white";

    return (
        <button className={`w-full ${backgroundColour} "disabled:bg-opacity-60" ${loading ? "cursor-wait" : "active:bg-nord-10 hover:" + hoverBackgroundColour} ${textColourCss} rounded py-1 px-2 focus:outline-none `} type={type || undefined} disabled={loading} onClick={(e) => (onClick ? onClick(e) : undefined)}>
            <div className="flex justify-center">
                {children}
                {loading && <div className="ml-1 my-auto">
                    <LoadingSpinner />
                </div>}
            </div>
        </button>
    )
}
