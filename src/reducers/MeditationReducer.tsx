enum Types {
  ADD_MEDITATION = 'ADD_MEDITATION',
  UPDATE_MEDITATION = 'UPDATE_MEDITATION',
}

type LogAction = 
    | {
        type: Types.ADD_MEDITATION;
        payload: Meditation;
    }
    | {
        type: Types.UPDATE_MEDITATION;
        payload: Meditation
    }

export const actionCreators = {
    addMeditation: (timestamp: Date, log: string) => ({ 
        type: Types.ADD_MEDITATION, 
        payload: createMeditation(timestamp, log) 
    }),

    updateMeditation: (meditation: Meditation) => ({ 
        type: Types.UPDATE_MEDITATION, 
        payload: meditation
    })
}

export type Meditation = {
    key: string;
    timestamp: Date;
    month: number;
    markString: string;
    log: string;
}

const getFormattedDateString = (d: Date): string => {
    const ye = String(d.getFullYear());
    const mo = String(d.getMonth() + 1).padStart(2, '0');
    const da = String(d.getDate()).padStart(2, '0');
    const result = `${ye}-${mo}-${da}`;
    return result;
}

const createMeditation = (timestamp: Date, log: string): Meditation => {
    let m: Meditation = {
        key: timestamp.toISOString(),
        timestamp: timestamp,
        month: timestamp.getMonth(),
        markString: getFormattedDateString(timestamp),
        log: log,
    };

    return m;
}

export interface MeditationMap { 
    [key: string]: Meditation; 
}

export type State = {
    meditations: MeditationMap;
}

const dummyMeditations: Meditation[] = [
    createMeditation(new Date('2022-11-08T08:18:12'), 'Earliest Hello'),
    createMeditation(new Date('2022-11-09T08:18:12'), 'Earlier Hello'),
    createMeditation(new Date('2022-11-09T10:18:12'), 'Hello'),
]

export const MeditationInitialState: State = {
    meditations: {
        [dummyMeditations[0].key]: dummyMeditations[0],
        [dummyMeditations[1].key]: dummyMeditations[1],
        [dummyMeditations[2].key]: dummyMeditations[2],
    },
}

export function MeditationReducer(state: State, action: LogAction) {
    let newState: State = {meditations:{}}
    switch (action.type) {
        case Types.ADD_MEDITATION:
            newState = {...state};
            newState.meditations[action.payload.key] = action.payload
            return newState

        case Types.UPDATE_MEDITATION:
            newState = {...state};
            newState.meditations[action.payload.key] = action.payload;
            return newState
    }
}