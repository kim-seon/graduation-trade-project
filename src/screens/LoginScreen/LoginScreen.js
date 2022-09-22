/* eslint-disable react-native/no-inline-styles */
import React, {useState, createRef} from 'react';
import {View, Text, StyleSheet, Pressable, Alert} from 'react-native';
import CustomInput from '../../components/CustomInput';
import CustomButton from '../../components/CustomButton';
import Ionicons from 'react-native-vector-icons/Ionicons';

import AsyncStorage from '@react-native-async-storage/async-storage';

const LoginScreen = () => {
  const [userEmail, setUserEmail] = useState('');
  const [userPassword, setUserPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errortext, setErrortext] = useState('');
  const passwordInputRef = createRef();

  const onLoginPressed = () => {
    setErrortext('');
    if (!userEmail) {
      Alert.alert('이메일 입력은 필수입니다!');
      return;
    }
    if (!userPassword) {
      Alert.alert('비밀번호 입력은 필수입니다!');
    }
    setLoading(true);
    let data = {email: userEmail, password: userPassword};
    let body = [];
  };

  const onRegisterPressed = () => {
    console.warn('onRegisterPressed');
  };
  return (
    <View style={styles.container}>
      <View style={styles.textContainer}>
        <View style={{marginBottom: 15}}>
          <Ionicons name="md-lock-closed" size={35} color={'#00ADB5'} />
        </View>
        <View style={styles.loginTextContainer}>
          <Text style={styles.loginText}>트레이북</Text>
          <Text style={styles.loginTextDsc}>| 로그인</Text>
        </View>
      </View>
      <CustomInput
        value={userEmail}
        setValue={setUserEmail}
        placeholder="이메일"
      />
      <CustomInput
        value={userPassword}
        setValue={setUserPassword}
        placeholder="비밀번호"
        secureTextEntry
      />
      <CustomButton onPress={onLoginPressed} text="로 그 인" />
      <View
        style={{
          width: '80%',
          marginTop: 30,
          marginBottom: 18,
          borderWidth: 1,
          borderColor: '#EEEEEE',
          alignSelf: 'center',
        }}
      />
      <View style={styles.registerContainer}>
        <Text style={{color: '#EEEEEE'}}>아직 회원이 아니신가요?</Text>
        <Pressable onPress={onRegisterPressed}>
          <Text style={{color: '#00ADB5', marginLeft: 10}}>회원가입</Text>
        </Pressable>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: '100%',
    display: 'flex',
    justifyContent: 'center',
    backgroundColor: '#222831',
  },
  textContainer: {
    width: '80%',
    alignSelf: 'center',
  },
  loginTextContainer: {
    flexDirection: 'row',
    display: 'flex',
    alignItems: 'flex-end',
    marginTop: 5,
    marginBottom: 30,
  },
  loginTextDsc: {
    fontSize: 18,
    color: '#00ADB5',
  },
  loginText: {
    fontSize: 24,
    fontWeight: '500',
    marginTop: 5,
    marginRight: 10,
    padding: 5,
    color: '#EEEEEE',
    borderRadius: 5,
    backgroundColor: '#00ADB5',
    alignSelf: 'flex-start',
  },
  registerContainer: {
    flexDirection: 'row',
    alignSelf: 'center',
  },
});

export default LoginScreen;
