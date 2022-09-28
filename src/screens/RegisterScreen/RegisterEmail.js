/* eslint-disable react-native/no-inline-styles */
import React, {useState, createRef} from 'react';
import {View, Text, StyleSheet, Pressable, Alert} from 'react-native';
import CustomInput from '../../components/CustomInput';
import CustomButton from '../../components/CustomButton';
import Ionicons from 'react-native-vector-icons/Ionicons';

import AsyncStorage from '@react-native-async-storage/async-storage';

const RegisterEmail = () => {
  const [userEmail, setUserEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [errortext, setErrortext] = useState('');

  const onLoginPressed = () => {
    setErrortext('');
    if (!userEmail) {
      Alert.alert('이메일 입력은 필수입니다!');
      return;
    }
    setLoading(true);
    let data = {email: userEmail};
    let body = [];
  };

  const onRegisterPressed = () => {
    console.warn('onRegisterPressed');
  };
  return (
    <View style={styles.container}>
      <View style={styles.textContainer}>
        <View style={{marginBottom: 15}}>
          <Ionicons name="person-add" size={35} color={'#21D380'} />
        </View>
      </View>
      <CustomInput
        value={userEmail}
        setValue={setUserEmail}
        placeholder="대학교 이메일 주소를 입력해주세요!"
      />
      <CustomButton onPress={onLoginPressed} text="인 증 하 기" />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: '100%',
    display: 'flex',
    justifyContent: 'center',
    backgroundColor: '#F2F2F2',
  },
  textContainer: {
    width: '80%',
    alignSelf: 'center',
  },
  registerContainer: {
    flexDirection: 'row',
    alignSelf: 'center',
  },
});

export default RegisterEmail;
