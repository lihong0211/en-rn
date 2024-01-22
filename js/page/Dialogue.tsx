/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import {useEffect, useState} from 'react';
import {Text} from '@rneui/themed';
import {FlatList, View, StyleSheet, SafeAreaView} from 'react-native';
import {get} from '../expand/dao/HiNet';

interface Dialogue {
  dialogue: any[];
  words: any[];
}

function Words() {
  const [list, setList] = useState<Dialogue[]>([]);
  const getList = () => {
    get('/dialogue/list')({
      page: 1,
      size: 20,
    }).then((res: any) => {
      console.log(res?.data?.data);
      setList(res?.data?.data);
    });
  };
  useEffect(() => {
    getList();
  }, []);

  return (
    <SafeAreaView>
      <FlatList
        style={styles.container}
        data={list}
        renderItem={({item, index}) => {
          return (
            <View key={index}>
              <View>
                {item.dialogue.map(it => {
                  return (
                    <View>
                      <View style={styles.item}>
                        <Text
                          style={{
                            lineHeight: 22,
                          }}>
                          {it.dialogue}
                        </Text>
                      </View>
                      <View style={styles.item}>
                        <Text
                          style={{
                            lineHeight: 22,
                            letterSpacing: 1,
                          }}>
                          {it.meaning}
                        </Text>
                      </View>
                    </View>
                  );
                })}
              </View>
              <View style={styles.item}>
                {item.words.map(it => {
                  return (
                    <View style={{marginVertical: 4}}>
                      <Text>
                        {it.word}: {it.meaning}
                      </Text>
                    </View>
                  );
                })}
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
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    lineHeight: 40,
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
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    paddingTop: 5,
    marginBottom: 5,
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
