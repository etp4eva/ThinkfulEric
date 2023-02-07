import { BuiltInChimeSounds, Chime } from "../types/ChimePlayer";
import { Persister } from "../types/Persister";
import { createBaseMeditation, Meditation } from "../types/types";

export enum Types {
  ADD_MEDITATION = 'ADD_MEDITATION',
  UPDATE_MEDITATION = 'UPDATE_MEDITATION',
  DELETE_MEDITATION = 'DELETE_MEDITATION',
  ADD_CHIME = 'ADD_CHIME',
  REMOVE_CHIME = 'REMOVE_CHIME',
  INIT_MEDITATIONS = 'INIT_MEDITATIONS',
  INIT_SETTINGS = 'INIT_SETTINGS',
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
    | {
        type: Types.INIT_MEDITATIONS;
        payload: MeditationMap;
    }
    | {
        type: Types.INIT_SETTINGS;
        payload: Chime[];
    }

export const actionCreators = {
    initMeditations: (meditations: MeditationMap) => ({
        type: Types.INIT_MEDITATIONS,
        payload: meditations
    }),

    initSettings: (settings: Chime[]) => ({
        type: Types.INIT_SETTINGS,
        payload: settings
    }),

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
        new Date('2023-01-12T08:18:12'), dummyChimes, 200000,
        3, 2, 3, 0, 'on bed', 'Earliest hello'
    ),
    createMeditation(new Date('2023-01-13T08:18:12'), dummyChimes, 18344506,
        2, 2, 4, 1, 'on chair', 'Early hello'
    ),
    createMeditation(new Date('2023-01-13T10:18:12'), dummyChimes, 2052510,
        1, 4, 2, 0, 'on holiday', 'Late hello'
    ),
]

const dummyMeditationsMap: MeditationMap = {
        [dummyMeditations[0].key]: dummyMeditations[0],
        [dummyMeditations[1].key]: dummyMeditations[1],
        [dummyMeditations[2].key]: dummyMeditations[2],
};

export const MeditationInitialState: State = {
    meditations: {},//dummyMeditationsMap,
    chimes: [
        { labels: ['20 minutes', 'Waves'], numMinutes: 20 },
    ]
}

const EmptyState: State = {
    meditations: {},
    chimes: []
}

export const MeditationReducer = (state: State, action: LogAction): State => {
    let newState: State = EmptyState;

    switch (action.type) {
        case Types.INIT_MEDITATIONS:
            newState = {...state};
            newState.meditations = action.payload;
            return newState

        case Types.INIT_SETTINGS:
            newState = {...state};
            newState.chimes = action.payload;
            return newState;

        case Types.ADD_MEDITATION:
            newState = {...state};
            newState.meditations[action.payload.key] = action.payload;          
            Persister.updateSavedMeditation(action.payload);
            return newState;

        case Types.UPDATE_MEDITATION:
            newState = {...state};
            newState.meditations[action.payload.key] = action.payload;
            Persister.updateSavedMeditation(action.payload);
            return newState;

        case Types.DELETE_MEDITATION:
            newState = {...state};
            delete newState.meditations[action.payload.key];
            Persister.deleteSavedMeditation(action.payload);
            return newState;

        case Types.ADD_CHIME:
            newState = {...state};
            newState.chimes.push(action.payload);
            newState.chimes.sort((a,b) => a.numMinutes - b.numMinutes);
            Persister.updateSettings(newState.chimes);
            return newState;
        
        case Types.REMOVE_CHIME:            
            newState = {
                ...state, 
                chimes: state.chimes.filter(
                    (val, idx) => idx !== action.payload
                )
            };
            Persister.updateSettings(newState.chimes);
            return newState;
    }
}