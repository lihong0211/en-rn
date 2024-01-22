import React, { Component } from 'react';
import SafeAreaViewPlus from 'react-native-safe-area-plus';
import { connect } from 'react-redux';
import DynamicTabNavigator from '../navigator/DynamicTabNavigator';
import NavigationUtil from '../navigator/NavigationUtil';
import CustomTheme from '../page/CustomTheme';
import actions from "../action";

class HomePage extends Component {
  constructor(props) {
    super(props);
    // fix remove BackPressComponent
  }
  renderCustomThemeView() {
    const { customThemeViewVisible, onShowCustomThemeView } = this.props;
    return (<CustomTheme
      visible={customThemeViewVisible}
      {...this.props}
      onClose={() => onShowCustomThemeView(false)}
    />)
  }
  render() {
    //使用从store中注入的props
    const themeColor = this.props.theme.themeColor || this.props.theme;
    NavigationUtil.navigation = this.props.navigation;
    return <SafeAreaViewPlus topColor={themeColor}>
      <DynamicTabNavigator />
      {this.renderCustomThemeView()}
    </SafeAreaViewPlus>
  }
}
//我们声明`HomePage`组件需要整个 store 中的哪一部分数据作为自己的 props
const mapStateToProps = (state) => ({
  theme: state.theme.theme,
  customThemeViewVisible: state.theme.customThemeViewVisible,
});
const mapDispatchToProps = dispatch => ({
  onShowCustomThemeView: (show) => dispatch(actions.onShowCustomThemeView(show)),
});
//包装 component，注入 state 到其默认的 connect(mapStateToProps)(HomePage) 中；
//这里用到了`connect`，我们将`mapStateToProps`作为参数传给`connect`，`connect`会返回一个生成组件函数，然后我们将App组件当做参数传给这个函数。
export default connect(mapStateToProps, mapDispatchToProps)(HomePage);
