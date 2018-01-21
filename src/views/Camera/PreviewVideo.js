import React, { Component } from 'react';
import {
    AppRegistry,
    StyleSheet,
    Text,
    TextInput,
    Button,
    Image,
    TouchableOpacity,
    TouchableWithoutFeedback,
    StatusBar,
    Dimensions,
    ScrollView,
    PanResponder,
    Animated,
    View } from 'react-native';
import Video from 'react-native-video';
import { Keyboard } from 'react-native';
import IonIcon from 'react-native-vector-icons/Ionicons';
import GestureRecognizer, {swipeDirections} from 'react-native-swipe-gestures';
import PinchZoom from 'react-native-pinch-zoom-view';

import renderIf from './renderIf';

//Redux
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import * as Actions from '../../actions/postAction'

export const {height, width} = Dimensions.get('window');

function mapStateToProps(state) {
  return {
    post: state.postReducer
  }
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(Actions, dispatch)
}

const styles = StyleSheet.create({

  container: {
    flex: 1,
    //height: height,
    //justifyContent: 'center',
    //alignItems: 'center',
    //flexDirection: 'column',
    backgroundColor: 'black',
  },

  fullScreen: {
    position: 'absolute',
    //height: height,
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
  },

  buttons: {
    position: 'absolute',
    alignSelf: 'flex-end',
    alignItems: 'flex-end',
    bottom: 0,
  },

  comList: {
    width: width,
    height: 100,
    backgroundColor: 'rgba(77, 77, 77, 0.5)',
  },

  sendButton: {
    flex: 1,
    alignSelf: 'flex-end',
  },

  textField: {
    opacity: 0.8,
    height: 40,
    fontSize: 32,
    width: width * 0.75,
    color: 'white',
    position: 'absolute',
    top: 100,
  },

  comImage: {
    width: 75,
    height: 75,
    marginLeft: 5,
    marginRight: 5,
    marginBottom: 5,
  },

  selectedCom: {
    width: 75,
    height: 75,
    marginLeft: 10,
    marginBottom: 10,
  },

});

class PreviewVideo extends Component {

  constructor(props) {
    super(props);
    this.onLoad = this.onLoad.bind(this);
    this.onBuffer = this.onBuffer.bind(this);

    this.state = {
      pan: new Animated.ValueXY()
    };

    /*this.state = {
      asset: null,
      text: 'Hello world',
      fontSize: 38,
      colorCode: '#ffffff',
      textBackgroundColor: '#ff00e0',
      state: false,
      pan: new Animated.ValueXY(),
      communities: [
        {"key": 0, "name": "Team of Vili"},
        {"key": 1, "name": "Team of Vili"},
        {"key": 2, "name": "Team of Vili"},
        {"key": 3, "name": "Team of Vili"},
        {"key": 4, "name": "Team of Vili"}
      ]
    };*/

      this.panResponder = PanResponder.create({
        onStartShouldSetPanResponder : () => true,
        onPanResponderMove : Animated.event([null,{
          dx : this.state.pan.x,
          dy : this.state.pan.y
        }]),

        onPanResponderGrant: (e, gestureState) => {
          this.state.pan.setOffset({x: this.state.pan.x._value, y: this.state.pan.y._value});
          this.state.pan.setValue({x: 0, y: 0});
        },

        onPanResponderRelease : (e, gesture) => {
          this.state.pan.flattenOffset();
        }
      });

    }

    hideElement() {
      this.setState({elementVisibility: true});
      this.setState({comVisibility: true});
    }

    onLoad(data) {
      this.setState({duration: data.duration});
    }

    onBuffer({ isBuffering }: { isBuffering: boolean }) {
      this.setState({ isBuffering });
    }

  render() {
    //var img = require({this.props.path});
    //alert("Video preview");
    return (
      <View style={styles.container}>
        <StatusBar barStyle="light-content" />
        <View style={styles.fullScreen}>
          <Video
          source={{uri: this.props.post.path}}
          style={styles.fullScreen}
          muted={false}
          rate={1.0}
          onLoad={this.onLoad}
          onBuffer={this.onBuffer}
          repeat={true} />
          {this.renderDragable()}
        </View>
        <View style={{flex: 0, flexDirection: 'column', alignItems: 'flex-start', marginLeft: 20, marginTop: 10, position: 'absolute'}}>
        <TouchableOpacity>
        <IonIcon name="ios-close" size={60} color="#FFFFFF" style={{backgroundColor: "transparent"}} />
        </TouchableOpacity>
        </View>
        <View style={styles.buttons}>
          {renderIf(!this.state.elementVisibility,
          <ScrollView horizontal={true} showsHorizontalScrollIndicator={false} style={styles.comList}>

            <View style={{flex: 1, flexDirection: 'row', alignSelf: 'flex-end', alignItems: 'flex-end'}}>

                <TouchableOpacity onPress={()=> this.hideElement()}>
                <View style={{flex: 1, alignItems: 'center'}}>
                <Image
                style={styles.comImage}
                source={require('../../images/community.png')} />
                <Text style={{flex: 1, color: 'white'}}>Test</Text>
                </View>
                </TouchableOpacity>

                <TouchableOpacity onPress={()=> this.hideElement()}>
                <View style={{flex: 1, alignItems: 'center'}}>
                <Image
                style={styles.comImage}
                source={require('../../images/community.png')} />
                <Text style={{flex: 1, color: 'white'}}>Test</Text>
                </View>
                </TouchableOpacity>

                <TouchableOpacity onPress={()=> this.hideElement()}>
                <View style={{flex: 1, alignItems: 'center'}}>
                <Image
                style={styles.comImage}
                source={require('../../images/community.png')} />
                <Text style={{flex: 1, color: 'white'}}>Test</Text>
                </View>
                </TouchableOpacity>

                <TouchableOpacity onPress={()=> this.hideElement()}>
                <View style={{flex: 1, alignItems: 'center'}}>
                <Image
                style={styles.comImage}
                source={require('../../images/community.png')} />
                <Text style={{flex: 1, color: 'white'}}>Test</Text>
                </View>
                </TouchableOpacity>

              </View>

            </ScrollView>
            )}
            <View style={{flex: 1, flexDirection: 'row', alignSelf: 'flex-end', width: width}}>
            { this.state.elementVisibility &&
              <View style={{flex: 1, flexDirection: 'row', alignSelf: 'flex-start'}}>
              <TouchableOpacity>
              <Image
              style={styles.selectedCom}
              source={require('../../images/community.png')} />
              </TouchableOpacity>
              </View>
            }

            { this.state.elementVisibility &&
            <View style={{flex: 1, flexDirection: 'row', alignSelf: 'flex-end', alignItems: 'flex-end'}}>
            <TouchableOpacity style={styles.sendButton}>
            <Image
            style={{width: 70, height: 70, marginBottom: 15, marginRight: 10, alignSelf: 'flex-end', alignItems: 'flex-end'}}
            source={require('../../images/send_button.png')} />
            </TouchableOpacity>
            </View>
            }
            </View>
        </View>
      </View>
    );
  }

  renderDragable() {
    return (
      <View>
        <Animated.View {...this.panResponder.panHandlers}>
          <TouchableWithoutFeedback onPress= { () => {Keyboard.dismiss()} }>
            <TextInput style={styles.textField}
            autoCorrect={false}
            returnKeyType="done"
            onSubmitEditing={(event) => {
              Keyboard.dismiss();
            }} />
          </TouchableWithoutFeedback>
        </Animated.View>
      </View>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(PreviewVideo);
