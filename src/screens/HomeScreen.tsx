import { StackScreenProps } from "@react-navigation/stack"
import { useContext, useState } from "react"
import { View, Text, StyleSheet, ImageBackground } from "react-native";
import { ChimePickerModal } from "../components/ChimePickerModal";
import { RemoveableItemList } from "../components/RemovableItemList";
import { DispatchContext } from "../contexts/Context";
import { actionCreators } from "../reducers/MeditationReducer";
import { createNewMeditation } from "../types/types";
import { MeditationInfoMode, RootStackParamList } from "./ScreenParams";
import { Theme } from './Themes';
import { ImageButton } from "../components/ImageButton";


export const HomeScreen = ({ route, navigation }: StackScreenProps<RootStackParamList, 'Home'> ) => {
    const {state, dispatch} = useContext(DispatchContext);
    const [chimePickerModalOpen, setChimePickerModalOpen] = useState<boolean>(false);
  
    // TODO: Scroll view wrapping a la meditation info screen in case somebody adds too many chimes
    return (
      <View style={ Theme.styles.container }>
        <ImageBackground style={ Theme.styles.bg } source={ Theme.images.background }>
          <View style={ styles.internalContainer }>
            <ChimePickerModal 
              initialNumber={1}
              visible={chimePickerModalOpen}
              closeModalFn={() => setChimePickerModalOpen(!chimePickerModalOpen)}
              handleChimeFn={(chime) => { 
                dispatch(actionCreators.addChime(chime)) 
              }}
            />

            <View style={ Theme.styles.titleView }>
              <View style={{ alignItems:'center' }}>
                <Text style={ Theme.styles.title }>ThinkfulEric</Text>
                <Text style={ Theme.styles.subtitle }>Meditation by Eric</Text>            
              </View>
            </View>

            <View style={ styles.buttonsView }>
              <ImageButton 
                imageStyle={{ width: '50%', height: undefined, aspectRatio: 1.8 }}
                textStyle={{ fontSize: 18 }}
                label='Start Meditation'
                image={Theme.images.lotusButton}
                onPress={ () => navigation.navigate('MeditationInfo', { meditation: createNewMeditation(state.chimes), mode: MeditationInfoMode.PRE_MED })}
              />
              <ImageButton 
                imageStyle={{ width: '50%', height: undefined, aspectRatio: 1.8 }}
                textStyle={{ fontSize: 18 }}
                label='View Log'
                image={Theme.images.lotusButton}
                onPress={ () => navigation.navigate('Log') }
              />
            </View>     

            <View style={Theme.styles.card}>
              <RemoveableItemList 
                data={state.chimes}
                removeFn={(idx: number) => {
                  dispatch(actionCreators.removeChime(idx))
                }}
                minItems={1}            
                textStyle={{ fontSize: 16 }}
              />
              <ImageButton
                imageStyle={{ marginVertical: 5, width: '15%', height: undefined, aspectRatio: 1.0 }}
                onPress={ () => setChimePickerModalOpen(true) }
                image={ Theme.images.addButton }
              />
            </View>
          </View>
        </ImageBackground>
      </View>
    )
}

const styles = StyleSheet.create({

    buttonsView: {
      flexDirection: 'row',
      justifyContent: 'space-around',
    },
    buttons: {
      width: '20%',
      height: undefined,
      aspectRatio: 1.8,
    },
    
    internalContainer:
    {
      flex: 1,
      justifyContent: 'space-between',
      flexDirection: 'column'
    }
});