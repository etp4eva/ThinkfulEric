import 'react-native-gesture-handler';

import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { RootStackParamList } from './src/screens/ScreenParams';
import { HomeScreen } from './src/screens/HomeScreen';
import { MeditateScreen } from './src/screens/MeditateScreen';
import { LogScreen } from './src/screens/LogScreen';
import { MediationInfoScreen } from './src/screens/MeditationInfoScreen';
import React, { useReducer, useState } from 'react';
import { MeditationInitialState, MeditationMap, MeditationReducer, Types } from './src/reducers/MeditationReducer';
import { DispatchContext } from './src/contexts/Context';
import { Theme } from './src/screens/Themes';
import { Persister } from './src/types/Persister';
import { Chime } from './src/types/ChimePlayer';
import { ActivityIndicator, ImageBackground, View, Text } from 'react-native';

const RootStack = createStackNavigator<RootStackParamList>();

export default function App() {
  const [ state, dispatch ] = useReducer(MeditationReducer, MeditationInitialState);
  const [ isLoading, setLoading ] = useState(true);

  React.useEffect(() => {
    const checkAsync = async () => {
      setLoading(true);

      const today: Date = new Date();
      const settings: Chime[] = await Persister.getSettings();
      const meditations: MeditationMap = await Persister.getMeditationMonthList(
        today.getFullYear(), today.getMonth()
      );

      if (settings) {
        dispatch({type: Types.INIT_SETTINGS, payload: settings});
      }

      if (meditations) {
        dispatch({type: Types.INIT_MEDITATIONS, payload: meditations});
      }

      setLoading(false);
    }

    checkAsync();
  }, [])

  if (isLoading)
  {

    return (
      <View style={ Theme.styles.container }>
        <ImageBackground style={ Theme.styles.bg } source={ Theme.images.background }>
          <View style={ Theme.styles.titleView }>
            <View style={{ alignItems:'center' }}>
              <Text style={ Theme.styles.title }>ThinkfulEric</Text>
              <Text style={ Theme.styles.subtitle }>Meditation by Eric</Text>
              <ActivityIndicator
                size='large'
                color={ Theme.colors.headerTint }
              />
            </View>
          </View>
        </ImageBackground>
      </View>
    )

  } else {

    return (
      <DispatchContext.Provider value={{state, dispatch}}>
        <NavigationContainer theme={Theme}>
          <RootStack.Navigator initialRouteName='Home' >
            <RootStack.Screen 
              name='Home' 
              component={HomeScreen} 
              options={Theme.headerOptions}
            />
            <RootStack.Screen 
              name='Meditate' 
              component={MeditateScreen}
              options={Theme.headerOptions}
            />
            <RootStack.Screen 
              name='Log'
              component={LogScreen}
              options={Theme.headerOptions}
            />
            <RootStack.Screen 
              name='MeditationInfo' 
              component={MediationInfoScreen} 
              options={{
                ...Theme.headerOptions,
                title: 'Meditation Info',
              }}
            />
          </RootStack.Navigator>
        </NavigationContainer>
      </DispatchContext.Provider>
    );

  }
}
