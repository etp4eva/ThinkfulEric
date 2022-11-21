import { Chime } from "../types/types";

export type RootStackParamList = {
    'Home': undefined;
    'Meditate': {
      chimeList: Chime[]
    };
    'Log': undefined;
    'MeditationInfo': {
      meditationKey: string
    }
  }