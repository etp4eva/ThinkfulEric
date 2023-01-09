import {Button, Dimensions, Modal, Pressable, StyleSheet, View, Text} from "react-native"
import React, { useEffect, useState } from "react";
import { Picker } from "@react-native-picker/picker";
import { ChimePlayer, BuiltInChimesData, BuiltInChimeSounds, Chime, createChime } from "../types/ChimePlayer";
import { MinutePicker } from "./MinutePicker";
import { Theme } from "../screens/Themes";

export type ChimePickerProps = {
    initialNumber: number;
    closeModalFn: () => void;
    handleChimeFn: (chime: Chime) => void;
    visible: boolean;
}

export const ChimePickerModal = (props: ChimePickerProps) => {
    const [selectedTime, selectTime] = useState(-1);
    const [selectedChimeSound, selectChimeSound] = useState<BuiltInChimeSounds | undefined>(undefined);
    const [chimePlayer, setChimePlayer] = useState<ChimePlayer>(new ChimePlayer());

    useEffect(() => {
        return () => {chimePlayer.unloadChimes()};
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
                    <MinutePicker 
                        initialNumber={props.initialNumber}
                        selectTimeParent={selectTime}
                    />

                    <Picker
                        selectedValue={selectedChimeSound}
                        onValueChange={(itemValue, itemIndex) => {
                            chimePlayer.stopAllChimes();

                            if (itemValue) {
                                chimePlayer.playChime(itemValue);
                            }

                            selectChimeSound(itemValue);
                        }}
                        style={{backgroundColor: Theme.colors.card}}
                    >
                        <Picker.Item label='No Chime' value={undefined} />
                        {Object.values(BuiltInChimesData).map((value) => {
                            return (<Picker.Item key={value.key} label={value.label} value={value.key} />)
                        })}
                    </Picker>

                    <View style={{flexDirection: 'row', justifyContent: 'space-around'}}>
                        <Pressable
                            disabled={selectedTime === -1}                            
                            onPress={() => {
                                props.handleChimeFn(
                                    createChime(selectedTime, selectedChimeSound)
                                );
                                selectTime(-1);
                                chimePlayer.stopAllChimes();
                                props.closeModalFn()
                            }}
                        >
                            <Text style={[{fontSize: 60}, (selectedTime === -1) ? {color: '#00000050'} : null]}>✓</Text>
                        </Pressable>
                        <Pressable 
                            onPress={() => {
                                selectTime(-1);
                                chimePlayer.stopAllChimes();
                                props.closeModalFn()
                            }}
                        >
                            <Text style={{fontSize: 60}}>X</Text>
                        </Pressable>
                    </View>
                </View>
            </View>
        </Modal>
    )
}

const styles = StyleSheet.create({
    greyBackground: {
        backgroundColor: 'rgba(80,80,80,0.5)',
        height: Dimensions.get('window').height,
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'space-around',
        alignItems: 'center',
        alignContent: 'center',        
    },
    whiteBackground: {
        backgroundColor: Theme.colors.background,
        width: Dimensions.get('window').width * 0.60,
        padding: 5,
        borderWidth: 1,
        borderStyle: 'solid',
        borderColor: Theme.colors.headerTint,
        shadowColor: 'black',
        shadowOpacity: 0.5,
        shadowRadius: 5,
        elevation: 15,
    },
});