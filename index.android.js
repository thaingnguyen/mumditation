/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component } from 'react';
import {
  AppRegistry,
  StyleSheet,
  Text,
  View,
  Image,
  Linking
} from 'react-native';
import config from './config.js';
import qs from 'qs';
import Button from 'react-native-button';

function getMoviesFromApiAsync() {
  return fetch('https://facebook.github.io/react-native/movies.json')
    .then((response) => response.json())
    .then((responseJson) => {
      return responseJson.movies;
    })
    .catch((error) => {
      console.error(error);
    });
}

function OAuth(client_id, cb) {

   // Listen to redirection
  Linking.addEventListener('url', handleUrl);
  function handleUrl(event){
    console.log(event.url);
    Linking.removeEventListener('url', handleUrl);
    const [, query_string] = event.url.match(/\#(.*)/);
    console.log(query_string);

    const query = qs.parse(query_string);
    console.log(`query: ${JSON.stringify(query)}`);

    cb(query.access_token);

    /*if (query.state === state) {
      cb(query.code, getProfileData, 'access_token');
    } else {
      console.error('Error authorizing oauth redirection');
    }*/
  }

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

function getData(access_token) {
  fetch(
     'https://api.fitbit.com/1/user/-/activities/heart/date/today/1d.json',
    {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${access_token}`
      },
      //body: `root=auto&path=${Math.random()}`

    }
  ).then((res) => {
    return res.json()
  }).then((res) => {
    console.log(`res: ${JSON.stringify(res)}`);
  }).catch((err) => {
    console.error('Error: ', err);
  });
}

export default class mumditation extends Component {

  constructor(props) {
    super(props);

    this.state = {
      movies: '',
    };
  }

  componentDidMount() {
    const url = Linking.getInitialURL().then(url => {
      if (url) {
        const route = url.replace(/.*?:\/\//g, "");
        this._navigator.replace(this.state.routes[route]);
      }
    });
  }

  _fitbitLogin(event) {
    OAuth(config.client_id, getData);
  }

  render() {

    getMoviesFromApiAsync().then((movies) => {
      this.setState({ movies: movies[0].title });
    });

    return (
      <View style={styles.container}>
        <Text style={styles.welcome}>
          {this.state.movies}
        </Text>
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
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5,
  },
});

AppRegistry.registerComponent('mumditation', () => mumditation);
