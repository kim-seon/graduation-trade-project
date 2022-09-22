import React from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {Home, Chat, MyPage} from '../screens/TabScreen';
import {View, StyleSheet, Text} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';

const Tab = createBottomTabNavigator();

const TabNavigation = () => {
  return (
    <Tab.Navigator
      initialRouteName="홈"
      screenOptions={{
        tabBarActiveTintColor: '#ffd400',
        tabBarInactiveTintColor: '#bcbcbc',
      }}>
      <Tab.Screen
        name="홈"
        component={Home}
        options={{
          tabBarIcon: ({focused}) => (
            <Ionicons
              name={focused ? 'book' : 'book-outline'}
              size={25}
              color={focused ? '#ffd400' : '#bcbcbc'}
            />
          ),
        }}
      />
      <Tab.Screen
        name="채팅방"
        component={Chat}
        options={{
          tabBarIcon: ({focused}) => (
            <Ionicons
              name={focused ? 'chatbubble' : 'chatbubble-outline'}
              size={25}
              color={focused ? '#ffd400' : '#bcbcbc'}
            />
          ),
        }}
      />
      <Tab.Screen
        name="마이페이지"
        component={MyPage}
        options={{
          tabBarIcon: ({focused}) => (
            <Ionicons
              name={focused ? 'md-person' : 'md-person-outline'}
              size={25}
              color={focused ? '#ffd400' : '#bcbcbc'}
            />
          ),
        }}
      />
    </Tab.Navigator>
  );
};

export default TabNavigation;
