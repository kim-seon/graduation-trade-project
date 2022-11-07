import React, {useState, useEffect, useLayoutEffect, useCallback} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  FlatList,
  TouchableOpacity,
  BackHandler,
} from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Entypo from 'react-native-vector-icons/Entypo';
import AsyncStorage from '@react-native-async-storage/async-storage';
import auth from '@react-native-firebase/auth';
import {firebase} from '@react-native-firebase/database';
import {
  GiftedChat,
  Bubble,
  Send,
  InputToolbar,
  SystemMessage,
} from 'react-native-gifted-chat';
import {useIsFocused, useNavigation} from '@react-navigation/native';
import ChatStateMenu from '../../components/ChatStateMenu';

const ChatRoomScreen = ({route}) => {
  const reference = firebase
    .app()
    .database(
      'https://rntradebookproject-default-rtdb.asia-southeast1.firebasedatabase.app/',
    );

  const [loading, setLoading] = useState(false);
  const [userInfo, setUserInfo] = useState({});
  const [bookInfo, setBookInfo] = useState({});
  const [messages, setMessages] = useState([
    {
      _id: 0,
      text: '🔊 안녕하세요! 안전하고 쿨한 거래를 위해 고운 말로 대화해주세요',
      createdAt: new Date().getTime(),
      system: true,
    },
  ]);
  const [uid, setUid] = useState('');
  const [reportUser, setReportUser] = useState(null);
  const [dbKey, setDbKey] = useState('');
  const [openMenu, setOpenMenu] = useState(false);
  const [sellState, setSellState] = useState('');

  const navigation = useNavigation();

  const handlePressBack = () => {
    if (navigation.canGoBack()) {
      navigation.navigate('Tab', {screen: '채팅방'});
      return true;
    }
    return false;
  };

  const isFocused = useIsFocused();

  useLayoutEffect(() => {
    setLoading(true);
    setUserInfo({
      _id:
        (route.params.data && route.params.data.uid) ||
        route.params.userInfo.uid,
      name:
        (route.params.data && route.params.data.displayName) ||
        route.params.userInfo.displayName,
      email:
        (route.params.data && route.params.data.email) ||
        route.params.userInfo.email,
    });
    const changeValue = () =>
      reference
        .ref(
          `chats/${
            (route.params.book && route.params.book.uploadDate) ||
            (route.params.sendInfo && route.params.sendInfo.uploadDate)
          }`,
        )
        .orderByChild('createdAt', 'desc')
        .on('child_added', snap => {
          const {_id, createdAt, text, user} = snap.val();
          const message = {
            _id,
            createdAt,
            text,
            user,
          };
          setMessages(prev => GiftedChat.append(prev, message));
          setLoading(false);
        });
    changeValue();
    reference
      .ref(`/posts/`)
      .orderByChild('sellState')
      .equalTo('sell')
      .on('value', snap => setSellState(''));
    reference
      .ref(`/posts/`)
      .orderByChild('sellState')
      .equalTo('reserve')
      .on('value', snap => {
        reference
          .ref(`/posts/`)
          .orderByChild('reserveUser')
          .equalTo(route.params.book && route.params.book.chatUserUid)
          .on('value', child => setSellState('예약중'));
      });
    reference
      .ref(`/posts/`)
      .orderByChild('sellState')
      .equalTo('done')
      .on('value', snap => {
        reference
          .ref(`/posts/`)
          .orderByChild('donUser')
          .equalTo(route.params.book && route.params.book.chatUserUid)
          .on('value', child => {
            setSellState('거래완료');
            reference
              .ref(
                `/posts/${
                  (route.params.book && route.params.book.uploadDate) ||
                  (route.params.sendInfo && route.params.sendInfo.uploadDate)
                }`,
              )
              .child('reserveUser')
              .remove();
          });
      });
    BackHandler.addEventListener('hardwareBackPress', handlePressBack);
    return () => {
      setLoading(false);
      BackHandler.removeEventListener('hardwareBackPress', handlePressBack);
    };
  }, []);

  const onSend = newMessage => {
    let today = new Date();
    let timestamp = today.toISOString();
    for (let i = 0; i < newMessage.length; i++) {
      let random = Math.round(Math.random() * 1000000);
      const {text, user} = newMessage[i];
      const message = {_id: random, text, user, createdAt: timestamp};
      reference
        .ref(
          `chats/${
            (route.params.book && route.params.book.uploadDate) ||
            (route.params.sendInfo && route.params.sendInfo.uploadDate)
          }`,
        )
        .push(message)
        .then(res => {
          setDbKey(res.key);
        });
    }
  };

  function customtInputToolbar(props) {
    return (
      <InputToolbar
        {...props}
        containerStyle={{
          backgroundColor: 'white',
          borderTopColor: '#FFD400',
          borderTopWidth: 1,
        }}
      />
    );
  }

  function renderBubble(props) {
    return (
      <Bubble
        {...props}
        wrapperStyle={{
          right: {
            backgroundColor: '#21D380',
          },
          left: {
            borderWidth: 1,
            borderColor: '#21D380',
            backgroundColor: 'white',
          },
        }}
        textStyle={{
          right: {
            color: '#F2F2F2',
          },
          left: {
            color: '#393E46',
          },
        }}
      />
    );
  }

  function renderSystemMessage(props) {
    return (
      <SystemMessage
        {...props}
        containerStyle={{backgroundColor: '#FFD400'}}
        textStyle={{
          color: '#F2F2F2',
          fontWeight: 'bold',
          fontSize: 13,
          padding: 8,
          textAlign: 'center',
        }}
      />
    );
  }

  function renderSend(props) {
    return (
      <Send {...props}>
        <View style={{justifyContent: 'center', alignItems: 'center'}}>
          <MaterialCommunityIcons
            name="send-circle"
            size={42}
            color={'#FFD400'}
          />
        </View>
      </Send>
    );
  }

  const onMenuPress = () => {
    setLoading(true);
    setOpenMenu(!openMenu);
    if (openMenu === true) {
      setLoading(false);
    }
  };

  return (
    <View style={{flex: 1}}>
      <View style={styles.chatTitleContainer}>
        {(route.params.book && route.params.book.sellerUid) ===
        (userInfo && userInfo._id) ? (
          <View style={styles.menuBarContainer}>
            <TouchableOpacity onPress={onMenuPress}>
              <Entypo name="dots-three-vertical" size={20} color={'#A0A0A0'} />
            </TouchableOpacity>
            {openMenu ? <ChatStateMenu postData={route.params.book} /> : null}
          </View>
        ) : null}
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <Text style={styles.chatTitleText}>
            {(route.params.sendInfo && route.params.sendInfo.bookTitle) ||
              (route.params.book && route.params.book.bookTitle)}
          </Text>
          {sellState.length > 1 ? (
            <Text style={styles.chatStateText}>{sellState}</Text>
          ) : null}
        </View>
        {(route.params.book && route.params.book.sellerUid) ===
        (userInfo && userInfo._id) ? (
          <Text style={styles.chatTitleInfoText}>
            {route.params.book && route.params.book.chatUser}
            &nbsp;
            <Text>
              ({route.params.book && route.params.book.chatUserSchool})
            </Text>
          </Text>
        ) : (
          <Text style={styles.chatTitleInfoText}>
            {(route.params.sendInfo && route.params.sendInfo.seller) ||
              (route.params.book && route.params.book.seller)}&nbsp;
            <Text>
              (
              {(route.params.sendInfo && route.params.sendInfo.sellerSchool) ||
                (route.params.book && route.params.book.sellerSchool)}
              )
            </Text>
          </Text>
        )}
      </View>
      <GiftedChat
        messages={messages}
        onSend={newMessage => onSend(newMessage)}
        user={userInfo}
        placeholder="메시지를 입력해주세요."
        alwaysShowSend
        renderSystemMessage={renderSystemMessage}
        renderSend={renderSend}
        renderBubble={renderBubble}
        renderInputToolbar={customtInputToolbar}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  chatTitleContainer: {
    height: '8%',
    backgroundColor: 'white',
    justifyContent: 'center',
    padding: 5,
  },
  menuBarContainer: {
    zIndex: 1,
    position: 'absolute',
    right: 5,
    top: 20,
  },
  chatTitleText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#393E46',
  },
  chatTitleInfoText: {
    fontSize: 13,
    alignSelf: 'center',
  },
  chatStateText: {
    marginLeft: 5,
    fontSize: 13,
    padding: 3,
    justifyContent: 'center',
    color: '#393E46',
    fontWeight: 'bold',
    backgroundColor: '#FFD400',
    borderRadius: 5,
  },
});

export default ChatRoomScreen;
