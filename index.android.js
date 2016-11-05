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
  // Linking.addEventListener('url', handleUrl);
  // function handleUrl(event){
  //   console.log(event.url);
  //   Linking.removeEventListener('url', handleUrl);
  //   const [, query_string] = event.url.match(/\#(.*)/);
  //   console.log(query_string);
  //
  //   const query = qs.parse(query_string);
  //   console.log(`query: ${JSON.stringify(query)}`);
  //
  //   cb(query.access_token);
  //
  //   /*if (query.state === state) {
  //     cb(query.code, getProfileData, 'access_token');
  //   } else {
  //     console.error('Error authorizing oauth redirection');
  //   }*/
  // }

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

function getHRV(data) {
  var mockData = {
    "activities-heart": [
          {
              "customHeartRateZones": [],
              "dateTime": "today",
              "heartRateZones": [
                  {
                      "caloriesOut": 2.3246,
                      "max": 94,
                      "min": 30,
                      "minutes": 2,
                      "name": "Out of Range"
                  },
                  {
                      "caloriesOut": 0,
                      "max": 132,
                      "min": 94,
                      "minutes": 0,
                      "name": "Fat Burn"
                  },
                  {
                      "caloriesOut": 0,
                      "max": 160,
                      "min": 132,
                      "minutes": 0,
                      "name": "Cardio"
                  },
                  {
                      "caloriesOut": 0,
                      "max": 220,
                      "min": 160,
                      "minutes": 0,
                      "name": "Peak"
                  }
              ],
              "value": "64.2"
          }
      ],
      "activities-heart-intraday": {
          "dataset": [
              {
                  "time": "00:00:00",
                  "value": 64
              },
              {
                  "time": "00:00:10",
                  "value": 63
              },
              {
                  "time": "00:00:20",
                  "value": 64
              },
              {
                  "time": "00:00:30",
                  "value": 65
              },
              {
                  "time": "00:00:45",
                  "value": 65
              }
          ],
          "datasetInterval": 1,
          "datasetType": "second"
      }
  };
  var arr = mockData['activities-heart-intraday']['dataset'];
  var sum = 0;
  for(var x = 0; x < arr.length; x++) {
      sum += arr[x].value;
  }
  var mean = sum/arr.length;
  var sumOfDifferences = 0;
  for(var x = 0; x < arr.length; x++) {
      sumOfDifferences += (arr[x].value-mean)*(arr[x].value-mean);
  }
  var HRV = Math.sqrt(sumOfDifferences/(arr.length-1));
  return "mean: " + mean + ", HRV: " + HRV;
}

function getNumSeconds(input) {
  var t = Date.parse(input);
  return t.getSeconds() + (t.getMinutes()*60) + (t.getHours()*60*60);
}

export default class mumditation extends Component {

  constructor(props) {
    super(props);

    this.state = {
      movies: '',
    };
  }

  componentDidMount() {
    Linking.getInitialURL().then(this._handleOpenURL);
  }

  _handleOpenURL(url) {
    console.log(url);
    if (url) {
      console.log("GET DATA");

      const [, query_string] = url.match(/\#(.*)/);
      console.log(query_string);

      const query = qs.parse(query_string);
      console.log(`query: ${JSON.stringify(query)}`);

      getData(query.access_token);
    }
  }

  _fitbitLogin(event) {
    OAuth(config.client_id, getData);
  }

  render() {

    getMoviesFromApiAsync().then((movies) => {
      this.setState({ str: getHRV() });
    });

    return (
      <View style={styles.container}>
        <Text style={styles.welcome}>
          {this.state.str}
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
