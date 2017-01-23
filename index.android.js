import React, { Component } from 'react';
import {
  AppRegistry,
  View,
  Text,
  StatusBar,
} from "react-native";

import MainView from "./main.js"; // you can rename the exported if it's a default export
import {Main} from "./main.js";   // or you have to use {exact name} if it's a name export

export default class tuchong extends Component {
  constructor() {
    super();
    this.state = {
      tabs: ["风光", "人像", "纪实", "建筑", "旅行", "少女"],
    }
  }

  _setStatusBar() {
    StatusBar.setHidden(true, "slide");
  }

  render() {
    this._setStatusBar();
    return (
      <MainView tabs={this.state.tabs}/>
    );
  }
}

AppRegistry.registerComponent('tuchong', () => tuchong);
