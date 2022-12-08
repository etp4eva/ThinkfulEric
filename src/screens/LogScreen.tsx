import { StackScreenProps } from "@react-navigation/stack"
import { useContext } from "react";
import { View, Text, StyleSheet, ListRenderItem, TouchableHighlight } from "react-native";
import { Calendar } from "react-native-calendars";
import { FlatList } from "react-native-gesture-handler";
import { DispatchContext } from "../contexts/Context";
import { MeditationMap } from "../reducers/MeditationReducer";
import { Meditation } from "../types/types";
import { RootStackParamList } from "./ScreenParams";

interface MarkedList { 
  [key: string]: {
    dots: [{ key: string, color: string, selectedDotColor: string }]
  }; 
}
  
const generateMeditationList = (meditations: MeditationMap): MarkedList => {
  let outList: MarkedList = {}

  Object.keys(meditations).forEach((key) => {
    const dateKey = meditations[key].markString;

    const dot = {
      key: '0',
      color: '#00a8c9',
      selectedDotColor: 'white',
    }

    if (dateKey in outList)
    {
      const numDots = outList[dateKey]['dots'].length;      

      if (numDots < 4) {        
        dot.key = numDots.toString();
        outList[dateKey].dots.push(dot);
      }  
    } else {
      outList[dateKey] = {dots: [dot]}
    }
  })

  return outList
}

export const LogScreen = ({ route, navigation }: StackScreenProps<RootStackParamList, 'Log'> ) => {
  const {state, dispatch} = useContext(DispatchContext);
  const markedDate = generateMeditationList(state.meditations);

  // TODO: Filter meditation list by month displayed
  const renderItem: ListRenderItem<string> = ({item}) => {
    const meditation: Meditation = state.meditations[item];
    return (
      <TouchableHighlight
        onPress={() => navigation.push('MeditationInfo', {meditation: meditation})}
      >
        <Text>{meditation.key}</Text>
      </TouchableHighlight>
    )
  }
  
  // TODO: Filter list based on selection
  // TODO: Open view / edit log screen on click 
  return (
    <View style={styles.container}>
      <Text>A monthly calendar with meditation days highlighted and you can click them to read your log. Also a list in reverse chronological order</Text>
      <Calendar 
        maxDate={new Date().toUTCString()}
        markingType={'multi-dot'}
        markedDates={markedDate}
      />
      <FlatList 
        data={Object.keys(state.meditations)}
        renderItem={renderItem}
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

export { Meditation };
