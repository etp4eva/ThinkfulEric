import { FlatList } from "react-native-bidirectional-infinite-scroll";
import {Button, Dimensions, ListRenderItem, ListRenderItemInfo, Modal, Pressable, StyleSheet, Text, View} from "react-native"
import React, { useEffect, useState } from "react";
import { LinearGradient } from "expo-linear-gradient";
import { Picker } from "@react-native-picker/picker";
import { ChimePlayer, BuiltInChimesData, BuiltInChimeSounds, Chime, createChime } from "../types/ChimePlayer";

//
// TODO: /!\ BIG REFACTOR /!\
//

export type ChimePickerProps = {
    initialNumber: number;
    closeModalFn: () => void;
    handleChimeFn: (chime: Chime) => void;
    visible: boolean;
}

const oneToTen: number[] = Array.from({length: 10}, (_, i) => i + 1)

export const ChimePickerModal = (props: ChimePickerProps) => {
    const [state, setState] = useState<Array<number>>(
        Array.from({length: props.initialNumber + 10}, (_, i) => i + 1)
    );
    const [selectedTime, selectTime] = useState(-1);
    const [selectedChimeSound, selectChimeSound] = useState<BuiltInChimeSounds | undefined>(undefined);
    const [chimePlayer, setChimePlayer] = useState<ChimePlayer>(new ChimePlayer());

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
                style={(num.item === selectedTime ? styles.timeSelected : undefined)}
                onPress={ () => {
                    selectTime(num.item);
                }}
            >
                <Text>{(num.item === 1 ? `${num.item} minute` : `${num.item} minutes`)}</Text>
            </Pressable>
        )
    }

    useEffect(() => {
        return () => {chimePlayer.unloadChimes};
    });    

    return (
        <Modal
          animationType="fade"
          transparent={true}
          visible={props.visible}
          onRequestClose={props.closeModalFn}
        >
            <View style={styles.greyBackground}>
                <View style={styles.whiteBackground}>
                    <LinearGradient
                        style={styles.modal}
                        colors={['#969696','#FFF', '#FFF', '#FFF', '#969696']}
                    >                  
                        <FlatList
                            data={state}
                            renderItem={renderItem}
                            keyExtractor={(item) => item.toString()}
                            onEndReached={loadLaterNumbers}
                            onStartReached={loadEarlierNumbers}
                        />
                    </LinearGradient>
                    <Picker
                        selectedValue={selectedChimeSound}
                        onValueChange={(itemValue, itemIndex) => {
                            chimePlayer.stopAllChimes();

                            if (itemValue) {
                                chimePlayer.playChime(itemValue);
                            }

                            selectChimeSound(itemValue);
                        }}
                    >
                        <Picker.Item label='No Chime' value={undefined} />
                        {Object.values(BuiltInChimesData).map((value) => {
                            return (<Picker.Item key={value.key} label={value.label} value={value.key} />)
                        })}
                    </Picker>
                    <Button
                        disabled={selectedTime === -1}                        
                        title="ACCEPT"
                        onPress={() => {
                            props.handleChimeFn(
                                createChime(selectedTime, selectedChimeSound)
                            );
                            selectTime(-1);
                            chimePlayer.stopAllChimes();
                            props.closeModalFn()
                        }}
                    />  
                    <Button
                        title="CANCEL"                        
                        onPress={() => {
                            selectTime(-1);
                            chimePlayer.stopAllChimes();
                            props.closeModalFn()
                        }}
                    /> 
                </View>
            </View>
        </Modal>
    )
}

const styles = StyleSheet.create({
    timeSelected: {
        backgroundColor: 'red',
    },
    greyBackground: {
        backgroundColor: 'rgba(80,80,80,0.5)',
        height: Dimensions.get('window').height,
        alignItems: 'center',
    },
    whiteBackground: {
        backgroundColor: 'white',
        width: Dimensions.get('window').width * 0.95,
    },
    modal: {
        height: Dimensions.get('screen').height / 6,
        
    },
});