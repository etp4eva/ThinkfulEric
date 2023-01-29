import { Dimensions, ListRenderItemInfo, Pressable, StyleSheet, Text } from "react-native"
import { LinearGradient } from "expo-linear-gradient";
import { FlatList } from "react-native-bidirectional-infinite-scroll";
import { useState } from "react";

type MinutePickerProps = {
    initialNumber: number;
    selectTimeParent: (number: number) => void;
}

export const MinutePicker = (props: MinutePickerProps) => {
    const [state, setState] = useState<Array<number>>(
        Array.from({length: props.initialNumber + 10}, (_, i) => i + 1)
    );

    const [selectedTime, selectTimeChild] = useState<number>(-1);

    const selectTime = (time: number) => {
        props.selectTimeParent(time);
        selectTimeChild(time);
    }

    const loadEarlierNumbers = async () => {
        const lowNum: number = state[0]
        if (lowNum == 1) {
            return
        }            
        const len: number = lowNum < 10 ? lowNum : 9;

        const earlierNumbers = Array.from({length: len}, (_, i) => lowNum - len + i);

        setState(
            earlierNumbers.concat(state)
        ); 
    };

    const loadLaterNumbers = async () => {
        const highNum: number = state[state.length - 1];

        const laterNumbers = Array.from({length: 10}, (_, i) => highNum + 1 + i);

        setState(
          state.concat(laterNumbers)
        ); 
    };

    const renderItem = (num: ListRenderItemInfo<number>) => { 
        return (
            <Pressable
                style={(num.item === selectedTime ? styles.timeSelected : undefined)}
                onPress={ () => {
                    selectTime(num.item);
                }}
            >
                <Text style={{ marginHorizontal: 5 }}>{(num.item === 1 ? `${num.item} minute` : `${num.item} minutes`)}</Text>
            </Pressable>
        )
    }

    return (
        <LinearGradient
            style={styles.modal}
            colors={['#96969660','#FFFFFF60', '#FFFFFF60', '#FFFFFF60', '#96969660']}
        >                  
            <FlatList
                data={state}
                renderItem={renderItem}
                keyExtractor={(item) => item.toString()}
                onEndReached={loadLaterNumbers}
                onStartReached={loadEarlierNumbers}
            />
        </LinearGradient>
    )
}                

const styles = StyleSheet.create({
    timeSelected: {
        backgroundColor: '#FFFFFFBB',
    },
    modal: {
        height: Dimensions.get('screen').height / 6,
        borderWidth: 1,
        borderColor: '#778664',
        marginBottom: 5,     
    },
});