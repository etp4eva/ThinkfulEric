import { StackScreenProps } from "@react-navigation/stack"
import { useContext, useState } from "react"
import { Button, View, Text, StyleSheet } from "react-native";
import { RemoveableItemList } from "../components/RemovableItemList";
import { TimePickerModal } from "../components/ChimePickerModal";
import { DispatchContext } from "../contexts/Context";
import { actionCreators } from "../reducers/MeditationReducer";
import { createChime } from "../utils/types";
import { RootStackParamList } from "./ScreenParams";

export const HomeScreen = ({ route, navigation }: StackScreenProps<RootStackParamList, 'Home'> ) => {
    const {state, dispatch} = useContext(DispatchContext);
    const [timePickerModalOpen, setTimePickerModalOpen] = useState<boolean>(false);
  
    return (
      <View style={styles.container}>
        <TimePickerModal 
          initialNumber={1}
          visible={timePickerModalOpen}
          closeModalFn={() => setTimePickerModalOpen(!timePickerModalOpen)}
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
          onPress={ () => setTimePickerModalOpen(true) }
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