// https://dev.to/yuridevat/how-to-create-a-timer-with-react-7b9

import { useEffect, useState } from "react";
import { StyleProp, Text, TextStyle } from "react-native"
import { Timer } from "../types/Timer";

export enum CountDownState {
    RUNNING = 'RUNNING',
    PAUSED = 'PAUSED',
}

type Props = {
    totalMinutes: number;
    totalSeconds: number;
    state: CountDownState;
    onComplete?: () => void;
    style?: StyleProp<TextStyle>
};

const generateDisplayString = (ms: number) => {
    const minSec = calculateMinSec(ms);
    return generateDisplayStringMinSec(minSec.minutes, minSec.seconds);
}

const generateDisplayStringMinSec = (minutes: number, seconds: number) => {
    return `${minutes}:${seconds.toString().padStart(2, "0")}`
}

const calculateMinSec = (milliseconds: number) => {
    const minutes = Math.floor(milliseconds / 60000);
    const seconds = Math.floor((milliseconds - (minutes * 60000)) / 1000);

    return {minutes: minutes, seconds: seconds};
}

const calculateMs = (minutes: number, seconds: number) => {
    return minutes * 60000 + seconds * 1000;
}

export const CountDown = (props: Props) => {
    const [timer, setTimer] = useState(new Timer(
        calculateMs(props.totalMinutes, props.totalSeconds)
    ))
    const [timerDisplay, updateDisplay] = useState(
        generateDisplayStringMinSec(props.totalMinutes, props.totalSeconds)
    );
    const [state, setState] = useState<CountDownState>(props.state);
    
    useEffect(() => {
        const newMs = calculateMs(props.totalMinutes, props.totalSeconds);
        setTimer(new Timer(            
            newMs,
            timer.onComplete,
            timer.onTick,
            timer.isRunning,
        ))

    }, [props.totalMinutes, props.totalSeconds])

    useEffect(() => {
        setState(props.state);
        if (props.state === CountDownState.PAUSED) {
            timer.stopTimer();
        } else {            
            timer.runTimer();
        }
    }, [props.state])

    useEffect(() => {
        timer.onTick = () => {
            updateDisplay(
                generateDisplayString(timer.remainingMs)
            );  
        }

        timer.onComplete = () => {
            updateDisplay('0:00');
            setState(CountDownState.PAUSED);

            if (props.onComplete)
                props.onComplete();
        }
    }, [timer])

    return <Text style={props.style}>{timerDisplay}</Text>

}