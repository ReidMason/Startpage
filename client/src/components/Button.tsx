import React from 'react';
import LoadingSpinner from './LoadingSpinner';

interface ButtonProps {
    children?: React.ReactNode;
    onClick?: Function;
    type?: "button" | "submit" | "reset";
    colour?: "red" | "green" | "blue";
    textColour?: "dark" | "light";
    loading?: boolean;
    disabled?: boolean;
    className?: string;
}

const backgroundColourMapping = {
    red: "bg-nord-11",
    green: "bg-nord-14",
    blue: "bg-nord-10",
    default: "bg-nord-2"
}

const hoverBackgroundColourMapping = {
    red: "hover:bg-nord-12",
    green: "hover:bg-nord-7",
    blue: "hover:bg-nord-9",
    default: "hover:bg-nord-3"
}

const textColourMapping = {
    dark: "text-gray-800",
    light: "text-nord-4",
}

export default function Button({ loading, colour, textColour, children, onClick, type, className, disabled }: ButtonProps) {
    const backgroundColour = backgroundColourMapping[colour || "default"];
    const hoverBackgroundColour = hoverBackgroundColourMapping[colour || "default"]
    const textColourCss = textColour ? textColourMapping[textColour] : "text-white";

    const cursorStyling = loading ? "cursor-wait" : disabled ? "cursor-not-allowed" : "";
    const hoverStyling = loading || disabled ? cursorStyling : "active:bg-nord-10 " + hoverBackgroundColour;


    return (
        <button className={`${backgroundColour} disabled:opacity-50 ${hoverStyling} ${textColourCss} rounded py-1 px-2 focus:outline-none ${className || ""}`} type={type || undefined} disabled={loading || disabled} onClick={(e) => (onClick ? onClick(e) : undefined)}>
            <div className="flex justify-center">
                {children}
                {loading && <div className="ml-2 my-auto">
                    <LoadingSpinner className="w-5 h-5" />
                </div>}
            </div>
        </button>
    )
}
