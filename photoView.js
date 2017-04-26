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
        return(
            this.props.data.postImages.map((elem, index, array) => {
                // TODO: the adjusted image width and height seem not working
                let imgWidth = elem.ar > PHOTOVIEW_AR ? PHOTOVIEW_HEIGHT / elem.ar : PHOTOVIEW_WIDTH;
                let imgHeight = elem.ar > PHOTOVIEW_AR ? PHOTOVIEW_HEIGHT : PHOTOVIEW_WIDTH * elem.ar;
                return(
                  <PhotoView
                      key={index}
                      style={{flex: 1, backgroundColor: 'black'}}
                      source={{uri: elem.url, width: imgWidth, height: imgHeight}}
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
                <Swiper style={styles.imageSet}
                    height={PHOTOVIEW_HEIGHT}
                    width={PHOTOVIEW_WIDTH}
                    showsButtons={false}
                    autoplay={false}
                    showPagination={true}
                    dotColor='rgba(255, 255, 255, 0.5)'>
                    {this._generatePhotos()}
                </Swiper>
                <View style={styles.bottomBar}>

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
        backgroundColor: 'black',
        borderTopColor: 'white',
        borderTopWidth: 1,
    },
});
