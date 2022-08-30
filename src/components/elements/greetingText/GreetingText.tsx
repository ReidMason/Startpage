import { useEffect, useState } from "react";
import useConfig from "../../../hooks/useConfig";

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

export default function GreetingText() {
  const { config } = useConfig();
  const [date, setDate] = useState<Date>(new Date());

  const greeting: string = greetings[Math.floor(date.getHours() / 6)];

  const dayOfWeek = `${date.toLocaleString("default", {
    weekday: "long",
  })}, ${date.getDate()}`;

  const dateOrdinal = getDateOrdinal(date);

  const monthAndYear = date.toLocaleString("default", {
    month: "long",
    year: "numeric",
  });

  useEffect(() => {
    setDate(new Date());
  }, []);

  return (
    <div aria-label="greeting-section">
      <div className="mb-3" aria-label="current-date">
        <a
          className={`text-xl font-semibold ${
            config.data?.general.calendarUrl ? "cursor-pointer" : ""
          }`}
          href={
            config.data?.general.calendarUrl
              ? config.data.general.calendarUrl
              : undefined
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
