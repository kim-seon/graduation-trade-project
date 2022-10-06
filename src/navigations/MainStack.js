import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import MainScreen from '../screens/MainScreen/MainScreen';
import RegisterScreen from '../screens/RegisterScreen/RegisterScreen';
import LoginScreen from '../screens/LoginScreen/LoginScreen';

const Stack = createStackNavigator();

const MainStackNavigation = () => {
  return (
    <Stack.Navigator initialRouteName="Main">
      <Stack.Screen
        name="Main"
        component={MainScreen}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="Register"
        component={RegisterScreen}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="Login"
        component={LoginScreen}
        options={{headerShown: false}}
      />
    </Stack.Navigator>
  );
};

export default MainStackNavigation;
