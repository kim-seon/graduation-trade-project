import React, {useState} from 'react';
import {
  View,
  StyleSheet,
  Text,
  Pressable,
  TouchableOpacity,
  FlatList,
} from 'react-native';
import {firebase} from '@react-native-firebase/database';

const ChatStateMenu = ({postData}) => {
  const reference = firebase
    .app()
    .database(
      'https://rntradebookproject-default-rtdb.asia-southeast1.firebasedatabase.app/',
    );

  let menuList = [
    {
      id: 0,
      menu: '예약중',
    },
    {
      id: 1,
      menu: '거래완료',
    },
  ];

  const onMenuPress = item => {
    switch (item) {
      case 0:
        reference.ref(`/posts/${postData.uploadDate}`).update({
          sellState: 'reserve',
          reserveUser: postData.chatUserUid,
        });
        break;
      case 1:
        reference.ref(`/posts/${postData.uploadDate}`).update({
          sellState: 'done',
          doneUser: postData.chatUserUid,
        });
        break;
    }
  };

  const renderMenu = ({item}) => {
    return (
      <View style={styles.menuContainer}>
        <TouchableOpacity onPress={() => onMenuPress(item.id)}>
          <Text style={styles.menuText}>{item.menu}</Text>
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={menuList}
        horizontal
        listKey={(item, index) => 'D' + index.toString()}
        keyExtractor={(item, index) => 'D' + index.toString()}
        renderItem={renderMenu}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    zIndex: 1,
    position: 'absolute',
    width: 125,
    right: 5,
    top: 20,
  },
  menuContainer: {
    padding: 8,
    backgroundColor: '#F2F2F2',
    borderBottomWidth: 1,
    borderBottomColor: '#21D380',
  },
  menuText: {
    color: '#393E46',
    textAlign: 'center',
  },
});

export default ChatStateMenu;
