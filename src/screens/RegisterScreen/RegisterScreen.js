/* eslint-disable react-native/no-inline-styles */
import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Pressable,
  Alert,
  TouchableOpacity,
  Keyboard,
} from 'react-native';
import CustomInput from '../../components/CustomInput';
import CustomButton from '../../components/CustomButton';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';

import SearchableDropdown from 'react-native-searchable-dropdown';
import AsyncStorage from '@react-native-async-storage/async-storage';

import searchResult from '../../components/SearchSchoolList';

export const userCollection = firestore().collection('users');

const RegisterScreen = ({navigation}) => {
  const [userEmail, setUserEmail] = useState('');
  const [userPassword, setUserPassword] = useState('');
  const [userConfPassword, setUseConfPassword] = useState('');
  const [userNickname, setUserNickname] = useState('');
  const [userSchool, setUserSchool] = useState('');
  const [userDB, setUserDB] = useState([]);
  const [loading, setLoading] = useState(false);
  const [errortext, setErrortext] = useState('');

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
            Alert.alert(
              '이메일을 확인해주세요.\n이메일을 인증한 후 OK를 클릭해주세요.',
            );
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
                    userCollection.doc(userCredentials.user.uid).set({
                      id: userCredentials.user.uid,
                      email: userCredentials.user.email,
                      nickname: auth().currentUser.displayName,
                      school: userSchool,
                    });
                    userCollection
                      .doc(userCredentials.user.uid + '')
                      .get()
                      .then(doc => {
                        console.log(doc._data);
                        setUserDB(doc._data);
                      });
                    AsyncStorage.setItem(
                      'users',
                      JSON.stringify(userDB),
                      () => {
                        console.log('저장 완료');
                      },
                    );
                    navigation.navigate('Login');
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
      <SearchableDropdown
        onTextChange={text => console.log(text)}
        onItemSelect={item => {
          setUserSchool(item.name);
        }}
        items={searchResult}
        placeholder={userSchool ? userSchool : '대학교 이름을 검색해주세요!'}
        placeholderTextColor={userSchool ? '#393E46' : '#06de96'}
        textInputStyle={styles.customInput}
        itemStyle={styles.customList}
        itemsContainerStyle={{
          maxHeight: 160,
          margin: 40,
          marginTop: -18,
        }}
        itemTextStyle={{color: '#393E46'}}
        underlineColorAndroid="transparent"
      />
      <CustomInput
        value={userEmail}
        setValue={setUserEmail}
        placeholder="대학교 이메일 주소를 입력해주세요!"
      />
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
  avatar: {
    width: 80,
    height: 80,
    alignSelf: 'center',
    backgroundColor: '#a0a0a0',
    borderRadius: 50,
    marginBottom: 18,
  },
  customInput: {
    fontSize: 15,
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
  customList: {
    padding: 10,
    borderColor: '#21D380',
    borderBottomWidth: 1,
    backgroundColor: '#ddd',
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
