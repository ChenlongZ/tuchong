import React, {
  PropTypes,
  Component,
} from 'react';
import {
  Platform,
  Animated,
  Image,
  StyleSheet,
  Text,
  I18nManager,
  TouchableOpacity,
  View,
} from 'react-native';
import Actions from 'react-native-router-flux';
import _drawerImage from './resources/menu_burger.png';
import _backButtonImage from './resources/back_chevron.png';

const styles = StyleSheet.create({
  title: {
    textAlign: 'center',
    color: '#0A0A0A',
    fontSize: 18,
    width: 180,
    alignSelf: 'center',
  },
  titleImage: {
    width: 180,
    alignSelf: 'center',
  },
  titleWrapper: {
    marginTop: 10,
    position: 'absolute',
    ...Platform.select({
      ios: {
        top: 20,
      },
      android: {
        top: 5,
      },
      windows: {
        top: 5,
      },
    }),
    left: 0,
    right: 0,
  },
  header: {
    backgroundColor: '#EFEFF2',
    paddingTop: 0,
    top: 0,
    ...Platform.select({
      ios: {
        height: 64,
      },
      android: {
        height: 54,
      },
      windows: {
        height: 54,
      },
    }),
    right: 0,
    left: 0,
    borderBottomWidth: 0.5,
    borderBottomColor: '#828287',
    position: 'absolute',
  },
  backButton: {
    height: 37,
    position: 'absolute',
    ...Platform.select({
      ios: {
        top: 22,
      },
      android: {
        top: 10,
      },
      windows: {
        top: 8,
      },
    }),
    left: 2,
    padding: 8,
    flexDirection: 'row',
    transform: [{ scaleX: I18nManager.isRTL ? -1 : 1 }],
  },
  rightButton: {
    height: 37,
    position: 'absolute',
    ...Platform.select({
      ios: {
        top: 22,
      },
      android: {
        top: 10,
      },
      windows: {
        top: 8,
      },
    }),
    right: 2,
    padding: 8,
  },
  leftButton: {
    height: 37,
    position: 'absolute',
    ...Platform.select({
      ios: {
        top: 20,
      },
      android: {
        top: 8,
      },
      windows: {
        top: 8,
      },
    }),
    left: 2,
    padding: 8,
  },
  barRightButtonText: {
    color: 'rgb(0, 122, 255)',
    textAlign: 'right',
    fontSize: 17,
  },
  barBackButtonText: {
    color: 'rgb(0, 122, 255)',
    textAlign: 'left',
    fontSize: 17,
    paddingLeft: 6,
  },
  barLeftButtonText: {
    color: 'rgb(0, 122, 255)',
    textAlign: 'left',
    fontSize: 17,
  },
  backButtonImage: {
    width: 13,
    height: 21,
  },
  defaultImageStyle: {
    height: 24,
    resizeMode: 'contain',
  },
});

export default class AnimatedNavBar extends Component {

  constructor(props) {
    super(props);
    this.renderBackButton = this.renderBackButton.bind(this);
    this.renderTitle = this.renderTitle.bind(this);
  }

  renderTitle = (childState) => {
    let title = this.props.getTitle ? this.props.getTitle(childState) : childState.title;
    if (title === undefined && childState.component && childState.component.title) {
      title = childState.component.title;
    }
    if (typeof (title) === 'function') {
      title = title(childState);
    }
    return (
      <Animated.View
        style={[
          styles.titleWrapper,
          this.props.titleWrapperStyle,
        ]}
      >
        <Animated.Text
          style={[
            styles.title,
            this.props.titleStyle,
            this.props.navigationState.titleStyle,
            childState.titleStyle,
          ]}
        >
          {this.props.component}
        </Animated.Text>
      </Animated.View>
    );
  };

  renderBackButton = (navProps) => {
    return (
      <TouchableOpacity
        testID="backNavButton"
        style={[
          styles.backButton,
        ]}
        onPress={() => Actions.pop()}>
        <Image
          source={_backButtonImage}
          style={[
            styles.backButtonImage,
            this.props.leftButtonIconStyle,
          ]}
        />
      </TouchableOpacity>
    )
  };

  contents = (
    <View>
      {this.renderTitle(this.props)}
      {this.renderBackButton(this.props)}
    </View>
  );

  render() {
    return (
      <Animated.View
        style={[
          styles.header,
          this.props.navigationBarStyle
        ]}>
        {this.contents}
      </Animated.View>
    )
  }
}
