import { StackScreenProps } from "@react-navigation/stack"
import { useContext, useEffect, useState } from "react";
import { View, Text, StyleSheet, FlatList, Button, ImageBackground } from "react-native";
import { CountDown, CountDownState } from "../components/CountDown";
import { DispatchContext } from "../contexts/Context";
import { actionCreators } from "../reducers/MeditationReducer";
import { Chime, ChimePlayer } from "../types/ChimePlayer";
import { RootStackParamList, MeditationInfoMode } from "./ScreenParams";
import { Theme } from "./Themes";
import { ImageButton } from "../components/ImageButton";
import { Meditation } from "../types/types"

enum MeditationMode {
  MEDITATION_NOT_STARTED = 'MEDITATION_NOT_STARTED',
  MEDITATION_RUNNING = 'MEDITATION_RUNNING',
  MEDITATION_PAUSED = 'MEDITATION_PAUSED',
  MEDITATION_ENDED = 'MEDITATION_ENDED',
}

export const MeditateScreen = ({ route, navigation }: StackScreenProps<RootStackParamList, 'Meditate'> ) => {
  const {state, dispatch} = useContext(DispatchContext);
  const [chimeList, setChimeList] = useState<Chime[]>(route.params.meditation.chimes);
  const [nextChime, setNextChime] = useState<Chime>(chimeList[0]);
  const [lastChime, setLastChime] = useState<Chime>(chimeList[chimeList.length - 1]);
  const [timerState, setTimerState] = useState<CountDownState>(CountDownState.PAUSED);
  const [timerStartTime, setTimerStartTime] = useState(Date.now());
  const [nextChimeTime, setNextChimeTime] = useState(nextChime.numMinutes);
  const [chimePlayer, setChimePlayer] = useState(new ChimePlayer());
  const [meditation, setMeditation] = useState(route.params.meditation);
  const [meditationMode, setMeditationMode] = useState(MeditationMode.MEDITATION_NOT_STARTED);

  let nextChimeCounter;
  if (chimeList.length > 1)
  {
    nextChimeCounter = (
      <View>
        <Text style={{...Theme.styles.centeredHeader, marginBottom: -10}}>
          Time until next chime
        </Text>
        <View style={ Theme.styles.card }>        
          <CountDown 
            totalMinutes={nextChimeTime}
            totalSeconds={0}
            state={timerState}
            style={{fontSize: 40, textAlign: "center"}}
            onComplete={() => {
              if (nextChime.chimeSound) {
                chimePlayer.playChime(nextChime.chimeSound);
              }

              if (chimeList.length > 1) {
                setNextChime(chimeList[1]);
                setNextChimeTime(chimeList[1].numMinutes);
                setTimerState(CountDownState.RUNNING);
              }

              setChimeList(
                chimeList.filter((value, index) => {return index !== 0})
              );            
            }}
          />
        </View>
      </View>
    )
  }

  useEffect(() => {
    const blur = navigation.addListener('blur', () => {
      setTimerState(CountDownState.PAUSED);
      chimePlayer.stopAllChimes();
      chimePlayer.unloadChimes();
    });

    return blur;
  });

  useEffect(() => {
    if (timerState === CountDownState.PAUSED)
    {
      meditation.timeElapsed = meditation.timeElapsed + Date.now() - timerStartTime;
      dispatch(actionCreators.updateMeditation(meditation));
    }

    if (timerState === CountDownState.RUNNING)
    {
      setTimerStartTime(Date.now());
    }
  }, [timerState])

  const endFn = () => {
    navigation.replace('MeditationInfo', {meditation: meditation, mode: MeditationInfoMode.POST_MED})
  }

  const startResumeEndButton = () => {
    if (meditationMode === MeditationMode.MEDITATION_ENDED)
    {
      return (
        <ImageButton 
          imageStyle={ {...styles.imageButtonImageStyle, width:200 } }
          textStyle={ {...styles.imageButtonTextStyle, fontSize: 30 } }
          image={ Theme.images.lotusButton }
          label='End'
          onPress={ endFn }
        />
      )
    } 
    
    let label: string = "";

    if (meditationMode === MeditationMode.MEDITATION_RUNNING)
    {
      label = "Pause";
    }
    else if (meditationMode === MeditationMode.MEDITATION_NOT_STARTED)
    {
      label = "Start";
    }
    else if (meditationMode === MeditationMode.MEDITATION_PAUSED)
    {
      label = "Resume";
    }

    return (
      <ImageButton 
        imageStyle={ {...styles.imageButtonImageStyle, width:200 } }
        textStyle={ {...styles.imageButtonTextStyle, fontSize: 30 } }
        image={ Theme.images.lotusButton }
        label={ label }
        onPress={() => {
          setTimerState(
            timerState === CountDownState.RUNNING 
              ? CountDownState.PAUSED
              : CountDownState.RUNNING
          );
          setMeditationMode(
            timerState === CountDownState.RUNNING
            ? MeditationMode.MEDITATION_PAUSED
            : MeditationMode.MEDITATION_RUNNING
          )
        }}
      />
    )
  }

  const restartCancelButtons = (disabled: boolean) => {
    const endButton = (
      <ImageButton 
          imageStyle={ styles.imageButtonImageStyle }
          textStyle={ styles.imageButtonTextStyle }
          image={ Theme.images.lotusButton }
          label='End'
          onPress={ endFn }
          disabled={ disabled }
        />
    )
  
    return (
      <View style={{ flexDirection:"row", justifyContent: 'space-around' }}>
        <ImageButton
          imageStyle={ styles.imageButtonImageStyle }
          textStyle={ styles.imageButtonTextStyle }          
          image={ Theme.images.lotusButton }
          label='Restart'
          disabled={disabled}
          onPress={() => {
            let newMeditation: Meditation = JSON.parse(JSON.stringify(route.params.meditation));
            newMeditation.timeElapsed = 0;
            dispatch(actionCreators.updateMeditation(newMeditation));
            navigation.replace('Meditate', {meditation: newMeditation});
          }}
        />
        <ImageButton
          imageStyle={ styles.imageButtonImageStyle }
          textStyle={ styles.imageButtonTextStyle }          
          image={ Theme.images.lotusButton }
          label='Cancel'
          disabled={disabled}
          onPress={() => {
            dispatch(actionCreators.deleteMeditation(meditation));
            navigation.popToTop()
          }}
        />
        {( meditationMode !== MeditationMode.MEDITATION_ENDED ) 
          ? endButton : null }
      </View>
  )}
  
  return (
    <View style={ Theme.styles.container }>
      <ImageBackground style={ Theme.styles.bg } source={ Theme.images.background }>
        <Text style={{...Theme.styles.centeredHeader, marginBottom: -10}}>Total time left</Text>        
        <View style={Theme.styles.card}>
          <CountDown 
            totalMinutes={lastChime.numMinutes}
            totalSeconds={0}
            state={timerState}
            style={{fontSize: 80, textAlign: "center"}}
            onComplete={() => {
              if (lastChime.chimeSound) {
                chimePlayer.playChime(lastChime.chimeSound);            
              }

              setTimerState(CountDownState.PAUSED);
              setMeditationMode(MeditationMode.MEDITATION_ENDED);
            }}
          />
        </View>
        
        {nextChimeCounter}

        { startResumeEndButton() }
        
        {
          restartCancelButtons(meditationMode === MeditationMode.MEDITATION_RUNNING)
        }

        <Text style={{...Theme.styles.sectionHeader, marginTop: 10, marginBottom: -10}}>Upcoming chimes </Text>
        <View style={{...Theme.styles.card, maxHeight: '20%'}}>
          <FlatList
            data={chimeList}
            renderItem={({item}) => {
              return (
                <View style={{ 
                  flexDirection: 'row', 
                  justifyContent: 'space-between',
                }}>
                  <Text style={{fontSize: 16}}>{item.labels[0]}</Text>
                  <Text style={{fontSize: 16}}>{item.labels[1]}</Text>
                </View>
              )
            }}          
          />
        </View>

      </ImageBackground>
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

  imageButtonImageStyle: {
      width: 80, 
      height: undefined, 
      aspectRatio: 1.8 
  },

  imageButtonTextStyle: {
      fontSize: 16,
      textShadowColor: Theme.colors.primary,
      //textShadowOffset: {width: -1, height: 1},
      textShadowRadius: 10,
  }
});