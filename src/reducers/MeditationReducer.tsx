import { Chime, Meditation } from "../utils/types";

enum Types {
  ADD_MEDITATION = 'ADD_MEDITATION',
  UPDATE_MEDITATION = 'UPDATE_MEDITATION',
  ADD_CHIME = 'ADD_CHIME',
  REMOVE_CHIME = 'REMOVE_CHIME',
}

type LogAction = 
    | {
        type: Types.ADD_MEDITATION;
        payload: Meditation;
    }
    | {
        type: Types.UPDATE_MEDITATION;
        payload: Meditation;
    }
    | {
        type: Types.ADD_CHIME;
        payload: Chime;
    }
    | {
        type: Types.REMOVE_CHIME;
        payload: number;
    }

export const actionCreators = {
    addMeditation: (timestamp: Date, log: string) => ({ 
        type: Types.ADD_MEDITATION, 
        payload: createMeditation(timestamp, log) 
    }),

    updateMeditation: (meditation: Meditation) => ({ 
        type: Types.UPDATE_MEDITATION, 
        payload: meditation
    }),

    addChime: (chime: Chime) => ({
        type: Types.ADD_CHIME,
        payload: chime
    }),

    removeChime: (numMinutes: number) => ({
        type: Types.REMOVE_CHIME,
        payload: numMinutes
    })
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
    chimes: Chime[];
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
    chimes: [
        { label: '20 minutes', numMinutes: 20 },
    ]
}

const EmptyState: State = {
    meditations: {},
    chimes: []
}

export const MeditationReducer = (state: State, action: LogAction) => {
    let newState: State = EmptyState;

    switch (action.type) {
        case Types.ADD_MEDITATION:
            newState = {...state};
            newState.meditations[action.payload.key] = action.payload
            return newState

        case Types.UPDATE_MEDITATION:
            newState = {...state};
            newState.meditations[action.payload.key] = action.payload;
            return newState

        case Types.ADD_CHIME:
            newState = {...state};
            newState.chimes.push(action.payload);
            newState.chimes.sort((a,b) => a.numMinutes - b.numMinutes);
            return newState;
        
        case Types.REMOVE_CHIME:            
            newState = {
                ...state, 
                chimes: state.chimes.filter(
                    (val, idx) => idx !== action.payload
                )
            };
            return newState;
    }
}