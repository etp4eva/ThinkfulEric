import { StackScreenProps } from "@react-navigation/stack"
import { useState } from "react"
import { Button, View, Text, StyleSheet, Modal, Dimensions } from "react-native";
import { RemovableListItemInterface, RemoveableItemList } from "../components/RemovableItemList";
import { TimePickerModal } from "../components/TimePickerModal";
import { RootStackParamList } from "./ScreenParams";

interface Chime extends RemovableListItemInterface {
  numMinutes: number;
}

export const HomeScreen = ({ route, navigation }: StackScreenProps<RootStackParamList, 'Home'> ) => {
    const [chimeTimes, setChimes] = useState<Chime[]>([]);
    const [timePickerModalOpen, setTimePickerModalOpen] = useState<boolean>(false);

    const removeChime = (index: number) => {

      let newList: Chime[] = chimeTimes.filter((value, ind) => {        
        return ind !== index;
      })

      setChimes(newList)
    }

    const addChimeTime = (numMinutes: number) => {
      const chime: Chime = {
        numMinutes: numMinutes,
        label: (numMinutes === 1 ? `${numMinutes} minute` : `${numMinutes} minutes`),
        removeFn: function (): void {
          throw new Error("Function not implemented.");
        }
      }
        
      let newList: Chime[] = [...chimeTimes, chime]
      newList.sort((a,b) => a.numMinutes - b.numMinutes)
      setChimes(newList)
    }
    
    return (
      <View style={styles.container}>
        <TimePickerModal 
          initialNumber={1}
          visible={timePickerModalOpen}
          closeModalFn={() => setTimePickerModalOpen(!timePickerModalOpen)}
          handleNumberFn={(num) => { addChimeTime(num) }}
        />
        <Text>Dial in your meditation settings here. When should chimes occur</Text>
        <Button 
          title='Start Meditation'
          onPress={ () => navigation.navigate('Meditate')}
        />
        <Button 
          title='View log'
          onPress={ () => navigation.navigate('Log')}
        />
        <Button 
          title='Add chime'
          onPress={ () => setTimePickerModalOpen(true) }
        />
        <RemoveableItemList data={chimeTimes} removeFn={removeChime} />
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