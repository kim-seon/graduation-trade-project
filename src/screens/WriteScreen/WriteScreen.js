import React, {useState} from 'react';
import axios from 'axios';
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
} from 'react-native';
import CustomButton from '../../components/CustomButton';
import {launchCamera, launchImageLibrary} from 'react-native-image-picker';
import MultipleImagePicker from '@baronha/react-native-multiple-image-picker';

const WriteScreen = () => {
  const [selectedMenu, setSelectedMenu] = useState();
  const [selectedBefore, setSelectedBefore] = useState();
  const [selectedTrade, setSelectedTrade] = useState();
  const [selectedTradeBefore, setSelectedTradeBefore] = useState();
  const [selectedImages, setSelectedImages] = useState([]);
  const [searchList, setSearchList] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [searchKeyword, setSearchKeyword] = useState('');
  const [searchPage, setsearchPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);

  const loadMoreCommit = () => {
    setsearchPage(searchPage + 1);
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
        <TouchableOpacity style={styles.bookInfo}>
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

  const onSelectedImags1 = () => {
    const response = MultipleImagePicker.openPicker({
      usedCameraButton: true,
      isExportThumbnail: true,
      selectedAssets: selectedImages,
      mediaType: 'image',
    });
    console.log(response);
    setSelectedImages(response);
    console.log(selectedImages);
  };

  const onDelete = value => {
    const data = selectedImages.filter(
      item =>
        item.localIdentifier && item.localIdentifier !== value.localIdentifier,
    );
    setSelectedImages(data);
  };

  const renderImage = ({item, index}) => {
    return (
      <View>
        <Image source={{uri: item._W.path}} style={styles.imgUpload} />
        <TouchableOpacity onPress={() => onDelete(item)} activeOpacity={0.9}>
          <Text>삭제</Text>
        </TouchableOpacity>
      </View>
    );
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

  const ShowTradeView = () => {
    if (selectedTrade === 'direct') {
      return (
        <View style={styles.centerView}>
          <TextInput
            style={styles.input}
            placeholder="대략적인 위치를 기입해주세요"
          />
        </View>
      );
    } else {
      return null;
    }
  };

  return (
    <View style={styles.container}>
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
              keyExtractor={item => item.isbn}
              renderItem={renderBookList}
            />
            <Pressable
              style={styles.modalCloseBtn}
              onPress={() => setModalVisible(!modalVisible)}>
              <Text>닫기</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
      <View style={styles.infoContainer}>
        <FlatList
          style={{flex: 1, paddingTop: 6}}
          data={selectedImages}
          keyExtractor={(item, index) => item.path + index}
          renderItem={renderImage}
          numColumns={3}
          onEndReached={loadMoreCommit}
          onEndReachedThreshold={0.5}
          windowSize={2}
          initialNumToRender={10}
        />
        <TouchableOpacity onPress={onSelectedImags1}>
          <Text>open</Text>
        </TouchableOpacity>
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
        <TextInput style={styles.input} placeholder="가격" />
        <View style={styles.bookState}>
          <FlatList
            data={bookStateList}
            renderItem={renderMenu}
            keyExtractor={item => item.id}
            extraData={selectedMenu}
            numColumns={3}
            contentContainerStyle={{
              alignSelf: 'center',
            }}
          />
        </View>
        <ShowView />
        <View>
          <TextInput
            style={styles.bookShortDsc}
            placeholder="책에 관한 짧은 소개글을 적어주세요!"
          />
        </View>
        <View>
          <FlatList
            data={tradeWay}
            renderItem={tradeRenderMenu}
            keyExtractor={item => item.id}
            extraData={selectedTrade}
            numColumns={2}
            contentContainerStyle={{
              alignSelf: 'center',
            }}
          />
        </View>
        <ShowTradeView />
      </View>
      <CustomButton text="등록하기" />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: '100%',
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
  bookInfoContainer: {
    justifyContent: 'center',
    width: '75%',
  },
  bookTitleText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#393E46',
    marginBottom: 5,
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
    padding: 5,
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
  imgUpload: {
    marginLeft: 6,
    marginBottom: 6,
    width: 100,
    height: 100,
    backgroundColor: '#a0a0a0',
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
    width: '70%',
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
