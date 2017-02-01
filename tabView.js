const Component = require('Component');
const Dimensions = require('Dimensions');
const Icon = require('Icon.react');
const Image = require('Image.react');
const ListView = require('ListView');
const PhotoView = require('PhotoView.react');
const Platform = require('Platform');
const React = require('React');
const RecyclerViewBackedScrollView = require('RecyclerViewBackedScrollView.react');
const RefreshControl = require('RefreshControl.react');
const StyleSheet = require('StyleSheet');
const Swiper = require('Swiper.react');
const Text = require('Text.react');
const ToastAndroid = require('ToastAndroid');
const TouchableHighlight = require('TouchableHighlight.react');
const TouchableWithoutFeedback = require('TouchableWithoutFeedback.react');
const TuchongLoadingIndicator = require('TuchongLoadingIndicator.react');
const View = require('View.react');

const fetch = require('fetch');
const fetch_url = require('fetch_url');
const result = require('result');

import Icon from 'react-native-vector-icons/Ionicons';
import Swiper from 'react-native-swiper';
import PhotoView from 'react-native-photo-view';

//tag url format: tuchong.com/rest/tags/风光/post?type=subject&page=1&order=new
//user url format: https://tuchong.com/rest/sites/280431/posts/2017-01-19 15:07:38?limit=10"
const tagBaseUrl = "https://tuchong.com/rest/tags/";
const userBaseUrl = "https://tuchong.com/rest/sites/";
const imageBaseUrl = "https://photo.tuchong.com/";

const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});

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
	      deviceWidth: Dimensions.get('window').width,
		    showPhotoSetView: false,
		    photoSetIndex: 0,
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
  	fetch_url = tagBaseUrl + this.props.tabLabel + "/posts?type=subject&order=new&page=" + this.pageNum;
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
	  <View style={{position: 'relative'}} >
		  {this.state.showPhotoSetView && <PhotoSetView
			imgSet={this.imagePool[this.state.photoSetIndex].postImages}
			onPressHandle={this._pressPhotoSetView.bind(this)} />}
	   <ListView
		  style={styles.mainContainer}
		  refreshControl={
			  <RefreshControl
				  refreshing={this.state.loading}
				  onRefresh={this._refreshData.bind(this)}/>
		  }
		  onLayout={(event) => {
			  this.setState({deviceWidth : event.nativeEvent.layout.width});
		  }}
		  dataSource={this.state.dataSource}
		  renderRow={this._renderRow.bind(this)}
		  renderScrollComponent={(props) => <RecyclerViewBackedScrollView {...props} />}
		  renderSeparator={this._renderSeparator}
		  onEndReached={this._loadmore.bind(this)}
		  onEndReachedThreshold={10}
	  /></View>
	 );
  }

  _renderRow(rowData, sectionID, rowID, highlightRow) {
	  let imageWidth = this.state.deviceWidth;
	  let imageHeight = this.state.deviceWidth * rowData.coverImageAR;
	  return (
	    <View>
  			<TouchableHighlight onPress={() => {
  			  this._pressRow(rowData, rowID);
  	    	  highlightRow(sectionID, rowID);
  			  }}>
  			  <Image source={{uri: rowData.coverImageUrl, width: imageWidth, height: imageHeight }}/>
  			</TouchableHighlight>
		    <View style={styles.bottomBar}>
              <TouchableHighlight style={styles.bottomBarLeft} onPress={() => {}}>
                <Text style={{fontSize: 12, color: 'white', fontWeight: '500'}}>{rowData.coverImageTitle}</Text>
              </TouchableHighlight>
              <View style={styles.bottomBarRight}>
                <View style={{height: 30, width: 40, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'}}>
                  <Icon name="ios-heart-outline" size={18} color='white'/>
                  <Text style={{fontSize: 12, textAlign: 'right', color: '#d8d8d8'}}>{rowData.coverImageLikes}</Text>
                </View>
                <View style={{height: 30, width: 40, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'}}>
                  <Icon name="ios-chatboxes-outline" size={18} color='white'/>
                  <Text style={{fontSize: 12, textAlign: 'right', color: '#d8d8d8'}}>{rowData.coverImageComments}</Text>
                </View>
              </View>
		    </View>
      </View>
	  );
  }

	_renderSeparator(sectionID, rowID, adjacentRowHighlighted) {
		return <View
			key={sectionID + "-" + rowID}
			style={{ height: adjacentRowHighlighted ? 2 :1, backgroundColor: 'black'}}/>
	}

  //handle row click
  _pressRow(rowData, rowID) {
	  this.setState({ showPhotoSetView: true, photoSetIndex: parseInt(rowID) });
  }
  _pressPhotoSetView() {
	  this.setState({ showPhotoSetView: false});
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

class PhotoSetView extends Component {
	static propTypes = {
		imgSet: React.PropTypes.array.isRequired,
		onPressHandle: React.PropTypes.func.isRequired,
	};
	constructor(props) {
		super(props);
		this.photoWidth = Dimensions.get('window').width;
	}

	render() {
    let pressHandler = this.props.onPressHandle;
		return(
      <Swiper style={styles.photoSetSwiper}
			  dot={<View style={{backgroundColor: 'rgba(0,0,0,.5)', width: 5, height: 5, borderRadius: 4, marginLeft: 3, marginRight: 3, marginTop: 3, marginBottom: 3}} />}
			  activeDot={<View style={{backgroundColor: '#AAA', width: 8, height: 8, borderRadius: 4, marginLeft: 3, marginRight: 3, marginTop: 3, marginBottom: 3}} />}>
			  {
  				this.props.imgSet.map((elem, index) => <View key={index} style={styles.photoSetView}>
  					<TouchableWithoutFeedback onPress={pressHandler}>
  					 <PhotoView
  						 source={{uri: elem.url}}
  						 resizeMode='contain'
  						 minimumZoomScale={0.5}
  						 maximumZoomScale={3}
  						 androidScaleType='center'
  						 style={{ width:this.photoWidth, height: this.photoWidth * elem.ar}}
  						 />
  				 </TouchableWithoutFeedback>
  				</View>)
  			}
		  </Swiper>);
	}
}

const styles = StyleSheet.create({
  mainContainer: {
	top: 0, right: 0, bottom: 0, left: 0,
  },
  bottomBar: {
    height: 42,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: 'black'
  },
  bottomBarLeft: {
    marginLeft: 15,
  },
  bottomBarRight: {
    marginRight: 15,
    width: 85,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
	photoSetSwiper: {
		backgroundColor: '#000',
	},
	photoSetView: {
		flex: 1,
	}
});
