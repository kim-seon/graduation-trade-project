/* eslint-disable react-native/no-inline-styles */
import React, {useState, createRef} from 'react';
import {View, Text, StyleSheet, Pressable, Alert} from 'react-native';
import CustomInput from '../../components/CustomInput';
import CustomButton from '../../components/CustomButton';
import Ionicons from 'react-native-vector-icons/Ionicons';

import AsyncStorage from '@react-native-async-storage/async-storage';

const RegisterScreen = () => {
  const [userPassword, setUserPassword] = useState('');
  const [userConfPassword, setUseConfPassword] = useState('');
  const [userNickname, setUserNickname] = useState('');
  const [loading, setLoading] = useState(false);
  const [errortext, setErrortext] = useState('');
  const passwordInputRef = createRef();

  const onLoginPressed = () => {
    setErrortext('');
    if (!userPassword) {
      Alert.alert('비밀번호 입력은 필수입니다!');
    }
    setLoading(true);
    let data = {password: userPassword};
    let body = [];
  };

  const onRegisterPressed = () => {
    console.warn('onRegisterPressed');
  };
  return (
    <View style={styles.container}>
      <View style={styles.textContainer}>
        <View style={styles.registerTextContainer}>
          <Text style={styles.registerText}>트레이북</Text>
          <Text style={styles.registerTextDsc}>| 이어서 회원가입하기</Text>
        </View>
      </View>
      <CustomInput
        value={userNickname}
        setValue={setUserNickname}
        placeholder="닉네임"
      />
      <CustomInput
        value={userPassword}
        setValue={setUserPassword}
        placeholder="비밀번호"
        secureTextEntry
      />
      <CustomInput
        value={userConfPassword}
        setValue={setUseConfPassword}
        placeholder="비밀번호 확인"
        secureTextEntry
      />
      <CustomButton onPress={onLoginPressed} text="회 원 가 입" />
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
  registerTextContainer: {
    flexDirection: 'row',
    display: 'flex',
    alignItems: 'flex-end',
    marginTop: 5,
    marginBottom: 30,
  },
  registerTextDsc: {
    fontSize: 18,
    color: '#21D380',
  },
  registerText: {
    fontSize: 24,
    fontWeight: '600',
    marginTop: 5,
    marginRight: 10,
    padding: 5,
    color: '#F2F2F2',
    borderRadius: 5,
    backgroundColor: '#21D380',
    alignSelf: 'flex-start',
  },
  registerContainer: {
    flexDirection: 'row',
    alignSelf: 'center',
  },
});

export default RegisterScreen;
