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
import {useIsFocused, useNavigation} from '@react-navigation/native';

const UpdateMenu = ({postData, userData, data}) => {
  const navigation = useNavigation();

  const reference = firebase
    .app()
    .database(
      'https://rntradebookproject-default-rtdb.asia-southeast1.firebasedatabase.app/',
    );

  let menuList = [
    {
      id: 0,
      menu: '게시글 수정',
    },
    {
      id: 1,
      menu: '판매중',
    },
    {
      id: 2,
      menu: '예약중',
    },
    {
      id: 3,
      menu: '거래완료',
    },
    {
      id: 4,
      menu: '게시글 삭제',
    },
  ];

  const onMenuPress = item => {
    switch (item) {
      case 0:
        navigation.navigate('Write', {updateData: data, data: userData});
        break;
      case 1:
        reference.ref(`/posts/${postData}`).update({
          sellState: 'sell',
        });
        break;
      case 2:
        reference.ref(`/posts/${postData}`).update({
          sellState: 'reserve',
        });
        break;
      case 3:
        reference.ref(`/posts/${postData}`).update({
          sellState: 'done',
        });
        break;
      case 4:
        reference
          .ref(`/posts/${postData}`)
          .remove()
          .then(() => {
            console.log('삭제 완료');
            reference.ref(`users/${userData.uid}/likes/${postData}`).remove();
            navigation.navigate('Tab', {screen: '마이페이지'});
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
        listKey={(item, index) => 'D' + index.toString()}
        keyExtractor={(item, index) => 'D' + index.toString()}
        renderItem={renderMenu}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    width: 100,
    right: 10,
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

export default UpdateMenu;
