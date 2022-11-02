import React, {useEffect, useState, useLayoutEffect} from 'react';
import {
  View,
  ScrollView,
  Dimensions,
  FlatList,
  Text,
  StyleSheet,
  TouchableOpacity,
  BackHandler,
  LogBox,
  Image,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import {firebase} from '@react-native-firebase/database';
import {useIsFocused, useNavigation} from '@react-navigation/native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {SliderBox} from 'react-native-image-slider-box';

const {width} = Dimensions.get('window');
const height = (width * 100) / 80;

const DetailScreen = ({route}) => {
  const [userInfo, setUserInfo] = useState({});
  const [userPost, setUserPost] = useState({});
  const [likeUser, setLikeUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [heartPress, setHeartPress] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);

  const isFocused = useIsFocused();
  const navigation = useNavigation();

  const handlePressBack = () => {
    if (navigation.canGoBack()) {
      navigation.navigate('Tab', {screen: '홈'});
      return true;
    }
    return false;
  };

  const reference = firebase
    .app()
    .database(
      'https://rntradebookproject-default-rtdb.asia-southeast1.firebasedatabase.app/',
    );

  useLayoutEffect(() => {
    setLoading(true);
    console.log(height);
    LogBox.ignoreLogs([
      'Non-serializable values were found in the navigation state',
    ]);
    //console.log(route.params.id.stateImage);
    setUserInfo(route.params.loginUser);
    reference
      .ref(
        `/posts/${
          (route.params.id && route.params.id.uploadDate) ||
          (route.params.post && route.params.post.uploadDate)
        }`,
      )
      .on('value', snapshot => {
        const post = snapshot.val();
        setUserPost(post);
        console.log(userPost.stateImage);
        const likesDate = () => {
          reference
            .ref(`/posts/${userPost.uploadDate}/likes/`)
            .orderByChild('userEmail')
            .equalTo(userInfo.email + '')
            .on('value', async value => {
              const likesVal = await value.val();
              //console.log(likesVal);
              if (likesVal !== null) {
                setHeartPress(true);
              } else {
                setHeartPress(false);
              }
              setLoading(false);
            });
          return likeUser;
        };
        likesDate();
      });
    BackHandler.addEventListener('hardwareBackPress', handlePressBack);
    return () => {
      setLoading(false);
      BackHandler.removeEventListener('hardwareBackPress', handlePressBack);
    };
  }, []);

  const onChatPress = () => {
    navigation.navigate('ChatRoom', {sendInfo: userPost, userInfo: userInfo});
  };

  const onHeartPress = async () => {
    setHeartPress(!heartPress);

    const increment = firebase.database.ServerValue.increment(1);
    const decrement = firebase.database.ServerValue.increment(-1);

    if (heartPress === false) {
      await reference
        .ref(`/posts/${userPost.uploadDate}/`)
        .update({
          like_cnt: increment,
        })
        .then(() => {
          reference
            .ref(`/posts/${userPost.uploadDate}/likes/${userInfo.uid}`)
            .update({
              userEmail: userInfo.email,
              userNickname: userInfo.displayName,
            })
            .then(() => {
              reference
                .ref(`users/${userInfo.uid}/likes/${userPost.uploadDate}`)
                .update({
                  sellerUid: userPost.sellerUid,
                  sellerNickname: userPost.seller,
                });
            })
            .catch(err => console.log(err));
        });
    } else {
      await reference
        .ref(`/posts/${userPost.uploadDate}/`)
        .update({
          like_cnt: decrement,
        })
        .then(() => {
          reference
            .ref(`/posts/${userPost.uploadDate}/likes/`)
            .child(userInfo.uid)
            .remove()
            .then(() => {
              reference
                .ref(`users/${userInfo.uid}/likes/${userPost.uploadDate}`)
                .remove();
            })
            .catch(err => console.log(err));
        });
    }
  };

  const renderImage = ({item, index}) => {
    return (
      <Image
        key={index}
        source={{
          uri: item,
        }}
        style={{width: width, height: height, resizeMode:'cover'}}
      />
    );
  };

  const changeActive = ({nativeEvent}) => {
    const slide = Math.ceil(
      nativeEvent.contentOffset.x / nativeEvent.layoutMeasurement.width,
    );
    if (slide !== activeIndex) {
      setActiveIndex(slide);
      console.log(activeIndex);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.bookImageContainer}>
        <FlatList
          data={userPost.stateImage}
          listKey={(item, index) => 'D' + index.toString()}
          keyExtractor={(item, index) => item + index}
          renderItem={renderImage}
          onScroll={changeActive}
          horizontal
          pagingEnabled={true}
          showsHorizontalScrollIndicator={false}
        />
        <View style={styles.pagination}>
          {userPost.stateImage?.map((item, index) => {
            return (
              <Text
                key={index}
                style={
                  index === activeIndex
                    ? styles.pagingActiveText
                    : styles.pagingText
                }>
                ●
              </Text>
            );
          })}
        </View>
      </View>
      <View style={styles.bookInfoContainer}>
        <ScrollView style={{flexGrow:1}}>
          <Text style={styles.bookTitleText}>{userPost.bookTitle}</Text>
          <View style={{flexDirection: 'row'}}>
            <Text
              style={[
                styles.writerInfoText,
                {width: '15%', fontWeight: 'bold'},
              ]}>
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
              style={[
                styles.writerInfoText,
                {width: '15%', fontWeight: 'bold'},
              ]}>
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
              style={[
                styles.writerInfoText,
                {width: '15%', fontWeight: 'bold'},
              ]}>
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
            <Text style={styles.bookOrignPriceText}>
              {userPost.bookPrice}원
            </Text>
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
            <View style={{padding: 8}}>
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                }}>
                <Text>업로드</Text>
                <Text>{userPost.date}</Text>
              </View>
              <Text style={[styles.detailText, {marginTop: 10}]}>
                {userPost.bookDsc}
              </Text>
            </View>
          </View>
        </ScrollView>
      </View>
      <View style={styles.functionContainer}>
        {(userInfo && userInfo.uid) !== userPost.sellerUid ? (
          <TouchableOpacity style={styles.chatBtn} onPress={() => onChatPress}>
            <Text style={styles.chatBtnText}>채팅 보내기</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity style={styles.chatBtn}>
            <Text style={styles.chatBtnText}>내 채팅방</Text>
          </TouchableOpacity>
        )}
        <View style={styles.emoticonContainer}>
          <TouchableOpacity onPress={onHeartPress}>
            {heartPress === true ? (
              <Ionicons
                name="ios-heart-sharp"
                size={35}
                color={'#FFD400'}
                style={{alignSelf: 'center', marginRight: 10}}
              />
            ) : (
              <Ionicons
                name="ios-heart-outline"
                size={35}
                color={'#a0a0a0'}
                style={{alignSelf: 'center', marginRight: 10}}
              />
            )}
          </TouchableOpacity>
          <TouchableOpacity>
            <Ionicons
              name="ios-share-social"
              size={30}
              color={'#a0a0a0'}
              style={{alignSelf: 'center'}}
            />
          </TouchableOpacity>
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
    flex: 1,
    width: width,
    height: height,
  },
  pagination: {
    flexDirection: 'row',
    position: 'absolute',
    bottom: 0,
    alignSelf: 'center',
  },
  pagingText: {
    fontSize: 10,
    color: '#a0a0a0',
    margin: 3,
  },
  pagingActiveText: {
    fontSize: 10,
    color: 'white',
    margin: 3,
  },
  bookInfoContainer: {
    height: '50%',
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
    padding: 6,
  },
  bookDscText: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderColor: '#21D380',
    padding: 10,
  },
  bookTradeText: {
    flexDirection: 'row',
    padding: 6,
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
    height: '10%',
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
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
