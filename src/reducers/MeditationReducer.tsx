import { BuiltInChimesData, BuiltInChimeSounds, Chime } from "../types/ChimePlayer";
import { Meditation } from "../types/types";

enum Types {
  ADD_MEDITATION = 'ADD_MEDITATION',
  UPDATE_MEDITATION = 'UPDATE_MEDITATION',
  DELETE_MEDITATION = 'DELETE_MEDITATION',
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
        type: Types.DELETE_MEDITATION;
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
    addMeditation: (timestamp: Date, chimes: Chime[], timeElapsed: number) => ({ 
        type: Types.ADD_MEDITATION, 
        payload: createBaseMeditation(timestamp, chimes, timeElapsed) 
    }),

    updateMeditation: (meditation: Meditation) => ({ 
        type: Types.UPDATE_MEDITATION, 
        payload: meditation
    }),

    deleteMeditation: (meditation: Meditation) => ({
        type: Types.DELETE_MEDITATION,
        payload: meditation,
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

const createBaseMeditation = (
        timestamp: Date, 
        chimes: Chime[], 
        timeElapsed: number,
    ): Meditation => {
        let m: Meditation = {
            key: timestamp.toISOString(),
            timestamp: timestamp,
            month: timestamp.getMonth(),
            markString: getFormattedDateString(timestamp),
            chimes: chimes,
            timeElapsed: timeElapsed,
        };

        return m;
}

const createMeditation = (
    timestamp: Date, 
    chimes: Chime[], 
    timeElapsed: number,
    stressBefore?: number,
    stressAfter?: number,
    depth?: number,    
    interrupted?: number,
    location?: string,
    log?: string,
): Meditation => {
    let m = createBaseMeditation(timestamp, chimes, timeElapsed);
    m.stressBefore = stressBefore;
    m.stressAfter = stressAfter;
    m.depth = depth;
    m.interrupted = interrupted;
    m.location = location;
    m.log = log;
    return m;
}

export interface MeditationMap { 
    [key: string]: Meditation; 
}

export type State = {
    meditations: MeditationMap;
    chimes: Chime[];
}

const dummyChimes: Chime[] = [
    {labels: ['2 minutes', 'Chime'], numMinutes: 2, chimeSound: BuiltInChimeSounds.CHIME1},
    {labels: ['20 minutes', 'Waves'], numMinutes: 20, chimeSound: BuiltInChimeSounds.WAVES1},
]

const dummyMeditations: Meditation[] = [
    createMeditation(
        new Date('2022-11-20T08:18:12'), dummyChimes, 20,
        3, 2, 3, 0, 'on bed', 'Earliest hello'
    ),
    createMeditation(new Date('2022-11-21T08:18:12'), dummyChimes, 18.34,
        2, 2, 4, 1, 'on chair', 'Early hello'
    ),
    createMeditation(new Date('2022-11-21T10:18:12'), dummyChimes, 20,
        1, 4, 2, 0, 'on holiday', 'Late hello'
    ),
]

export const MeditationInitialState: State = {
    meditations: {
        [dummyMeditations[0].key]: dummyMeditations[0],
        [dummyMeditations[1].key]: dummyMeditations[1],
        [dummyMeditations[2].key]: dummyMeditations[2],
    },
    chimes: [
        { labels: ['20 minutes', 'Waves'], numMinutes: 20 },
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
            return newState;

        case Types.UPDATE_MEDITATION:
            newState = {...state};
            newState.meditations[action.payload.key] = action.payload;
            return newState;

        case Types.DELETE_MEDITATION:
            newState = {...state};
            delete newState.meditations[action.payload.key];
            return newState;

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