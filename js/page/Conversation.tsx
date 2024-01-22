/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import {useEffect, useState} from 'react';
import {Text, Switch} from '@rneui/themed';
import {FlatList, View, StyleSheet, SafeAreaView} from 'react-native';
import {post} from '../expand/dao/HiNet';

interface Word {
  speech: string;
  meaning: string;
  mastered?: 1 | 2;
}

function Words() {
  const [list, setList] = useState<Word[]>([]);
  const getList = () => {
    post('/living-speech/list')({
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

  const changeMastered = (value: boolean, idx: number) => {
    setList(prev => {
      prev[idx].mastered = value ? 1 : 2;
      return prev;
    });
  };
  return (
    <SafeAreaView>
      <FlatList
        style={styles.container}
        data={list}
        renderItem={({item, index}) => {
          return (
            <View style={styles.item}>
              <View style={styles.row}>
                <Text>单词：{item.speech}</Text>
              </View>
              <View style={styles.row}>
                <Text>释义：{item.meaning}</Text>
              </View>
              <View style={[styles.row, styles.mastered]}>
                <Text>是否掌握</Text>
                <Switch
                  style={styles.switch}
                  color="green"
                  value={item.mastered === 1}
                  onValueChange={value => changeMastered(value, index)}
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
