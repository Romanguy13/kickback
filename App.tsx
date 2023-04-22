import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import React from 'react';
import Welcome from './src/screens/Welcome';
import Login from './src/screens/Login';
import SignUp from './src/screens/SignUp';
import EventFeed from './src/screens/EventFeed';
import NavBar from './src/screens/NavBar';
const Stack = createNativeStackNavigator();

const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="Welcome" component={Welcome} />
        <Stack.Screen name="Login" component={Login} />
        <Stack.Screen name="SignUp" component={SignUp} />
        <Stack.Screen name="EventFeed" component={EventFeed} />
        <Stack.Screen name="NavBar" component={NavBar} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
