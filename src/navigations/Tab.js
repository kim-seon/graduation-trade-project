import React, {useState, useEffect} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import auth from '@react-native-firebase/auth';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {useIsFocused} from '@react-navigation/native';
import {Home, Chat, MyPage} from '../screens/TabScreen';
import {HomeScreen} from '../screens/HomeScreen/HomeScreen';
import {ChatRoomScreen} from '../screens/ChatRoomScreen/ChatRoomScreen';
import {MyPageScreen} from '../screens/MyPageScreen/MyPageScreen';
import {View, StyleSheet, Text} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Loding from '../components/Loading';

const Tab = createBottomTabNavigator();

const TabNavigation = params => {
  const [userInfo, setUserInfo] = useState([]);
  const [loading, setLoading] = useState(false);
  const isFocused = useIsFocused();

  useEffect(() => {
    setLoading(true);
    auth().onAuthStateChanged(user => {
      setUserInfo(user);
      setLoading(false);
    });
  }, []);

  return (
    <Tab.Navigator
      initialRouteName="홈"
      screenOptions={{
        tabBarActiveTintColor: '#393E46',
        tabBarInactiveTintColor: '#393E46',
      }}>
      <Tab.Screen
        name="홈"
        children={() => <HomeScreen data={userInfo} />}
        options={{
          tabBarIcon: ({focused}) => (
            <Ionicons
              name={focused ? 'book' : 'book-outline'}
              size={25}
              color={focused ? '#393E46' : '#393E46'}
            />
          ),
        }}
      />
      <Tab.Screen
        name="채팅방"
        children={() => <ChatRoomScreen data={userInfo} />}
        options={{
          tabBarIcon: ({focused}) => (
            <Ionicons
              name={focused ? 'chatbubble' : 'chatbubble-outline'}
              size={25}
              color={focused ? '#393E46' : '#393E46'}
            />
          ),
        }}
      />
      <Tab.Screen
        name="마이페이지"
        children={() => <MyPageScreen data={userInfo} />}
        options={{
          tabBarIcon: ({focused}) => (
            <Ionicons
              name={focused ? 'md-person' : 'md-person-outline'}
              size={25}
              color={focused ? '#393E46' : '#393E46'}
            />
          ),
        }}
      />
    </Tab.Navigator>
  );
};

export default TabNavigation;
