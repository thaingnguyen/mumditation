import React, { Component } from 'react';
import {
  Text,
  View,
  StyleSheet,
  Linking
} from 'react-native';
import Button from 'react-native-button';
import config from './config.js';
import qs from 'qs';

function OAuth(client_id) {
  const oauthurl = 'https://www.fitbit.com/oauth2/authorize?'+
            qs.stringify({
              client_id,
              response_type: 'token',
              scope: 'heartrate activity activity profile sleep',
              redirect_uri: 'mppy://fit',
              expires_in: '31536000',
            });

  Linking.openURL(oauthurl).catch(err => console.error('Error processing linking', err));
}

export default class Login extends Component {
  _fitbitLogin(event) {
    OAuth(config.client_id);
  }

  render() {
    return (
      <View style={styles.container}>
        <Text style={styles.brand}>
          Mumditation
        </Text>
        <Text style={styles.slogan}>
          Experience a stress-free pregnancy
        </Text>
        <Button
          containerStyle={styles.button_container}
          style={styles.button}
          onPress={this._fitbitLogin}>
          Log In with Fibit
        </Button>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fd5c63',
  },
  brand: {
    fontSize: 45,
    color: 'white',
    textAlign: 'center'
  },
  slogan: {
    fontSize: 20,
    color: 'white',
    textAlign: 'center',
    marginBottom: 150
  },
  button_container: {
    padding: 15,
    height: 60,
    overflow: 'hidden',
    borderRadius: 4,
    backgroundColor: 'grey',
  },
  button: {
    fontSize: 20,
    color: 'white'
  }
});
