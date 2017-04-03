import React, { Component } from 'react';
import { View, Text } from 'react-native';
import { Actions } from 'react-native-router-flux';

export default class PageOne extends Component {
  render() {
    return (
      <View style={{backgroundColor: 'black', flex: 1}}>
        <View style={{margin: 128}}>
          <Text style={{color: 'white'}} onPress={Actions.Home}>This is photoView (Modal)!</Text>
        </View>
      </View>
    )
  }
}
