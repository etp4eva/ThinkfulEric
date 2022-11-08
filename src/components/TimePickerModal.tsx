import { FlatList } from "react-native-bidirectional-infinite-scroll";
import {Button, Dimensions, ListRenderItem, ListRenderItemInfo, Modal, Pressable, StyleSheet, Text, View} from "react-native"
import React, { useState } from "react";
import { LinearGradient } from "expo-linear-gradient";

type TimePickerProps = {
    initialNumber: number;
    closeModalFn: () => void;
    handleNumberFn: (num: number) => void;
    visible: boolean;
}

const oneToTen: number[] = Array.from({length: 10}, (_, i) => i + 1)

export const TimePickerModal = (props: TimePickerProps) => {
    const [state, setState] = useState<Array<number>>(
        Array.from({length: props.initialNumber + 10}, (_, i) => i + 1)
    );

    const loadEarlierNumbers = async () => {
        const lowNum: number = state[0]
        if (lowNum == 1) {
            return
        }            
        const len: number = lowNum < 10 ? lowNum : 9;

        const earlierNumbers = Array.from({length: len}, (_, i) => lowNum - len + i);
        console.log(earlierNumbers)
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
                onPress={ () => {
                    props.handleNumberFn(num.item)
                    props.closeModalFn()                        
                }}
            >
                <Text>{(num.item === 1 ? `${num.item} minute` : `${num.item} minutes`)}</Text>
            </Pressable>
        )
    }

    return (
        <Modal
          animationType="fade"
          transparent={true}
          visible={props.visible}
          onRequestClose={props.closeModalFn}
        >
            <View style={styles.background}>
                <LinearGradient
                        style={styles.modal}
                        colors={['#969696','#FFF', '#FFF', '#FFF', '#969696']}
                    >
                        <Button
                            title="X"
                            onPress={props.closeModalFn}
                        />
                        <FlatList
                            data={state}
                            renderItem={renderItem}
                            keyExtractor={(item) => item.toString()}
                            onEndReached={loadLaterNumbers}
                            onStartReached={loadEarlierNumbers}
                        />
                    </LinearGradient>                    
                </View>
        </Modal>
    )
}

const styles = StyleSheet.create({
    background: {
        backgroundColor: 'rgba(80,80,80,0.5)',
        height: Dimensions.get('window').height,
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        padding: 100,
    },
    modal: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(80,80,80,0.0)',
        height: Dimensions.get('window').height / 5,
        
    },
});