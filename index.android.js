import React, { Component } from 'react';
import {
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
            title='change me' />
          <Scene
            key='photoView'
            component={ PhotoView }
            title='change me'
            direction='vertical'
            hideNavBar={ true }
          />
        </Scene>
      </Router>
    );
  }
}

AppRegistry.registerComponent('tuchong', () => tuchong);
