import { Meditation } from "./LogScreen";

export type RootStackParamList = {
    'Home': undefined;
    'Meditate': undefined;
    'Log': undefined;
    'MeditationInfo': {
      meditationKey: string
    }
  }