import React, { Component } from 'react';
import {
  AppRegistry,
  Text,
  View,
  StyleSheet,
  Alert,
  Linking
} from 'react-native';
import Button from 'react-native-button';
import HRVCalculator from './hrv.js';
import Graph from './graph.js';

import reactAddonsUpdate from 'react-addons-update';
var ToolbarAndroid = require('ToolbarAndroid');

export default class Home extends Component {

  constructor(props) {
    super(props);

    this.state = {
      access_token : this.props.access_token,
      heart_rate : {},
      data: {}
    };
  }

  componentDidMount() {
    
  }

  componentWillMount() {
    this._getData(this.props.access_token).then((res) => {
      this.setState({heart_rate: HRVCalculator.getHRV(JSON.parse(res['_bodyInit']))});
    }).then( () => {
      this.setState(
        reactAddonsUpdate(this.state, {
          data: {
            $set: {
              datasets: [{
                yValues: this.state.heart_rate['rmssd'],
                label: 'Running RMDDS',
                setDrawGridLines: false,
                config: {
                  lineWidth: 2,
                  drawCircles: false,
                  drawCubic: true,
                  highlightColor: 'red',
                  color: 'red',
                  setDrawGridLines: false,
                  setEnabled: false,
                },
                xAxis: {
                  $set: {
                    drawLabels: false,
                    drawGridLines: false,
                  }
                },
                yAxis: {
                  $set: {
                    drawLabels: false,
                    drawGridLines: false,
                  }
                }
              }],
              xValues: this.state.heart_rate['time']
            }
          }
        })
      );
    });
  };

  render() {
    return (
      <View style={styles.container}>
        <ToolbarAndroid
            actions={toolbarActions}
            //navIcon={require('./app_logo.jpg')}
            onActionSelected={this._onActionSelected}
            onIconClicked={() => this.setState({actionText: 'Icon clicked'})}
            style={styles.toolbar}
            subtitle="Your current report"
            title="Mumditate" />
        <Button
          style={{borderWidth: 1, borderColor: 'blue'}}
          onPress={this._getData}>
          Refresh Heart Rate Graph
        </Button>
        <Text style={styles.text}>Your average RMSSD: {this.state.heart_rate['avg_rmssd']}</Text>

        <Graph data={this.state.data}></Graph>

        <Button 
          style={{borderWidth:0.5, borderColor: 'black', height: 35}}
          onPress={this._giveAdvice}>
            Our Advice
        </Button>
      </View>
    );
  }

  _getData(access_token) {
      console.log("Getting data _getData");
      return fetch(
         'https://api.fitbit.com/1/user/-/activities/heart/date/today/1d/1sec/time/00:00/23:59.json',
        {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${access_token}`
          },
        }
      );
  }

  _giveAdvice() {
    console.log("Giving advice to users.");
      Alert.alert(
        'It seems like you are stressed out',
        'We would suggest that you take a meditation break.\nWould you like to start a meditation break?',
        [
          {text: 'Ask me later', onPress: () => console.log('Ask me later pressed')},
          {text: 'Cancel', onPress: () => console.log('Cancel Pressed'), style: 'cancel'},
          {text: 'OK', onPress: () => Linking.openURL("https://open.spotify.com/track/2QfFLpSGF1T1pY6tq4kD7Z").catch(err => console.error('An error occurred', err))},
        ]
      )
    }
}

var toolbarActions = [
  {title: 'Create', icon: require('./ic_account_circle_black_24dp.png'), show: 'always'},
  {title: 'Signout'},
  {title: 'Settings', icon: require('./ic_settings_black_24dp.png'), show: 'always'},
];

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    // alignItems: 'center',
    backgroundColor: '#F5FCFF'
  },
  chart: {
    flex: 1,
    margin: 10
  },
  text: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 15,
    margin: 10
  },
  toolbar: {
    backgroundColor: '#e9eaed',
    height: 56,
    paddingBottom: 15,
    marginBottom: 10
  }
});

AppRegistry.registerComponent('Home', () => Home);