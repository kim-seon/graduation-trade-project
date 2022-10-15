import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  FlatList,
  TouchableOpacity,
} from 'react-native';
import {FAB} from 'react-native-paper';

import AsyncStorage from '@react-native-async-storage/async-storage';

export const HomeScreen = ({navigation, route}) => {
  const [userInfo, setUserInfo] = useState([]);
  AsyncStorage.getItem('users').then(value => {
    const data = JSON.parse(value);
    setUserInfo(data);
  });
  return (
    <View style={styles.container}>
      <View style={styles.listView}>
        <Text style={styles.bookTitle}>책 제목</Text>
        <Text style={styles.bookAP}>저자 | 출판사</Text>
        <Text style={styles.writerInfo}>
          <Text style={styles.writerSchool}>학교이름</Text> | 닉네임 | 업로드
          날짜
        </Text>
        <Text style={styles.price}>20,000원</Text>
      </View>
      <FAB
        icon="plus"
        style={styles.fab}
        small
        label="책팔기"
        onPress={() => navigation.navigate('Write')}
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
    margin: 10,
    padding: 15,
    backgroundColor: 'white',
    borderRadius: 5,
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
