import React, {useState, createRef} from 'react';
import {View, Text, StyleSheet, Pressable, Alert} from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

const MainScreen = ({navigation}) => {
  return (
    <View style={styles.container}>
      <View>
        <Text style={styles.mainDscText}>대학생 책 중고거래 앱</Text>
        <Text style={styles.mainLogoText}>트레이북</Text>
      </View>
      <View style={styles.mainNextContainer}>
        <Text style={styles.nextText}>
          이용을 위해서는 로그인이 필요합니다!
        </Text>
        <MaterialIcons
          name="arrow-drop-down"
          size={25}
          color={'#FFD400'}
          style={{alignSelf: 'center'}}
        />
        <Pressable
          onPress={() => navigation.navigate('Register')}
          style={styles.mainStartBtn}>
          <Text style={styles.text}>회원가입</Text>
        </Pressable>
        <Pressable
          onPress={() => navigation.navigate('Login')}
          style={styles.mainStartBtn}>
          <Text style={styles.text}>로그인</Text>
        </Pressable>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: '100%',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#21D380',
  },
  mainDscText: {
    fontSize: 20,
    color: '#F2F2F2',
  },
  mainLogoText: {
    fontSize: 24,
    fontWeight: '600',
    marginTop: 5,
    padding: 5,
    color: '#21D380',
    borderRadius: 5,
    backgroundColor: '#F2F2F2',
    alignSelf: 'center',
  },
  mainNextContainer: {
    width: '80%',
    position: 'absolute',
    bottom: 80,
  },
  mainStartBtn: {
    width: '100%',
    marginTop: 10,
    height: 45,
    fontWeight: '700',
    alignItems: 'center',
    borderRadius: 5,
    backgroundColor: '#FFD400',
    alignSelf: 'center',
    justifyContent: 'center',
  },
  nextText: {
    color: '#F2F2F2',
    padding: 2,
    borderBottomWidth: 2,
    borderBottomColor: '#FFD400',
    alignSelf: 'center',
  },
  text: {
    color: '#F2F2F2',
    fontWeight: '700',
    fontSize: 16,
  },
});

export default MainScreen;
