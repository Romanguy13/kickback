<<<<<<< HEAD
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
=======
// import { NavigationContainer } from '@react-navigation/native';
// import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React from 'react';
import AppContainer from './src/navigation/AppContainer';
// import Welcome from './src/navigation/screens/Welcome';
// import Login from './src/navigation/screens/Login';
// import SignUp from './src/navigation/screens/SignUp';
// import EventFeed from './src/navigation/screens/EventFeed';
// import EventGroups from './src/navigation/screens/EventGroups';
// import EventHistory from './src/navigation/screens/EventHistory';
// import EventCreation from './src/navigation/screens/EventCreation';
// import NavBar from './src/navigation/screens/NavBar';

// const Stack = createNativeStackNavigator();
>>>>>>> main

function App() {
  return <AppContainer />;
}

export default App;
