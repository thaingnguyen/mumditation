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

import reactAddonsUpdate from 'react-addons-update';
import {LineChart} from 'react-native-mp-android-chart';

var ToolbarAndroid = require('ToolbarAndroid');

export default class Home extends Component {

  constructor(props) {
    super(props);

    this.state = {
      access_token : this.props.access_token,
      heart_rate : {},
      data: {},
      legend: {
        enabled: true,
        textColor: 'blue',
        textSize: 12,
        position: 'BELOW_CHART_RIGHT',
        form: 'SQUARE',
        formSize: 14,
        xEntrySpace: 10,
        yEntrySpace: 5,
        formToTextSpace: 5,
        wordWrapEnabled: true,
        maxSizePercent: 0.5,
        fontFamily: 'monospace',
        fontStyle: 1
      }
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
                config: {
                  lineWidth: 2,
                  drawCircles: false,
                  drawCubic: true,
                  highlightColor: 'red',
                  color: 'red'
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

        <LineChart
          style={styles.chart}
          data={this.state.data}
          description={{text: ''}}
          legend={this.state.legend}

          drawGridBackground={false}
          borderColor={'teal'}
          borderWidth={1}
          drawBorders={true}

          touchEnabled={true}
          dragEnabled={true}
          scaleEnabled={true}
          scaleXEnabled={true}
          scaleYEnabled={true}
          pinchZoom={true}
          doubleTapToZoomEnabled={true}

          dragDecelerationEnabled={true}
          dragDecelerationFrictionCoef={0.99}

          keepPositionOnRotation={false}
        />

        <Button 
          style={{borderWidth:0.5, borderColor: 'black'}}
          onPress={this._giveAdvice}>
            Our Advice
        </Button>
      </View>
    );
  }

  _getData(access_token) {
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