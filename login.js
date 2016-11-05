import React, { Component } from 'react';
import {
  Text,
  View,
  StyleSheet
} from 'react-native';
import Button from 'react-native-button';
import config from './config.js';

function OAuth(client_id) {

   // Call OAuth
  const oauthurl = 'https://www.fitbit.com/oauth2/authorize?'+
            qs.stringify({
              client_id,
              response_type: 'token',
              scope: 'heartrate activity activity profile sleep',
              redirect_uri: 'mppy://fit',
              expires_in: '31536000',
              //state,
            });
  console.log(oauthurl);

  Linking.openURL(oauthurl).catch(err => console.error('Error processing linking', err));
}

export default class Login extends Component {
  _fitbitLogin(event) {
    OAuth(config.client_id);
  }

  render() {
    return (
      <View style={styles.container}>
        <Button
          style={{borderWidth: 1, borderColor: 'blue'}}
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
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  }
});
