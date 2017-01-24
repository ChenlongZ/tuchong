import React, {Component} from "react";
import {
  View,
  Image,
  Text,
  Platform, 
  ScrollableView,
  RefreshControl,
  Dimension,
  ActivityIndicator,
} from "react-native";
import InfiniteScrollView from 'react-native-infinte-scroll-view'; 

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
	const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
	this.imagePool = [];   // maximum 100 images per tab, 20 per fetch
    this.state = {
	  loading: false,
      dataSource: ds.cloneWithRows(this.imagePool),
	};
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
	this.imageWidth = Dimension.get("window").width;
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
				  ar: parseFloat(img.height) / parseFloat(img.width),
			  };
		  });
		feed.coverImageUrl = feed.postImages[0].url; 
		feed.coverImageAR = feed.postImages[0].ar;
		return feed;
	  });
	  imagePool.concat(result);
	  this.setState({
		dataSource: ds.cloneWithRows(imagePool),
		loading: false,
      });
    });
	.catch((error) => {
		alert("连接服务器失败");
	});
  }

  render() {
	let progressBar = Platform.OS === "ios"
		  ?()
		  :();
	let spinner = <ActivityIndicator size="large" style={{justifyContent:"center", alignItems:"center", padding:10}}/>;
	let imageWidth = Dimension.get("window").width;
    return (
	   <ListView 
		  style={styles.mainContainer}
		  refreshControl={
			  <RefreshControl
				  refreshing={this.state.loading}
				  onRefresh={this._refreshData.bind(this)}/>
		  }
		  dataSource={this.state.dataSource}
		  renderRow={this._renderRow}
		  renderScrollComponent={(props) => <RecyclerViewBackedScrollView {...props}/>}
		  renderSeparator={this._renderSeparator}
		  onEndReached={this._loadmore}
		  onEndReachedThreshold={10}
	  />	
	);
  }
  _renderRow(rowData, sectionID, rowID, highlightRow) => {
      let imageWidth = this.imageWidth;
	  let imageHeight = imageWidth * rowData.coverImageAR;
	  return (
		<TouchableOpacity onPress={() => {
		  this._pressRow(rowData, rowID);
	      highlightRow(sectionID, rowID);
		  }}>
	      <View style={{style.row}}>
		    <Image source={{uri: img.coverImageUrl, width: imageWidth, height: imageHeight }}/>
			<View style={{width: imageWidth, height: 20, backgroundColor: "white"}}/>
		  </View>
		</TouchableOpacity>
	  );
  }
	_renderSeparator(sectionID, rowID, adjacentRowHighlighted) {
		return <View
			key={sectionID + "-" + rowID}
			style={{ height: adjacentRowHightlighted ? 2 :1;}}/>
	}
	//clear current data and reload 20 images
	_refreshData() {

	}
	//load 20 more images and append to current list
	_loadmore() {
	}
}
