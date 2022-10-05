/* eslint-disable react-native/no-inline-styles */
import React, {useState, createRef} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  Alert,
  TouchableOpacity,
} from 'react-native';
import CustomInput from '../../components/CustomInput';
import CustomButton from '../../components/CustomButton';
import Ionicons from 'react-native-vector-icons/Ionicons';
import auth, {sendEmailVerification} from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';

import {signIn, signUp} from '../../lib/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const userCollection = firestore().collection('users');

const RegisterScreen = () => {
  const [userEmail, setUserEmail] = useState('');
  const [userPassword, setUserPassword] = useState('');
  const [userConfPassword, setUseConfPassword] = useState('');
  const [userNickname, setUserNickname] = useState('');
  const [loading, setLoading] = useState(false);
  const [errortext, setErrortext] = useState('');
  const passwordInputRef = createRef();

  const onRegisterPressed = () => {
    //const info = {userEmail, userPassword};
    if (userEmail === '') {
      return Alert.alert('이메일 입력');
    } else if (userPassword === '') {
      return Alert.alert('비밀번호 입력');
    }
    auth()
      .createUserWithEmailAndPassword(userEmail, userPassword)
      .then(userCredentials => {
        console.log(userCredentials.user);
        userCredentials.user
          .sendEmailVerification()
          .then(() => {
            Alert.alert('이메일을 확인해주세요.');
            setLoading(true);
            let emailVerificationEventListener = setInterval(() => {
              auth().currentUser.reload();
              if (auth().currentUser.emailVerified) {
                clearInterval(emailVerificationEventListener);
                setLoading(false);
                auth()
                  .currentUser.updateProfile({
                    displayName: userNickname,
                  })
                  .then(() => {
                    userCollection.add({
                      id: userCredentials.user.uid,
                      email: userCredentials.user.email,
                      nickname: auth().currentUser.displayName,
                    });
                  })
                  .catch(function (err) {
                    console.log(err);
                  });
              }
            }, 1000);
          })
          .catch(function (err) {
            console.log(err);
          });
      })
      .catch(function (err) {
        console.log(err);
      });
  };
  return (
    <View style={styles.container}>
      <View style={styles.textContainer}>
        <View style={styles.registerTextContainer}>
          <Text style={styles.registerText}>트레이북</Text>
          <Text style={styles.registerTextDsc}>| 회원가입</Text>
        </View>
      </View>
      <View style={styles.emailAuthContainer}>
        <CustomInput
          value={userEmail}
          setValue={setUserEmail}
          placeholder="대학교 이메일 주소를 입력해주세요!"
        />
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
      <CustomButton onPress={onRegisterPressed} text="회 원 가 입" />
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
  emailAuthContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
});

export default RegisterScreen;
