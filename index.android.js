/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component } from 'react';
import {
  AppRegistry,
  Linking
} from 'react-native';
import Home from './home.js';
import Login from './login.js';
import qs from 'qs';
import {Actions, Scene, Router} from 'react-native-router-flux';

export default class mumditation extends Component {

  componentDidMount() {
    Linking.getInitialURL().then(this._handleOpenURL);
  }

  _handleOpenURL(url) {
    console.log(url);
    if (url) {
      console.log("GET DATA");
      const [, query_string] = url.match(/\#(.*)/);
      // console.log(query_string);
      const query = qs.parse(query_string);
      // console.log(`query: ${JSON.stringify(query)}`);
      Actions.home({access_token: query.access_token});
      // return AsyncStorage.setItem("access_token", query.access_token);
    }
  }

  render() {
    return (
      <Router hideNavBar={true}>
        <Scene key="root">
          <Scene key="login" component={Login}/>
          <Scene key="home" component={Home}/>
        </Scene>
      </Router>
    )
  }
}

AppRegistry.registerComponent('mumditation', () => mumditation);
