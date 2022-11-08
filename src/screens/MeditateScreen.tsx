import { StackScreenProps } from "@react-navigation/stack"
import { View, Text, StyleSheet } from "react-native";
import { RootStackParamList } from "./ScreenParams";

export const MeditateScreen = ({ route, navigation }: StackScreenProps<RootStackParamList, 'Meditate'> ) => {
    return (
      <View style={styles.container}>
        <Text>A countdown clock with total time and time to next chime</Text>
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