/* eslint-disable react/no-unstable-nested-components */
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
// eslint-disable-next-line import/no-extraneous-dependencies
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import React from 'react';
// eslint-disable-next-line import/no-extraneous-dependencies
import Ionicons from 'react-native-vector-icons/Ionicons';
import Welcome from './screens/Welcome';
import Login from './screens/Login';
import SignUp from './screens/SignUp';
import EventFeed from './screens/EventFeed';
import EventGroups from './screens/EventGroups';
import EventHistory from './screens/EventHistory';
import EventCreation from './screens/EventCreation';
import GroupDetails from './screens/GroupDetails';
import EventDetail from './screens/EventDetail';
import HistoryDetail from './screens/HistoryDetail';
// import NavBar from './screens/NavBar';

const Stack = createNativeStackNavigator();

const Tab = createBottomTabNavigator();

function TabBar() {
  return (
    <Tab.Navigator
      initialRouteName="EventFeed"
      screenOptions={{
        tabBarActiveTintColor: 'white',
        tabBarInactiveTintColor: '#FF7000',
        tabBarStyle: {
          backgroundColor: '#272222',
          height: 100,
          borderTopColor: 'black',
          borderTopWidth: 2,
          borderTopLeftRadius: 18,
          borderTopRightRadius: 18,
        },
      }}
    >
      <Tab.Screen
        name="Feed"
        component={EventFeed}
        options={{
          headerShown: false,
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="home" color={color} size={size} style={{ fontSize: 30 }} />
          ),
        }}
      />
      <Tab.Screen
        name="Creation"
        component={EventCreation}
        options={{
          headerShown: false,
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="add" color={color} size={size} style={{ fontSize: 30 }} />
          ),
        }}
      />
      <Tab.Screen
        name="Groups"
        component={EventGroups}
        options={{
          headerShown: false,
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="people" color={color} size={size} style={{ fontSize: 30 }} />
          ),
        }}
      />
      <Tab.Screen
        name="History"
        component={EventHistory}
        options={{
          headerShown: false,
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="time" color={color} size={size} style={{ fontSize: 30 }} />
          ),
        }}
      />
    </Tab.Navigator>
  );
}

function AppContainer() {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Welcome" component={Welcome} />
        <Stack.Screen name="Login" component={Login} />
        <Stack.Screen name="SignUp" component={SignUp} />
        <Stack.Screen name="GroupDetails" component={GroupDetails} />
        <Stack.Screen name="TabBar" component={TabBar} options={{ headerShown: false }} />
        <Stack.Screen name="EventDetail" component={EventDetail} />
        <Stack.Screen
          name="HistoryDetail"
          component={HistoryDetail}
          options={{ headerShown: true, title: 'Details' }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default AppContainer;
