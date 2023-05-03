import {NavigationContainer, TypedNavigator} from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React from 'react';
import Welcome from './src/screens/Welcome';
import Login from './src/screens/Login';
import SignUp from './src/screens/SignUp';
import EventFeed from './src/screens/EventFeed';
import EventGroups from './src/screens/EventGroups';
import EventHistory from './src/screens/EventHistory';
import EventCreation from './src/screens/EventCreation';
import NavBar from './src/screens/NavBar';
import GroupDetails from "./src/screens/GroupDetails";
import {GroupReturnModel} from "./src/resources/schema/group.model";

type RootStackParamList = {
  YourCurrentScreen: undefined;
  Welcome: undefined;
  Login: undefined;
  SignUp: undefined;
  EventFeed: undefined;
  EventGroups: undefined;
  EventHistory: undefined;
  EventCreation: undefined;
  NavBar: undefined;
  GroupDetails: { group: GroupReturnModel };
};
const Stack = createNativeStackNavigator<RootStackParamList>();


function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Welcome" component={Welcome} />
        <Stack.Screen name="Login" component={Login} />
        <Stack.Screen name="SignUp" component={SignUp} />
        <Stack.Screen name="EventFeed" component={EventFeed} />
        <Stack.Screen name="EventGroups" component={EventGroups} />
        <Stack.Screen name="EventHistory" component={EventHistory} />
        <Stack.Screen name="EventCreation" component={EventCreation} />
        <Stack.Screen name="NavBar" component={NavBar} />
        <Stack.Screen name="GroupDetails" component={GroupDetails} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default App;
