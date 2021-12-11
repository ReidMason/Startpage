import React from 'react';
import { days, months } from "../common";

function getDateOrdinal(date: Date) {
    const d = date.getDate();
    if (d > 3 && d < 21) return "th";
    switch (d % 10) {
        case 1:
            return "st";
        case 2:
            return "nd";
        case 3:
            return "rd";
        default:
            return "th";
    }
}

const greetings: { [key: number]: string } = {
    0: "Good night!",
    1: "Good morning!",
    2: "Good afternoon!",
    3: "Good evening!"
};

interface GreetingProps {
    calendarUrl: string
}

export default function GreetingText({ calendarUrl }: GreetingProps) {
    const date: Date = new Date();

    const greeting: string = greetings[Math.floor(date.getHours() / 6)];

    const dayOfWeek = `${days[date.getDay()]}, ${date.getDate()}`;

    const dateOrdinal = getDateOrdinal(date);

    const monthAndYear = `${months[date.getMonth()]} ${date.getFullYear()}`;


    return (
        <div aria-label="greeting-section">
            <div className="mb-3" aria-label="current-date">
                <a className={`text-xl font-semibold ${calendarUrl ? 'cursor-pointer' : ''}`} href={calendarUrl ? calendarUrl : undefined} tabIndex={1}>{dayOfWeek}<sup>{dateOrdinal}</sup> {monthAndYear}</a>
            </div>
            <p className="text-5xl font-bold" aria-label="greeting">{greeting}</p>
        </div>
    )
}
