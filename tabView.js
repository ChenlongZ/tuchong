import React, {Component} from "react";
import {
  View,
  Image,
  Text,
} from "react-native";

const request = require("request");
const cheerio = require("cheerio");

const baseUrl = "https://tuchong.com/rest/recommend/"

export default class TabView extends Component {
  static propTypes = {
    tabLabel: React.PropTypes.string.isRequired,
  }

  constructor(props) {
    super(props);
    this.state = {
      imagePool: [],   // maximum 100 images per tab, 20 per fetch
    }
  }

  // fire network request, parse response and update state
  // request: a uri
  // result: a array of 20 items, each item should contain
  // 1) an object has the info of the image: a url to the image to be fetched directly, an aspect ratio of the image, a name of the image, image comments, favorites, excerpts
  // 2) an object has the info of the author: the name of the author, the url to the author's webpage, the icon of the author
  // 3) an array of image in the image set, each should have a direclty url to the image and an aspect ration.
  componentDidMount() {
    alert("Mounted!");
  }

  _fetchImage() {
    fetch_url = baseUrl + this.props.tabLabel;
    fetch(fetch_url)
    .then((response) => response.json())
    .then((responseJson) => {
      feed = {}
      responseJson.posts.map((elem, index) => {
        
      })
    })
    .catch((error) => alert("连接服务器失败"));
  }

  render() {
    return (
      <Text>I'm {this.props.tabLabel}</Text>
    )
  }
}
