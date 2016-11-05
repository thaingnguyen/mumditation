import React, { Component } from 'react';
import {
  WebView,
  Linking
} from 'react-native';

export default class NativeWebView extends Component {

  render() {
    return (
      <WebView
        source={{uri: this.props.uri}}
      />
    );
  }
}
