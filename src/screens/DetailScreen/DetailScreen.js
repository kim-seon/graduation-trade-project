import React, {useEffect, useState} from 'react';
import {
  View,
  ScrollView,
  Text,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import firestore from '@react-native-firebase/firestore';
import {firebase} from '@react-native-firebase/database';
import Ionicons from 'react-native-vector-icons/Ionicons';

const DetailScreen = ({navigation, route}) => {
  const [userInfo, setUserInfo] = useState([]);
  const [userPost, setUserPost] = useState([]);
  const [loading, setLoading] = useState(false);

  const reference = firebase
    .app()
    .database(
      'https://rntradebookproject-default-rtdb.asia-southeast1.firebasedatabase.app/',
    );

  useEffect(() => {
    setLoading(true);
    AsyncStorage.getItem('users').then(value => {
      const data = JSON.parse(value);
      setUserInfo(data);
      reference.ref(`/posts/${route.params.id}`).on('value', snapshot => {
        setLoading(false);
        const post = snapshot.val();
        setUserPost(post);
      });
    });
  }, [reference, route.params.id]);

  return (
    <View style={styles.container}>
      <View style={styles.bookImageContainer}>
        <Text>사진</Text>
      </View>
      <ScrollView style={styles.bookInfoContainer}>
        <Text style={styles.bookTitleText}>{userPost.bookTitle}</Text>
        <View style={{flexDirection: 'row'}}>
          <Text
            style={[styles.writerInfoText, {width: '15%', fontWeight: 'bold'}]}>
            저자
          </Text>
          <Text
            numberOfLines={2}
            style={[styles.writerInfoText, {width: '80%'}]}>
            {userPost.bookAuthor}
          </Text>
        </View>
        <View style={{flexDirection: 'row'}}>
          <Text
            style={[styles.writerInfoText, {width: '15%', fontWeight: 'bold'}]}>
            출판사
          </Text>
          <Text
            numberOfLines={2}
            style={[styles.writerInfoText, {width: '80%'}]}>
            {userPost.bookPublisher}
          </Text>
        </View>
        <View style={{flexDirection: 'row'}}>
          <Text
            style={[styles.writerInfoText, {width: '15%', fontWeight: 'bold'}]}>
            출판날짜
          </Text>
          <Text
            numberOfLines={2}
            style={[styles.writerInfoText, {width: '80%'}]}>
            {userPost.bookPubDate}
          </Text>
        </View>
        <View
          style={{
            borderBottomWidth: 1,
            borderBottomColor: '#393E46',
            margin: 5,
          }}
        />
        <View style={{flexDirection: 'row'}}>
          <Text style={styles.bookOrignPriceText}>{userPost.bookPrice}원</Text>
          <Text style={styles.bookPriceText}>{userPost.tradePrice}원</Text>
        </View>
        <View style={styles.bookStateInfoContainer}>
          <View style={styles.bookStateText}>
            <Text style={styles.detailText}>판매자 정보</Text>
            <Text style={styles.dscText}>
              {userPost.sellerSchool} | {userPost.seller}
            </Text>
          </View>
          <View style={styles.bookStateText}>
            <Text style={styles.detailText}>책 상태</Text>
            <Text style={styles.dscText}>{userPost.bookState}</Text>
          </View>
          <View style={styles.bookTradeText}>
            <Text style={styles.detailText}>선호거래방식</Text>
            <Text style={styles.dscText}>
              {userPost.tradeWay}
              {userPost.tradeDirect ? (
                <Text>({userPost.tradeDirect})</Text>
              ) : (
                ''
              )}
            </Text>
          </View>
        </View>
        <View style={styles.bookStateInfoContainer}>
          
          <View style={styles.bookTradeText}>
            <Text style={styles.detailText}>{userPost.bookDsc}</Text>
          </View>
        </View>
      </ScrollView>
      <View style={styles.functionContainer}>
        <TouchableOpacity style={styles.chatBtn}>
          <Text style={styles.chatBtnText}>채팅 보내기</Text>
        </TouchableOpacity>
        <View style={styles.emoticonContainer}>
          <Ionicons
            name="ios-heart-outline"
            size={35}
            color={'#a0a0a0'}
            style={{alignSelf: 'center'}}
          />
        </View>
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
  bookImageContainer: {
    height: '30%',
    backgroundColor: 'white',
  },
  bookInfoContainer: {
    width: '95%',
    alignSelf: 'center',
    margin: 5,
  },
  bookTitleText: {
    fontSize: 20,
    fontWeight: '600',
    color: '#393E46',
    margin: 5,
  },
  writerInfoText: {
    fontSize: 14,
    color: '#393E46',
    margin: 5,
  },
  bookOrignPriceText: {
    margin: 5,
    alignSelf: 'center',
    fontSize: 15,
    color: '#a0a0a0',
    textDecorationLine: 'line-through',
  },
  bookPriceText: {
    fontSize: 20,
    fontWeight: '700',
    color: '#21D380',
    margin: 5,
  },
  bookStateText: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderBottomWidth: 1,
    borderColor: '#21D380',
    padding: 8,
  },
  bookDscText: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderColor: '#21D380',
    padding: 10,
  },
  bookTradeText: {
    flexDirection: 'row',
    padding: 8,
    justifyContent: 'space-between',
  },
  detailText: {
    color: '#393E46',
    fontWeight: 'bold',
  },
  dscText: {
    fontSize: 15,
    color: '#393E46',
  },
  bookStateInfoContainer: {
    backgroundColor: 'white',
    margin: 5,
    borderRadius: 5,
    padding: 10,
  },
  functionContainer: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    flexDirection: 'row',
    padding: 20,
    justifyContent: 'space-between',
    backgroundColor: 'white',
  },
  chatBtn: {
    justifyContent: 'center',
    width: 120,
    height: 45,
    padding: 10,
    backgroundColor: '#21D380',
    borderRadius: 5,
  },
  chatBtnText: {
    alignSelf: 'center',
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  emoticonContainer: {
    flexDirection: 'row',
  },
});

export default DetailScreen;
