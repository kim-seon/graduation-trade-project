/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React, {useState, useEffect} from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import TabNavigation from './src/navigations/Tab';
import MainStackNavigation from './src/navigations/MainStack';
import WriteScreen from './src/screens/WriteScreen/WriteScreen';

import AsyncStorage from '@react-native-async-storage/async-storage';

const Stack = createStackNavigator();

const App = () => {
  const [isLogin, setIsLogin] = useState(false);
  AsyncStorage.getItem('users').then(data => {
    if (data !== null) {
      setIsLogin(true);
    } else {
      setIsLogin(false);
    }
  });
  return (
    <NavigationContainer>
      <Stack.Navigator>
        {isLogin ? (
          <>
            <Stack.Screen
              name="Tab"
              component={TabNavigation}
              options={{headerShown: false}}
            />
            <Stack.Screen
              name="Write"
              component={WriteScreen}
              options={{headerShown: false}}
            />
          </>
        ) : (
          <>
            <Stack.Screen
              name="MainStack"
              component={MainStackNavigation}
              options={{headerShown: false}}
            />
            <Stack.Screen
              name="Tab"
              component={TabNavigation}
              options={{headerShown: false}}
            />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
