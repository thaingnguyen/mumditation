import React, { Component } from 'react';
import {
  AppRegistry,
  Text,
  View,
  StyleSheet,
  Alert
} from 'react-native';
import HRVCalculator from './hrv.js';

import reactAddonsUpdate from 'react-addons-update';
import {LineChart} from 'react-native-mp-android-chart';

export default class Graph extends Component {

    constructor() {
        super();

        this.state = {
            legend: {
                enabled: false,
            },
            xAxis : {
                drawLabels: false,
                drawGridLines: false,
                enabled: false,
            },
            yAxis : {
                drawLabels: false,
                drawGridLines: false,
                enabled:false,
                left: {
                    enabled: false
                },
                right: {
                    enabled: false
                }
            }
        };
    }

    render() {
        return (
            <LineChart
            style={styles.chart}
            data={this.props.data}
            description={{text: ''}}
            legend={this.state.legend}
            xAxis={this.state.xAxis}
            yAxis={this.state.yAxis}

            setDrawLabels={false}
            setDrawGridBackground={false}
            setDrawBorders={false}
            setDrawGridLines={false}
            drawGridBackground={false}

            borderColor={'teal'}
            borderWidth={1}
            drawBorders={false}

            touchEnabled={true}
            dragEnabled={true}
            scaleEnabled={false}
            scaleXEnabled={false}
            scaleYEnabled={false}
            pinchZoom={true}
            doubleTapToZoomEnabled={true}

            dragDecelerationEnabled={true}
            dragDecelerationFrictionCoef={0.99}

            keepPositionOnRotation={false}
            />
        );
    }
}


const styles = StyleSheet.create({
  chart: {
    flex: 1,
    margin: 10
  }
});
