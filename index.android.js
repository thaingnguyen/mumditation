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
