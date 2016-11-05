import React, { Component } from 'react';
import {
  AppRegistry,
  Linking
} from 'react-native';
import Home from './home.js';
import Login from './login.js';
import NativeWebView from './webview.js';
import qs from 'qs';
import {Actions, Scene, Router} from 'react-native-router-flux';

export default class mumditation extends Component {

  constructor(props) {
    super(props);
    this.state = {
      access_token: null
    };
  }

  componentWillMount() {
    console.log("mount");
    console.log(this.state);
    if (this.state.access_token) {
      Actions.home({access_token: this.state.access_token});
    } else {
      Linking.getInitialURL().then(this._handleOpenURL.bind(this));
    }
  }

  _handleOpenURL(url) {
    if (url) {
      const [, query_string] = url.match(/\#(.*)/);
      const query = qs.parse(query_string);
      this.setState({access_token: query.access_token})
      Actions.home({access_token: query.access_token});
    }
  }

  render() {
    return (
      <Router hideNavBar={true}>
        <Scene key="root">
          <Scene key="login" component={Login}/>
          <Scene key="home" component={Home}/>
          <Scene key="webview" component={NativeWebView}/>
        </Scene>
      </Router>
    )
  }
}

AppRegistry.registerComponent('mumditation', () => mumditation);
