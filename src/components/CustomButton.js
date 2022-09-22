import React from 'react';
import {View, StyleSheet, Text, Pressable} from 'react-native';

const CustomButton = ({onPress, text}) => {
  return (
    <Pressable onPress={onPress} style={styles.container}>
      <Text style={styles.text}>{text}</Text>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '80%',
    height: 45,
    alignItems: 'center',
    borderRadius: 5,
    backgroundColor: '#00ADB5',
    alignSelf: 'center',
    justifyContent: 'center',
  },
  text: {
    color: '#EEEEEE',
    fontWeight: '700',
    fontSize: 16,
  },
});

export default CustomButton;
