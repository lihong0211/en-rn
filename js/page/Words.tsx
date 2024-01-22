/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import {useEffect, useState} from 'react';
import {Text, Switch} from '@rneui/themed';
import {
  FlatList,
  View,
  StyleSheet,
  Image,
  SafeAreaView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import Sound from 'react-native-sound';
import {post} from '../expand/dao/HiNet';

interface Word {
  word: string;
  meaning: string;
  type?: string[];
  collocation: string;
  collocation_meaning: string;
  mastered?: 1 | 2;
}

function Words() {
  const [list, setList] = useState<Word[]>([]);
  const getList = () => {
    post('/words/list')({
      page: 1,
      size: 20,
    })().then((res: any) => {
      console.log(res?.data?.data);
      setList(res?.data?.data);
    });
  };
  useEffect(() => {
    getList();
  }, []);

  const changeMastered = (checked: boolean, item: any) => {
    post('/words/update')({
      ...item,
      mastered: checked ? 1 : 2,
    })().then(() => {
      // TODO: toast
      Alert.alert('设置成功');
      getList();
    });
  };

  const pronunciation = (word: string) => {
    const url = `https://dict.youdao.com/dictvoice?audio=${word}`;
    const s = new Sound(url, '', e => {
      if (e) {
        console.log('播放失败');
        console.log(e);
        return;
      }
      s.play(() => s.release());
    });
    s.play();
  };

  return (
    <SafeAreaView>
      <FlatList
        style={styles.container}
        data={list}
        renderItem={({item, index}) => {
          return (
            <View style={styles.item} key={index}>
              <View style={styles.row}>
                <Text>单词：{item.word}</Text>
              </View>

              <TouchableOpacity
                style={styles.pronunciation}
                onPress={() => pronunciation(item.word)}>
                <Image
                  style={{width: 25, height: 25}}
                  source={require('../assets/pronunciation.png')}
                />
              </TouchableOpacity>

              <View style={styles.row}>
                <Text>释义：{item.meaning}</Text>
              </View>

              {item.type && (
                <View style={styles.row}>
                  <Text>类型：{item.type.join('、')}</Text>
                </View>
              )}

              {item.collocation && (
                <>
                  <View style={styles.row}>
                    <Text>搭配：{item.collocation}</Text>
                  </View>
                  <View style={styles.row}>
                    <Text>搭配释义：{item.collocation_meaning}</Text>
                  </View>
                </>
              )}
              <View style={[styles.row, styles.mastered]}>
                <Text>是否掌握</Text>
                <Switch
                  style={styles.switch}
                  color="green"
                  value={item.mastered === 1}
                  onValueChange={value => changeMastered(value, item)}
                />
              </View>
            </View>
          );
        }}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#f8f8f8',
  },
  item: {
    backgroundColor: '#fff',
    padding: 10,
    marginVertical: 8,
    marginHorizontal: 16,
    shadowColor: '#eee',
    shadowOffset: {width: 5, height: 3},
    shadowOpacity: 0.5,
    shadowRadius: 5,
    borderRadius: 5,
  },
  pronunciation: {
    width: 25,
    height: 25,
    position: 'absolute',
    right: 13,
    top: 20,
  },
  text: {
    color: 'red',
  },
  row: {
    height: 40,
    lineHeight: 40,
    borderBottomWidth: 1,
    paddingTop: 15,
    borderBottomColor: '#eee',
  },
  mastered: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  switch: {
    transform: 'scale(0.7) translateY(-15px) translateX(5px)',
  },
});

export default Words;
