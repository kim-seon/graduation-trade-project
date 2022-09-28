import React from 'react';
import {View, Text, StyleSheet, FlatList, TouchableOpacity} from 'react-native';

export const MyPageScreen = () => {
  return (
    <View style={styles.container}>
      <View style={styles.myInfo}>
        <Text>프로필 사진</Text>
        <Text style={styles.myNickname}>닉네임</Text>
        <Text style={styles.mySchoolName}>강남대학교</Text>
      </View>
      <View style={styles.sellBookContainer}>
        <Text style={styles.listText}>> 판매하는 책 목록</Text>
      </View>
      <View style={styles.likeBookContainer}>
        <Text style={styles.listText}>> 관심 가는 책 목록</Text>
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
    fontSize: 15,
    color: '#FFD400',
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
    fontSize: 18,
  },
});
