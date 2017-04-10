import React, { Component } from 'react';
import {
  Animated,
  AppRegistry,
  View,
  Text,
  StatusBar,
} from "react-native";
import { Router, Scene, Modal } from 'react-native-router-flux';

import Home from './home.js';
import TaggedView from './taggedView.js';
import PhotoView from './photoView.js';

class tuchong extends Component {
  constructor() {
    super();
  }

  _setStatusBar() {
    StatusBar.setHidden(true, "fade");
  }

  render() {
    this._setStatusBar();
    return (
      <Router>
        <Scene key='root'>
          <Scene
            key='home'
            component={ Home }
            title='图虫'
            initial={ true } />
          <Scene
            key='taggedView'
            component={ TaggedView }
            navigationBarStyle={{
              backgroundColor: 'transparent'}}
            leftButtonIconStyle={{tintColor: 'black'}} />
          <Scene
            key='photoView'
            component={ PhotoView }
            title='change me'
            direction='vertical'
            navigationBarStyle={
              {backgroundColor: 'transparent',
               borderBottomColor: 'white',
               borderBottomWidth: 2}}
            leftButtonIconStyle={{tintColor: 'white'}}
            />
        </Scene>
      </Router>
    );
  }
}

AppRegistry.registerComponent('tuchong', () => tuchong);
// import React, { Component } from 'react';
// import {
//   AppRegistry,
//   View,
//   Text,
//   StatusBar,
// } from "react-native";
//
// import MainView from "./main.js"; // you can rename the exported if it's a default export
// import {Main} from "./main.js";   // or you have to use {exact name} if it's a name export
//
// export default class tuchong extends Component {
//   constructor() {
//     super();
//     this.state = {
//       tabs: ["风光", "人像", "纪实", "建筑", "旅行", "少女", "人文", "街拍", "夜景", "静物", "私房"],
//     }
//   }
//
//   _setStatusBar() {
//     StatusBar.setHidden(true, "fade");
//   }
//
//   render() {
//     this._setStatusBar();
//     return (
//       <MainView tabs={this.state.tabs}/>
//     );
//   }
// }
//
// AppRegistry.registerComponent('tuchong', () => tuchong);
