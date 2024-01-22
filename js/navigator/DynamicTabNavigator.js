/* eslint-disable react-native/no-inline-styles */
/* eslint-disable react/no-unstable-nested-components */
import {
  BottomTabBar,
  createBottomTabNavigator,
} from '@react-navigation/bottom-tabs';
import React, {Component} from 'react';
import Words from '../page/Words.tsx';
import Conversation from '../page/Conversation.tsx';
import Dialogue from '../page/Dialogue.tsx';
import Test from '../page/Test.tsx';
import {connect} from 'react-redux';
import EventTypes from '../util/EventTypes';
import EventBus from 'react-native-event-bus';
import {Image} from '@rneui/themed';

const Tab = createBottomTabNavigator();

const TABS = {
  //在这里配置页面的路由
  PopularPage: {
    screen: Words,
    navigationOptions: {
      tabBarLabel: 'words',
      headerShown: false,
      tabBarIcon: ({focused}) => (
        <>
          {focused ? (
            <Image
              style={{width: 25, height: 25}}
              source={require('../assets/word-hl.png')}
            />
          ) : (
            <Image
              style={{width: 22, height: 22}}
              source={require('../assets/word.png')}
            />
          )}
        </>
      ),
    },
  },
  TrendingPage: {
    screen: Dialogue,
    navigationOptions: {
      tabBarLabel: 'dialogue',
      headerShown: false,
      tabBarIcon: ({focused}) => (
        <>
          {focused ? (
            <Image
              style={{width: 25, height: 25}}
              source={require('../assets/dialogue-hl.png')}
            />
          ) : (
            <Image
              style={{width: 22, height: 22}}
              source={require('../assets/dialogue.png')}
            />
          )}
        </>
      ),
    },
  },
  FavoritePage: {
    screen: Conversation,
    navigationOptions: {
      tabBarLabel: 'conversation',
      headerShown: false,
      tabBarIcon: ({focused}) => (
        <>
          {focused ? (
            <Image
              style={{width: 25, height: 25}}
              source={require('../assets/conversation-hl.png')}
            />
          ) : (
            <Image
              style={{width: 22, height: 22}}
              source={require('../assets/conversation.png')}
            />
          )}
        </>
      ),
    },
  },
  MyPage: {
    screen: Test,
    navigationOptions: {
      tabBarLabel: 'test',
      headerShown: false,
      tabBarIcon: ({focused}) => (
        <>
          {focused ? (
            <Image
              style={{width: 25, height: 25}}
              source={require('../assets/test-hl.png')}
            />
          ) : (
            <Image
              style={{width: 20, height: 20}}
              source={require('../assets/test.png')}
            />
          )}
        </>
      ),
    },
  },
};

class DynamicTabNavigator extends Component {
  /**
   * 从navigationState解析导航跳转
   * @param {*} navigationState
   */
  fireEvent(navigationState) {
    const {index, history, routeNames} = navigationState;
    let fromIndex = -1;
    if (history.length === 1) {
      fromIndex = this.toNavIndex;
    } else {
      let key = history[history.length - 2].key;
      for (let i = 0; i < routeNames.length; i++) {
        if (key.startsWith(routeNames[i])) {
          fromIndex = i;
          break;
        }
      }
    }
    EventBus.getInstance().fireEvent(EventTypes.bottom_tab_select, {
      //发送底部tab切换的事件
      from: fromIndex,
      to: index,
    });
    //记录上一次的位置
    this.toNavIndex = index;
  }
  _tabNavigator() {
    const {PopularPage, TrendingPage, FavoritePage, MyPage} = TABS;
    const tabs = {PopularPage, TrendingPage, FavoritePage, MyPage}; //根据需要定制显示的tab
    // PopularPage.navigationOptions.tabBarLabel = '最热'; //动态配置Tab属性
    const themeColor = this.props.theme.themeColor || this.props.theme;
    return (
      <Tab.Navigator
        tabBar={props => {
          this.fireEvent(props.state);
          return <BottomTabBar {...props} />;
        }}>
        {Object.entries(tabs).map(item => {
          return (
            <Tab.Screen
              key={item[0]}
              name={item[0]}
              component={item[1].screen}
              options={{
                ...item[1].navigationOptions,
                tabBarActiveTintColor: themeColor,
              }}
            />
          );
        })}
      </Tab.Navigator>
    );
  }

  render() {
    return this._tabNavigator();
  }
}
const mapStateToProps = state => ({
  theme: state.theme.theme,
});

export default connect(mapStateToProps)(DynamicTabNavigator);
