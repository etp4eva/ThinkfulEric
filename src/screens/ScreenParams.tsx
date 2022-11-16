import { Chime } from "../reducers/MeditationReducer";

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