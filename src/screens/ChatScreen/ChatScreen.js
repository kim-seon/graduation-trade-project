import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  FlatList,
  TouchableOpacity,
} from 'react-native';
import {firebase} from '@react-native-firebase/database';
import {useIsFocused, useNavigation} from '@react-navigation/native';

export const ChatScreen = (data, {route}) => {
  const reference = firebase
    .app()
    .database(
      'https://rntradebookproject-default-rtdb.asia-southeast1.firebasedatabase.app/',
    );

  const navigation = useNavigation();
  const [loading, setLoading] = useState(false);
  const [userInfo, setUserInfo] = useState({});
  const [postList, setPostList] = useState({});

  let list = [];
  useEffect(() => {
    setLoading(true);
    setUserInfo(data.data);
    //console.log(userInfo);
    reference
      .ref('chats/')
      .child('')
      .on('value', snapshot => {
        snapshot.forEach(item => {
          reference.ref(`posts/${item.key}`).on('value', child => {
            list.push({
              bookTitle: child.val().bookTitle,
              seller: child.val().seller,
              sellerSchool: child.val().sellerSchool,
            });
            setPostList(list);
          });
        });
      });
  }, []);

  const renderPostList = ({item}) => {
    return (
      <TouchableOpacity
        onPress={() => navigation.navigate('ChatRoom', {data: userInfo})}>
        <View style={styles.listView}>
          <View style={styles.chatInfo}>
            <Text style={styles.chatNickname}>{item.seller}</Text>
            <Text style={{marginLeft: 10, fontSize: 13, color: '#393E46'}}>
              ({item.sellerSchool})
            </Text>
            <Text style={{marginLeft: 5, fontSize: 13, color: '#393E46'}}>
              | 날짜
            </Text>
          </View>
          <Text
            numberOfLines={1}
            ellipsizeMode="tail"
            style={styles.chatBookTitle}>
            {item.bookTitle}
          </Text>
          <Text style={styles.chatPreview}>최근 메시지 미리보기</Text>
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
    fontSize: 15,
    color: '#393E46',
  },
  writerSchool: {
    color: '#FFD400',
  },
});
