import React, { useEffect, useState } from 'react'
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

const createAudioObject = () => {
    const newAudio = new Audio("/android_argon.mp3");
    newAudio.loop = true;
    return newAudio;
}

const playAlarm = () => {
    audio = createAudioObject();
    audio.play();
}

const stopAlarm = () => {
    audio.pause();
}

const timerToSeconds = (timer: Array<TimerDigit>): number => {
    const hours = (timer[0].value * 10) + timer[1].value;
    const minutes = (timer[2].value * 10) + timer[3].value;
    const seconds = (timer[4].value * 10) + timer[5].value;

    return (hours * 3600) + (minutes * 60) + seconds;
}

const secondsToTimerString = (seconds: number): string => {
    const hoursRemaining = Math.floor(seconds / 3600)
    const minutesRemaining = Math.floor((seconds - (hoursRemaining * 3600)) / 60);
    const secondsRemaining = seconds - (hoursRemaining * 3600) - (minutesRemaining * 60);
    return `${zeroPadNum(hoursRemaining)}${zeroPadNum(minutesRemaining)}${zeroPadNum(secondsRemaining)}`;
}

let interval: NodeJS.Timeout | null = null;
let audio = createAudioObject();

export default function Timer() {
    const [timer, setTimer] = useState<Array<TimerDigit>>(padArray([], 6, { known: false, value: 0 }));
    const [timeRemaining, setTimeRemaining] = useState<Array<TimerDigit>>(padArray([], 6, { known: false, value: 0 }));
    const [timerRunning, setTimerRunning] = useState<boolean>(false);
    const [editMode, setEditMode] = useState<boolean>(true);
    const [editModeFirstRender, setEditModeFirstRender] = useState<boolean>(true);
    const [timerFinished, setTimerFinished] = useState<boolean>(false);

    const anyTimerValueEntered = timer.find(x => x.known);
    const timeDisplay = timer.filter(x => x.known).map(x => x.value).join("");

    useEffect(() => {
        window.onbeforeunload = null;
        if (timerRunning)
            window.onbeforeunload = function () {
                return true;
            };
    }, [timerRunning])

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
        let totalTime = timerToSeconds(timeRemaining);
        if (totalTime < 1)
            return;

        setTimerRunning(true);

        // Clear existing interval to prevent multiple running
        if (interval)
            clearInterval(interval);

        // Alarm countdown
        interval = setInterval(() => {
            totalTime--;

            const timeRemainingDisplay = secondsToTimerString(totalTime);
            const inputValueArray = timeRemainingDisplay.split('').map((x, i) => ({ known: timeRemaining[i].known, value: parseInt(x) }));
            const newTimeRemainingDisplay = padArray(inputValueArray, 6, { known: false, value: 0 })
            setTimeRemaining([...newTimeRemainingDisplay])

            if (totalTime <= 0 && interval) {
                setTimerFinished(true);
                playAlarm();
                stopTimer();
            }
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
        // Don't allow editing if the timer is running
        if (timerRunning)
            return;

        // If the timer has ended and we're entering edit mode we can reset the timer
        if (timerToSeconds(timeRemaining) < 1)
            resetTimer();

        setEditMode(true);
        acknowledgeAlarmFinished()
        setEditModeFirstRender(false);
    }

    const acknowledgeAlarmFinished = () => {
        stopAlarm();
        setTimerFinished(false);
    }

    return (
        <div className="flex flex-col gap-4 items-center">
            <div className="flex flex-col items-center gap-4">
                <label className={`pl-4 ${timerFinished ? "animate-bounce" : ""} ${(!editMode || editModeFirstRender) && !timerRunning ? "cursor-pointer" : ""}`} onClick={enableEditMode} onMouseDown={(e) => e.preventDefault()} >
                    <TimerDisplay editMode={editMode} editModeFirstRender={editModeFirstRender} timer={editMode ? timer : timeRemaining} />
                    <input className="text-black opacity-0 absolute w-0 h-0" autoComplete="off" id="timeEditor" onBlur={() => setEditMode(false)} onSubmit={startTimer} value={timeDisplay} onChange={handleTimerInput} type="tel" maxLength={6} />
                </label>

                <div className="grid grid-cols-2 gap-4">
                    {!timerRunning ?
                        timerFinished ?
                            <Button className="w-64" onClick={acknowledgeAlarmFinished} disabled={!anyTimerValueEntered}>Okay</Button>
                            :
                            <Button className="w-64" onClick={startTimer} disabled={!anyTimerValueEntered}>Start</Button>
                        :
                        <Button className="w-64" onClick={stopTimer}>Stop</Button>
                    }

                    <Button onClick={resetTimer} disabled={!anyTimerValueEntered || timerAndTimeRemainingMatch}>Reset</Button>
                </div>
            </div>
        </div>
    )
}
