import React, { Component } from 'react';
import {
  Animated,
  View,
  Image,
  Dimensions,
  ScrollView,
  ListView,
  RecyclerViewBackedScrollView,
  StyleSheet,
  Text,
} from 'react-native';
import { Actions } from 'react-native-router-flux';
import NavigationBar from 'react-native-navbar';

const AnimatedNavBar = Animated.createAnimatedComponent(NavigationBar);

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

const deviceWidth = Dimensions.get('window').width
const deviceHeight = Dimensions.get('window').height;

const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
const navBarHeight = new Animated.Value(58);

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
        if (feed.coverImageGridUrl === undefined) {
          return undefined;
        }
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
     result = result.filter((val) => val !== undefined);
     if (result.length % 2 != 0) result.pop();
     for (i = 0; i < result.length; i+=2) {
       this.imagePool.push({
         first: result[i],
         second: result[i + 1],
       });
     }
     this.isLoading = false;
  	 this.setState({
    	dataSource: ds.cloneWithRows(this.imagePool),
     });
    })
    .catch((error) => {
      // alert(error);
    	alert("Hahaha, 404 not found!");
    });
  }

  _generateImages() {
    let paddingLeftRight = 3;
    return (
      <ListView style={styles.content}
        dataSource={this.state.dataSource}
        renderRow={(rowData, sectionID, rowID, highlightRow) => {
          let rowWidth = deviceWidth;
          let rowHeight = (rowWidth - 3 * paddingLeftRight) * rowData.first.coverImageAR * rowData.second.coverImageAR / (rowData.first.coverImageAR + rowData.second.coverImageAR);
          let firstItemWidth = rowHeight / rowData.first.coverImageAR + paddingLeftRight / 2;
          let firstItemHeight = rowHeight;
          let secondItemWidth = rowHeight / rowData.second.coverImageAR + paddingLeftRight / 2;
          let secondItemHeight = rowHeight;
          let firstImgWidth = firstItemWidth - paddingLeftRight / 2;
          let firstImgHeight = rowHeight;
          let secondImgWidth = secondItemWidth - paddingLeftRight / 2;
          let secondImgHeight = rowHeight;
          return (
            <View key={rowID} style={{
              flexDirection: 'row',
              paddingLeft: paddingLeftRight,
              paddingRight: paddingLeftRight,
            }}>
              <View style={{
                paddingRight: paddingLeftRight / 2,
              }}>
                <Image source={{
                  uri: rowData.first.coverImageMediumUrl,
                  width: firstImgWidth,
                  height: firstImgHeight }}/>
              </View>
              <View style={{
                paddingLeft: paddingLeftRight / 2,
              }}>
                <Image source={{
                  uri: rowData.second.coverImageMediumUrl,
                  width: secondImgWidth,
                  height: secondImgHeight }}/>
              </View>
            </View>
          )
        }}
  		  renderScrollComponent={(props) => <RecyclerViewBackedScrollView {...props} />}
  		  renderSeparator={(sectionID, rowID, adjacentRowHighlighted) => {
          return (<View key={`${sectionID}-${rowID}`}
            style={{width: deviceWidth, height: paddingLeftRight, backgroundColor: 'white'}}/>)
        }}
  		  onEndReached={() => {
          if(this.pageNum <= 10) {
            this.pageNum++;
            this._fetch();
          }
        }}
  		  onEndReachedThreshold={10}
       />
    )
  }

  componentDidMount() {
    this.pageNum = 1;
    this._fetch();
  }

  navBarAnim = (close) => {
      Animated.timing(
        navBarHeight,
        {
          toValue: close ? 0 : 58,
          duration: 400,
        }
      ).start();
  }

  render() {
    return (
      <ScrollView
        styles={{flex: 1}}
        onScroll={(event) => {
          console.log(event.nativeEvent.contentOffset.y);
          if (event.nativeEvent.contentOffset.y > 0) {
            this.navBarAnim(true);
          } else {
            this.navBarAnim(false);
          }
        }}
        scrollEventThrottle={200}>
        {/* transparent nav bar with a back button */}
        {/* TODO: gone when scroll down */}

        {/* thumbnail of the 1st picture (1/3 screen) */}
        <View style={styles.cover}>
          {/* <Image source={require('./resources/temp_background.jpg')}/> */}
        </View>

        {/* tag name, sub title, hot/new taggle */}
        <View style={styles.segment}>
        </View>

        {/* infinte scroll view (max = 10 pages) */}
        {/* two picture in a row, adjust heigth */}
        {this._generateImages()}
      </ScrollView>
    )
  }

  static renderNavigationBar(props) {
    return (<Animated.View
      style={{
        backgroundColor: 'black',
        paddingTop: 0,
        top: 0,
        right: 0,
        left: 0,
        position: 'absolute',
        height: navBarHeight}}>
    </Animated.View>
    )
  }
}

const styles = StyleSheet.create({
  cover: {
    height: deviceHeight/6,
  },
  segment: {
    height: deviceHeight/8,
  },
  content: {

  },
});
