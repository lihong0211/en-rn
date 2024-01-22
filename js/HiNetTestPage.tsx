import React, {useState} from 'react';
import {Button, SafeAreaView, StyleSheet, Text} from 'react-native';
import Constants from './expand/dao/Constants';
import {get, post} from './expand/dao/HiNet';
export default (props: any) => {
  const [showText, setShowText] = useState<string>();
  const doGet = () => {
    get(Constants.test.api)({requestPrams: 'devio', name: 'Tom', age: 18})
      .then(result => {
        setShowText(JSON.stringify(result));
      })
      .catch(e => {
        setShowText(JSON.stringify(e));
      });
  };
  const doPost = () => {
    const formData = new FormData();
    formData.append('requestPrams', 'devio');
    formData.append('name', 'Tom');
    post(Constants.test.api)(formData)()
      .then(result => {
        setShowText(JSON.stringify(result));
      })
      .catch(e => {
        setShowText(JSON.stringify(e));
      });
  };
  return (
    <SafeAreaView style={styles.root}>
      <Button title={'get'} onPress={doGet} />
      <Button title={'post'} onPress={doPost} />
      <Text>{showText}</Text>
    </SafeAreaView>
  );
};
const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
});
