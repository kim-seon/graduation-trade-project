import React, {useState, useEffect, useCallback} from 'react';
import axios from 'axios';
import Moment from 'moment';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Pressable,
  Image,
  Modal,
  LogBox,
  Alert,
  RefreshControl,
} from 'react-native';
import {ScrollView} from 'react-native-gesture-handler';
import AntDesign from 'react-native-vector-icons/AntDesign';
import CustomButton from '../../components/CustomButton';
import MultipleImagePicker from '@baronha/react-native-multiple-image-picker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useIsFocused} from '@react-navigation/native';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import {firebase} from '@react-native-firebase/database';
import storage, {getDownloadURL} from '@react-native-firebase/storage';

const WriteScreen = ({navigation, route}) => {

  const isFocused = useIsFocused();
  const reference = firebase
    .app()
    .database(
      'https://rntradebookproject-default-rtdb.asia-southeast1.firebasedatabase.app/',
    );
  const [userInfo, setUserInfo] = useState({});
  const [userDB, setUserDB] = useState({});
  const [selectedMenu, setSelectedMenu] = useState();
  const [selectedBefore, setSelectedBefore] = useState();
  const [selectedTrade, setSelectedTrade] = useState();
  const [selectedTradeBefore, setSelectedTradeBefore] = useState();
  const [selectedImages, setSelectedImages] = useState([]);
  const [searchList, setSearchList] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [searchKeyword, setSearchKeyword] = useState('');
  const [searchPage, setSearchPage] = useState(1);
  const [inputPrice, setInputPrice] = useState(null);
  const [bookState, setBookState] = useState('');
  const [inputDsc, setInputDsc] = useState('');
  const [tradeMethod, setTradeMethod] = useState('');
  const [directPlace, setdirectPlace] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [selectImgBtn, setSelectImgBtn] = useState(false);
  const [imgBtnTxt, setimgBtnTxt] = useState('사진 업로드(최대 3장)');
  const [selectedBookInfo, setSelectedBookInfo] = useState([]);
  const [infoVisible, setInfoVisible] = useState(false);
  const [uploadDate, setUploadDate] = useState();
  const [loading, setLoading] = useState(false);
  const [photosURL, setPhotosURL] = useState([]); // 업로드 완료된 사진 링크들
  const [progress, setProgress] = useState(0); // 업로드 진행상태

  useEffect(() => {
    setLoading(true);
    LogBox.ignoreLogs(['VirtualizedLists should never be nested']);
    setUserInfo(route.params.data);
    reference.ref(`/users/${userInfo.uid}`).on('value', async snapshot => {
      const userData = await snapshot.val();
      setUserDB(userData);
      console.log(userDB);
      console.log(selectedImages);
      setLoading(false);
    });
  }, [userInfo.uid]);

  let submitDate = null;
  let printDate = null;

  const onSubmitPress = e => {
    e.preventDefault();
    const currentDate = new Date();
    submitDate = Moment(currentDate).format('YYYYMMDDHHmmss');
    printDate = Moment(currentDate).format('YYYY년 MM월 DD일 HH:mm');

    imageUpload();

    let writeData = {
      seller: route.params.data.displayName,
      sellerUid: route.params.data.uid,
      sellerSchool: userDB && userDB.school,
      stateImage: photosURL && photosURL,
      bookCover: selectedBookInfo[0],
      bookTitle: selectedBookInfo[1],
      bookAuthor: selectedBookInfo[2],
      bookPublisher: selectedBookInfo[3],
      bookPrice: selectedBookInfo[5]
        .toString()
        .replace(/\B(?=(\d{3})+(?!\d))/g, ','),
      bookPubDate: selectedBookInfo[6],
      tradePrice: inputPrice.replace(/\B(?=(\d{3})+(?!\d))/g, ','),
      bookState: bookState,
      bookDsc: inputDsc,
      tradeWay: tradeMethod,
      tradeDirect: directPlace && directPlace,
      date: printDate,
      uploadDate: submitDate,
    };

    reference
      .ref(`/posts/${submitDate}`)
      .set(writeData)
      .then(() => {
        navigation.navigate('Detail', {
          id: writeData,
          loginUser: userInfo,
        });
      })
      .catch(function (err) {
        console.log(err);
      });
  };

  const onOpenInfo = () => {
    setModalVisible(true);
    axios
      .get(
        `http://www.aladin.co.kr/ttb/api/ItemSearch.aspx?ttbkey=ttblte08091534001&Query=${searchKeyword}&QueryType=Keyword&MaxResults=10&start=1&MaxResults=${searchPage}&SearchTarget=Book&Cover=Small&output=js&Version=20131101`,
      )
      .then(res => {
        setSearchList(res.data.item);
      });
    setIsLoading(false);
  };

  const renderBookList = ({item}) => {
    return (
      <View>
        <TouchableOpacity
          onPress={() => onSelectedBook({item})}
          style={styles.bookInfo}>
          <View style={styles.bookImage}>
            <Image
              source={{uri: item.cover}}
              resizeMode={'cover'}
              style={{height: 70, width: 50}}
            />
          </View>
          <View style={styles.bookInfoContainer}>
            <Text
              numberOfLines={1}
              ellipsizeMode="tail"
              style={styles.bookTitleText}>
              {item.title}
            </Text>
            <View style={styles.bookANPContainer}>
              <Text style={styles.bookANP}>{item.author}</Text>
              <Text style={styles.bookANP}>{item.publisher}</Text>
            </View>
          </View>
        </TouchableOpacity>
      </View>
    );
  };

  const Menus = ({menu, onPress, isSelected}) => {
    return (
      <TouchableOpacity
        onPress={onPress}
        style={isSelected ? styles.buttonSelected : styles.button}>
        <Text
          style={isSelected ? styles.buttonTextSelected : styles.buttonText}>
          {menu}
        </Text>
      </TouchableOpacity>
    );
  };

  const ImageBtn = ({text, onPress}) => {
    if (selectImgBtn === true) {
      setimgBtnTxt('다시 업로드하기');
    }
    return (
      <View>
        <TouchableOpacity style={styles.uploadBtn} onPress={onPress}>
          <Text style={{alignSelf: 'center', color: '#393E46'}}>{text}</Text>
        </TouchableOpacity>
      </View>
    );
  };

  const imageUpload = res => {
    let imgArr = [];
    setLoading(true);
    console.log('arr: ' + JSON.stringify(res));
    res?.map((file, index) => {
      const storageRef = storage().ref(
        `images/${file.bucketId}/${file.bucketId + '_' + file.fileName}`,
      );
      const task = storageRef.putFile(file.realPath);
      task.on(
        'state_changed',
        snapshot => {
          console.log(snapshot);
        },
        err => console.log(err),
        () => {
          task.snapshot.ref.getDownloadURL().then(url => {
            setPhotosURL(old => [...old, url]);
            setLoading(false);
            console.log(photosURL);
          });
        },
      );
    });
  };

  const onSelectedImages = async () => {
    const response = await MultipleImagePicker.openPicker({
      usedCameraButton: true,
      isExportThumbnail: true,
      selectedAssets: selectedImages,
      maxSelectedAssets: 3,
      mediaType: 'image',
    });
    setSelectImgBtn(true);
    setSelectedImages(response);
    imageUpload(response);
  };

  const onDelete = value => {
    const data =
      selectedImages &&
      selectedImages.filter(
        item =>
          item.localIdentifier &&
          item.localIdentifier !== value.localIdentifier,
      );
    setSelectedImages(data);
  };

  const renderImage = ({item, index}) => {
    console.log(item);
    return (
      <View>
        <Image
          source={{
            uri: item,
          }}
          style={styles.imgUpload}
        />
        {/* <TouchableOpacity
          onPress={() => onDelete(item)}
          activeOpacity={0.9}
          style={styles.buttonDelete}>
          <Text style={styles.titleDelete}>삭제</Text>
        </TouchableOpacity> */}
      </View>
    );
  };

  const onSelectedBook = ({item}) => {
    setInfoVisible(true);
    setModalVisible(!modalVisible);
    setSelectedBookInfo([
      item.cover,
      item.title,
      item.author,
      item.publisher,
      item.isbn,
      item.priceStandard,
      item.pubDate,
    ]);
  };

  const BookInfo = () => {
    if (infoVisible === true) {
      return (
        <View style={styles.selectedBookContainer}>
          <Text style={styles.titleForInfo}>📑 선택한 책</Text>
          <View
            style={{
              width: '100%',
              flexDirection: 'row',
              alignItems: 'center',
              marginTop: 5,
              alignSelf: 'center',
              justifyContent: 'center',
            }}>
            <View style={{width: '30%', alignItems: 'flex-start'}}>
              <Text style={styles.infoTitle}>제목</Text>
              <Text style={styles.infoTitle}>원가</Text>
              <Text style={styles.infoTitle}>저자</Text>
              <Text style={styles.infoTitle}>출판사</Text>
              <Text style={styles.infoTitle}>출판날짜</Text>
            </View>
            <View style={{width: '65%', alignItems: 'flex-end'}}>
              <Text
                numberOfLines={1}
                ellipsizeMode="tail"
                style={styles.infoAll}>
                {selectedBookInfo[1]}
              </Text>
              <Text
                numberOfLines={1}
                ellipsizeMode="tail"
                style={styles.infoAll}>
                {selectedBookInfo[5]}
              </Text>
              <Text
                numberOfLines={1}
                ellipsizeMode="tail"
                style={styles.infoAll}>
                {selectedBookInfo[2]}
              </Text>
              <Text
                numberOfLines={1}
                ellipsizeMode="tail"
                style={styles.infoAll}>
                {selectedBookInfo[3]}
              </Text>
              <Text
                numberOfLines={1}
                ellipsizeMode="tail"
                style={styles.infoAll}>
                {selectedBookInfo[6]}
              </Text>
            </View>
          </View>
        </View>
      );
    } else {
      return null;
    }
  };

  const bookStateList = [
    {id: 1, menu: '새거'},
    {id: 2, menu: '약간 중고'},
    {id: 3, menu: '완전 중고'},
  ];

  const tradeWay = [
    {id: 'direct', menu: '직거래'},
    {id: 'ship', menu: '택배'},
  ];

  const renderMenu = ({item}) => {
    const isSelected = selectedMenu === item.id ? true : false;
    const handleMenu = id => {
      if (selectedBefore === id) {
        setSelectedMenu(null);
        setSelectedBefore(null);
        return;
      }
      setBookState(item.menu);
      setSelectedMenu(id);
      setSelectedBefore(id);
    };

    return (
      <View>
        <Menus
          menu={item.menu}
          onPress={() => handleMenu(item.id)}
          isSelected={isSelected}
        />
      </View>
    );
  };

  const tradeRenderMenu = ({item}) => {
    const isSelected = selectedTrade === item.id ? true : false;

    const handleMenu = id => {
      if (selectedTradeBefore === id) {
        setSelectedTrade(null);
        setSelectedTradeBefore(null);
        return;
      }
      setTradeMethod(item.menu);
      setSelectedTrade(id);
      setSelectedTradeBefore(id);
    };

    return (
      <View>
        <Menus
          menu={item.menu}
          onPress={() => handleMenu(item.id)}
          isSelected={isSelected}
        />
      </View>
    );
  };

  const ShowView = () => {
    if (selectedMenu === 1) {
      return (
        <View style={styles.stateContainer}>
          <Text style={styles.bookStateInfoText}>
            ✔️ 이런 상태의 책일 때 선택해주세요!
          </Text>
          <View style={styles.bookStateText}>
            <Text style={styles.stateText}>📙 미개봉 및 개봉만 한 상태</Text>
            <Text style={styles.stateText}>❌ 아무런 필기가 없는 상태</Text>
          </View>
        </View>
      );
    } else if (selectedMenu === 2) {
      return (
        <View style={styles.stateContainer}>
          <Text style={styles.bookStateInfoText}>
            ✔️ 이런 상태의 책일 때 선택해주세요!
          </Text>
          <View style={styles.bookStateText}>
            <Text style={styles.stateText}>✍️ 이름이 기입된 상태</Text>
            <Text style={styles.stateText}>
              ✏️ 연필 및 샤프로만 필기가 되어있는 상태
            </Text>
          </View>
        </View>
      );
    } else if (selectedMenu === 3) {
      return (
        <View style={styles.stateContainer}>
          <Text style={styles.bookStateInfoText}>
            ✔️ 이런 상태의 책일 때 선택해주세요!
          </Text>
          <View style={styles.bookStateText}>
            <Text style={styles.stateText}>✍️ 이름이 기입된 상태</Text>
            <Text style={styles.stateText}>
              🖍️ 볼펜 및 형광펜으로 필기가 되어있는 상태
            </Text>
          </View>
        </View>
      );
    } else {
      return null;
    }
  };

  const getHeader = () => {
    return (
      <Text style={{fontSize: 16, marginBottom: 5, alignSelf: 'center'}}>
        <Text style={{color: '#21D380', fontWeight: '700'}}>
          {searchKeyword}
        </Text>
        에 대한 검색결과
      </Text>
    );
  };

  const getFooter = () => {
    if (isLoading) {
      return null;
    }
    return (
      <Text style={{fontSize: 16, marginTop: 5, alignSelf: 'center'}}>
        Loding. . .
      </Text>
    );
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(!modalVisible);
        }}>
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <FlatList
              data={searchList}
              listKey={(item, index) => 'D' + index.toString()}
              keyExtractor={item => item.isbn}
              renderItem={renderBookList}
              disableVirtualization={false}
              initialNumToRender={15}
              onEndReachedThreshold={0.2}
              ListHeaderComponent={getHeader}
              ListFooterComponent={getFooter}
            />
            <Pressable
              style={styles.modalCloseBtn}
              onPress={() => setModalVisible(!modalVisible)}>
              <Text style={{color: '#F2F2F2'}}>닫기</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
      <View style={styles.infoContainer}>
        <View>
          {photosURL.length > 0 && (
            <FlatList
              contentContainerStyle={{width: '100%', alignItems: 'center'}}
              data={photosURL}
              listKey={(item, index) => 'D' + index.toString()}
              keyExtractor={(item, index) => item + index}
              renderItem={renderImage}
              numColumns={3}
              scrollEnabled={false}
            />
          )}
        </View>
        <ImageBtn text={imgBtnTxt} onPress={onSelectedImages} />
        <View style={styles.searchBookContainer}>
          <TextInput
            style={styles.searchInput}
            placeholder="책 검색하기"
            value={searchKeyword}
            onChangeText={setSearchKeyword}
          />
          <TouchableOpacity style={styles.searchBtn} onPress={onOpenInfo}>
            <Text>검색</Text>
          </TouchableOpacity>
        </View>
        <BookInfo />
        <TextInput
          style={styles.input}
          placeholder="가격"
          keyboardType="numeric"
          value={inputPrice}
          onChangeText={setInputPrice}
        />
        <View style={styles.bookState}>
          <FlatList
            data={bookStateList}
            renderItem={renderMenu}
            listKey={(item, index) => 'D' + index.toString()}
            keyExtractor={item => item.id}
            extraData={selectedMenu}
            numColumns={3}
            contentContainerStyle={{
              alignSelf: 'center',
            }}
            scrollEnabled={false}
            nestedScrollEnabled={true}
          />
        </View>
        <ShowView />
        <View>
          <TextInput
            style={styles.bookShortDsc}
            placeholder="책 상태에 대한 글을 작성해주세요!"
            value={inputDsc}
            onChangeText={setInputDsc}
          />
        </View>
        <View>
          <FlatList
            data={tradeWay}
            renderItem={tradeRenderMenu}
            listKey={(item, index) => 'D' + index.toString()}
            keyExtractor={item => item.id}
            extraData={selectedTrade}
            numColumns={2}
            contentContainerStyle={{
              alignSelf: 'center',
            }}
            scrollEnabled={false}
            nestedScrollEnabled={true}
          />
          {selectedTrade === 'direct' && (
            <TextInput
              style={styles.input}
              placeholder="대략적인 위치를 기입해주세요"
              value={directPlace}
              onChangeText={setdirectPlace}
            />
          )}
        </View>
      </View>
      <CustomButton onPress={onSubmitPress} text="등록하기" />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    justifyContent: 'center',
    backgroundColor: '#F2F2F2',
  },
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 22,
  },
  modalView: {
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 35,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  imageList: {
    width: '100%',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
  },
  imgUpload: {
    width: 100,
    height: 100,
    borderWidth: 1,
    borderRadius: 5,
    margin: 5,
  },
  uploadBtn: {
    width: '80%',
    borderWidth: 1,
    borderRadius: 5,
    borderColor: '#393E46',
    padding: 5,
    margin: 5,
    alignSelf: 'center',
  },
  restImage: {
    position: 'absolute',
    right: 0,
  },
  titleDelete: {
    fontWeight: 'bold',
    fontSize: 12,
    color: '#000',
  },
  buttonDelete: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    position: 'absolute',
    top: 6,
    right: 6,
    backgroundColor: '#ffffff92',
    borderRadius: 4,
  },
  selectedBookContainer: {
    width: '80%',
    marginBottom: 5,
    backgroundColor: 'white',
    alignSelf: 'center',
    padding: 10,
    borderWidth: 1,
    borderRadius: 5,
    borderColor: '#21D380',
  },
  titleForInfo: {
    padding: 2,
    borderBottomWidth: 1,
    borderBottomColor: '#21D380',
    fontSize: 14,
    color: '#393E46',
    fontWeight: 'bold',
  },
  infoAll: {
    color: '#393E46',
  },
  infoTitle: {
    fontWeight: 'bold',
    color: '#393E46',
  },
  bookInfoContainer: {
    justifyContent: 'center',
    width: '75%',
  },
  bookTitleText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#393E46',
  },
  bookANP: {
    fontSize: 13,
  },
  bookANPContainer: {
    width: '75%',
  },
  bookInfo: {
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#21D380',
    padding: 8,
  },
  bookImage: {
    width: '25%',
  },
  modalCloseBtn: {
    backgroundColor: '#FFD400',
    borderRadius: 30,
    padding: 10,
  },
  input: {
    alignSelf: 'center',
    padding: 5,
    margin: 5,
    color: '#393E46',
    backgroundColor: 'white',
    width: '80%',
    borderRadius: 5,
    marginBottom: 12,
  },
  button: {
    margin: 5,
    padding: 5,
    borderWidth: 1,
    borderRadius: 5,
    borderColor: '#393E46',
  },
  buttonSelected: {
    margin: 5,
    padding: 5,
    borderWidth: 1,
    borderRadius: 5,
    borderColor: '#21D380',
  },
  buttonTextSelected: {
    color: '#21D380',
  },
  buttonText: {
    color: '#393E46',
  },
  searchBookContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  searchInput: {
    alignSelf: 'center',
    padding: 5,
    margin: 5,
    color: '#393E46',
    backgroundColor: 'white',
    width: '65%',
    borderRadius: 5,
    marginBottom: 12,
  },
  searchBtn: {
    alignSelf: 'center',
    justifyContent: 'center',
    alignItems: 'center',
    width: '15%',
    marginTop: -5,
    height: 35,
    borderRadius: 30,
    backgroundColor: '#21D380',
  },
  stateContainer: {
    alignSelf: 'center',
    width: '80%',
    margin: 5,
    padding: 10,
    backgroundColor: 'white',
    borderWidth: 1,
    borderRadius: 5,
    borderColor: '#21D380',
  },
  bookStateInfoText: {
    color: '#393E46',
    fontSize: 14,
    fontWeight: 'bold',
  },
  bookStateText: {
    marginLeft: 8,
  },
  stateText: {
    alignSelf: 'flex-start',
    padding: 2,
    fontSize: 12,
    color: '#393E46',
    marginTop: 5,
    borderBottomWidth: 2,
    borderColor: '#FFD400',
  },
  bookShortDsc: {
    alignSelf: 'center',
    margin: 5,
    backgroundColor: 'white',
    width: '80%',
    height: 150,
    borderRadius: 5,
    padding: 10,
    textAlignVertical: 'top',
  },
});
export default WriteScreen;
