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
import {useIsFocused, useNavigation} from '@react-navigation/native';

const LikePostsListListScreen = ({route}) => {
  const navigation = useNavigation();
  const [loading, setLoading] = useState(false);
  const [userLikePosts, setUserLikePosts] = useState([]);

  useEffect(() => {
    setLoading(true);
    setUserLikePosts(route.params.posts);
    setLoading(false);
  }, []);

  const SellState = ({item}) => {
    if (item && item.sellState === 'sell') {
      return <Text style={styles.sellStateText}>판매중</Text>;
    } else if (item && item.sellState === 'reserve') {
      return <Text style={styles.sellStateRsvText}>예약중</Text>;
    } else if (item && item.sellState === 'done') {
      return <Text style={styles.sellStateDoneText}>판매완료</Text>;
    } else return null;
  };

  const renderLikePostList = ({item}) => {
    return (
      <TouchableOpacity
        onPress={() => navigation.navigate('Detail', {post: item})}>
        <View style={styles.listView}>
          <View style={styles.bookImage}>
            <Image
              source={{uri: item && item.stateImage[0]}}
              resizeMode={'cover'}
              style={{height: 100, width: 70, borderRadius: 5,}}
            />
          </View>
          <View style={styles.bookDsc}>
            <Text
              numberOfLines={1}
              ellipsizeMode="tail"
              style={styles.bookTitle}>
              {item && item.bookTitle}
            </Text>
            <Text numberOfLines={1} ellipsizeMode="tail" style={styles.bookAP}>
              {item && item.bookAuthor}
            </Text>
            <Text style={styles.bookAP}>{item && item.bookPublisher}</Text>
            <Text style={{fontSize: 12}}>{item && item.date}</Text>
            <View style={{flexDirection: 'row', marginTop: 3}}>
              <SellState item={item} />
              <Text style={styles.price}> {item.tradePrice}원</Text>
            </View>
          </View>
        </View>
      </TouchableOpacity>
    );
  };
  return (
    <View style={styles.container}>
      <View style={styles.titleContainer}>
        <Text style={styles.titleText}>관심가는 책 목록</Text>
      </View>
      {userLikePosts.length > 0 ? (
        <View>
          <FlatList
            data={userLikePosts}
            listKey={(item, index) => 'D' + index.toString()}
            keyExtractor={(item, index) => 'D' + index.toString()}
            renderItem={renderLikePostList}
            disableVirtualization={false}
            onEndReachedThreshold={0.2}
          />
        </View>
      ) : (
        <View>
          <Text style={styles.nullListText}>해당 목록이 없어요 😅</Text>
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
  titleContainer: {
    height: '8%',
    backgroundColor: 'white',
    justifyContent: 'center',
  },
  titleText: {
    fontSize: 18,
    alignSelf: 'center',
    fontWeight: 'bold',
    color: '#393E46',
  },
  listView: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 130,
    margin: 5,
    padding: 15,
    backgroundColor: 'white',
    borderRadius: 5,
  },
  bookImage: {
    width: '20%',
  },
  bookDsc: {
    width: '75%',
    margin: 15,
  },
  bookTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#393E46',
  },
  bookAP: {
    fontSize: 13,
    color: '#393E46',
  },
  sellStateText: {
    padding: 3,
    backgroundColor: '#21D380',
    alignSelf: 'center',
    fontWeight: 'bold',
    fontSize: 12,
    color: 'white',
    borderRadius: 5,
  },
  sellStateRsvText: {
    padding: 3,
    backgroundColor: '#FFD400',
    alignSelf: 'center',
    fontWeight: 'bold',
    fontSize: 12,
    color: 'white',
    borderRadius: 5,
  },
  sellStateDoneText: {
    padding: 3,
    backgroundColor: '#A0A0A0',
    alignSelf: 'center',
    fontWeight: 'bold',
    fontSize: 12,
    color: 'white',
    borderRadius: 5,
  },
  price: {
    fontSize: 16,
    fontWeight: '700',
    color: '#21D380',
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

export default LikePostsListListScreen;
