import { Chime } from "./ChimePlayer";

export type Meditation = {
    key: string;
    timestamp: number;
    month: number;
    markString: string;

    chimes: Chime[];
    timeElapsed: number;
    
    stressBefore?: number;
    stressAfter?: number;
    depth?: number;
    
    interrupted?: number;
    location?: string;
    log?: string;
}

const getFormattedDateString = (d: Date): string => {
    const ye = String(d.getFullYear());
    const mo = String(d.getMonth() + 1).padStart(2, '0');
    const da = String(d.getDate()).padStart(2, '0');
    const result = `${ye}-${mo}-${da}`;
    return result;
}

export const createBaseMeditation = (
    timestamp: Date, 
    chimes: Chime[], 
    timeElapsed: number,
): Meditation => {
    let m: Meditation = {
        key: timestamp.toISOString(),
        timestamp: timestamp.getTime(),
        month: timestamp.getMonth(),
        markString: getFormattedDateString(timestamp),
        chimes: chimes,
        timeElapsed: timeElapsed,
    };

    return m;
}

export const createNewMeditation = (chimes: Chime[]): Meditation => {
    let meditation: Meditation = createBaseMeditation(
        new Date(Date.now()), chimes, 0
    );

    return meditation;
}