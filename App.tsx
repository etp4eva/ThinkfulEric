import 'react-native-gesture-handler';

import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator, StackScreenProps } from '@react-navigation/stack';
import { RootStackParamList } from './src/screens/ScreenParams';
import { HomeScreen } from './src/screens/HomeScreen';
import { MeditateScreen } from './src/screens/MeditateScreen';
import { LogScreen } from './src/screens/LogScreen';

const RootStack = createStackNavigator<RootStackParamList>();

export default function App() {
  return (
    <NavigationContainer>
      <RootStack.Navigator initialRouteName='Home'>
        <RootStack.Screen name='Home' component={HomeScreen} />
        <RootStack.Screen name='Meditate' component={MeditateScreen} />
        <RootStack.Screen name='Log' component={LogScreen} />
      </RootStack.Navigator>
    </NavigationContainer>
  );
}
