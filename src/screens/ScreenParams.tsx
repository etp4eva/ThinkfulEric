import { Meditation } from "../types/types";

export enum MeditationInfoMode {
  PRE_MED = 'PRE_MED',
  POST_MED = 'POST_MED',
  LOG = 'LOG',
}

export type RootStackParamList = {
    'Home': undefined;
    'Meditate': {
      meditation: Meditation;
    };
    'Log': undefined;
    'MeditationInfo': {
      meditation: Meditation;
      mode: MeditationInfoMode;
    }
  }