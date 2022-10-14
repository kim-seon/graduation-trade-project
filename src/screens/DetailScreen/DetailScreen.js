import React from 'react';
import {View, Text, StyleSheet, TouchableOpacity} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';

const DetailScreen = ({navigation, route}) => {
  return (
    <View style={styles.container}>
      <View style={styles.bookImageContainer}>
        <Text>사진</Text>
      </View>
      <View>
        <TouchableOpacity style={styles.shareContainer}>
          <Ionicons
            name="ios-share-outline"
            size={25}
            color={'#FFD400'}
            style={{alignSelf: 'center'}}
          />
        </TouchableOpacity>
      </View>
      <View style={styles.bookInfoContainer}>
        <Text style={styles.bookTitleText}>책 제목</Text>
        <Text style={styles.writerInfoText}>
          학교 이름 | 닉네임 | 업로드 날짜
        </Text>
        <Text style={styles.bookPriceText}>20,000원</Text>
        <View style={styles.bookStateInfoContainer}>
          <View style={styles.bookStateText}>
            <Text style={styles.detailText}>책 상태</Text>
            <Text style={styles.detailText}>약간 중고</Text>
          </View>
          <View style={styles.bookDscText}>
            <Text style={styles.detailText}>
              책 상태 좋아요{'\n'}직거래 원해요{'\n'}필기를 좀 한 책이라 싸게
              내놓습니다.
            </Text>
          </View>
          <View style={styles.bookTradeText}>
            <Text style={styles.detailText}>선호거래방식</Text>
            <Text style={styles.detailText}>직거래(강남대학교 인사관 앞)</Text>
          </View>
        </View>
      </View>
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
    height: '35%',
    backgroundColor: 'white',
  },
  bookInfoContainer: {
    margin: 10,
  },
  bookTitleText: {
    fontSize: 24,
    fontWeight: '600',
    color: '#393E46',
    margin: 5,
  },
  writerInfoText: {
    fontSize: 16,
    color: '#393E46',
    margin: 5,
  },
  bookPriceText: {
    fontSize: 24,
    fontWeight: '700',
    color: '#21D380',
    margin: 5,
  },
  bookStateText: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderBottomWidth: 1,
    borderColor: '#21D380',
    padding: 10,
  },
  bookDscText: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderColor: '#21D380',
    padding: 10,
  },
  bookTradeText: {
    flexDirection: 'row',
    padding: 10,
    justifyContent: 'space-between',
  },
  detailText: {
    fontSize: 15,
    color: '#393E46',
  },
  bookStateInfoContainer: {
    backgroundColor: 'white',
    margin: 5,
    borderRadius: 5,
    padding: 10,
  },
  shareContainer: {
    margin: 15,
    position: 'absolute',
    right: 0,
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
