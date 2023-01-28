import { Chime } from "./ChimePlayer";

export type Meditation = {
    key: string;
    timestamp: number;
    year: number;
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
        year: timestamp.getFullYear(),
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

export interface MeditationMarker {
    key: string, color: string, selectedDotColor: string
}

export interface MarkedList { 
    [key: string]: {
        dots: MeditationMarker[]
    }; 
}

export const generateMeditationTitle = (meditation: Meditation) => {
    const monthNames = [
        "Jan", "Feb", "March", "April", "May", "June",
        "July", "Aug", "Sept", "Oct", "Nov", "Dec"
    ];

    const dayNames = [
        "Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"
    ];

    const date = new Date(meditation.key);

    const dateString = `${dayNames[date.getDay()]}, ${date.getDate()} ${monthNames[date.getMonth()]}`;
    const timeString = `${date.getHours()}:${date.getMinutes().toString().padStart(2, '0')}`;
    const minutes = `${Math.floor(meditation.timeElapsed / 60000)} mins`;

    return {
        date: dateString, 
        time: timeString, 
        minutes: minutes, 
        dateTime: `${dateString} - ${timeString}`,
    };
}