import { StackScreenProps } from "@react-navigation/stack"
import { useContext, useState } from "react"
import { Button, View, Text, StyleSheet } from "react-native";
import { ChimePickerModal } from "../components/ChimePickerModal";
import { RemoveableItemList } from "../components/RemovableItemList";
import { DispatchContext } from "../contexts/Context";
import { actionCreators } from "../reducers/MeditationReducer";
import { RootStackParamList } from "./ScreenParams";

export const HomeScreen = ({ route, navigation }: StackScreenProps<RootStackParamList, 'Home'> ) => {
    const {state, dispatch} = useContext(DispatchContext);
    const [chimePickerModalOpen, setChimePickerModalOpen] = useState<boolean>(false);
  
    return (
      <View style={styles.container}>
        <ChimePickerModal 
          initialNumber={1}
          visible={chimePickerModalOpen}
          closeModalFn={() => setChimePickerModalOpen(!chimePickerModalOpen)}
          handleChimeFn={(chime) => { 
            dispatch(actionCreators.addChime(chime)) 
          }}
        />
        <Text>Dial in your meditation settings here. When should chimes occur</Text>
        <Button 
          title='Start Meditation'
          onPress={ () => navigation.navigate('Meditate', {chimeList: state.chimes})}
        />
        <Button 
          title='View log'
          onPress={ () => navigation.navigate('Log')}
        />
        <Button 
          title='Add chime'
          onPress={ () => setChimePickerModalOpen(true) }
        />
        <RemoveableItemList 
          data={state.chimes}
          removeFn={(idx: number) => {
            dispatch(actionCreators.removeChime(idx))
          }}
          minItems={1}
        />
      </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
    },
});