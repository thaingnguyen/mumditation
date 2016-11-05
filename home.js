import React, { Component } from 'react';
import {
  Text,
  View,
  StyleSheet
} from 'react-native';
import Button from 'react-native-button';

export default class Home extends Component {

  constructor(props) {
    super(props);

    this.state = {
      heart_rate: ''
    };
  }

  componentWillMount() {
    this._getData(this.props.access_token).then((res) => {
      console.log(res);
      this.setState({heart_rate: res});
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
        <Text> {this.props.access_token} </Text>
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
