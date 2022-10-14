import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Image,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';

export const MyPageScreen = ({navigation}) => {
  const [userInfo, setUserInfo] = useState([]);
  const [userDB, setUserDB] = useState([]);
  const onLogoutPress = () => {
    AsyncStorage.removeItem('users');
    auth()
      .signOut()
      .then(() => {
        navigation.navigate('MainStack', {screen: 'Main'});
      })
      .catch(function (err) {
        console.log(err);
      });
  };

  const userCollection = firestore().collection('users');

  useEffect(() => {
    AsyncStorage.getItem('users').then(value => {
      const data = JSON.parse(value);
      setUserInfo(data);
      userCollection
        .doc(data.uid)
        .get()
        .then(res => {
          setUserDB(res._data);
        });
    });
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.myInfo}>
        <Image
          source={require('../../assets/image/avatar.png')}
          resizeMode={'cover'}
          style={{
            width: 80,
            height: 80,
            margin: 5,
          }}
        />
        <Text style={styles.myNickname}>{userInfo.displayName}</Text>
        <Text style={styles.mySchoolName}>{userDB.school}</Text>
      </View>
      <View style={styles.sellBookContainer}>
        <TouchableOpacity>
          <Text style={styles.listText}>> 판매하는 책 목록</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.likeBookContainer}>
        <TouchableOpacity>
          <Text style={styles.listText}>> 관심가는 책 목록</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.logoutBtnContainer}>
        <TouchableOpacity style={styles.logoutBtn} onPress={onLogoutPress}>
          <Text style={styles.logoutBtnText}>로그아웃</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: '100%',
    backgroundColor: '#F2F2F2',
  },
  myInfo: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  myNickname: {
    fontSize: 20,
    fontWeight: '600',
    color: '#21D380',
    marginBottom: 5,
  },
  mySchoolName: {
    fontSize: 12,
    fontWeight: '600',
    backgroundColor: '#FFD400',
    color: '#F2F2F2',
    borderRadius: 30,
    padding: 5,
  },
  sellBookContainer: {
    margin: 10,
    padding: 25,
    backgroundColor: 'white',
    borderRadius: 5,
  },
  likeBookContainer: {
    margin: 10,
    padding: 25,
    backgroundColor: 'white',
    borderRadius: 5,
  },
  listText: {
    color: '#393E46',
    fontSize: 16,
  },
  logoutBtnContainer: {
    alignSelf: 'center',
    width: '100%',
  },
  logoutBtn: {
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderTopColor: '#D94844',
    borderBottomColor: '#D94844',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 10,
    margin: 10,
  },
  logoutBtnText: {
    fontSize: 16,
    color: '#D94844',
  },
});
