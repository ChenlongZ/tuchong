import React, {Component} from "react";
import {
  View,
  Image,
  Text,
  Platform, 
  ListView,
  StyleSheet,
  RefreshControl,
  RecyclerViewBackedScrollView,
  Dimensions,
  ProgressBarAndroid,
  ProgressViewIOS,
  TouchableOpacity,
} from "react-native";

//tag url format: tuchong.com/rest/tags/风光/post?type=subject&page=1
//user url format: https://tuchong.com/rest/sites/280431/posts/2017-01-19 15:07:38?limit=10"
const tagBaseUrl = "https://tuchong.com/rest/tags/";
const userBaseUrl = "https://tuchong.com/rest/sites/";
const imageBaseUrl = "https://photo.tuchong.com/";

const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
const imageWidth = Dimensions.get('window').width;

export default class TabView extends Component {
  static propTypes = {
    tabLabel: React.PropTypes.string.isRequired,
  }

  constructor(props) {
    super(props);
	this.imagePool = [];   // maximum 100 images per tab, 20 per fetch
	this.pageNum = 1;
    this.state = {
	  loading: false,
	  loadmore: false,
      dataSource: ds.cloneWithRows(this.imagePool),
	};
  }

  // fire network request, parse response and update state
  // request: a uri
  // result: a array of 20 items, each item should contain
  // 1) an object has the info of the image: a url to the image to be fetched directly, an aspect ratio of the image, a name of the image, image comments, favorites, excerpts
  // 2) an object has the info of the author: the name of the author, the url to the author's webpage, the icon of the author
  // 3) an array of image in the image set, each should have a direclty url to the image and an aspect ration.
  componentDidMount() {
	this.pageNum = 1;
	this._fetchImage();
  }

  _fetchImage() {
	this.setState({
		loading: true,
	});
	fetch_url = tagBaseUrl + this.props.tabLabel + "/posts?type=subject&page=" + this.pageNum;
    fetch(fetch_url)
    .then((response) => response.json())
    .then((responseJson) => {
      result = responseJson.postList.map((elem, index) => {
        var feed = {};
		feed.coverImageTitle = elem.title;
		feed.coverImageLikes = parseInt(elem.favorites);
		feed.coverImageComments = parseInt(elem.comments);
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
		feed.coverImageUrl = feed.postImages[0].url; 
		feed.coverImageAR = feed.postImages[0].ar;
		return feed;
	  });
	  this.imagePool = this.imagePool.concat(result);
	  this.setState({
		dataSource: ds.cloneWithRows(this.imagePool),
		loading: false,
	  });
    })
	.catch((error) => {
		alert("连接服务器失败");
	});
  }

  render() {
    return (
	   <ListView 
		  style={styles.mainContainer}
		  refreshControl={
			  <RefreshControl
				  refreshing={this.state.loading}
				  onRefresh={this._refreshData.bind(this)}/>
		  }
		  dataSource={this.state.dataSource}
		  renderRow={this._renderRow.bind(this)}
		  renderScrollComponent={(props) => <RecyclerViewBackedScrollView {...props} />}
		  renderSeparator={this._renderSeparator}
		  onEndReached={this._loadmore.bind(this)}
		  onEndReachedThreshold={10}
      />
	);
  }

  _renderRow(rowData, sectionID, rowID, highlightRow) {
	  let imageHeight = imageWidth * rowData.coverImageAR;
	  return (
		<TouchableOpacity onPress={() => {
		  this._pressRow(rowData, rowID);
	      highlightRow(sectionID, rowID);
		  }}>
	      <View style={styles.row}>
		    <Image source={{uri: rowData.coverImageUrl, width: imageWidth, height: imageHeight }}/>
			<View style={{width: imageWidth, height: 20, backgroundColor: "white"}}/>
		  </View>
		</TouchableOpacity>
	  );
  }

	_renderSeparator(sectionID, rowID, adjacentRowHighlighted) {
		return <View
			key={sectionID + "-" + rowID}
			style={{ height: adjacentRowHighlighted ? 2 :1}}/>
	}

  //handle row click	
  _pressRow(rowData, rowID) {
  }
	
	//clear current data and reload 20 images
	_refreshData() {
	  this.imagePool = [];
	  this.pageNum = 1;
	  this._fetchImage();
	}
	
	//load 20 more images and append to current list
	_loadmore() {
		if (this.imagePool.length > 0 && this.imagePool.length < 100) {
			this.pageNum++;
			this.setState({loadmore: true});
			this._fetchImage();
			this.setState({loadmore: false});
		} else if (this.imagePool.length == 0) {
		} else {
			if (Platform.OS === 'ios') alert("已经是最后一页了");
			else if (Platform.OS === 'android') ToastAndroid.show("已经是最后一页了", ToastAndroid.SHORT);
		}
	}
  
  _showloading() {
    if (this.state.loadmore && this.state.loading)
      return <TuchongLoadingIndicator />
    else return null;
  }
}

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
  },
  row: {
  }
});
