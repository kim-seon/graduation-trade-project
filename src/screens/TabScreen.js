import React from 'react';
import {View, StyleSheet, Text} from 'react-native';

export const Home = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.styledText}>Home</Text>
    </View>
  );
};

export const Chat = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.styledText}>Chat</Text>
    </View>
  );
};

export const MyPage = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.styledText}>MyPage</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  styledText: {
    fontSize: 30,
  },
});
