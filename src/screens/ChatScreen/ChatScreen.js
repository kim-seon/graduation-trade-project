import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  FlatList,
  TouchableOpacity,
} from 'react-native';
import {useIsFocused, useNavigation} from '@react-navigation/native';

export const ChatScreen = (data, {route}) => {
  const navigation = useNavigation();
  const [userInfo, setUserInfo] = useState([]);

  useEffect(() => {
    setUserInfo(data.data);
    console.log(JSON.stringify(userInfo));
  }, []);

  return (
    <View style={styles.container}>
      <TouchableOpacity
        onPress={() => navigation.navigate('ChatRoom', {data: userInfo})}>
        <View style={styles.listView}>
          <View style={styles.chatInfo}>
            <Text style={styles.chatNickname}>닉네임</Text>
            <Text style={styles.chatBookTitle}>책 제목 | 날짜</Text>
          </View>
          <Text style={styles.chatPreview}>최근 메시지 미리보기</Text>
        </View>
      </TouchableOpacity>
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
    margin: 10,
    padding: 15,
    backgroundColor: 'white',
    borderRadius: 5,
  },
  chatInfo: {
    flexDirection: 'row',
    display: 'flex',
    alignItems: 'center',
    marginBottom: 5,
  },
  chatNickname: {
    fontSize: 17,
    fontWeight: '600',
    color: '#21D380',
  },
  chatBookTitle: {
    marginLeft: 10,
    fontSize: 13,
  },
  chatPreview: {
    fontSize: 15,
    color: '#393E46',
  },
  writerSchool: {
    color: '#FFD400',
  },
});
