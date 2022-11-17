import { Chime } from "../utils/types";

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