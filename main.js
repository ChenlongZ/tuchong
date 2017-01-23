import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
} from 'react-native';

import TabView from "./tabView.js";
import ScrollableTabView from "react-native-scrollable-tab-view";
import ScrollableTabBar from 'react-native-scrollable-tab-view/ScrollableTabBar.js';

const imageUrl = "https://photo.tuchong.com/267872/f/15361536.jpg";

export default class Main extends Component {
  static propTypes = {
    tabs: React.PropTypes.array.isRequired,
  }

  constructor(props) {
    super(props);
  }

  render() {
    return (
      <ScrollableTabView renderTabBar={() => <ScrollableTabBar/>}>
        {/* <Landscape tabLabel="风光"/>
        <Protrait tabLabel="人像"/>
        <City tabLabel="城市"/>
        <Travel tabLabel="旅行"/>
        <Civil tabLabel="人文"/>
        <Document tabLabel="纪实"/>
        <Architecture tabLabel="建筑"/> */}
        {this.props.tabs.map((elem, index) => <TabView key={index} tabLabel={elem}/>)}
      </ScrollableTabView>
    )
  }
}
