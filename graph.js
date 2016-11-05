import React, { Component } from 'react';
import {
  AppRegistry,
  Text,
  View,
  StyleSheet,
} from 'react-native';
import {LineChart} from 'react-native-mp-android-chart';

export default class Graph extends Component {

    render() {
        return (
            <LineChart
            style={styles.chart}
            data={this.props.data}
            description={{text: ''}}

            drawGridBackground={false}
            borderColor={'teal'}
            borderWidth={1}
            drawBorders={true}

            setDrawLabel={false}
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
