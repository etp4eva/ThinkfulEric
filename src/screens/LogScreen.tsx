import { StackScreenProps } from "@react-navigation/stack"
import { View, Text, StyleSheet } from "react-native";
import { RootStackParamList } from "./ScreenParams";

export const LogScreen = ({ route, navigation }: StackScreenProps<RootStackParamList, 'Log'> ) => {
    return (
      <View style={styles.container}>
        <Text>A monthly calendar with meditation days highlighted and you can click them to read your log. Also a list in reverse chronological order</Text>
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