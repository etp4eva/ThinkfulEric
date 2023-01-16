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
import { MeditationInitialState, MeditationMap, MeditationReducer, Types } from './src/reducers/MeditationReducer';
import { DispatchContext } from './src/contexts/Context';
import { Theme } from './src/screens/Themes';
import { Persister } from './src/types/Persister';
import { Chime } from './src/types/ChimePlayer';

const RootStack = createStackNavigator<RootStackParamList>();

export default function App() {
  const [state, dispatch] = useReducer(MeditationReducer, MeditationInitialState);

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
  
  return (
    <DispatchContext.Provider value={{state, dispatch}}>
      <NavigationContainer>
        <RootStack.Navigator initialRouteName='Home' >
          <RootStack.Screen 
            name='Home' 
            component={HomeScreen} 
            options={Theme.headerOptions}
          />
          <RootStack.Screen name='Meditate' component={MeditateScreen}/>
          <RootStack.Screen 
            name='Log'
            component={LogScreen}
            options={Theme.headerOptions}
          />
          <RootStack.Screen name='MeditationInfo' component={MediationInfoScreen} />
        </RootStack.Navigator>
      </NavigationContainer>
    </DispatchContext.Provider>
  );
}
