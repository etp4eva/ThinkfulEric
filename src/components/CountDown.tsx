// https://dev.to/yuridevat/how-to-create-a-timer-with-react-7b9

import { useEffect, useState } from "react";
import { Text } from "react-native"

export enum CountDownState {
    RUNNING = 'RUNNING',
    PAUSED = 'PAUSED',
}

type Props = {
    totalMinutes: number;
    totalSeconds: number;
    state: CountDownState;
};

const generateDisplayString = (minutes: number, seconds: number) => {
    return `${minutes}:${seconds.toString().padStart(2, "0")}`
}

const calculateMs = (minutes: number, seconds: number) => {
    return minutes * 60000 + seconds * 1000;
}

const calculateMinSec = (milliseconds: number) => {
    const minutes = Math.floor(milliseconds / 60000);
    const seconds = Math.floor((milliseconds - (minutes * 60000)) / 1000);

    return {minutes: minutes, seconds: seconds};
}

export const CountDown = (props: Props) => {
    const [timerDisplay, updateDisplay] = useState(
        generateDisplayString(props.totalMinutes, props.totalSeconds)
    );
    const elapsedMilliseconds = useState(0);
    const lastTime = useState(Date.now());

    const totalMs = calculateMs(props.totalMinutes, props.totalSeconds);

    const updateTime = () => {
        if (props.state === CountDownState.RUNNING)
        {
            const interval = Date.now() - lastTime[0];
            elapsedMilliseconds[0] = elapsedMilliseconds[0] + interval;

            let msRemaining = totalMs - elapsedMilliseconds[0];

            let minSec = calculateMinSec(msRemaining);

            updateDisplay(generateDisplayString(minSec.minutes, minSec.seconds));
        }

        lastTime[0] = Date.now();
    }

    useEffect(() => {
        const interval = setInterval(updateTime, 100);

        return () => clearInterval(interval);
    });

    return <Text>{timerDisplay}</Text>

}