import { StackScreenProps } from "@react-navigation/stack"
import { useContext, useEffect, useState } from "react";
import { View, Text, StyleSheet, FlatList, Button } from "react-native";
import { CountDown, CountDownState } from "../components/CountDown";
import { DispatchContext } from "../contexts/Context";
import { actionCreators } from "../reducers/MeditationReducer";
import { Chime, ChimePlayer } from "../types/ChimePlayer";
import { RootStackParamList, MeditationInfoMode } from "./ScreenParams";

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

  let nextChimeCounter;
  if (chimeList.length > 1)
  {
    nextChimeCounter = (
      <View>
        <Text>Time until next chime:</Text>
        <CountDown 
          totalMinutes={nextChimeTime}
          totalSeconds={0}
          state={timerState}
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
  
  return (
    <View style={styles.container}>
      <Text>A countdown clock with total time and time to next chime</Text>
      <Text>Total time left:</Text>
      <CountDown 
        totalMinutes={lastChime.numMinutes}
        totalSeconds={0}
        state={timerState}
        onComplete={() => {
          if (lastChime.chimeSound) {
            chimePlayer.playChime(lastChime.chimeSound);            
          }

          setTimerState(CountDownState.PAUSED);
        }}
      />
      {nextChimeCounter}
      <Button 
        title={timerState === CountDownState.PAUSED ? "START" : "PAUSE"}
        onPress={() => {
          setTimerState(
            timerState === CountDownState.RUNNING 
              ? CountDownState.PAUSED
              : CountDownState.RUNNING
          );
        }}
      />
      <Button
        title='RESTART {TODO}'
      />
      <Button
        title='END'
        onPress={() => {
          navigation.replace('MeditationInfo', {meditation: meditation, mode: MeditationInfoMode.POST_MED})
        }}
      />
      <Button
        title='CANCEL'
        onPress={() => {
          dispatch(actionCreators.deleteMeditation(meditation));
          navigation.popToTop()
        }}
      />
      <FlatList 
        data={chimeList}
        renderItem={({item}) => {
          return (
            <View>
              <Text>{item.labels[0]}</Text>
              <Text>{item.labels[1]}</Text>
            </View>
          )
        }}
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