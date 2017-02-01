import React, {Component} from 'react';
import {
  Text,
  Navigator,
} from 'react-native';

export default class PhotoView extends Component {

  static propTypes = {
    imageSet: React.PropTypes.array.isRequired,
  };

  constructor(props) {
    super(props);
  }

  render() {
    return <Text>Hello, PhotoView</Text>
  }
}
