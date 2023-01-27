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

const generateFilterTitle = (year: number, month: number, day?: number) => {
  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  const dayString = (day !== undefined) ? `${day} ` : '';
  const result = `${dayString}${monthNames[month]}, ${year}`;

  return result;
}

export const LogScreen = ({ route, navigation }: StackScreenProps<RootStackParamList, 'Log'> ) => {
  const {state, dispatch} = useContext(DispatchContext);
  const monthMeditations = useState<MeditationMap>(state.meditations);
  const monthMeditationsML = useState<MarkedList>(generateMarkedList(state.meditations));

  const today: Date = new Date();
  const [filteredMeditationMap, setFilteredMeditationMap] = useState<MeditationMap|undefined>(
    filterMeditationMap(state.meditations, today.getMonth())
  )
  const [filterTitle, setFilterTitle] = useState<string>(
    generateFilterTitle(today.getFullYear(), today.getMonth())
  );

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

          onDayPress={ ( date ) => {
            const filteredMap = filterMeditationMap(monthMeditations[0], date.month - 1, date.day)
            setFilterTitle(generateFilterTitle(date.year, date.month-1, date.day));
            setFilteredMeditationMap(filteredMap);
          }}

          onMonthChange={ async ( date ) => {
            monthMeditations[0] = await Persister.getMeditationMonthList(date.year, date.month-1);
            setFilterTitle(generateFilterTitle(date.year, date.month-1));
            
            if( !monthMeditations[0] )
            {
              setFilteredMeditationMap(undefined);
              return;
            }

            monthMeditationsML[0] = generateMarkedList(monthMeditations[0]);
            setFilteredMeditationMap(
              filterMeditationMap(monthMeditations[0], date.month - 1)
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

        <View style={{
          flexDirection: 'row', 
          alignItems: 'baseline', 
          justifyContent:'space-between',
          marginHorizontal: 10,
        }}>
          <Text style={{
            marginTop: 10, paddingBottom: 0, fontSize: 20 
          }}>
            Meditations
          </Text>
          <Text style={{fontStyle: 'italic'}}>{filterTitle}</Text>
        </View>

        <FlatList 
          style={ Theme.styles.card }
          data={ 
            (filteredMeditationMap) 
              ? Object.keys(filteredMeditationMap)
              : undefined                
          }
          renderItem={ renderItem }
        />

      </ImageBackground>
    </View>
  )
}

const styles = StyleSheet.create({

});

export { Meditation };
