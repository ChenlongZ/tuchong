import React, { Component } from 'react';
import {
  View,
  ListView,
  Text,
} from 'react-native';
import { Actions } from 'react-native-router-flux';

//tag url format: tuchong.com/rest/tags/风光/post?type=subject&page=1&order=new
//user url format: https://tuchong.com/rest/sites/280431/posts/2017-01-19 15:07:38?limit=10"
//image url format: "https://photo.tuchong.com/" + userId + "/%format/" + imageId + ".jpg"
// format: {
    // f: full
    // g: grid
    // s: small
    // m: medium
    // l: large
//}
const tagBaseUrl = "https://tuchong.com/rest/tags/";
const userBaseUrl = "https://tuchong.com/rest/sites/";
const imageBaseUrl = "https://photo.tuchong.com/";

const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});

export default class TaggedView extends Component {

  static propTypes = {
    tag: React.PropTypes.string.isRequired,
  }

  constructor(props) {
    super();
    this.imagePool = [];
    this.pageNum;
    this.isLoading = false;
    this.state = {
      hotNew: true, //true for hot
      dataSource: ds.cloneWithRows(this.imagePool)
    }
  }

  _fetch() {
    this.isLoading = true;
  	fetch_url = `${tagBaseUrl}${this.props.tag}/posts?type=subject${this.state.hotNew?'':'&order=new'}&page=${this.pageNum}`;
    fetch(fetch_url)
    .then((response) => response.json())
    .then((responseJson) => {
      result = responseJson.postList.map((elem, index) => {
        var feed = {};
        feed.title = elem.title;
        feed.coverImageGridUrl = elem.cover_image_src;
        feed.coverImageLargeUrl = elem.cover_image_src.replace(/(\d+)\/(.+)\/(\d+.jpg)/, "$1/l/$3");
        feed.coverImageMediumUrl = elem.cover_image_src.replace(/(\d+)\/(.+)\/(\d+.jpg)/, "$1/m/$3");
        feed.coverImageSmallUrl = elem.cover_image_src.replace(/(\d+)\/(.+)\/(\d+.jpg)/, "$1/s/$3");
      	feed.likes = parseInt(elem.favorites);
      	feed.comments = parseInt(elem.comments);
      	feed.publishedAt = elem.published_at;
      	feed.authorId = parseInt(elem.author_id);
      	feed.authorUrl = userBaseUrl + parseInt(elem.author_id) + "/posts/" + elem.published_at;
      	feed.postImages = elem.images.map((img, index) => {
  			 return {
  			  url: imageBaseUrl + img.user_id + "/f/" + img.img_id + ".jpg",
  			  height: img.height,
  			  width: img.width,
  			  ar: parseFloat(img.height) / parseFloat(img.width),
  			 };
  		  });
    	feed.coverImageAR = feed.postImages[0].ar;
    	return feed;
  	 });
    this.isLoading = false;
  	this.imagePool = this.imagePool.concat(result);
  	this.setState({
    	dataSource: ds.cloneWithRows(this.imagePool),
      });
    })
    .catch((error) => {
      // alert(error);
    	alert("连接服务器失败");
    });
  }

  componentDidMount() {
    this.pageNum = 1;
    this._fetch();
  }

  render() {
    return (
      // transparent nav bar with a back button, TODO: gone when scroll down

      // thumbnail of the 1st picture (1/3 screen)

      // tag name, sub title, hot/new taggle

      // infinte scroll view (max = 10 pages)
      // two picture in a row, adjust heigth
      <View style={{margin: 128}}>
        <Text onPress={Actions.photoView}>This is {this.props.tag}!</Text>
      </View>
    )
  }
}
