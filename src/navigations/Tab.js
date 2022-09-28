import React from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {Home, Chat, MyPage} from '../screens/TabScreen';
import {HomeScreen} from '../screens/HomeScreen/HomeScreen';
import {ChatRoomScreen} from '../screens/ChatRoomScreen/ChatRoomScreen';
import {MyPageScreen} from '../screens/MyPageScreen/MyPageScreen';
import {View, StyleSheet, Text} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';

const Tab = createBottomTabNavigator();

const TabNavigation = () => {
  return (
    <Tab.Navigator
      initialRouteName="홈"
      screenOptions={{
        tabBarActiveTintColor: '#393E46',
        tabBarInactiveTintColor: '#393E46',
      }}>
      <Tab.Screen
        name="홈"
        component={HomeScreen}
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
        component={ChatRoomScreen}
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
        component={MyPageScreen}
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
