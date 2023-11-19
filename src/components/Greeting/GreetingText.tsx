import type { Config } from "@/services/config/schemas";
import { useEffect, useState } from "react";

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
  3: "Good evening!",
};

interface GreetingTextProps {
  config: Config;
}

export default function GreetingText({ config }: GreetingTextProps) {
  const [greeting, setGreeting] = useState<string>();
  const [dayOfWeek, setDayOfWeek] = useState<string>();
  const [dateOrdinal, setDateOrdinal] = useState<string>();
  const [monthAndYear, setMonthAndYear] = useState<string>();

  useEffect(() => {
    const date = new Date();
    setGreeting(greetings[Math.floor(date.getHours() / 6)]);
    setDayOfWeek(
      `${date.toLocaleString("default", {
        weekday: "long",
      })}, ${date.getDate()}`,
    );
    setDateOrdinal(getDateOrdinal(date));
    setMonthAndYear(
      date.toLocaleString("default", {
        month: "long",
        year: "numeric",
      }),
    );
  }, []);

  return (
    <div aria-label="greeting-section">
      <div className="mb-3" aria-label="current-date">
        <a
          className={`text-xl font-semibold ${config.general.calendarUrl ? "cursor-pointer" : ""
            }`}
          href={
            config.general.calendarUrl ? config.general.calendarUrl : undefined
          }
          tabIndex={-1}
        >
          {dayOfWeek}
          <sup>{dateOrdinal}</sup> {monthAndYear}
        </a>
      </div>
      <p className="text-4xl font-bold md:text-5xl" aria-label="greeting">
        {greeting}
      </p>
    </div>
  );
}
