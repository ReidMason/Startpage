import React, { useState } from 'react'
import Button from '../components/Button'
import TimerDisplay from '../components/TimerDisplay';
import { TimerDigit } from '../interfaces';

function isNumeric(text: string) {
    return /^\d+$/.test(text);
}

const padArray = (arr: Array<TimerDigit>, len: number, fill: TimerDigit) => {
    return Array(len).fill(fill).concat(arr).slice(arr.length);
}

const zeroPadNum = (text: string | number) => {
    return String(text).padStart(2, '0')
}

let interval: NodeJS.Timeout | null = null;

export default function Timer() {
    const [timer, setTimer] = useState<Array<TimerDigit>>(padArray([], 6, { known: false, value: 0 }));
    const [timeRemaining, setTimeRemaining] = useState<Array<TimerDigit>>(padArray([], 6, { known: false, value: 0 }));
    const [timerRunning, setTimerRunning] = useState<boolean>(false);
    const [editMode, setEditMode] = useState<boolean>(true);
    const [editModeFirstRender, setEditModeFirstRender] = useState<boolean>(true);

    const anyTimerValueEntered = timer.find(x => x.known);
    const timeDisplay = timer.filter(x => x.known).map(x => x.value).join("");

    const checkTimerAndTimeRemainingMatch = () => {
        // Check if the timer and time remaining match
        for (let i = 0; i < timer.length; i++) {
            const timerElement = timer[i];
            const timeRemainingElement = timeRemaining[i];

            // If at least one of these don't match they are different timers
            if (timerElement.known !== timeRemainingElement.known || timerElement.value !== timeRemainingElement.value)
                return false;
        }

        return true;
    }

    const timerAndTimeRemainingMatch = checkTimerAndTimeRemainingMatch();

    const startTimer = () => {
        setEditMode(false);
        const hours = (timeRemaining[0].value * 10) + timeRemaining[1].value;
        const minutes = (timeRemaining[2].value * 10) + timeRemaining[3].value;
        const seconds = (timeRemaining[4].value * 10) + timeRemaining[5].value;

        var totalTime = (hours * 3600) + (minutes * 60) + seconds;
        if (totalTime < 1)
            return;

        setTimerRunning(true);

        if (interval)
            clearInterval(interval);


        interval = setInterval(() => {
            totalTime--;
            const hoursRemaining = Math.floor(totalTime / 3600)
            const minutesRemaining = Math.floor((totalTime - (hoursRemaining * 3600)) / 60);
            const secondsRemaining = totalTime - (hoursRemaining * 3600) - (minutesRemaining * 60);
            const timeRemainingDisplay = `${zeroPadNum(hoursRemaining)}${zeroPadNum(minutesRemaining)}${zeroPadNum(secondsRemaining)}`;

            const inputValueArray = timeRemainingDisplay.split('').map((x, i) => ({ known: timeRemaining[i].known, value: parseInt(x) }));
            const newTimeRemainingDisplay = padArray(inputValueArray, 6, { known: false, value: 0 })

            setTimeRemaining([...newTimeRemainingDisplay])

            if (totalTime <= 0 && interval)
                stopTimer();
        }, 1000);
    }

    const resetTimer = () => {
        stopTimer();
        // Set the time remaining to the original timer
        setTimeRemaining([...timer]);
    }

    const stopTimer = () => {
        // Stop the timer from running
        if (interval)
            clearInterval(interval);

        setTimerRunning(false);
    }

    const handleTimerInput = (e: React.ChangeEvent<HTMLInputElement>) => {
        const inputValue = (e.target.value || "").trim();

        // Handle non numeric values if the value isn't empty
        if ((!isNumeric(inputValue) && inputValue !== "") || !editMode) {
            e.target.value = timer.map(x => x.value).join('');
            return;
        }

        // Conver the text into an array of TimerDigits and zero pad the array
        const inputValueArray = e.target.value.split('').map(x => ({ known: true, value: parseInt(x) }));
        const newTimer = padArray(inputValueArray, 6, { known: false, value: 0 })

        setTimer([...newTimer]);
        setTimeRemaining([...newTimer]);
    }

    const enableEditMode = () => {
        if (timerRunning || timerAndTimeRemainingMatch)
            resetTimer();
        setEditMode(true);
        setEditModeFirstRender(false);
    }

    return (
        <div className="flex flex-col gap-4 items-center">
            <div className="flex flex-col items-center gap-4">
                <label className={`${!editMode || editModeFirstRender ? "cursor-pointer" : ""}`} onClick={enableEditMode} onMouseDown={(e) => e.preventDefault()} >
                    <TimerDisplay editMode={editMode} editModeFirstRender={editModeFirstRender} timer={editMode ? timer : timeRemaining} />
                    <input className="text-black opacity-0 absolute w-0 h-0" autoComplete="off" id="timeEditor" onBlur={() => setEditMode(false)} onSubmit={startTimer} value={timeDisplay} onChange={handleTimerInput} type="tel" maxLength={6} />
                </label>

                <div className="flex gap-4">
                    {!timerRunning ?
                        <Button onClick={startTimer} disabled={!anyTimerValueEntered}>Start</Button>
                        :
                        <Button onClick={stopTimer}>Stop</Button>
                    }
                    <Button onClick={resetTimer} disabled={!anyTimerValueEntered || timerAndTimeRemainingMatch}>Reset</Button>
                </div>
            </div>
        </div>
    )
}
