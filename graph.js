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

    render() {
        return (
            <LineChart
            style={styles.chart}
            data={this.props.data}
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
        );
    }
}


const styles = StyleSheet.create({
  chart: {
    flex: 1,
    margin: 10
  }
});
