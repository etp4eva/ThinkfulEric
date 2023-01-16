import { StackScreenProps } from "@react-navigation/stack"
import { useContext, useState } from "react";
import { View, Text, StyleSheet, ListRenderItem, TouchableHighlight, ImageBackground } from "react-native";
import { Calendar } from "react-native-calendars";
import { FlatList } from "react-native-gesture-handler";
import { DispatchContext } from "../contexts/Context";
import { MeditationMap } from "../reducers/MeditationReducer";
import { Meditation, MeditationMarker } from "../types/types";
import { MeditationInfoMode, RootStackParamList } from "./ScreenParams";
import { Persister } from "../types/Persister";
import { Theme } from "./Themes";

interface MarkedList { 
  [key: string]: {
      dots: [{ key: string, color: string, selectedDotColor: string }]
  }; 
}

const generateMarkedList = (meditations: MeditationMap): MarkedList => {
  let outList: MarkedList = {}

  Object.keys(meditations).forEach((key) => {
    const dateKey = meditations[key].markString;

    const dot = {
      key: '0',
      color: Theme.colors.dot,
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

const filterMeditationMap = (
  meditations: MeditationMap, 
  month: number, 
  dayOfMonth?: number
): MeditationMap => {
  let result: MeditationMap = {};

  Object.keys(meditations).forEach(key => {
    const med = meditations[key];
    const date = new Date(med.timestamp)

    if (month === date.getMonth())
    {      
      if (dayOfMonth && dayOfMonth === date.getDate())
      {
        result[key] = med;        
        return;
      } else if (dayOfMonth) {
        return;
      }

      result[key] = med;
    }
  })

  return result;
}

const generateMeditationTitle = (meditation: Meditation) => {
  const date = new Date(meditation.key);

  return `${date.toLocaleString('en-US', {dateStyle: 'full', timeStyle: 'short'})}`
}

export const LogScreen = ({ route, navigation }: StackScreenProps<RootStackParamList, 'Log'> ) => {
  const {state, dispatch} = useContext(DispatchContext);
  const monthMeditations = useState<MeditationMap>(state.meditations)
  const monthMeditationsML = useState<MarkedList>(generateMarkedList(state.meditations))
  const [filteredMeditationMap, setFilteredMeditationMap] = useState<MeditationMap>(
    filterMeditationMap(state.meditations, new Date(Date.now()).getMonth())
  )

  const renderItem: ListRenderItem<string> = ({ item }) => {
    const meditation: Meditation = monthMeditations[0][item];
    
    return (
      <TouchableHighlight
        underlayColor={'#FFFFFF44'}
        onPress={ () => navigation.push('MeditationInfo', { meditation: meditation, mode: MeditationInfoMode.LOG })}
      >
        <Text style={{
          fontSize: 16,
        }}>{ 
          generateMeditationTitle(meditation) 
        }</Text>
      </TouchableHighlight>
    )
  }
  
  return (
    <View style={ Theme.styles.container }>
      <ImageBackground style={ Theme.styles.bg } source={ Theme.images.background }>

        <Calendar     
          maxDate={ new Date().toUTCString() }
          markingType={ 'multi-dot' }
          markedDates={ monthMeditationsML[0] }

          onDayPress={ ( selectedDate ) => {
            const filteredMap = filterMeditationMap(monthMeditations[0], selectedDate.month - 1, selectedDate.day)
            setFilteredMeditationMap(filteredMap);
          }}

          onMonthChange={ async ( date ) => {
            monthMeditations[0] = await Persister.getMeditationMonthList(date.month);
            
            if( !monthMeditations[0] )
              return;

            monthMeditationsML[0] = generateMarkedList(monthMeditations[0]);
            setFilteredMeditationMap(
              filterMeditationMap(monthMeditations[0], date.month)
            );
          }}

          style={{
            backgroundColor: Theme.colors.card,
          }}

          theme={{
            backgroundColor: Theme.colors.card,
            calendarBackground: Theme.colors.card,
            textSectionTitleColor: 'black',
            arrowColor: 'black',
            textDisabledColor: '#8f8f8fff',
            selectedDayBackgroundColor: Theme.colors.dot,
          }}
        />

        <Text style={{
          marginHorizontal: 10, marginTop: 10, paddingBottom: 0, fontSize: 20 
        }}>
          Meditations
        </Text>
        <FlatList 
          style={ Theme.styles.card }
          data={ Object.keys(filteredMeditationMap) }
          renderItem={ renderItem }
        />

      </ImageBackground>
    </View>
  )
}

const styles = StyleSheet.create({

});

export { Meditation };
