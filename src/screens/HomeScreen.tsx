import { StackScreenProps } from "@react-navigation/stack"
import { useContext, useState } from "react"
import { Button, View, Text, StyleSheet, ImageBackground } from "react-native";
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
  
    return (
      <View style={styles.container}>
        <ImageBackground style={styles.bg} source={ Theme.background }>
          <View style={styles.internalContainer}>
            <ChimePickerModal 
              initialNumber={1}
              visible={chimePickerModalOpen}
              closeModalFn={() => setChimePickerModalOpen(!chimePickerModalOpen)}
              handleChimeFn={(chime) => { 
                dispatch(actionCreators.addChime(chime)) 
              }}
            />

            <View style={ styles.titleView }>
              <View style={{alignItems:'center'}}>
                <Text style={ styles.title }>ThinkfulEric</Text>
                <Text style={ styles.subtitle }>Meditation by Eric</Text>            
              </View>
            </View>

            <View style={ styles.buttonsView }>
              <ImageButton 
                imageStyle={{width: '50%', height: undefined, aspectRatio: 1.8}}
                textStyle={{fontFamily: 'Comfortaa', fontSize: 18}}
                label='Start Meditation'
                image={require('../../assets/img/lotus.png')}
                onPress={ () => navigation.navigate('MeditationInfo', { meditation: createNewMeditation(state.chimes), mode: MeditationInfoMode.PRE_MED })}
              />
              <ImageButton 
                imageStyle={{width: '50%', height: undefined, aspectRatio: 1.8 }}
                textStyle={{fontFamily: 'Comfortaa', fontSize: 18}}
                label='View Log'
                image={require('../../assets/img/lotus.png')}
                onPress={ () => navigation.navigate('Log') }
              />
            </View>     

            <View style={styles.card}>
              <RemoveableItemList 
                data={state.chimes}
                removeFn={(idx: number) => {
                  dispatch(actionCreators.removeChime(idx))
                }}
                minItems={1}            
                textStyle={{fontFamily: 'Comfortaa', fontSize: 16}}
              />
              <ImageButton
                imageStyle={{marginVertical: 5, width: '15%', height: undefined, aspectRatio: 1.0}}
                onPress={ () => setChimePickerModalOpen(true) }
                image={require('../../assets/img/add_button.png')}
              />
            </View>
          </View>
        </ImageBackground>
      </View>
    )
}

const styles = StyleSheet.create({
    container: {
      flex: 0,
      backgroundColor: '#adba94ff',
      padding: 0,
      margin: 0,
      width: '100%',
      alignSelf: "stretch",
    },
    titleView: {
      alignItems: 'center',
      flexGrow: 1,
      justifyContent: 'space-around'
    },
    title: {
      fontSize: 60,
      fontFamily: 'ComfortaaBold',
      paddingBottom: 5
    },
    subtitle: {
      fontSize: 20,
      //fontStyle: "italic", 
      fontFamily: 'Comfortaa',
      marginTop: -20,
    },
    buttonsView: {
      flexDirection: 'row',
      justifyContent: 'space-around',
    },
    buttons: {
      width: '20%',
      height: undefined,
      aspectRatio: 1.8,
    },
    card: {
      backgroundColor: Theme.colors.card,
      margin: 10,
      padding: 10,
      flexGrow: 0,
    },
    bg: {
      resizeMode: "cover",
      height: "100%",
      width: "100%",
      //alignItems: 'center',
    },
    internalContainer:
    {
      flex: 1,
      justifyContent: 'space-between',
      flexDirection: 'column'
    }
});