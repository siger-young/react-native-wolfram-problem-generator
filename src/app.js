import { Provider } from 'react-redux';
import store from './redux/store';

import React from 'react';
import {
  AppRegistry,
  Platform,
  BackAndroid,
  Navigator,
} from 'react-native';

import Router from './router';
import Drawer from './components/Drawer'

export default class App extends React.Component {
  constructor(props) {
    super(props);
    if (!App.instance) {
      App.instance = this;
    }
  }
  static getInstance() {
    return App.instance;
  }
  push(router) {
    this.navigator.push(router);
  }
  pop(num = 1) {
    const nav = this.navigator;
    const routes = nav.getCurrentRoutes();
    if (num === 1) {
      nav.pop();
    } else {
      if (routes.length > num) {
        nav.popToRoute(routes[routes.length - 1 - num]);
      }
    }
  }
  popToRoot() {
    const nav = this.navigator;
    const routes = nav.getCurrentRoutes();
    if (routes.length > 1) {
      nav.popToRoute(routes[0]);
    }
  }
  replace(page) {
    this.navigator.replace(page);
  }
  jumpTo(page) {
    this.navigator.jumpTo(page);
  }
  componentWillMount() {
    if (Platform.OS === 'android') {
      BackAndroid.addEventListener('hardwareBackPress', this.onBackAndroid);
    }
  }
  componentWillUnmount() {
    if (Platform.OS === 'android') {
      BackAndroid.removeEventListener('hardwareBackPress', this.onBackAndroid);
    }
  }
  onBackAndroid = () => {
    const nav = this.navigator;
    const routers = nav.getCurrentRoutes();
    if (routers.length > 1) {
      nav.pop();
      return true;
    }
    return false;
  };
  initialRoute = Router.pages.News;
  configureScene() {
    if (Platform.OS === 'ios') {
      return Navigator.SceneConfigs.PushFromRight;
    }
    return Navigator.SceneConfigs.FloatFromBottomAndroid;
  }
  renderScene(route, navigator) {
    const Component = route.component;

    return (
      <Drawer drawerLockMode={route.params.drawerLockMode} navigator={navigator}>
        <Component {...route.params} navigator={navigator} />
      </Drawer>
    );
  }
  render() {
    return (
      <Provider store={store} key="provider">
        <Navigator
          ref={nav => { this.navigator = nav; }}
          initialRoute={this.initialRoute}
          configureScene={() => this.configureScene()}
          renderScene={(route, navigator) => this.renderScene(route, navigator)}
        />
      </Provider>
    );
  }
}

AppRegistry.registerComponent('QiuzhenAssistant', () => App);
