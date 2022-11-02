import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  FlatList,
  TouchableOpacity,
  BackHandler,
} from 'react-native';
import {FAB} from 'react-native-paper';
import {firebase, orderByChild} from '@react-native-firebase/database';
import auth from '@react-native-firebase/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useIsFocused, useNavigation} from '@react-navigation/native';
import Loding from '../../components/Loading';

export const HomeScreen = (data, {route}) => {
  const navigation = useNavigation();
  const reference = firebase
    .app()
    .database(
      'https://rntradebookproject-default-rtdb.asia-southeast1.firebasedatabase.app/',
    );

  const [userInfo, setUserInfo] = useState([]);
  const [userDB, setUserDB] = useState([]);
  const [loading, setLoading] = useState(false);
  const [postList, setPostList] = useState({});
  const [dateList, setDateList] = useState({});

  const isFocused = useIsFocused();

  let list = [];
  useEffect(() => {
    setUserInfo(data.data);
    setLoading(true);
    // auth().onAuthStateChanged(user => {
    //   setUserInfo(user);
    // });
    reference
      .ref('/posts/')
      .orderByChild('uploadDate')
      .on('value', snapshot => {
        //console.log(snapshot.val());
        for (var i in snapshot.val()) {
          list.push({
            ...list,
            bookTitle: snapshot.val()[i].bookTitle,
            bookAuthor: snapshot.val()[i].bookAuthor,
            bookPublisher: snapshot.val()[i].bookPublisher,
            sellerSchool: snapshot.val()[i].sellerSchool,
            seller: snapshot.val()[i].seller,
            date: snapshot.val()[i].date,
            tradePrice: snapshot.val()[i].tradePrice,
            uploadDate: snapshot.val()[i].uploadDate,
          });
          setPostList(list);
          setLoading(false);
        }
      });
  }, [isFocused, userInfo]);

  const renderPostList = ({item}) => {
    return (
      <TouchableOpacity
        onPress={() =>
          navigation.navigate('Detail', {
            post: item,
            loginUser: userInfo,
          })
        }>
        <View style={styles.listView}>
          <Text numberOfLines={1} ellipsizeMode="tail" style={styles.bookTitle}>
            {item.bookTitle}
          </Text>
          <Text numberOfLines={1} ellipsizeMode="tail" style={styles.bookAP}>
            {item.bookAuthor}
          </Text>
          <Text style={styles.bookAP}>{item.bookPublisher}</Text>
          <Text style={styles.writerInfo}>
            <Text style={styles.writerSchool}>{item.sellerSchool}</Text> |
            {item.seller} | {item.date}
          </Text>
          <Text style={styles.price}>{item.tradePrice}원</Text>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={postList}
        listKey={(item, index) => 'D' + index.toString()}
        keyExtractor={(item, index) => 'D' + index.toString()}
        renderItem={renderPostList}
        disableVirtualization={false}
        onEndReachedThreshold={0.2}
      />
      <FAB
        icon="plus"
        style={styles.fab}
        small
        label="책팔기"
        onPress={() => navigation.navigate('Write', {data: userInfo})}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: '100%',
    backgroundColor: '#F2F2F2',
  },
  listView: {
    height: 130,
    margin: 5,
    padding: 15,
    backgroundColor: 'white',
    borderRadius: 5,
    justifyContent: 'center',
  },
  bookTitle: {
    fontSize: 17,
    fontWeight: '600',
    color: '#393E46',
  },
  bookAP: {
    color: '#393E46',
  },
  writerSchool: {
    color: '#FFD400',
  },
  price: {
    fontSize: 17,
    fontWeight: '700',
    color: '#21D380',
  },
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
    backgroundColor: '#21D380',
  },
});
