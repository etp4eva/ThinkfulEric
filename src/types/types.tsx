import { Chime } from "./ChimePlayer";

export type Meditation = {
    key: string;
    timestamp: Date;
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
