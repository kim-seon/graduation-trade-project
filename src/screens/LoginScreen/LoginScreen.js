/* eslint-disable react-native/no-inline-styles */
import React, {useState, createRef} from 'react';
import {View, Text, StyleSheet, Pressable, Alert} from 'react-native';
import CustomInput from '../../components/CustomInput';
import CustomButton from '../../components/CustomButton';
import Ionicons from 'react-native-vector-icons/Ionicons';
import auth from '@react-native-firebase/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';

const LoginScreen = ({navigation}) => {
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
    auth()
      .signInWithEmailAndPassword(userEmail, userPassword)
      .then(userCredentials => {
        AsyncStorage.setItem(
          'user',
          JSON.stringify(userCredentials.user),
          () => {
            console.log('저장 완료');
          },
        ).catch(function (err) {
          console.log(err);
        });
        navigation.navigate('Tab');
      });
  };

  return (
    <View style={styles.container}>
      <View style={styles.textContainer}>
        <View style={{marginBottom: 15}}>
          <Ionicons name="md-lock-closed" size={35} color={'#21D380'} />
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
  loginTextContainer: {
    flexDirection: 'row',
    display: 'flex',
    alignItems: 'flex-end',
    marginTop: 5,
    marginBottom: 30,
  },
  loginTextDsc: {
    fontSize: 18,
    color: '#21D380',
  },
  loginText: {
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
});

export default LoginScreen;
