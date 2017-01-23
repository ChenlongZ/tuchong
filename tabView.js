import React, {Component} from "react";
import {
  View,
  Image,
  Text,
} from "react-native";

const request = require("request");
const cheerio = require("cheerio");

//tag url format: tuchong.com/rest/tags/风光/post?type=subject&page=1
//user url format: https://tuchong.com/rest/sites/280431/posts/2017-01-19 15:07:38?limit=10"
const tagBaseUrl = "https://tuchong.com/rest/tags/";
const userBaseUrl = "https://tuchong.com/rest/sites/";
const imageBaseUrl = "https://tuchong.com/";

export default class TabView extends Component {
  static propTypes = {
    tabLabel: React.PropTypes.string.isRequired,
  }

  constructor(props) {
    super(props);
    this.state = {
	  loading: false,
      imagePool: [],   // maximum 100 images per tab, 20 per fetch
	}
	_fetchImage.bind(this);
  }

  // fire network request, parse response and update state
  // request: a uri
  // result: a array of 20 items, each item should contain
  // 1) an object has the info of the image: a url to the image to be fetched directly, an aspect ratio of the image, a name of the image, image comments, favorites, excerpts
  // 2) an object has the info of the author: the name of the author, the url to the author's webpage, the icon of the author
  // 3) an array of image in the image set, each should have a direclty url to the image and an aspect ration.
  componentDidMount() {
	this.setState({
		loading: true,
	});
	this._fetchImage();
  }

  _fetchImage() {
    fetch_url = baseUrl + this.props.tabLabel;
    fetch(fetch_url)
    .then((response) => response.json())
    .then((responseJson) => {
      result = responseJson.posts.map((elem, index) => {
        feed = {};
		feed.coverImageTitle = elem.title;
		feed.coverImageLikes = parseInt(elem.favorites);
		feed.coverImageComments = parseInt(elem.comments);
		feed.publishedAt = elem.published_at;
		feed.authorId = parseInt(elem.author_id);
		feed.authorUrl = userBaseUrl + parseInt(elem.author_id) + "/posts/" + elem.published_at;
		feed.postImages = elem.images.map((img, index) => {
			  return {
				  url: imageBaseUrl + img.user_id + "/f/" + img.img_id,
				  height: img.height,
				  width: img.width,
				  ar: parseFloat(img.width)  / parseFloat(img.heigth),
			  };
		  });
		feed.coverImageUrl = feed.postImages[0].url; 
		feed.coverImageAR = feed.postImages[0].ar;
		return feed;
	  });
	  this.setState({
		imagePool: this.state.imagePool == undefined ? result : this.state.imagePool.concat(result),
		loading: false,
      });
    });
	.catch((error) => {
		alert("连接服务器失败");
	});
  }

  render() {
    return (
      <Text>I'm {this.props.tabLabel}</Text>
    )
  }
}
