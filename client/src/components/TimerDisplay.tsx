import React from 'react'
import TimerDigit from '../interfaces/TimerDigit'

interface TimerDisplayProps {
    timer: Array<TimerDigit>;
    editMode: boolean;
    editModeFirstRender: boolean;
    className?: string;
}

export default function TimerDisplay({ timer, editMode, className, editModeFirstRender }: TimerDisplayProps) {
    const displayHours = editMode || (timer[0].value !== 0 || timer[1].value !== 0);
    const displayMinutes = editMode || (displayHours || (timer[2].value !== 0 || timer[3].value !== 0));
    const displaySecondsPadding = editMode || displayHours || displayMinutes || timer[4].value !== 0;
    const opacity = editMode ? "opacity-50" : "opacity-20";

    // className={editModeFirstRender ? "opacity-20 cursor-pointer !border-opacity-0" : ""}
    return (
        <div className={`flex align-baseline transition-all border-b ${editModeFirstRender ? "opacity-50" : ""} ${editMode && !editModeFirstRender ? "border-opacity-70" : "border-opacity-0"}`}>
            {displayHours &&
                <div className="flex">
                    <p className={`text-4xl ${timer[0].known ? "" : opacity}`}>{timer[0].value}</p>
                    <p className={`text-4xl ${timer[1].known ? "" : opacity}`}>{timer[1].value}</p>
                    <span className={`mt-auto mr-2 ${timer[1].known ? "" : opacity}`}>h</span>
                </div>
            }
            {displayMinutes &&
                <div className="flex">
                    <p className={`text-4xl ${timer[2].known ? "" : opacity}`}>{timer[2].value}</p>
                    <p className={`text-4xl ${timer[3].known ? "" : opacity}`}>{timer[3].value}</p>
                    <span className={`mt-auto mr-2 ${timer[3].known ? "" : opacity}`}>m</span>
                </div>
            }
            <div className="flex">
                {displaySecondsPadding && <p className={`text-4xl ${timer[4].known ? "" : opacity}`}>{timer[4].value}</p>}
                <p className={`text-4xl ${timer[5].known ? "" : opacity}`}>{timer[5].value}</p>
                <span className={`mt-auto mr-2 ${timer[5].known ? "" : opacity}`}>s</span>
            </div>
        </div>
    )
}
