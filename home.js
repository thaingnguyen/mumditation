import React, { Component } from 'react';
import {
  Text,
  View,
  StyleSheet
} from 'react-native';
import Button from 'react-native-button';
import HRVCalculator from './hrv.js';

export default class Home extends Component {

  constructor(props) {
    super(props);

    this.state = {
      heart_rate: ''
    };
  }

  componentWillMount() {
    this._getData(this.props.access_token).then((res) => {
      this.setState({heart_rate: HRVCalculator.getHRV(JSON.parse(res['_bodyInit']))});
    });
  }

  render() {
    return (
      <View style={styles.container}>
        <Button
          style={{borderWidth: 1, borderColor: 'blue'}}
          onPress={this._getData}>
          Get Heart Rate
        </Button>
        <Text> {this.state.heart_rate} </Text>
      </View>
    );
  }

  _getData(access_token) {
      return fetch(
         'https://api.fitbit.com/1/user/-/activities/heart/date/today/1d.json',
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
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  }
});
