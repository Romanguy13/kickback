import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import React from 'react';
import Welcome from './src/screens/Welcome';
import Login from './src/screens/Login';
import SignUp from './src/screens/SignUp';
import EventFeed from './src/screens/EventFeed';
import EventGroups from './src/screens/EventGroups';
import EventHistory from './src/screens/EventHistory';
import EventCreation from './src/screens/EventCreation';
import NavBar from './src/screens/NavBar';
const Stack = createStackNavigator();

function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="Welcome" component={Welcome} />
        <Stack.Screen name="Login" component={Login} />
        <Stack.Screen name="SignUp" component={SignUp} />
        <Stack.Screen name="EventFeed" component={EventFeed} />
        <Stack.Screen name="EventGroups" component={EventGroups} />
        <Stack.Screen name="EventHistory" component={EventHistory} />
        <Stack.Screen name="EventCreation" component={EventCreation} />
        <Stack.Screen name="NavBar" component={NavBar} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default App;
