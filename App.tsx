import 'react-native-gesture-handler';

import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { RootStackParamList } from './src/screens/ScreenParams';
import { HomeScreen } from './src/screens/HomeScreen';
import { MeditateScreen } from './src/screens/MeditateScreen';
import { LogScreen } from './src/screens/LogScreen';
import { MediationInfoScreen } from './src/screens/MeditationInfoScreen';
import React, { useReducer } from 'react';
import { Text } from 'react-native';
import { MeditationInitialState, MeditationMap, MeditationReducer, State, Types, actionCreators } from './src/reducers/MeditationReducer';
import { DispatchContext } from './src/contexts/Context';
import { Theme } from './src/screens/Themes';
import { useFonts } from 'expo-font';
import { Persister } from './src/types/Persister';
import { Chime } from './src/types/ChimePlayer';

const RootStack = createStackNavigator<RootStackParamList>();

export default function App() {
  const [state, dispatch] = useReducer(MeditationReducer, MeditationInitialState);
  const [fontsLoaded] = useFonts({
    'Comfortaa': require('./assets/fonts/Comfortaa.ttf'),
    'ComfortaaBold': require('./assets/fonts/ComfortaaBold.ttf'),
  })

  React.useEffect(() => {
    const checkAsync = async () => {
        const settings: Chime[] = await Persister.getSettings();
        const meditations: MeditationMap = await Persister.getMeditationMonthList(new Date().getMonth());

        if (settings) {
          dispatch({type: Types.INIT_SETTINGS, payload: settings});
        }

        if (meditations) {
          dispatch({type: Types.INIT_MEDITATIONS, payload: meditations});
        }
    }
    checkAsync()
  }, [])

  if (!fontsLoaded)
  {
    return (<Text>Loading</Text>)
  }

  return (
    <DispatchContext.Provider value={{state, dispatch}}>
      <NavigationContainer>
        <RootStack.Navigator initialRouteName='Home' >
          <RootStack.Screen 
            name='Home' 
            component={HomeScreen} 
            options={{
              headerStyle: {
                backgroundColor: Theme.colors.border
              },
              headerTintColor: Theme.colors.headerTint
            }}
          />
          <RootStack.Screen name='Meditate' component={MeditateScreen}/>
          <RootStack.Screen name='Log' component={LogScreen} />
          <RootStack.Screen name='MeditationInfo' component={MediationInfoScreen} />
        </RootStack.Navigator>
      </NavigationContainer>
    </DispatchContext.Provider>
  );
}
