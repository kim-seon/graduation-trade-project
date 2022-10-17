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
import {useIsFocused, useNavigation} from '@react-navigation/native';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
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
  const [userDB, setUserDB] = useState([]);
  const [loading, setLoading] = useState(false);

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
  useEffect(() => {
    setUserInfo(data.data);
    const getData = () => {
      try {
        auth().onAuthStateChanged(user => {
          reference
            .ref(`/users/${user.uid}`)
            .once('value')
            .then(snapshot => {
              const userData = snapshot.val();
              setUserDB(userData);
              reference
                .ref('/posts/')
                .orderByChild('sellerUid')
                .equalTo(userDB.id)
                .on('value', value => {
                  for (var i in value.val()) {
                    list.push(value.val()[i]);
                    setUserPosts(list);
                  }
                });
            });
        });
      } catch (err) {
        console.log(err);
      }
    };
    getData();
  }, []);

  const renderPostList = ({item}) => {
    return (
      <TouchableOpacity
        onPress={() =>
          navigation.navigate('Detail', {postNum: item.uploadDate})
        }>
        <View style={styles.listView}>
          <Text numberOfLines={1} ellipsizeMode="tail" style={styles.bookTitle}>
            {item.bookTitle}
          </Text>
          <Text numberOfLines={1} ellipsizeMode="tail" style={styles.bookAP}>
            {item.bookAuthor}
          </Text>
          <Text style={styles.bookAP}>{item.bookPublisher}</Text>
          <Text style={{fontSize: 12}}>{item.date}</Text>
          <Text style={styles.price}>{item.tradePrice}원</Text>
        </View>
      </TouchableOpacity>
    );
  };

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
        <View>
          <FlatList
            data={userPosts}
            listKey={(item, index) => 'D' + index.toString()}
            keyExtractor={(item, index) => 'D' + index.toString()}
            renderItem={renderPostList}
            disableVirtualization={false}
            onEndReachedThreshold={0.2}
          />
        </View>
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
  listView: {
    height: 130,
    margin: 5,
    borderTopWidth: 1,
    borderTopColor: '#21D380',
    justifyContent: 'center',
  },
  bookTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: '#393E46',
  },
  bookAP: {
    fontSize: 12,
    color: '#393E46',
  },
  price: {
    fontSize: 15,
    fontWeight: '700',
    color: '#21D380',
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
