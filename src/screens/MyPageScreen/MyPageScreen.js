import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Image,
  ScrollView,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useIsFocused, useNavigation} from '@react-navigation/native';
import auth from '@react-native-firebase/auth';
import {firebase} from '@react-native-firebase/database';

export const MyPageScreen = (data, {route}) => {
  const navigation = useNavigation();
  const reference = firebase
    .app()
    .database(
      'https://rntradebookproject-default-rtdb.asia-southeast1.firebasedatabase.app/',
    );

  const [userInfo, setUserInfo] = useState([]);
  const [userPosts, setUserPosts] = useState({});
  const [userLikePosts, setUserLikePosts] = useState({});
  const [userDB, setUserDB] = useState([]);
  const [loading, setLoading] = useState(false);

  const isFocused = useIsFocused();

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

  let list = [];
  let likeList = [];
  useEffect(() => {
    setLoading(true);
    setUserInfo(data.data);
    reference
      .ref(`/users/${userInfo.uid}`)
      .once('value')
      .then(snapshot => {
        const userData = snapshot.val();
        setUserDB(userData);
        setLoading(false);
        reference
          .ref('/posts/')
          .orderByChild('sellerUid')
          .equalTo(userData && userData.id + '')
          .on('value', value => {
            for (var i in value.val()) {
              list.push(value.val()[i]);
              setUserPosts(list);
              setLoading(false);
            }
          });
        reference
          .ref(`users/${userInfo.uid}`)
          .child('likes')
          .on('value', snap => {
            snap.forEach(item => {
              reference.ref(`posts/${item.key}`).on('value', val => {
                likeList.push(val.val());
                setUserLikePosts(likeList);
                setLoading(false);
              });
            });
          });
      })
      .catch(err => {
        console.log(err);
      });
  }, [userInfo]);

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
        <Text style={styles.mySchoolName}>{userDB && userDB.school}</Text>
      </View>
      <View style={styles.sellBookContainer}>
        <TouchableOpacity
          onPress={() =>
            navigation.navigate('SellBookList', {
              userInfo: data.data,
              posts: userPosts,
            })
          }>
          <Text style={styles.listText}>> 판매하는 책 목록</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.likeBookContainer}>
        <TouchableOpacity
          onPress={() =>
            navigation.navigate('LikePostsList', {
              userInfo: data.data,
              posts: userLikePosts,
            })
          }>
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
