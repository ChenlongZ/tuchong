import React, {Component} from 'react';
import {
    ActivityIndicator,
    View,
    Image,
    Dimensions,
    ListView,
    TouchableHighlight,
    StyleSheet,
    Text,
} from 'react-native';
import {Actions} from 'react-native-router-flux';
import NavigationBar from 'react-native-navbar';
import AnimatedNavBar from './animatedNavBar.js';

//tag url format: tuchong.com/rest/tags/风光/post?type=subject&page=1&order=new
//user url format: https://tuchong.com/rest/sites/280431/posts/2017-01-19 15:07:38?limit=10"
//image url format: "https://photo.tuchong.com/" + userId + "/%format/" + imageId + ".jpg"
//post url format: "https://tuchong.com/rest/posts/" + postId;
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
const postBaseUrl = "https://tuchong.com/rest/posts/";

const deviceWidth = Dimensions.get('window').width;
const deviceHeight = Dimensions.get('window').height;

const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
const paddingLeftRight = 3;

export default class TaggedView extends Component {

    static propTypes = {
        tag: React.PropTypes.string.isRequired,
        hot: React.PropTypes.bool.isRequired,
    }

    constructor(props) {
        super();
        this.hot = true;
        this.imagePool = [];
        this.pageNum = 0;
        this.state = {
            isLoading: false,
            dataSource: ds.cloneWithRows(this.imagePool, null)
        }
        setInterval(() => {
            if (this.hot !== this.props.hot) {
                this.hot = this.props.hot;
                this.componentDidMount();
            }
        }, 200);

        this._generateImages.bind(this);
        this._generateRowItems.bind(this);
    }

    _fetch() {
        if (this.pageNum === 1 && !this.state.isLoading) {
            this.setState({
                isLoading: true
            });
        }
        let fetch_url = `${tagBaseUrl}${this.props.tag}/posts?type=subject${this.props.hot ? '' : '&order=new'}&page=${this.pageNum}`;
        fetch(fetch_url)
            .then((response) => response.json())
            .then((responseJson) => {
                let result = responseJson.postList.map((elem, index) => {
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
                    feed.postId = parseInt(elem.post_id);
                    feed.authorUrl = userBaseUrl + parseInt(elem.author_id) + "/posts/" + elem.published_at;
                    feed.postUrl = postBaseUrl + elem.post_id;
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
                if (result.length % 2 !== 0) result.pop();
                for (let i = 0; i < result.length; i += 2) {
                    this.imagePool.push({
                        first: result[i],
                        second: result[i + 1],
                    });
                }
                this.setState({
                    dataSource: ds.cloneWithRows(this.imagePool, null),
                    isLoading: false,
                });
            })
            .catch((error) => {
                // alert(error);
                alert("Hahaha, 404 not found!");
            });
    }

    _generateRowItems(data) {
        return (
            <TouchableHighlight
                style={{paddingRight: paddingLeftRight / 2}}
                onPress={() => Actions.photoView({title: data.title, propData: data})}>
                <View style={{width: data.Width, height: data.Height}}>
                    <Image source={{
                        uri: data.coverImageMediumUrl,
                        width: data.Width,
                        height: data.Height
                    }}/>
                    {data.postImages.length > 1
                        ? <View style={styles.imageSetSize}>
                            <Text style={{
                                color: 'rgba(255, 255, 255, 0.8)',
                                fontSize: 14
                            }}>{data.postImages.length}</Text>
                        </View>
                        : null}
                </View>
            </TouchableHighlight>
        )
    }

    _generateImages() {
        return (
            <ListView style={styles.content}
                      dataSource={this.state.dataSource}
                      renderRow={(rowData, sectionID, rowID, highlightRow) => {
                          let rowHeight = (deviceWidth - 3 * paddingLeftRight) * rowData.first.coverImageAR * rowData.second.coverImageAR / (rowData.first.coverImageAR + rowData.second.coverImageAR);
                          let firstItemWidth = rowHeight / rowData.first.coverImageAR + paddingLeftRight / 2;
                          let secondItemWidth = rowHeight / rowData.second.coverImageAR + paddingLeftRight / 2;
                          let firstImgWidth = firstItemWidth - paddingLeftRight / 2;
                          let firstImgHeight = rowHeight;
                          let secondImgWidth = secondItemWidth - paddingLeftRight / 2;
                          let secondImgHeight = rowHeight;
                          rowData.first.Width = firstImgWidth;
                          rowData.first.Height = firstImgHeight;
                          rowData.second.Width = secondImgWidth;
                          rowData.second.Height = secondImgHeight;
                          return (
                              <View key={rowID} style={{
                                  flexDirection: 'row',
                                  paddingLeft: paddingLeftRight,
                                  paddingRight: paddingLeftRight,
                              }}>
                                  {this._generateRowItems(rowData.first)}
                                  {this._generateRowItems(rowData.second)}
                              </View>
                          )
                      }}
                      renderSeparator={(sectionID, rowID) => {
                          return (<View key={`${sectionID}-${rowID}`}
                                        style={{
                                            width: deviceWidth,
                                            height: paddingLeftRight,
                                            backgroundColor: 'white'
                                        }}/>)
                      }}
                      onEndReached={() => {
                          if (this.pageNum <= 10) {
                              this.pageNum++;
                              this._fetch();
                          }
                      }}
                      onEndReachedThreshold={100}/>
        )
    }

    componentDidMount() {
        this.pageNum = 1;
        this.imagePool = [];
        this.setState({
            isLoading: false,
            dataSource: ds.cloneWithRows(this.imagePool),
        });
        this._fetch();
    }

    // navBarAnim = (close) => {
    //     Animated.timing(
    //       navBarHeight,
    //       {
    //         toValue: close ? 0 : 58,
    //         duration: 200,
    //       }
    //     ).start();
    // }

    render() {
        console.log(`${this.props.tag} ${this.props.hot} pageNum=${this.pageNum}`);
        // if (this.props.hot != this.hot) {
        //   this.hot = this.props.hot;
        //   this.componentDidMount();
        // }
        return (
            this.state.isLoading
                ? <ActivityIndicator
                animating={true}
                size="large"
                style={styles.loadingIndicator}/>
                : this._generateImages()
        )
    }
}

const styles = StyleSheet.create({
    loadingIndicator: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        padding: 8,
    },
    imageSetSize: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 5,
        marginBottom: 5,
        width: 20,
        height: 20,
        position: 'absolute',
        bottom: 0,
        right: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.24)'
    }
});
