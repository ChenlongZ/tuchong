import React, { Component } from 'react';
import { View, Text } from 'react-native';
import { Actions } from 'react-native-router-flux';

export default class TaggedView extends Component {
  render() {
    return (
      <View style={{margin: 128}}>
        <Text onPress={Actions.photoView}>This is {this.props.data}!</Text>
      </View>
    )
  }
}
