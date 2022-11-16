import { StackScreenProps } from '@react-navigation/stack';
import { RootStackParamList } from './ScreenParams';
import { Button, Text, View, StyleSheet, TextInput } from 'react-native'
import { useContext, useState } from 'react';
import { DispatchContext } from '../contexts/Context';
import { Meditation } from './LogScreen';
import { actionCreators } from '../reducers/MeditationReducer';

const ReadMode = (
    meditation: Meditation,
    setEditing: (edit: boolean) => void
) => {
    return (
        <View>
            <Text>{meditation.log}</Text>
            <Button
                title='Edit log'
                onPress={() => { setEditing(true); }}
            />
        </View>
    )
}

const EditMode = (
    meditation: Meditation,
    setEditing: (edit: boolean) => void,
    dispatch: React.Dispatch<any>,
) => {
    let newMeditation: Meditation = JSON.parse(JSON.stringify(meditation))

    return (
        <View>
            <TextInput
                multiline
                numberOfLines={10}
                onChangeText={(text) => {newMeditation.log = text}}
            >
                {meditation.log}
            </TextInput>
            <View style={styles.sideBySide}>
                <Button
                    title='Save changes'
                    onPress={() => { 
                        dispatch(actionCreators.updateMeditation(newMeditation))
                        setEditing(false); 
                    }}
                />
                <Button
                    title='Discard changes'
                    onPress={() => { setEditing(false); }}
                />
            </View>
        </View>
    )
}

// TODO: Edit and save changes to meditation log also more fields
// eg. Stress level, location
export const MediationInfoScreen = ({ route, navigation }: StackScreenProps<RootStackParamList, 'MeditationInfo'> ) => {
    const {state, dispatch} = useContext(DispatchContext);
    const [isEditing, setEditing] = useState(false);
    
    let meditation: Meditation = state.meditations[route.params.meditationKey];
    if (isEditing) {
        return EditMode(meditation, setEditing, dispatch);
    } else {
        return ReadMode(meditation, setEditing);
    }
};

const styles = StyleSheet.create({
    sideBySide: {
        display: 'flex',
        flexDirection: 'row',
    },
});