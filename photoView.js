import React, {Component} from 'react';
import {
    ActivityIndicator,
    View,
    Dimensions,
    Platform,
    Text,
    StyleSheet,
} from 'react-native';
import {Actions} from 'react-native-router-flux';
import Swiper from 'react-native-swiper';
import PhotoView from 'react-native-photo-view';

const BOTTOM_BAR_HEIGHT = 64;
const PHOTOVIEW_WIDTH = Dimensions.get('window').width;
const PHOTOVIEW_HEIGHT = Dimensions.get('window').height - (Platform.OS == 'ios' ? 64 : 54) - BOTTOM_BAR_HEIGHT;
const PHOTOVIEW_AR = PHOTOVIEW_HEIGHT / PHOTOVIEW_WIDTH;

export default class extends Component {

    static propTypes = {
        data: React.PropTypes.any.isRequired,
    };

    constructor(props) {
        super(props);
        this._generatePhotos.bind(this);
    }

    _generatePhotos() {
        // feed.title = elem.title;
        // feed.coverImageGridUrl = elem.cover_image_src;
        // if (feed.coverImageGridUrl === undefined) {
        //     return undefined;
        // }
        // feed.coverImageLargeUrl = elem.cover_image_src.replace(/(\d+)\/(.+)\/(\d+.jpg)/, "$1/l/$3");
        // feed.coverImageMediumUrl = elem.cover_image_src.replace(/(\d+)\/(.+)\/(\d+.jpg)/, "$1/m/$3");
        // feed.coverImageSmallUrl = elem.cover_image_src.replace(/(\d+)\/(.+)\/(\d+.jpg)/, "$1/s/$3");
        // feed.likes = parseInt(elem.favorites);
        // feed.comments = parseInt(elem.comments);
        // feed.publishedAt = elem.published_at;
        // feed.authorId = parseInt(elem.author_id);
        // feed.authorUrl = userBaseUrl + parseInt(elem.author_id) + "/posts/" + elem.published_at;
        // feed.postImages = elem.images.map((img, index) => {
        //     return {
        //         url: imageBaseUrl + img.user_id + "/f/" + img.img_id + ".jpg",
        //         height: img.height,
        //         width: img.width,
        //         ar: parseFloat(img.height) / parseFloat(img.width),
        //     };
        // });
        // feed.coverImageAR = feed.postImages[0].ar;
        return(
            this.props.data.postImages.map((elem, index, array) => {
                // TODO: the adjusted image width and height seem not working
                let imgWidth = elem.ar > PHOTOVIEW_AR ? PHOTOVIEW_HEIGHT / elem.ar : PHOTOVIEW_WIDTH;
                let imgHeight = elem.ar > PHOTOVIEW_AR ? PHOTOVIEW_HEIGHT : PHOTOVIEW_WIDTH * elem.ar;
                return(
                  <PhotoView
                      key={index}
                      style={{height: PHOTOVIEW_HEIGHT, width: PHOTOVIEW_WIDTH, backgroundColor: 'black'}}
                      source={{uri: elem.url, height: imgHeight, width: imgWidth}}
                      minimumZoomScale={0.5}
                      maximumZoomScale={3}
                      androidScaleType="center"
                      loadingIndicatorSource={ // TODO: not work
                          <ActivityIndicator
                              animating={true}
                              color='#ffd939'
                              size={75} />
                      }
                      onTap={() => {Actions.pop()}}  //TODO
                  />
              );
          })
        );
    }

    render() {
        return (
            <View style={styles.overall}>
                <View style={styles.occupySpace}/>
                <Swiper style={styles.swiper}
                    showsButtons={false}
                    autoplay={false}
                    activeDot={ // TODO: not showing
                        <View style={{
                            backgroundColor: 'rgba(255, 255, 255, 0.8)',
                            width: 8,
                            height: 8,
                            borderRadius: 4,
                            margin: 3,
                            }} />}>
                    {this._generatePhotos()}
                </Swiper>
                <View style={styles.bottomBar}>

                </View>
            </View>
        )
    }
}

const styles = StyleSheet.create({
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
    swiper: {
        height: PHOTOVIEW_HEIGHT,
    },
    bottomBar: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        height: BOTTOM_BAR_HEIGHT,
        backgroundColor: 'black',
        borderTopColor: 'white',
        borderTopWidth: 2,
    },
});
