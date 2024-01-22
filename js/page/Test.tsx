/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import {useEffect, useState} from 'react';
import {Image} from '@rneui/themed';
import {
  FlatList,
  View,
  StyleSheet,
  SafeAreaView,
  Text,
  TextInput,
  TouchableOpacity,
  Button,
} from 'react-native';
import {post} from '../expand/dao/HiNet';
import AnimatedImage from '../common/AnimatedImage';

interface Word {
  word: string;
  meaning: string;
  test?: string;
}

function Words() {
  const [list, setList] = useState<Word[]>([]);
  const getList = () => {
    post('/words/list')({
      page: 1,
      size: 100,
    })().then((res: any) => {
      const data = res?.data?.data;
      const len = data?.length || 0;
      const ret = [];
      for (let i = 0; i < Math.min(20, len); i++) {
        let idx = Math.floor(Math.random() * len);
        ret.push(data[idx]);
        data.splice(idx, 1);
      }
      setList(ret);
    });
  };

  useEffect(() => {
    getList();
  }, []);

  const handleInput = (input: string, index: number) => {
    setList(prev => {
      const temp = [...prev];
      prev[index].test = input;
      return temp;
    });
  };

  const handleTip = (index: number) => {
    setList(prev => {
      const temp = [...prev];
      prev[index].test = prev[index].word;
      return temp;
    });
  };

  const handleCancelTip = (index: number) => {
    setList(prev => {
      const temp = [...prev];
      prev[index].test = '';
      return temp;
    });
  };

  return (
    <SafeAreaView>
      <TouchableOpacity onPress={getList}>
        <Button
          onPress={getList}
          title="换一批"
          color="#3171f6"
          accessibilityLabel="Learn more about this purple button"
        />
      </TouchableOpacity>
      <FlatList
        style={styles.container}
        data={list}
        renderItem={({item, index}) => {
          return (
            <>
              {item && (
                <View style={styles.item} key={index}>
                  <View style={styles.row}>
                    <Text>释义：{item.meaning}</Text>
                  </View>

                  <View style={styles.operator}>
                    {!item.test && (
                      <Image
                        style={styles.statusImage}
                        source={require('../assets/write.png')}
                      />
                    )}
                    {item.test && item.test !== item.word && (
                      <AnimatedImage
                        source={require('../assets/loading.png')}
                      />
                    )}
                    {item.test && item.test === item.word && (
                      <Image
                        style={[styles.statusImage, styles.downImage]}
                        source={require('../assets/done.png')}
                      />
                    )}
                    <TextInput
                      style={styles.input}
                      value={item.test}
                      placeholder="请输入..."
                      //取消自动大写
                      autoCapitalize={'none'}
                      onChangeText={(text: string) => handleInput(text, index)}
                    />

                    <View style={styles.tip}>
                      {item.test === item.word ? (
                        <TouchableOpacity
                          onPress={() => handleCancelTip(index)}>
                          <Image
                            style={[styles.statusImage, styles.cancelImage]}
                            source={require('../assets/cancel.png')}
                          />
                        </TouchableOpacity>
                      ) : (
                        <TouchableOpacity onPress={() => handleTip(index)}>
                          <Text style={styles.tipText}>提示</Text>
                        </TouchableOpacity>
                      )}
                    </View>
                  </View>
                </View>
              )}
            </>
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
  row: {
    padding: 5,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  operator: {
    padding: 5,
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    marginTop: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  input: {
    marginLeft: 10,
    width: 300,
  },
  statusImage: {
    width: 18,
    height: 18,
  },
  downImage: {
    transform: 'translateY(-3px) scale(0.9)',
  },
  cancelImage: {
    // transform: 'translate(-3px,-3px)',
  },
  tip: {
    position: 'absolute',
    right: 10,
    bottom: 10,
  },
  tipText: {
    color: '#3171f6',
    fontSize: 12,
  },
});

export default Words;
