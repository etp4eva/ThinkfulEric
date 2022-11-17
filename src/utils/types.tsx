export type Meditation = {
    key: string;
    timestamp: Date;
    month: number;
    markString: string;
    log: string;
}

export interface Chime {
    label: string;
    numMinutes: number;
}