import React from 'react';
import {Provider} from 'react-redux';
import AppNavigator from './navigator/AppNavigators';
import store from './store';

const App = () => {
  const App = AppNavigator();
  return <Provider store={store}>{App}</Provider>;
};
export default App;
