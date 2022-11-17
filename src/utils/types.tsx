import { AVPlaybackSource } from "expo-av/build/AV.types";

export type Meditation = {
    key: string;
    timestamp: Date;
    month: number;
    markString: string;
    log: string;
}

export enum BuiltInChimeSounds {
    CHIME1 = 'CHIME1',
    WAVES1 = 'WAVES1',
}

type BuiltInChimesDataT = {[key in BuiltInChimeSounds]: ChimeData};

export const BuiltInChimesData: BuiltInChimesDataT = {
    [BuiltInChimeSounds.CHIME1]: {key: BuiltInChimeSounds.CHIME1, label: 'Bowl Chime', soundSource: require('../../assets/chimes/chime1.mp3')},
    [BuiltInChimeSounds.WAVES1]: {key: BuiltInChimeSounds.WAVES1, label: 'Waves', soundSource: require('../../assets/chimes/waves1.mp3')},
}

export type ChimeData = {
    key: BuiltInChimeSounds;
    label: string;
    soundSource: AVPlaybackSource;
}

export interface Chime {
    label: string;
    numMinutes: number;
    chimeSound?: ChimeData;
}

export const createChime = (numMinutes: number, sound?: BuiltInChimeSounds): Chime => {
    return {
      numMinutes: numMinutes,
      label: (numMinutes === 1 ? `${numMinutes} minute` : `${numMinutes} minutes`),
      chimeSound: (sound ? BuiltInChimesData[sound] : undefined),
    }
  }