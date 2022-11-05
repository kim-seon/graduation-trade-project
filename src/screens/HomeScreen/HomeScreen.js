import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  FlatList,
  TouchableOpacity,
  BackHandler,
  Image,
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
        setLoading(false);
        for (var i in snapshot.val()) {
          list.push({
            ...list,
            stateImage: snapshot.val()[i].stateImage[0],
            bookTitle: snapshot.val()[i].bookTitle,
            bookAuthor: snapshot.val()[i].bookAuthor,
            bookPublisher: snapshot.val()[i].bookPublisher,
            sellerSchool: snapshot.val()[i].sellerSchool,
            seller: snapshot.val()[i].seller,
            sellState: snapshot.val()[i].sellState,
            date: snapshot.val()[i].date,
            tradePrice: snapshot.val()[i].tradePrice,
            uploadDate: snapshot.val()[i].uploadDate,
          });
          setPostList(list);
        }
        return () => setLoading(false);
      });
  }, [isFocused, userInfo]);

  const SellState = ({item}) => {
    if (item && item.sellState === 'sell') {
      return <Text style={styles.sellStateText}>판매중</Text>;
    } else if (item && item.sellState === 'reserve') {
      return <Text style={styles.sellStateText}>예약중</Text>;
    } else if (item && item.sellState === 'done') {
      return <Text style={styles.sellStateText}>판매완료</Text>;
    } else return null;
  };

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
          <View style={styles.bookImage}>
            <Image
              source={{uri: item.stateImage}}
              resizeMode={'cover'}
              style={{height: 100, width: 70, borderRadius: 5}}
            />
          </View>
          <View style={styles.bookDsc}>
            <Text
              numberOfLines={1}
              ellipsizeMode="tail"
              style={styles.bookTitle}>
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
            <View style={{flexDirection: 'row', marginTop: 3}}>
              <SellState item={item} />
              <Text style={styles.price}> {item.tradePrice}원</Text>
            </View>
          </View>
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
    flexDirection: 'row',
    alignItems: 'center',
    height: 130,
    margin: 5,
    padding: 15,
    backgroundColor: 'white',
    borderRadius: 5,
  },
  bookImage: {
    width: '20%',
  },
  bookDsc: {
    width: '80%',
    margin: 10,
  },
  bookTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#393E46',
  },
  writerInfo: {
    fontSize: 13,
  },
  bookAP: {
    fontSize: 13,
    color: '#393E46',
  },
  writerSchool: {
    color: '#FFD400',
  },
  sellStateText: {
    padding: 3,
    backgroundColor: '#21D380',
    alignSelf: 'center',
    fontWeight: 'bold',
    fontSize: 12,
    color: 'white',
    borderRadius: 5,
  },
  price: {
    fontSize: 16,
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
