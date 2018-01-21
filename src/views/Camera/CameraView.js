import React, { Component } from 'react';
import {  View, AppRegistry, StyleSheet, StatusBar, Text,
          Image, Button, TouchableOpacity, TouchableHighlight, PanResponder,
          TouchableWithoutFeedback, Dimensions, Animated, BackHandler,
          ImageStore, ImageEditor, CameraRoll, ScrollView, TextInput, Keyboard,
          AsyncStorage, InteractionManager } from 'react-native';
import Camera from 'react-native-camera';
//import ReactNativeEventEmitter from 'ReactNativeEventEmitter';
//import NodeHandle from 'NodeHandle';
import GL from 'gl-react';
import { Surface } from 'gl-react-native';
import ImageFilter from 'gl-react-imagefilters';
const {Image: GLImage} = require("gl-react-image");

import Swiper from 'react-native-swiper';
import GestureRecognizer, {swipeDirections} from 'react-native-swipe-gestures';
import PinchZoom from 'react-native-pinch-zoom-view';
import ViewShot from 'react-native-view-shot';
import RNFS from 'react-native-fs';
import Video from 'react-native-video';
import RNMediaEditor from 'react-native-media-editor';
//import { captureRef } from 'react-native-view-shot';

import axios from 'axios';
import { SERVER } from '../../config/server';
import FCM from "react-native-fcm";

// aeged: Important for exiting
import { NavigationActions } from 'react-navigation'

import renderIf from './renderIf';

//Redux
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import * as Actions from '../../actions/postAction'
import * as Progress from 'react-native-progress';

import Icon from 'react-native-vector-icons/FontAwesome';
import IonIcon from 'react-native-vector-icons/Ionicons';

import Challenge from '../../views/Challenge/Challenge';

export const {height, width} = Dimensions.get('window');

const styles = StyleSheet.create({

  preview: {
    flex: 1,
    justifyContent: 'flex-end',
  },

  turn: {
    flex: 1,
    alignSelf: 'flex-start',
    marginLeft: 25,
  },

  shutter: {
    flex: 1,
    alignItems: 'center',
    alignSelf: 'center',
    marginBottom: 10,
  },

  progress: {
    flex: 1,
    alignItems: 'center',
    alignSelf: 'center',
  },

  //IMAGE VIEW STYLES
  container: {
    flex: 1,
    backgroundColor: 'transparent',
  },

  exitIcon: {
    backgroundColor: "transparent",
    textShadowRadius: 3,
    textShadowOffset: {width: 1, height: 2},
    textShadowColor: 'black',
  },

  dragArea: {
    flex: 0,
    backgroundColor: 'transparent',
    position: 'absolute',
    top: 400,
  },

  fullScreen: {
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
  },

  buttons: {
    position: 'absolute',
    alignSelf: 'flex-end',
    alignItems: 'flex-end',
    top: height - 100,
  },

  comList: {
    width: width,
    height: 100,
    backgroundColor: 'rgba(77, 77, 77, 0.5)',
  },

  sendButton: {
    alignSelf: 'flex-end',
  },

  textField: {
    fontSize: 32,
    width: 195,
    textAlign: 'left',
    flex: 0,
    color: 'white',
  },

  animatedText: {
    flex: 0,
  },

  comImage: {
    height: 70,
    width: 70,
    borderWidth: 2,
    borderColor: '#1A91E7',
    borderRadius: 35,
    marginTop: 5,
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

var index = 0;
var adurl = '';
/*
let media = [
  {
  "tempUrl" : "",
  "libUrl" : "",
},
];*/

let position = width / 2 + 59;

function mapStateToProps(state) {
  return {
    test: 'test',
    post: state.postReducer,
    spot: state.spotReducer
  }
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(Actions, dispatch)
}


class CameraView extends Component {

  static navigationOptions = {
    tabBarLabel: 'My Images',
    tabBarVisible: false,
    // Note: By default the icon is only shown on iOS. Search the showIcon option below.
    tabBarIcon: ({ tintColor }) => (
     <Icon name="camera" size={15} style={{ color: tintColor }}/>
    ),
  };


  constructor(props) {
    super(props);
    this.onLoad = this.onLoad.bind(this);
    this.onBuffer = this.onBuffer.bind(this);
    this.camera = null;
    isRecording: false;

    this.state = {

    remoteNUser:["yangtest","shijitest"],
   // competitorURL:'https://i.pinimg.com/originals/fb/f9/97/fbf997e3d0e2d713c17ea6d684f2eaff.jpg',
    


    //camera settings
    isVideo: false,
    progress: 0,
    indeterminate: true,
    buttonColor: 'white',
    animated: true,
    camera: {
      aspect: Camera.constants.Aspect.fill,
      captureTarget: Camera.constants.CaptureTarget.disk,
      type: Camera.constants.Type.back,
      mirrorImage: false,
      audio: false,
      orientaton: Camera.constants.Orientation.auto,
      flashMode: Camera.constants.FlashMode.auto,
    },
    mediaSource: null,
    image64: "",
    interactionsComplete: false,
    sendUrl: null,
    filters: [
      {"key": 0, "saturation": 1, "contrast": 1, "brightness": 1, "temperature": 6500},
      {"key": 1, "saturation": 0.0, "contrast": 1.1, "brightness": 1, "temperature": 6500},
      {"key": 2, "saturation": 1.1, "contrast": 1.15, "brightness": 1.05, "temperature": 6500},
      {"key": 3, "saturation": 1.08, "contrast": 0.75, "brightness": 1.3, "temperature": 5500},
      {"key": 4, "saturation": 0.8, "contrast": 1, "brightness": 1.05, "temperature": 9000}
      ],
    groups: [
        {"key": 0, "imgSource": require("../../images/portrait3.png"), "name": "Party"},
        {"key": 1, "imgSource": require("../../images/football.png"), "name": "USC vs CAL"},
        {"key": 2, "imgSource": require("../../images/keynote.png"), "name": "GamerCon"},
        {"key": 3, "imgSource": require("../../images/clothes.png"), "name": "2ndHand"}
      ],
    speed: [
          {"key": 0, speedRate: 1, rateText: "x1"},
          {"key": 1, speedRate: 1.5, rateText: "x1.5"},
          {"key": 2, speedRate: 2, rateText: "x2"},
          {"key": 3, speedRate: 0.2, rateText: "x0.2"},
          {"key": 4, speedRate: 0.5, rateText: "x0.5"}
      ],
    pan : new Animated.ValueXY()
  }

  

  
  

  takePicture = () => {
    this.camera.capture()
      .then((data) => {
        this.setState({mediaSource: data.path});
      })
      .catch(err => console.error(err));
    }

  startRecording = () => {
    this.state.buttonColor = 'red';
    this.animate();
    this.camera.capture({mode: Camera.constants.CaptureMode.video, audio: true, totalSeconds: 15})
      .then((data) => {
        this.setState({mediaSource: data.path, isVideo: true});
      })
      .catch(err => console.error(err));
  }

  stopRecording = () => {
    this.state.buttonColor = 'white';
    let progress = 0;
    this.setState({ progress });
    clearInterval(this.interval);
    this.camera.stopCapture();
    console.log("Recording stopped.");
  }

  turnCamera = () => {
    let newCamera;
    const { back, front } = Camera.constants.Type;

    if (this.state.camera.type === back) {
      this.setState({mirrorImage: false});
      newCamera = front;
    } else if (this.state.camera.type === front) {
      this.setState({mirrorImage: true});
      newCamera = back;
    }

    this.setState({
      camera: {
        ...this.state.camera,
        type: newCamera,
      },
    });
  }

  this.panResponder = PanResponder.create({
      onStartShouldSetPanResponder : () => true,
      onStartShouldSetPanResponderCapture : () => true,
      onPanResponderMove : Animated.event([null,{
        dx : this.state.pan.x,
        dy : this.state.pan.y
      }]),

      onMoveShouldSetResponderCapture : () => true,
      onMoveShouldSetPanResponderCapture : () => true,

      onPanResponderGrant: (e, gestureState) => {
        this.state.pan.setOffset({x: this.state.pan.x._value, y: this.state.pan.y._value});
        this.state.pan.setValue({x: 0, y: 0});
      },

      onPanResponderRelease : (e, gesture) => {
        this.state.pan.flattenOffset();
      }
    });

}

sendNotification(){
  let url = `http://104.236.189.217:8888/sendNotification`;
  return fetch(url,{
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      username: this.state.remoteNUser,     //array
      // description: this.state.description,    //string
      description: "You opponent is doing challenge now!",
    })
  })
  //.then((response) => response.json())
    .then((response) => {
      console.log("test notification"+response.toString());
    })
    .catch(error => {
      console.log(error+"test notification");
      throw error;
    });
}

  componentDidMount() {
    this.setState({rateText: "x1"});
    InteractionManager.runAfterInteractions(() => {
          this.setState({interactionsComplete: true});
    });
  }

  animate = () => {
    let progress = 0;
    this.setState({ progress });
    //var timer = setTimeout(() => {
      //this.setState({ indeterminate: false});
      this.interval = setInterval(() => {
        progress += 0.0045;
        if (progress > 1) {
            //progress = 1;
          progress = 0;
            //this.setState({ progress });
            //clearTimeout(this.timer);
            //clearInterval(this.interval);
        }
        this.setState({ progress });
      }, 50);
    //}, 100);
  }

  //IMAGE FUNCTIONS
  getSpots = () => {
    axios.get('http://35.176.212.147:3000/api/getOwnCommunityByUserId', {
      user_id: 1
    })
    .then(function (response) {
      console.log("New objects: ", response.data);
    })
    .catch(function (error) {
      console.log("Could not get objects: ", error.response);
    });
  }

  hideElement() {
    this.setState({elementVisibility: true});
    this.setState({comVisibility: true});
  }

  sendBack = () => {
    //var AWSAccessKeyId = 'AWS AKIAJDGQIQMDULPJMYCQ&Expires=1509106991&Signature=phYXHg%2FCNoY5WXdgWog3liBOCac%3D';
    var file = {
      uri: this.state.image64,
      type: 'image/jpeg',
      name: 'image.jpg',
    };

    console.log("Phase 1");
    const xhr = new XMLHttpRequest();
    console.log("Phase 2");
    xhr.open('PUT', adurl);
    console.log("Phase 3");
    //xhr.setRequestHeader('X-Amz-ACL', 'public-read');
    //xhr.setRequestHeader("Content-Type", "image/jpeg");
    //xhr.setRequestHeader("Content-Type: img/jpeg");
    xhr.onreadystatechange = function() {
      console.log("Phase 4");
      if (xhr.readyState === 4) {
        if (xhr.status === 200) {
          console.log("Phase 5");
          console.log("Image uploaded!");
        } else {
          console.log("Could not upload image: ", xhr);
        }
      }
    };
    /*xhr.open('PUT', adurl);
    xhr.setRequestHeader('X-Amz-ACL', 'public-read');
    xhr.setRequestHeader("Content-Type", "image/jpeg");*/
    xhr.send(file);
  }

  sendMedia = () => {
    this.refs.captureArea.capture().then(uri => {
      console.log("Here is the image uri: ", uri);
      this.setState({image64: uri});
      const{navigate} = this.props.navigation;
      navigate('Main');

      /*CameraRoll.saveToCameraRoll(this.props.post.path)
      .then(console.log("Image saved on gallery."))
      .catch( error => {
          console.log("Could not save the image: ", error)
      });*/
      AsyncStorage.getItem("userToken").then(value => {

        axios.get(SERVER + '/api/posts/getUrl', {
          headers: {
            'Authorization': "Bearer " + value
          }
        })
        .then(function (response) {
          console.log("New url: ", response.data.url);
          adurl = response.data.url;
        })
        .then(this.sendBack)
        .catch(function (error) {
          console.log("Could not get objects: ", error.response);
        });

      });


    })
  }

  send = () => {
    /*this.processImage();
    //this.convertToBase64();
    //console.log(this.state.image64);
    axios.post('http://35.176.212.147:3000/api/create_community', {
      name: this.props.spot.name,
      user_id: 12,
      radius: 500,
      image_video_url: this.state.image64
    })
    .then(function (response) {
      console.log(response);
    })
    .catch(function (error) {
      console.log(error);
    });*/
  }

  //VIDEO FUNCTIONS

  changeRate = () => {
    index += 1;
    //console.log(index);
    if (index == 5) {
      index = 0;
    }
    var velocity = this.state.speed[index];
    this.setState({speedRate: velocity.speedRate, rateText: velocity.rateText})
  }

  onLoad(data) {
    this.setState({duration: data.duration});
  }

  onBuffer({ isBuffering }: { isBuffering: boolean }) {
    this.setState({ isBuffering });
  }

  /*videoBase = () => {
    const imageURI = this.props.post.path;

    Image.getSize(imageURI, (width, height) => {
      var size = {size: {width, height}, offset: {x: 0, y: 0}};

      ImageEditor.cropImage(imageURI, size, (imageURL) => {
        console.log("Done");

        ImageStore.getBase64ForTag(imageURL, (imageBase64) => {
          this.setState({image64: imageBase64});
          //console.log("Base64 converted: ", base64Data);

          }, (error) => console.log(error) )
        }, (error) => console.log(error) )
      }, (error) => console.log(error));
  }*/

  textOnVideo = () => {

    const options = {
      path: '../../images/having_fun.mp4',
      type: 'video',
      left: 200,
      top: 200,
      backgroundOpacity: 0.5,
      text: 'Hello world',
      fontSize: 22,
      textColor: "#FFFFFF",
      backgroundColor: '#000000',
    };

    console.log("Text added");

    RNMediaEditor.embedText(options)
    .then(res => {
      console.log("Conversion succeed: ", res);
    })
    .catch(err => {
      console.log("Could not convert text on video: ", err);
    });
    /*RNFS.readFile(this.props.post.path, 'base64')
    .then(res => {
      console.log("Video converted on base64.");
      this.setState({image64: res});
    })
    .catch((err) => {
      console.log("Could not convert base64: ", err);
    });*/

  }

  onSwipeLeft(gestureState) {
    index += 1;
    console.log(index);
    if (index == 5 || index == 6) {
      index = 0;
    }
    var effect = this.state.filters[index];
    this.setState({saturation: effect.saturation, contrast: effect.contrast,
      brightness: effect.brightness, temperature: effect.temperature})
  }

  onSwipeRight(gestureState) {
    index -= 1;
    console.log(index);
    if (index == -1) {
      index = 4;
    }
    var effect = this.state.filters[index];
    this.setState({saturation: effect.saturation, contrast: effect.contrast,
      brightness: effect.brightness, temperature: effect.temperature})
  }



  onSwipe(gestureName, gestureState) {
    const {SWIPE_LEFT, SWIPE_RIGHT} = swipeDirections;
    this.setState({gestureName: gestureName});
    switch (gestureName) {
      case SWIPE_LEFT:
        this.setState({saturation: this.state.saturation, contrast: this.state.contrast,
          brightness: this.state.brightness, temperature: this.state.temperature});
        break;
      case SWIPE_RIGHT:
        this.setState({saturation: this.state.saturation, contrast: this.state.contrast,
        brightness: this.state.brightness, temperature: this.state.temperature});
        break;
    }
  }

  handleFocusChanged() {
    console.print("Focusing");
  }

  renderPreview = () => {
    if (this.state.isVideo == true) {
      return this.renderVideo();
    } else {
      //console.log("Rendering still image view.");
      return this.renderImage();
    }
  }

  changeView = () => {

    /*RNFS.stat(this.state.mediaSource)
    .then((result) => {
      console.log("Result: ", result);
    })
    .catch((err) => {
      console.log("Could not get file info.");
    });*/

    if (this.state.isVideo) {
      this.setState({isVideo: false});
    }
    //alert(this.state.mediaSource);
    this.setState({mediaSource: null});
    //console.log("Change view");
    //return this.renderCamera();
  }

  renderCamera() {
    //console.log("Camera on");
    //this.setState({camera: {type: Camera.constants.Type.back}});
    const {navigate} = this.props.navigation;
    return (
    <Camera
      ref={(cam) => {
        this.camera = cam;
      }}
      style={styles.preview}
      type={this.state.camera.type}
      captureTarget={this.state.camera.captureTarget}
      aspect={Camera.constants.Aspect.fill}
      defaultOnFocusComponent={true}
      onFocusChanged={() => {}}
      onZoomChanged={() => {}}
      mirrorImage={this.state.mirrorImage} >
      <View style={{flex: 1, position: 'absolute', marginLeft: 20, top: 10, justifyContent: 'flex-start'}}>
        <TouchableOpacity onPress= { () => navigate('Main') }>
        <IonIcon name="ios-close" size={60} color="#FFFFFF" style={styles.exitIcon} />
        </TouchableOpacity>
      </View>
      <View style={{flex: 0, flexDirection: 'row', justifyContent: 'flex-end', width: position}}>

        <View style={{flex: 1, flexDirection: 'row', marginBottom: 5}}>
          <TouchableOpacity style={styles.turn} onPressIn={turnCamera}>
            <IonIcon name="ios-reverse-camera-outline" size={65} color="#FFFFFF" style={{backgroundColor: "transparent"}} />

          </TouchableOpacity>

          <TouchableWithoutFeedback
          onPress={takePicture}
          onLongPress={startRecording}
          onPressOut={stopRecording}>
            <Progress.Circle
            style={styles.progress}
            size={100}
            borderWidth={5}
            thickness={5}
            color={this.state.buttonColor}
            progress={this.state.progress}
            intermediate={this.state.indeterminate}
            />
          </TouchableWithoutFeedback>

        </View>
      </View>
      </Camera>
    );
  }

  renderImage() {
    const backAction = NavigationActions.back(null)

    const config = {
      velocityThreshold: 0.3,
      directionalOfsetThreshold: 80
    };

    let groups = [ ...this.state.groups ];
    return (
      <View style={styles.container}>
      <StatusBar barStyle="light-content" />

      <View style={styles.fullScreen}>
      <ViewShot ref="captureArea" options={{format: 'jpg'}}>
      <GestureRecognizer
      onSwipe={(direction, state) => this.onSwipe(direction, state)}
      onSwipeLeft={(state) => this.onSwipeLeft(state)}
      onSwipeRight={(state) => this.onSwipeRight(state)}
      onSwipeUp={(state) => this.onSwipeUp(state)}
      config={config}>
        <TouchableWithoutFeedback onPress={ () => this.refs.locText.focus() }>
        <Surface width={width} height={height}>
          <ImageFilter saturation={this.state.saturation}
          contrast={this.state.contrast}
          brightness={this.state.brightness}
          temperature={this.state.temperature}>
            <GLImage
            source={{uri: this.state.mediaSource}}
            imageSize={{ width: width, height: height }}
            resizeMode="stretch" />
          </ImageFilter>
        </Surface>
        </TouchableWithoutFeedback>
        </GestureRecognizer>
        <View style={styles.dragArea}>
        <PinchZoom>
        {this.renderDragable()}
        </PinchZoom>
        </View>
      </ViewShot>


      </View>

      <View style={{flex: 0, flexDirection: 'column', alignItems: 'flex-start', marginLeft: 20, marginTop: 10, position: 'absolute'}}>
      <TouchableOpacity onPress={this.changeView}>
      <IonIcon name="ios-close" size={60} color="#FFFFFF" style={styles.exitIcon} />
      </TouchableOpacity>
      </View>

      <View style={styles.buttons}>
      {renderIf(!this.state.elementVisibility,
        <ScrollView horizontal={true} showsHorizontalScrollIndicator={false} style={styles.comList}>
          <View style={{flex: 1, flexDirection: 'row', alignSelf: 'flex-end', alignItems: 'flex-end', zIndex: 3}}>

          { this.state.groups.map(item => (
            <TouchableOpacity key={item.key} onPress={()=> this.hideElement()}>
              <View style={{flex: 1, alignItems: 'center'}}>
                <Image
                style={styles.comImage}
                resizeMethod={'resize'}
                source={item.imgSource} />
                <Text style={{flex: 1, color: 'white', fontSize: 12}}>{item.name}</Text>
              </View>
            </TouchableOpacity>

          ))}

            </View>
        </ScrollView>
        )}

        <View style={{flex: 1, flexDirection: 'row', alignSelf: 'flex-end', width: width}}>
          
            <View style={{flex: 1, flexDirection: 'row', alignSelf: 'flex-start'}}>
            <TouchableOpacity>
            <Image
            style={styles.selectedCom}
            source={require('../../images/community.png')} />
            </TouchableOpacity>
            </View>


          { this.state.elementVisibility
            ?
            <TouchableOpacity style={styles.sendButton} onPress={() => {
              this.sendMedia();this.sendNotification();this.pullPost();console.log("77777777777777777777777")
            }}>
              <Image
              style={{width: 70, height: 70, marginBottom: 15, marginRight: 10, position: 'absolute', right: 0, bottom: 0}}
              source={require('../../images/send_button.png')} />
            </TouchableOpacity>
            :
             <View />
          }
        </View>
      </View>
    </View>
    );
  }

  renderVideo() {
    const backAction = NavigationActions.back(null)
    return (
      <View style={styles.container}>
        <StatusBar barStyle="light-content" />
        <View style={styles.fullScreen}>
          <TouchableWithoutFeedback onPress={ this.handleText }>
          <Video
          source={{uri: this.state.mediaSource}}
          style={styles.fullScreen}
          muted={false}
          rate={this.state.speedRate}
          onLoad={this.onLoad}
          onBuffer={this.onBuffer}
          repeat={true} />
          </TouchableWithoutFeedback>
        </View>
        <View style={{flex: 0, flexDirection: 'column', alignItems: 'flex-start', marginLeft: 20, marginTop: 10, position: 'absolute'}}>
        <TouchableOpacity onPress={this.changeView}>
        <IonIcon name="ios-close" size={60} color="#FFFFFF" style={styles.exitIcon} />
        </TouchableOpacity>
        </View>
        <View style={styles.dragArea}>
          <PinchZoom>
          {this.renderDragable()}
          </PinchZoom>
        </View>
        <View style={styles.buttons}>
          {renderIf(!this.state.elementVisibility,
          <ScrollView horizontal={true} showsHorizontalScrollIndicator={false} style={styles.comList}>

            <View style={{flex: 1, flexDirection: 'row', alignSelf: 'flex-end', alignItems: 'flex-end'}}>

            { this.state.groups.map(item => (
              <TouchableOpacity key={item.key} onPress={()=> this.hideElement()}>
                <View style={{flex: 1, alignItems: 'center'}}>
                  <Image
                  style={styles.comImage}
                  resizeMethod={'resize'}
                  source={item.imgSource} />
                  <Text style={{flex: 1, color: 'white', fontSize: 12}}>{item.name}</Text>
                </View>
              </TouchableOpacity>
            )) }

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
            <View style={{flex: 1, flexDirection: 'row', alignSelf: 'center', alignItems: 'center', marginLeft: 60, marginBottom: 15}}>
            <TouchableOpacity style={styles.sendButton} onPress={this.changeRate}>
            <Text style={{color: 'white', backgroundColor: 'transparent', fontSize: 24, fontWeight: 'bold'}}>{this.state.rateText}</Text>
            </TouchableOpacity>
            </View>
            }

            { this.state.elementVisibility &&
            <View style={{flex: 0, flexDirection: 'row', alignSelf: 'flex-end', alignItems: 'flex-end'}}>
            <TouchableOpacity style={styles.sendButton} onPress={this.textOnVideo}>
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
    //<Text style={styles.textField}>Testing</Text>
    return (
      <Animated.View {...this.panResponder.panHandlers}
        style={[this.state.pan.getLayout(), styles.animatedText]}>
        <TextInput style={styles.textField}
          ref="locText"
          autoCorrect={false}
          multiline={true}
          onContentSizeChange={() => {}}
          value={this.state.imgText}
          onChangeText={(imgText) => this.setState({imgText})}
          numberOfLines={3}
          scrollEnabled={false}
          editable={this.state.hideKeypad}
          returnKeyType="done"
          autoFocus={false}
          blurOnSubmit={true}
          onSubmitEditing={this.handleDone} />
      </Animated.View>
    );
  }

  pullPost(){
    const url = `http://104.236.189.217:8888/addPost`;
    let fixedTime = (new Date().getHours())+":"+(new Date().getMinutes())+":"+(new Date().getSeconds());
    let tempdata = (new Date().getMonth()+1)+"-"+(new Date().getDate())+"-"+(new Date().getFullYear());
    //this.setState({ loading: true });
    
    return fetch(url,{

      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({

        username: this.props.myUsername,
        img: this.props.competitorURL,
        // img: "https://i.pinimg.com/originals/fb/f9/97/fbf997e3d0e2d713c17ea6d684f2eaff.jpg",
        date: tempdata,
        isChallenge: "true",
        time: fixedTime,

      }),
    })
      .then((response) => response.json())
      .then((responseJson) => {
        console.log(this.props.username+"ttttttttttttt");
        console.log(this.props.img+"iiiiiiiiiiiiiiiiiiii");
        // this.setState({
        //postStuff: this.state.responseJson[0].image,
        // postiStuffDate: this.state.responseJson[1].date,
        // postUserName: this.state.responseJson[2].username,
        // postStuffId: this.state.responseJson[4].postid,
        //postStuffTime: this.state.responseJson[5].time,
        // });
      })
      .catch(error => {
        this.setState({ error, loading: false });
      });
  }

  

  render() {
    console.log(this.state.username+"66666666666666666");
    console.log(this.state.img+"99999999999999999999999");
    console.log(this.state.date+"rrrrrrrrrrrrrrrrrrrrrr");
    console.log(this.state.time+"ffffffffffffffffffffffff");


    const {navigate} = this.props.navigation;
    return (
      <View style={{flex: 1}}>
      <StatusBar hidden={true} />
        {this.state.mediaSource ? this.renderPreview() : this.renderCamera()}
      </View>
    )
  }
}



export default connect(mapStateToProps, mapDispatchToProps)(CameraView);

