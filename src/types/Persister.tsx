import AsyncStorage from "@react-native-async-storage/async-storage";
import { Meditation } from "../types/types";
import { MeditationMap, State } from "../reducers/MeditationReducer";
import { Chime } from "./ChimePlayer";

enum KeyPrefixes {
    MONTH_MEDITATION_LIST_ = '@MONTH_MEDITATION_LIST_',
    MEDITATION_SETTINGS = '@CURRENT_MEDITATION',
}

const generateMonthKey = (year: number, month: number) => {
    return KeyPrefixes.MONTH_MEDITATION_LIST_ + `${year}_${month}`;
}

export class Persister {    
    static getMeditationMonthList = async (year: number, month: number) => {
        try {
            const monthKey = generateMonthKey(year, month);
            
            const mListJSON = await AsyncStorage.getItem(monthKey);

            const parsed = mListJSON != null ? JSON.parse(mListJSON) : null;

            return parsed;
        } catch (e) {
            // TODO: getMeditationMonth error
        }
    }

    static getSettings = async () => {
        try {
            const mSettingsJSON = await AsyncStorage.getItem(KeyPrefixes.MEDITATION_SETTINGS);

            return mSettingsJSON != null ? JSON.parse(mSettingsJSON) : null;
        } catch (e) {
            // TODO: getSettings error
        }   
    }

    static updateSettings = async (chimes: Chime[]) => {
        try {
            const settingsJSON = JSON.stringify(chimes);
            await AsyncStorage.setItem(KeyPrefixes.MEDITATION_SETTINGS, settingsJSON);
        } catch (e) {
            // TODO: updateSettings error
        }
    }

    static updateSavedMeditation = async (meditation: Meditation): Promise<MeditationMap> => {        

        return new Promise<MeditationMap>(async (resolve) => {
            const monthKey = generateMonthKey(meditation.year, meditation.month);

            try {          
                const mListJSON = await AsyncStorage.getItem(monthKey);
                let meditationList: MeditationMap = mListJSON != null ? JSON.parse(mListJSON) : null;                

                if (meditationList !== null) {
                    meditationList[meditation.key] = meditation;
                } else {
                    meditationList = {[meditation.key]: meditation}
                }
                
                const jsonValue = JSON.stringify(meditationList);
                await AsyncStorage.setItem(monthKey, jsonValue);

                resolve(meditationList);
            } catch (e) {
                throw e
            }
        })
    }

    static deleteSavedMeditation = async (meditation: Meditation) => {
        const monthKey = generateMonthKey(meditation.year, meditation.month);

        try {
            const mListJSON = await AsyncStorage.getItem(monthKey);
            let meditationList = mListJSON != null ? JSON.parse(mListJSON) : null;

            delete meditationList[meditation.key];
            
            const jsonValue = JSON.stringify(meditationList);
            await AsyncStorage.setItem(monthKey, jsonValue);

            return meditationList;
        } catch (e) {
            // TODO: remove error
        }
    }
}