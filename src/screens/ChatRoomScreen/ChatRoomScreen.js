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
    setBookInfo(route.params.sendInfo);
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
    const changeValue = reference
      .ref(`chats/${bookInfo.uploadDate}`)
      .orderByChild('createdAt', 'desc')
      .on('child_added', snap => {
        const {_id, timestamp, text, user} = snap.val();
        const createdAt = new Date(timestamp);
        const message = {
          _id,
          createdAt,
          text,
          user,
        };
        setMessages(GiftedChat.append(...messages, message));
      });
    BackHandler.addEventListener('hardwareBackPress', handlePressBack);
    return () => {
      changeValue;
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
        .ref(`chats/${bookInfo.uploadDate}`)
        .push(message)
        .then(res => {
          setDbKey(res.key);
        });
      setMessages([message, ...messages]);
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

  return (
    <View style={{flex: 1}}>
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

export default ChatRoomScreen;
