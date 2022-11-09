import { StackScreenProps } from '@react-navigation/stack';
import { RootStackParamList } from './ScreenParams';
import { Text } from 'react-native'
import { useContext } from 'react';
import { DispatchContext } from '../contexts/context';
import { Meditation } from './LogScreen';

export const MediationInfoScreen = ({ route, navigation }: StackScreenProps<RootStackParamList, 'MeditationInfo'> ) => {
    const {state, dispatch} = useContext(DispatchContext);
    let meditation: Meditation = state.meditations[route.params.meditationKey];
    return (
        <Text>{meditation.log}</Text>
    )
};