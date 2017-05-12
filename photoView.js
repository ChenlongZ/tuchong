import React, {Component} from 'react';
import {
    ActivityIndicator,
    View,
    Image,
    Dimensions,
    Platform,
    ScrollView,
    Text,
    TouchableHighlight,
    StyleSheet,
} from 'react-native';
import {Actions} from 'react-native-router-flux';
import Swiper from 'react-native-swiper';
import PhotoView from 'react-native-photo-view';
import Icon from 'react-native-vector-icons/FontAwesome';
import IonIcon from 'react-native-vector-icons/Ionicons';
import PopupDialog, {ScaleAnimation} from 'react-native-popup-dialog';

const DEVICE_W = Dimensions.get('window').width;
const DEVICE_H = Dimensions.get('window').height;
const BOTTOM_BAR_HEIGHT = 75;
const PHOTOVIEW_WIDTH = DEVICE_W;
const PHOTOVIEW_HEIGHT = DEVICE_H - (Platform.OS == 'ios' ? 64 : 54) - BOTTOM_BAR_HEIGHT;
const PHOTOVIEW_AR = PHOTOVIEW_HEIGHT / PHOTOVIEW_WIDTH;
const POPUP_W = DEVICE_W - 75;
const POPUP_H = 330;
const POPUP_TOP = (DEVICE_H - POPUP_H) / 2;
const POPUP_LEFT = (DEVICE_W - POPUP_W) / 2;

const popupArray = [];

export default class extends Component {

    static propTypes = {
        propData: React.PropTypes.any.isRequired,
    };

    constructor(props) {
        super(props);
        this._fetchInfo.bind(this);
        this._generatePhotos.bind(this);
        this._renderPopup.bind(this);
        this.state = {
            photos: [],
            author: undefined,
            tags: undefined,
            showPopup: false,
        }
    }

    componentDidMount() {
        this._fetchInfo();
    }

    _fetchInfo() {
        fetch(this.props.propData.postUrl)
            .then((response) => response.json())
            .then((responseJson) => {
                let authorInfo = {
                    comments: this.props.propData.comments,
                    likes: this.props.propData.likes,
                    time: this.props.propData.publishedAt.split(" ")[0],
                    authorName: responseJson.post.author.name,
                    authorThumbnail: responseJson.post.author.icon.substring(0, responseJson.post.author.icon.indexOf("?")),
                    authorOthers: responseJson.post.author,
                };
                let tags = responseJson.post.tags;
                let photoInfo = responseJson.images.map((elem, index, array) => {
                    return {
                        url: "https://photo.tuchong.com/" + elem.user_id + "/f/" + elem.img_id + ".jpg",
                        height: elem.height,
                        width: elem.width,
                        ar: parseFloat(elem.height) / parseFloat(elem.width),
                        exif: elem.exif,
                        popUpView: this._renderPopup(elem.exif, authorInfo, tags, index),
                    };
                });
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
                    <View key={index} style={{flex: 1}}>
                        <PhotoView
                            style={{flex: 1, backgroundColor: 'black'}}
                            source={{uri: elem.url, width: imgWidth, height: imgHeight}}
                            minimumZoomScale={0.5}
                            maximumZoomScale={3}
                            loadingIndicatorSource={
                                require('./resources/animal.gif')
                            }
                            onTap={() => {
                                popupArray[index].show();
                            }}
                        />
                        {elem.popUpView}
                    </View>
                );
            }));
    }

    _renderPopup(exif, author, tags, index) {
        let tagsView = tags.map((elem, index) => {
            return (
                <TouchableHighlight key={index}
                                    onPress={() => Actions.taggedView({
                                        title: elem.tag_name,
                                        tag: elem.tag_name,
                                        hot: true
                                    })}
                                    style={{
                                        justifyContent: 'center', alignItems: 'center',
                                        height: 20,
                                        margin: 5,
                                        paddingLeft: 8, paddingRight: 8,
                                        borderWidth: 1, borderRadius: 5, borderColor: "#3e86f9"
                                    }}>
                    <Text style={{
                        fontSize: 12,
                        fontWeight: '500',
                        color: "#3e86f9",
                        textAlign: 'center'
                    }}>{elem.tag_name}</Text>
                </TouchableHighlight>
            )
        });
        return (
            <PopupDialog style={{
                flexDirection: 'column',
            }}
                         dialogAnimation={new ScaleAnimation()}
                         width={POPUP_W}
                         height={POPUP_H}
                         ref={(popupDialog) => {
                             popupArray[index] = popupDialog;
                         }}>
                <View style={{
                    flex: 1,
                    flexDirection: 'column',
                    justifyContent: 'center',
                    alignItems: 'center',
                    paddingTop: 15,
                }}>
                    <Image style={{
                        padding: 10,
                        alignSelf: 'center',
                        borderWidth: 1,
                        borderRadius: 20,
                        resizeMode: 'cover'
                    }}
                           source={{uri: author.authorThumbnail, height: 38, width: 38}}/>
                    <Text style={{
                        padding: 15,
                        fontSize: 13,
                        fontWeight: '900',
                        color: 'black',
                    }}>{author.authorName}</Text>
                    <View style={{
                        marginTop: 5,
                        backgroundColor: '#AAA',
                        height: 1,
                        width: POPUP_W - 20
                    }}/>
                </View>
                {exif.camera !== undefined || exif.lens !== undefined || exif.exposure !== undefined ?
                    <View style={{
                        flex: 1,
                        flexDirection: 'column',
                        justifyContent: 'center',
                        alignItems: 'center',
                    }}>
                        {exif.camera !== undefined ? <View style={{
                            flex: 1,
                            flexDirection: 'row',
                            justifyContent: 'center',
                            alignItems: 'center',
                        }}>
                            <Icon name="camera" size={12} color="gray"/>
                            <Text style={{fontSize: 12, color: "gray", fontWeight: "500"}}>   {exif.camera.name}</Text>
                        </View> : null}
                        {exif.lens !== undefined ? <View style={{
                            flex: 1,
                            flexDirection: 'row',
                            justifyContent: 'center',
                            alignItems: 'center',
                        }}>
                            <IonIcon name="md-aperture" size={14} color="gray"/>
                            <Text style={{fontSize: 12, color: "gray", fontWeight: "500"}}>   {exif.lens.name}</Text>
                        </View> : null}
                        {exif.exposure !== undefined ? <View style={{
                            flex: 1,
                            flexDirection: 'row',
                            justifyContent: 'center',
                            alignItems: 'center',
                        }}>
                            {exif.exposure.split(",").map((elem, index) => {
                                return (<Text key={index}
                                              style={{fontSize: 12, color: "gray", fontWeight: "500"}}>{elem}</Text>);
                            })}
                        </View> : null}
                        <View style={{
                            backgroundColor: '#AAA',
                            height: 1,
                            width: POPUP_W - 20
                        }}/>
                    </View> : null }
                {tags !== undefined ? <ScrollView style={{flex: 1}}>
                    <View style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexWrap: 'wrap',
                        paddingTop: 10,
                        paddingBottom: 10,
                        paddingLeft: 15,
                        paddingRight: 15,
                    }}>
                        {tagsView}
                    </View>
                </ScrollView> : null}
            </PopupDialog>
        )
    }

    render() {
        return (
            <View style={styles.overall}>
                <View style={styles.occupySpace}/>
                {this.state.photos.length === 0
                    ? <View style={{
                        flex: 1, justifyContent: 'center', alignItems: 'center',
                        backgroundColor: 'black'
                    }}>
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
    },
    popUp: {},
    popUpUser: {},
    popUpExif: {},
    popUpTags: {}
});
