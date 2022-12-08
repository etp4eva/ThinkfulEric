import { Meditation } from "../types/types";

export type RootStackParamList = {
    'Home': undefined;
    'Meditate': {
      meditation: Meditation;
    };
    'Log': undefined;
    'MeditationInfo': {
      meditationKey: string
    }
  }