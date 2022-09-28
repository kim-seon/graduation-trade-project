import React from 'react';
import {View, StyleSheet, Text, TextInput} from 'react-native';

const CustomInput = ({value, setValue, placeholder, secureTextEntry}) => {
  return (
    <TextInput
      value={value}
      onChangeText={setValue}
      placeholder={placeholder}
      placeholderTextColor={'#06de96'}
      style={styles.input}
      secureTextEntry={secureTextEntry}
    />
  );
};

const styles = StyleSheet.create({
  input: {
    fontSize: 16,
    color: '#393E46',
    backgroundColor: 'transparent',
    width: '80%',
    height: 48,
    paddingLeft: 15,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#06de96',
    marginBottom: 18,
    alignSelf: 'center',
  },
});

export default CustomInput;
