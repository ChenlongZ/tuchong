import React, {Component} from 'react';
import {
    Animated,
    AppRegistry,
    Text,
    TouchableOpacity,
    StatusBar,
    View,
} from "react-native";
import {Actions, ActionConst, Router, Scene, Modal} from 'react-native-router-flux';

import Home from './home.js';
import TaggedView from './taggedView.js';
import PhotoView from './photoView.js';

class tuchong extends Component {
    constructor() {
        super();
        this.state = {
            hot: false,
        }
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
                        initial={ true }/>
                    <Scene
                        key='taggedView'
                        component={ TaggedView }
                        navigationBarStyle={{
                            backgroundColor: 'rgba(0, 0, 0, 0.2)',
                            borderBottomWidth: 0,
                        }}
                        titleStyle={{
                            color: 'rgba(255, 255, 255, 0.8)',
                            fontWeight: '700'
                        }}
                        leftTitle='Home'
                        leftButtonIconStyle={{
                            tintColor: 'rgba(255, 255, 255, 0.8)',
                            marginLeft: 10,
                        }}
                        onBack={() => {
                            console.log("Going to Home.js");
                            this.setState({
                                hot: false,
                            });
                            Actions.pop();
                        }}
                        renderRightButton={() =>
                            <TouchableOpacity
                                style={{
                                    marginRight: 10,
                                }}
                                onPress={() => {
                                    this.setState({
                                        hot: !this.state.hot
                                    });
                                    Actions.taggedView({type: ActionConst.REFRESH, hot: this.state.hot});
                                }}>
                                <Text style={{
                                    color: 'rgba(255, 255, 255, 0.8)',
                                    fontSize: 15,
                                    fontWeight: '500',
                                }}>{this.state.hot ? "最新" : "最热"}</Text>
                            </TouchableOpacity>
                        }
                    />
                    <Scene
                        key='photoView'
                        component={ PhotoView }
                        navigationBarStyle={{
                            backgroundColor: 'black',
                        }}
                        titleStyle={{
                            color: 'rgba(255, 255, 255, 0.9)',
                            fontWeight: '500',
                        }}
                        leftButtonIconStyle={{
                            tintColor: 'white',
                            marginLeft: 10,
                        }}
                    />
                </Scene>
            </Router>
        );
    }
}

AppRegistry.registerComponent('tuchong', () => tuchong);
