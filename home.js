import React, { Component } from 'react';
import {
  AppRegistry,
  Text,
  View,
  StyleSheet
} from 'react-native';
import Button from 'react-native-button';
import HRVCalculator from './hrv.js';

import reactAddonsUpdate from 'react-addons-update';
import {LineChart} from 'react-native-mp-android-chart';

export default class Home extends Component {

  constructor(props) {
    super(props);

    this.state = {
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
                  color: 'black'
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
        <Button
          style={{borderWidth: 1, borderColor: 'blue'}}
          onPress={this._getData}>
          Get Heart Rate
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
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    // alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  chart: {
    flex: 1
  },
  text: {
    alignItems: 'center',
    justifyContent: 'center'
  }
});

AppRegistry.registerComponent('Home', () => Home);