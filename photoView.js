import React, {Component} from 'react';
import {
    ActivityIndicator,
    View,
    Image,
    Dimensions,
    Platform,
    Text,
    StyleSheet,
} from 'react-native';
import {Actions} from 'react-native-router-flux';
import Swiper from 'react-native-swiper';
import PhotoView from 'react-native-photo-view';
import Icon from 'react-native-vector-icons/FontAwesome';

const BOTTOM_BAR_HEIGHT = 75;
const PHOTOVIEW_WIDTH = Dimensions.get('window').width;
const PHOTOVIEW_HEIGHT = Dimensions.get('window').height - (Platform.OS == 'ios' ? 64 : 54) - BOTTOM_BAR_HEIGHT;
const PHOTOVIEW_AR = PHOTOVIEW_HEIGHT / PHOTOVIEW_WIDTH;

export default class extends Component {

    static propTypes = {
        propData: React.PropTypes.any.isRequired,
    };

    constructor(props) {
        super(props);
        this._fetchInfo.bind(this);
        this._generatePhotos.bind(this);
        this.state = {
            photos: [],
            author: undefined,
            tags: undefined,
        }
    }

    componentDidMount() {
        this._fetchInfo();
    }

    // comments
    // likes
    // time
    // authorInfo:
    //      author name
    //      author thumbnail
    //      author others
    _fetchInfo() {
        fetch(this.props.propData.postUrl)
            .then((response) => response.json())
            .then((responseJson) => {
                let photoInfo = responseJson.images.map((elem, index, array) => {
                    return {
                        url: "https://photo.tuchong.com/" + elem.user_id + "/f/" + elem.img_id + ".jpg",
                        height: elem.height,
                        width: elem.width,
                        ar: parseFloat(elem.height) / parseFloat(elem.width),
                        exif: elem.exif,
                    };
                });
                let authorInfo = {
                    comments: this.props.propData.comments,
                    likes: this.props.propData.likes,
                    time: this.props.propData.publishedAt.split(" ")[0],
                    authorName: responseJson.post.author.name,
                    authorThumbnail: responseJson.post.author.icon.substring(0, responseJson.post.author.icon.indexOf("?")),
                    authorOthers: responseJson.post.author,
                };
                let tags = responseJson.post.tags;
                this.setState({
                    photos: photoInfo,
                    author: authorInfo,
                    tags: tags,
                });
            })
            .catch((error) => {
                alert(error);
            });
    }

    _generatePhotos() {
        let photos = this.state.photos;
        return (
            photos.map((elem, index, array) => {
                let imgWidth = elem.ar > PHOTOVIEW_AR ? PHOTOVIEW_HEIGHT / elem.ar : PHOTOVIEW_WIDTH;
                let imgHeight = elem.ar > PHOTOVIEW_AR ? PHOTOVIEW_HEIGHT : PHOTOVIEW_WIDTH * elem.ar;
                return (
                    <PhotoView
                        key={index}
                        style={{flex: 1, backgroundColor: 'black'}}
                        source={{uri: elem.url, width: imgWidth, height: imgHeight}}
                        minimumZoomScale={0.5}
                        maximumZoomScale={3}
                        loadingIndicatorSource={ // TODO: not work
                            require('./resources/animal.gif')
                        }
                        onTap={() => {
                            Actions.pop()
                        }}  //TODO
                    />
                );
            }));
    }

    render() {
        return (
            <View style={styles.overall}>
                <View style={styles.occupySpace}/>
                {this.state.photos.length === 0
                    ? <View style={{
                        flex: 1, justifyContent: 'center', alignItems: 'center',
                        backgroundColor: 'black'}}>
                        <Image style={{height: 50, width: 50}} source={require('./resources/ripple.gif')}/>
                      </View>
                    : <Swiper style={styles.imageSet}
                              height={PHOTOVIEW_HEIGHT}
                              width={PHOTOVIEW_WIDTH}
                              showsButtons={false}
                              autoplay={false}
                              showPagination={true}
                              dotColor='rgba(255, 255, 255, 0.5)'>
                        {this._generatePhotos()}
                    </Swiper>}
                <View style={styles.bottomBar}>
                    <View style={styles.bottomUpper}>
                        <View
                            style={{flex: 1, flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center'}}>
                            <Image style={{
                                    alignSelf: 'center',
                                    height: 40,
                                    width: 40,
                                    borderWidth: 1,
                                    borderRadius: 20,
                                    resizeMode: 'cover',
                                }}
                                   source={this.state.author === undefined
                                       ? require('./resources/ring-alt.gif')
                                       : {uri: this.state.author.authorThumbnail, height: 38, width: 38}}/>
                            <View style={{
                                flexDirection: 'column',
                                justifyContent: 'center',
                                padding: 5,
                                paddingLeft: 8
                            }}>
                                <Text style={{
                                    paddingBottom: 1,
                                    fontSize: 13,
                                    fontWeight: '900',
                                    color: 'white'
                                }}>{this.state.author === undefined ? null : this.state.author.authorName}</Text>
                                <Text style={{
                                    paddingTop: 2,
                                    fontSize: 12,
                                    fontWeight: '300',
                                    color: 'gray'
                                }}>{this.state.author === undefined ? null : this.state.author.time}</Text>
                            </View>
                        </View>
                        <View style={{
                            flex: 1,
                            flexDirection: 'row',
                            justifyContent: 'flex-end',
                            alignItems: 'center',
                            paddingRight: 8
                        }}>
                            <Text style={{
                                fontSize: 15,
                                fontWeight: '500',
                                color: 'white'
                            }}>{this.state.author === undefined ? null : this.state.author.comments}  </Text>
                            <Icon name="comment-o" size={18} color="white"/>
                        </View>
                    </View>
                    <View style={styles.bottomLower}>
                        <Icon name="heart" size={12} color="white"/>
                        <Text style={{
                            fontSize: 12,
                            fontWeight: '500',
                            color: 'white'
                        }}> {this.state.author === undefined ? 0 : this.state.author.likes} 人喜欢了这个相集</Text>
                    </View>
                </View>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    overall: {
        flex: 1,
        flexDirection: 'column',
    },
    occupySpace: {
        ...Platform.select({
            ios: {
                height: 64,
            },
            android: {
                height: 54,
            }
        }),
    },
    imageSet: {
        backgroundColor: 'black'
    },
    bottomBar: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        height: BOTTOM_BAR_HEIGHT,
        borderTopColor: 'white',
        backgroundColor: 'black',
        flexDirection: 'column',
    },
    bottomUpper: {
        flex: 2,
        flexDirection: 'row',
        backgroundColor: 'black',
        paddingLeft: 5,
        paddingRight: 5,
        borderBottomColor: 'rgba(255, 255, 255, 0.5)',
        borderBottomWidth: 0.5,
    },
    bottomLower: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        paddingLeft: 8,
        paddingRight: 8,
        backgroundColor: 'black',
    }
});
