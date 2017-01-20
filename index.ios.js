/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component } from 'react';
import {
  AppRegistry,
  StyleSheet,
  Text,
  View, 
  Image
} from 'react-native';

const ScrollableTabView = require("react-native-scrollable-tab-view");
import ScrollableTabBar from 'react-native-scrollable-tab-view/ScrollableTabBar.js';

const imageUrl = "https://photo.tuchong.com/267872/f/15361536.jpg";

export default class tuchong extends Component {
  constructor(props) {
    bimagePool = {
      "landscape": [],
      "protrait": [],
      "travel": [],
      "document": [],
      "civil": [],
      "architecture": [],
      "city": [],
    };     //max length = 100 for each tag
  } 
  
  render() {
    return (
      <ScrollableTabView renderTabBar={() => <ScrollableTabBar/>}>
        <Landscape tabLabel="风光"/>
        <Protrait tabLabel="人像"/>
        <City tabLabel="城市"/>
        <Travel tabLabel="旅行"/>
        <Civil tabLabel="人文"/>
        <Document tabLabel="纪实"/>
        <Architecture tabLabel="建筑"/>
      </ScrollableTabView>
    );
  }
}

class Landscape extends Component{
  render() {
    return 		<Image source={{uri: imageUrl}} style={{width:500, height:250}}/> 
  }
}
class Protrait extends Component{
  render() {
    return 		<Image source={{uri: imageUrl}} style={{width:500, height:250}}/> 
  }
}

class City extends Component{
  render() {
    return 		<Image source={{uri: imageUrl}} style={{width:500, height:250}}/> 
  }
}

class Travel extends Component{
  render() {
    return 		<Image source={{uri: imageUrl}} style={{width:500, height:250}}/> 
  }
}

class Civil extends Component{
  render() {
    return 		<Image source={{uri: imageUrl}} style={{width:500, height:250}}/> 
  }
}

class Architecture extends Component{
  render() {
    return 		<Image source={{uri: imageUrl}} style={{width:500, height:250}}/> 
  }
}

class Document extends Component{
  render() {
    return 		<Image source={{uri: imageUrl}} style={{width:500, height:250}}/> 
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5,
  },
});

AppRegistry.registerComponent('tuchong', () => tuchong);
