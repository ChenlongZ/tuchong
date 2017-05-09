import React, {Component} from 'react';
import {
    View,
    Text,
    Image,
    TouchableHighlight,
    Dimensions,
    Platform,
    ScrollView,
    StyleSheet,
} from 'react-native';
import {createStore} from 'redux';
import {Actions} from 'react-native-router-flux';
import GridView from 'react-native-gridview';

const {width, height} = Dimensions.get('window');
const ITEM_PER_ROW = 3;
const tags = {
    '主题': [
        ['风光', "https://photo.tuchong.com/1717922/g/32146044.jpg"],
        ['人像', "https://photo.tuchong.com/990878/g/13922581.jpg"],
        ['纪实', "https://photo.tuchong.com/1564099/g/8673859.jpg"],
        ['旅行', "https://photo.tuchong.com/1285680/g/13652176.jpg"],
        ['夜景', "https://photo.tuchong.com/1165654/g/30575897.jpg"],
        ['美女', "https://photo.tuchong.com/1779298/g/12996735.jpg"],
        ['街拍', "https://photo.tuchong.com/1664151/g/18182045.jpg"],
        ['静物', "https://photo.tuchong.com/111791/g/17073216.jpg"],
        ['私房', "https://photo.tuchong.com/529994/g/29004868.jpg"],
    ],
    '器材': [
        ['佳能', "https://photo.tuchong.com/393432/g/25917567.jpg"],
        ['尼康', "https://photo.tuchong.com/469536/g/15817168.jpg"],
        ['索尼', "https://photo.tuchong.com/461036/g/31610256.jpg"],
        ['富士', "https://photo.tuchong.com/1349632/g/21588837.jpg"],
        ['徕卡', "https://photo.tuchong.com/1647069/g/13206894.jpg"],
        ['50mm', "https://photo.tuchong.com/1752960/g/24206243.jpg"],
        ['35mm', "https://photo.tuchong.com/1330998/g/13069289.jpg"],
        ['85mm', "https://photo.tuchong.com/1055564/g/24206240.jpg"],
        ['胶片', "https://photo.tuchong.com/309340/g/8546922.jpg"],
    ],
    '风格': [
        ['色彩', "https://photo.tuchong.com/1370833/g/20472653.jpg"],
        ['抓拍', "https://photo.tuchong.com/1438483/g/33447368.jpg"],
        ['黑白', "https://photo.tuchong.com/354208/g/30242011.jpg"],
        ['小清新', "https://photo.tuchong.com/1064195/g/18111852.jpg"],
        ['唯美', "https://photo.tuchong.com/1698607/g/12810714.jpg"],
        ['日系', "https://photo.tuchong.com/1171228/g/12938218.jpg"],
        ['微距', "https://photo.tuchong.com/1646186/g/29779562.jpg"],
        ['长曝光', "https://photo.tuchong.com/438396/g/17255924.jpg"],
        ['写真', "https://photo.tuchong.com/1453968/g/30241960.jpg"],
    ],
    '地区': [
        ['北京', "https://photo.tuchong.com/981697/g/22112581.jpg"],
        ['上海', "https://photo.tuchong.com/1524189/g/24602978.jpg"],
        ['广州', "https://photo.tuchong.com/1316594/g/27949407.jpg"],
        ['西安', "https://photo.tuchong.com/1044363/g/23624646.jpg"],
        ['美国', "https://photo.tuchong.com/1788913/g/28920963.jpg"],
        ['成都', "https://photo.tuchong.com/1359626/g/16607875.jpg"],
        ['厦门', "https://photo.tuchong.com/1189179/g/9457237.jpg"],
        ['云南', "https://photo.tuchong.com/999851/g/16806360.jpg"],
        ['郑州', "https://photo.tuchong.com/426208/g/28861848.jpg"],
    ],
};

export default class Home extends Component {

    renderRow(item, sectionID, rowID) {
        return (
            <TouchableHighlight key={item.key} style={styles.coverView}
                                onPress={() => Actions.taggedView({title: item.tag, tag: item.tag, hot: true})}>
                <View>
                    <Image style={styles.coverViewImage}
                           source={{uri: item.url, width: (width - 40) / 3, height: (width - 40) / 3}}/>
                    <View style={styles.coverViewText}>
                        <Text style={{fontSize: 13, color: 'white', fontWeight: "300"}}>{ item.tag }</Text>
                    </View>
                </View>
            </TouchableHighlight>
        )
    }

    _generateData(array, index) {
        return array.map((item, i) => {
            return {
                key: index * 100 + i,
                tag: item[0],
                url: item[1],
            }
        });
    }

    render() {
        var sections = ['主题', '器材', '风格', '地区'].map((elem, index) => {
            data = this._generateData(tags[elem], index);
            return (
                <View key={index} style={styles.subsection}>
                    <View style={styles.subsectionTitle}>
                        <View style={styles.subsectionTitleDeco}>
                        </View>
                        <View style={{flexDirection: 'column', justifyContent: 'center'}}>
                            <Text style={styles.subsectionTitleText}>{elem}</Text>
                        </View>
                    </View>
                    <View style={styles.subsectionBody}>
                        <GridView
                            data={data}
                            itemsPerRow={ITEM_PER_ROW}
                            renderItem={this.renderRow}>
                        </GridView>
                    </View>
                </View>
            )
        });

        return (
            <ScrollView style={{flex: 1}}>
                <View style={styles.occupySpace} />
                <View style={styles.topSection}>
                    <Image style={styles.titleImage}
                        source={require('./resources/tuchong.jpg')} />
                </View>
                <View style={styles.mainSection}>
                    {sections}
                </View>
                <View style={styles.bottomSection}>
                    <Image style={styles.bottomImage}
                           source={require('./resources/separator.png')} />
                </View>
            </ScrollView>
        )
    }
}

const styles = StyleSheet.create({
    occupySpace: {
        height: (Platform.OS === 'ios') ? 64 : 54,
    },
    topSection: {
        height: 175,
    },
    titleImage: {
        height: 175,
        alignSelf: 'center',
        resizeMode: 'contain',
    },
    mainSection: {
    },
    bottomSection: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        height: 45,
    },
    bottomImage: {
        height: 45,
        resizeMode: 'contain',
    },
    subsection: {
        flexDirection: 'column',
        padding: 10,
    },
    subsectionTitle: {
        height: 30,
        flexDirection: 'row',
    },
    subsectionBody: {
        paddingLeft: 5,
        paddingRight: 5,
    },
    subsectionTitleDeco: {
        width: 15,
        margin: 10,
        backgroundColor: "rgba(255, 144, 0, 1)",
    },
    subsectionTitleText: {
        textAlign: 'center',
        fontSize: 14,
        color: 'black',
        fontWeight: "500",
    },
    coverView: {
        paddingTop: 1.5,
        paddingBottom: 1.5,
        width: (width - 40) / 3,
        height: (width - 40) / 3 + 3,
    },
    coverViewImage: {},
    coverViewText: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        width: (width - 40) / 3,
        height: 22,
        position: 'absolute',
        left: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.5)'
    }
})
