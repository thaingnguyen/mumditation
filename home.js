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
      heart_rate : {},
      data: {},
      access_token: props.access_token
    };

    setInterval(this.getAndPopulateData.bind(this), 1000 * 60);
  }

  getAndPopulateData() {
    if (this.state) {
      this._getData(this.state.access_token).then((res) => {
        console.log(res);
        this.setState({heart_rate: HRVCalculator.getHRV(JSON.parse(res['_bodyInit']))});
      }).then(() => {
        if (this.state.heart_rate['stress'] === 'High') {
          this._giveAdvice();
        }
        this.setState(
          reactAddonsUpdate(this.state, {
            data: {
              $set: {
                datasets: [{
                  yValues: this.state.heart_rate['rmssd'],
                  label: '',
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
    }
  }

  componentWillMount() {
    this.getAndPopulateData();
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
            subtitle="Daily report"
            title="Mumditation"
            titleColor="white"
            subtitleColor="white"/>

        <View style={styles.infoContainer}>
          <View style={styles.info}>
            <Text style={styles.infoText}>HRV</Text>
            <Text style={styles.infoText}>{this.state.heart_rate['avg_rmssd']}</Text>
          </View>
          <View style={styles.info}>
            <Text style={styles.infoText}>BPM</Text>
            <Text style={styles.infoText}>{this.state.heart_rate['bpm']}</Text>
          </View>
        </View>

        <View style={styles.infoContainer}>
          <View style={styles.info}>
            <Text style={styles.infoText}>Stress Level</Text>
            <Text style={styles.infoText}>{this.state.heart_rate['stress']}</Text>
          </View>
        </View>

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
        'We recommend you go pet baby goats, if you don\'t have access to baby goats you can click the video below or listen to some soothing music',
        [
          {text: 'Later', onPress: () => console.log('Cancel Pressed'), style: 'cancel'},
          {text: 'Cute Video', onPress: () => Linking.openURL("https://youtu.be/JmGSCIy7-kk?t=36").catch(err => console.error('An error occurred', err))},
          {text: 'Play Music', onPress: () => Linking.openURL("https://open.spotify.com/track/2QfFLpSGF1T1pY6tq4kD7Z").catch(err => console.error('An error occurred', err))},
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
    backgroundColor: '#F5FCFF'
  },
  toolbar: {
    backgroundColor: '#fd5c63',
    height: 60,
    paddingBottom: 15,
    marginBottom: 10
  },
  infoContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  info: {
    width: 200,
    flexDirection: 'column',
    padding: 10
  },
  infoText: {
    textAlign: 'center',
    fontSize: 20
  }
});

AppRegistry.registerComponent('Home', () => Home);
