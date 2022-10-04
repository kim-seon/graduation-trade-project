import React, {useState} from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  FlatList,
  TouchableOpacity,
} from 'react-native';
import CustomButton from '../../components/CustomButton';

const WriteScreen = () => {
  const [selectedMenu, setSelectedMenu] = useState();
  const [selectedBefore, setSelectedBefore] = useState();
  const [selectedTrade, setSelectedTrade] = useState();
  const [selectedTradeBefore, setSelectedTradeBefore] = useState();

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
      <View style={styles.infoContainer}>
        <Text>사진 업로드</Text>
        <TextInput style={styles.input} placeholder="책 제목" />
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
