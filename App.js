/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React, {useState, useEffect} from 'react';
import auth from '@react-native-firebase/auth';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import TabNavigation from './src/navigations/Tab';
import MainStackNavigation from './src/navigations/MainStack';
import WriteScreen from './src/screens/WriteScreen/WriteScreen';
import DetailScreen from './src/screens/DetailScreen/DetailScreen';
import ChatRoomScreen from './src/screens/ChatRoomScreen/ChatRoomScreen';

import AsyncStorage from '@react-native-async-storage/async-storage';

const Stack = createStackNavigator();

const App = () => {
  const [isLogin, setIsLogin] = useState(false);
  const [loading, setLoading] = useState(false);
  const [userInfo, setUserInfo] = useState({});
  const [userUid, setUserUid] = useState('');

  useEffect(() => {
    setLoading(true);
    auth().onAuthStateChanged(user => {
      if (user !== null) {
        setIsLogin(true);
        setUserInfo(user);
        console.log(userInfo);
        setLoading(false);
      } else {
        setIsLogin(false);
      }
    });
  }, [userInfo]);

  return (
    <NavigationContainer>
      <Stack.Navigator>
        {isLogin ? (
          <>
            <Stack.Screen
              name="Tab"
              children={() => <TabNavigation params={userInfo} />}
              options={{headerShown: false}}
            />
            <Stack.Screen
              name="Write"
              component={WriteScreen}
              options={{headerShown: false}}
            />
            <Stack.Screen
              name="Detail"
              component={DetailScreen}
              options={{headerShown: false}}
            />
            <Stack.Screen
              name="ChatRoom"
              component={ChatRoomScreen}
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
