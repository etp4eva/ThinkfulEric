import { StackScreenProps } from "@react-navigation/stack"
import { View, Text, StyleSheet } from "react-native";
import { CountDown, CountDownState } from "../components/CountDown";
import { RootStackParamList } from "./ScreenParams";

enum MeditationMode {
  MEDITATION_NOT_STARTED = 'MEDITATION_NOT_STARTED',
  MEDITATION_RUNNING = 'MEDITATION_RUNNING',
  MEDITATION_PAUSED = 'MEDITATION_PAUSED',
  MEDITATION_ENDED = 'MEDITATION_ENDED',
}

export const MeditateScreen = ({ route, navigation }: StackScreenProps<RootStackParamList, 'Meditate'> ) => {
  
  return (
    <View style={styles.container}>
      <Text>A countdown clock with total time and time to next chime</Text>
      <CountDown 
        totalMinutes={10}
        totalSeconds={30}
        state={CountDownState.RUNNING}
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