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
import {Actions} from 'react-native-router-flux';
import reactAddonsUpdate from 'react-addons-update';
var ToolbarAndroid = require('ToolbarAndroid');
import * as Progress from 'react-native-progress';
import { AnimatedGaugeProgress, GaugeProgress } from 'react-native-simple-gauge';
import Communications from 'react-native-communications';

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
    var color = null;
    var fill = 0;
    if(this.state.heart_rate['stress'] == 'Low') {
        fill = 33;
        color = '#89CFF0';
    } else if(this.state.heart_rate['stress'] == 'Medium') {
        fill = 66;
        color = '#FFA500';
    } else {
        fill = 100;
        color = '#FF0000';
    }
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
                <Text style={styles.infoTitle}>HRV</Text>
                {this.state.heart_rate['avg_rmssd'] && <AnimatedGaugeProgress
                  size={80}
                  width={15}
                  fill={(this.state.heart_rate['avg_rmssd']-2.94)/1.38 * 100}
                  rotation={90}
                  cropDegree={90}
                  tintColor={color}
                  backgroundColor="#b0c4de"
                  strokeCap="circle"
                  style={styles.circle} />}
                  <Text style={styles.infoText}>{this.state.heart_rate['avg_rmssd']}</Text>
              </View>
              <View style={styles.info}>
                <Text style={styles.infoTitle}>BPM</Text>
                {this.state.heart_rate['bpm'] && <AnimatedGaugeProgress
                  size={80}
                  width={15}
                  fill={this.state.heart_rate['bpm'] / 180 * 100}
                  rotation={90}
                  cropDegree={90}
                  tintColor={color}
                  backgroundColor="#b0c4de"
                  strokeCap="circle"
                  style={styles.circle} />}
                <Text style={styles.infoText}>{this.state.heart_rate['bpm']}</Text>
              </View>
            </View>

            <View style={styles.infoContainer}>
              <View style={styles.info}>
                <Text style={styles.infoTitle}>Stress Level</Text>
                <AnimatedGaugeProgress
                  size={90}
                  width={15}
                  fill={fill}
                  rotation={90}
                  cropDegree={90}
                  tintColor={color}
                  backgroundColor="#b0c4de"
                  strokeCap="circle"style={styles.circle} />
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
          // {text: 'Later', onPress: () => console.log('Cancel Pressed'), style: 'cancel'},
          {text: 'Cute Video', onPress: () => Actions.webview({uri: "https://youtu.be/JmGSCIy7-kk?t=36"})},
          {text: 'Play Music', onPress: () => Actions.webview({uri: "https://open.spotify.com/track/2QfFLpSGF1T1pY6tq4kD7Z"})},
          {text: 'Tell your partner', onPress: () => Communications.text('4133139159', "I'm not feeling well. Can you come home?")},
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
    paddingBottom: 10,
    marginBottom: 5
  },
  infoContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  info: {
    width: 200,
    flexDirection: 'column',
    paddingLeft: 30,
    paddingRight: 15,
    marginBottom: 10
  },
  infoTitle: {
    textAlign: 'center',
    fontSize: 20,
    marginBottom: 10,
    fontWeight: 'bold'
  },
  infoText: {
    textAlign: 'center',
    fontSize: 15,
  },
  circle: {
    justifyContent: 'center',
    alignItems: 'center'
  },
  circleText: {

  }
});

AppRegistry.registerComponent('Home', () => Home);
