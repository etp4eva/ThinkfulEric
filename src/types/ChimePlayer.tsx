import { Audio, AVPlaybackSource } from "expo-av";

export enum BuiltInChimeSounds {
    CHIME1 = 'CHIME1',
    WAVES1 = 'WAVES1',
}

type BuiltInChimesDataT = {[key in BuiltInChimeSounds]: ChimeData};

export const BuiltInChimesData: BuiltInChimesDataT = {
    [BuiltInChimeSounds.CHIME1]: {key: BuiltInChimeSounds.CHIME1, label: 'Bowl Chime', soundSource: require('../../assets/chimes/chime1.mp3')},
    [BuiltInChimeSounds.WAVES1]: {key: BuiltInChimeSounds.WAVES1, label: 'Waves', soundSource: require('../../assets/chimes/waves1.mp3')},
}

export interface Chime {
    labels: string[];
    numMinutes: number;
    chimeSound?: ChimeData;
}

type ChimeData = {
    key: BuiltInChimeSounds;
    label: string;
    soundSource: AVPlaybackSource;
}

export const createChime = (numMinutes: number, sound?: BuiltInChimeSounds): Chime => {
    let minuteLabel = (numMinutes === 1 ? `${numMinutes} minute` : `${numMinutes} minutes`);
    let chimeLabel = sound ? BuiltInChimesData[sound].label : 'No sound';

    return {
      numMinutes: numMinutes,
      labels: [minuteLabel, chimeLabel],
      chimeSound: (sound ? BuiltInChimesData[sound] : undefined),
    }
  }

export class ChimePlayer {
    loadedChimes: {[key: string]: Audio.Sound} = {};
    playingChimes: {[key: string]: Audio.Sound} = {};

    playChime = async (chime: BuiltInChimeSounds) => {
        if (!(chime in this.loadedChimes)) {
            const chimeData = BuiltInChimesData[chime];
            const { sound } = await Audio.Sound.createAsync(chimeData.soundSource);
            this.loadedChimes[chime] = sound;
        }
                
        this.playingChimes[chime] = this.loadedChimes[chime];

        await this.loadedChimes[chime].playAsync();

        delete this.playingChimes[chime];
    }

    stopChime = async (chime: BuiltInChimeSounds | string) => {
        if (chime in this.loadedChimes && this.loadedChimes[chime]._loaded)
        {
            await this.loadedChimes[chime].stopAsync();
        }
    }

    stopAllChimes = async () => {
        Object.keys(this.loadedChimes).forEach((key: string) => {
            this.stopChime(key);
        });
    }

    unloadChimes = () => {
        Object.keys(this.loadedChimes).forEach((key: string) => {
            this.loadedChimes[key].unloadAsync();
        })
    }
}