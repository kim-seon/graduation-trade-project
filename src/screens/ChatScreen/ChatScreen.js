import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  FlatList,
  TouchableOpacity,
  Image,
} from 'react-native';
import {firebase} from '@react-native-firebase/database';
import {useIsFocused, useNavigation} from '@react-navigation/native';
import Moment from 'moment';

export const ChatScreen = (data, {route}) => {
  const reference = firebase
    .app()
    .database(
      'https://rntradebookproject-default-rtdb.asia-southeast1.firebasedatabase.app/',
    );

  const isFocused = useIsFocused();
  const navigation = useNavigation();
  const [loading, setLoading] = useState(false);
  const [userInfo, setUserInfo] = useState({});
  const [postList, setPostList] = useState({});
  const [userDB, setUserDB] = useState({});

  let list = [];
  let userList = [];
  useEffect(() => {
    setLoading(true);
    setUserInfo(data.data);
    const currentDate = new Date();
    //console.log(userInfo);
    reference
      .ref('chats/')
      .child('')
      .on('value', snapshot => {
        setLoading(false);
        snapshot.forEach(item => {
          reference.ref(`posts/${item.key}`).on('value', child => {
            reference
              .ref(`chats/${item.key}`)
              .orderByChild('createdAt')
              .limitToFirst(1)
              .on('child_added', chat => {
                reference
                  .ref(`/users/${chat.val().user._id}`)
                  .once('value')
                  .then(info => {
                    const userData = info.val();
                    setUserDB(userData);
                    console.log(userDB);
                    setLoading(false);
                  });
              });
            reference
              .ref(`chats/${item.key}`)
              .orderByChild('user/_id')
              .equalTo(userInfo.uid + '')
              .on('value', shot => {
                reference
                  .ref(`chats/${item.key}`)
                  .orderByChild('createdAt')
                  .limitToLast(1)
                  .on('child_added', snap => {
                    list.push({
                      chatUserUid: userDB && userDB.id,
                      chatUser: userDB && userDB.nickname,
                      chatUserSchool: userDB && userDB.school,
                      bookTitle: child.val() && child.val().bookTitle,
                      seller: child.val() && child.val().seller,
                      sellerUid: child.val() && child.val().sellerUid,
                      sellerSchool: child.val() && child.val().sellerSchool,
                      stateImage: child.val() && child.val().stateImage[0],
                      uploadDate: child.val() && child.val().uploadDate,
                      message: snap.val() && snap.val().text,
                      date: snap.val() && snap.val().createdAt,
                    });
                    setPostList(list);
                    setLoading(false);
                  });
              });
          });
        });
      });
  }, [data.data, isFocused]);

  const renderPostList = ({item}) => {
    return (
      <TouchableOpacity
        onPress={() =>
          navigation.navigate('ChatRoom', {data: userInfo, book: item})
        }>
        <View style={styles.listView}>
          <View style={styles.listText}>
            <View style={styles.chatInfo}>
              {item.sellerUid === userInfo.uid ? (
                <>
                  <Text style={styles.chatNickname}>{item.chatUser}</Text>
                  <Text
                    style={{marginLeft: 10, fontSize: 13, color: '#393E46'}}>
                    {item.chatUserSchool}
                  </Text>
                  <Text style={{marginLeft: 5, fontSize: 13, color: '#393E46'}}>
                    | {Moment(item.date).format('YYYY/MM/DD HH:mm')}
                  </Text>
                </>
              ) : (
                <>
                  <Text style={styles.chatNickname}>{item.seller}</Text>
                  <Text
                    style={{marginLeft: 10, fontSize: 13, color: '#393E46'}}>
                    {item.sellerSchool}
                  </Text>
                  <Text style={{marginLeft: 5, fontSize: 13, color: '#393E46'}}>
                    | {Moment(item.date).format('YYYY/MM/DD HH:mm')}
                  </Text>
                </>
              )}
            </View>
            <Text
              numberOfLines={1}
              ellipsizeMode="tail"
              style={styles.chatBookTitle}>
              {item.bookTitle}
            </Text>
            <Text style={styles.chatPreview}>{item.message}</Text>
          </View>
          <View style={styles.listImage}>
            <Image
              source={{uri: item.stateImage}}
              resizeMode={'cover'}
              style={{height: 70, width: 50, borderRadius: 5}}
            />
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      {postList.length > 0 ? (
        <FlatList
          data={postList}
          listKey={(item, index) => 'D' + index.toString()}
          keyExtractor={(item, index) => 'D' + index.toString()}
          renderItem={renderPostList}
          disableVirtualization={false}
          onEndReachedThreshold={0.2}
        />
      ) : (
        <View>
          <Text style={styles.nullListText}>개설된 채팅방이 없어요 😅</Text>
        </View>
      )}
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
    justifyContent: 'space-between',
    margin: 5,
    padding: 15,
    backgroundColor: 'white',
    borderRadius: 5,
  },
  chatInfo: {
    flexDirection: 'row',
    display: 'flex',
    alignItems: 'center',
    marginBottom: 3,
  },
  chatNickname: {
    fontSize: 17,
    fontWeight: '600',
    color: '#21D380',
  },
  chatBookTitle: {
    fontSize: 13,
    marginBottom: 3,
    color: '#a0a0a0',
  },
  chatPreview: {
    fontSize: 16,
    color: '#393E46',
  },
  writerSchool: {
    color: '#FFD400',
  },
  nullListText: {
    justifyContent: 'center',
    alignSelf: 'center',
    margin: 15,
    padding: 10,
    fontSize: 16,
    color: '#393E46',
    borderRadius: 5,
    backgroundColor: 'white',
  },
});
