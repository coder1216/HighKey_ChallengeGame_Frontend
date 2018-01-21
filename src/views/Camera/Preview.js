import React, { Component } from 'react';
import {
    AppRegistry,
    StyleSheet,
    Text,
    TextInput,
    Button,
    Image,
    TouchableOpacity,
    StatusBar,
    Dimensions,
    ScrollView,
    Keyboard,
    PanResponder,
    Animated,
    BackHandler,
    ImageStore,
    ImageEditor,
    CameraRoll,
    View } from 'react-native';
import GL from 'gl-react';
import { Surface } from 'gl-react-native';
import ImageFilter from 'gl-react-imagefilters';
const {Image: GLImage} = require("gl-react-image");

import Swiper from 'react-native-swiper';
import GestureRecognizer, {swipeDirections} from 'react-native-swipe-gestures';
import IonIcon from 'react-native-vector-icons/Ionicons';
import PinchZoom from 'react-native-pinch-zoom-view';
import ViewShot from 'react-native-view-shot';
//import { captureRef } from 'react-native-view-shot';
//import ViewShot from 'react-native-view-shot';


import axios from 'axios';

// aeged: Important for exiting
import { NavigationActions } from 'react-navigation'

import renderIf from './renderIf';

export const {height, width} = Dimensions.get('window');

//Redux
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as Actions from '../../actions/postAction';

function mapStateToProps(state) {
  return {
    post: state.postReducer,
    spot: state.spotReducer
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
    top: height - 100,
  },

  comList: {
    width: width,
    height: 100,
    backgroundColor: 'rgba(77, 77, 77, 0.5)',
  },

  sendButton: {
    //flex: 1,
    alignSelf: 'flex-end',
  },

  textField: {
    //height: 40,
    fontSize: 32,
    width: 195,
    textAlign: 'center',
    //width: width * 0.90,
    //height: 70,
    flex: 0,
    color: 'white',
    //bottom: 300,
  },

  animatedText: {
    //width: 200,
    //height: 200,
    flex: 0,
    //position: 'absolute',
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

class Preview extends Component {

  constructor(props) {

  super(props);

  this.state = {
    image64: null,
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
    pan : new Animated.ValueXY()
  };

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

  componentWillMount() {

    this.getSpots();

  }
  //.then((data) => data.json())
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
    //this.setState({comVisibility: true});
  }

  processImage = () => {
    this.refs.captureArea.capture().then(uri => {
      console.log("Here is the image uri: ", uri);

      /*
      SAVE ORIGINAL IMAGE ON IMAGE LIBRARY.
      DELETE THIS LINE IF THIS FUNCTION NOT NEEDED.
      */
      /*CameraRoll.saveToCameraRoll(this.props.post.path)
      .then(console.log("Image saved on gallery."));

      Image.getSize(uri, (width, height) => {
        var size = {size: {width, height}, offset: {x: 0, y: 0}};

        ImageEditor.cropImage(uri, size, (imageURL) => {
          console.log("Cropping done");

          ImageStore.getBase64ForTag(imageURL, (imageBase64) => {
            this.setState({image64: imageBase64});
            console.log("Base64 converted: ", imageBase64);

            //REMOVE IMAGE FROM ImageStore IN ORDER TO FREE UP RAM.
            ImageStore.removeImageForTag(imageURL);

            }, (error) => console.log(error) )
          }, (error) => console.log(error) )
        }, (error) => console.log(error))*/
    })
    .catch(
      error => (
        console.log("Could not save the image: ", error)
      ));
  }

  /*processImage() {
    captureRef(this.refs.viewShot, {
      format: "jpg",
      quality: 0.8
    })
    .then(
      uri => console.log("Image saved to ", uri),
      error => console.error("Could not save image ", error)
    );
  }*/
  /*
  convertToBase64 = () => {
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
    }
    */
  /* !!! This is experiemental code !!! */

  /*
  processImage() {
    ViewShot.takeSnapshot(surface, {
      format: "jpg",
      quality: 0.8
    })
    .then(
      uri => console.log("Image saved to ", uri),
      error => console.error("Could not save image ", error)
    );
  }*/

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

  /*
  snapshot = refname => () =>
    captureRef(this.refs[refname], this.state.value)
    .then(
      res => this.setState({
          error: null,
          res,
          previewSource: {
            uri: this.state.value.result === "base64"
            ? "data:image/" + this.state.value.format + ";base64," + res : res
          }
      })
    )
    .then(
      alert(this.state.value.result)
    )
    .catch(
      error => (
        this.setState({error, res: null, previewSource: null})
      )
    );
    */
  /*convertImage = () => {
    //var ref = React.findNodeHandle(this.refs.img);
    this.refs.viewShot.capture().then(uri => {
      alert("Image captured");
    });
  }*/

  onSwipeLeft(gestureState) {
    /*{this.state.filters.map((item, index) => (
      this.setState({saturation: item.saturation})
      ))
    }*/

    //var number = this.state.filters.key;
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
    /*{this.state.filters.reverse().map((item, index) => (
      this.setState({saturation: item.saturation})
      ))
    }*/
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

  render() {
    // aeged: For navigating screen pages
    // value of null sets it back to last page
    const backAction = NavigationActions.back(null)

    const config = {
      velocityThreshold: 0.3,
      directionalOfsetThreshold: 80
    };

    let groups = [ ...this.state.groups ];
    //const data = this.props.data || 'No data';
    //alert(data.path);
    //const data = this.props.path || 'No data';
    //var imgUrl = "\'" + data + "\'"
    //const imageUrl = require(data);
    //alert(data);
    //var img = require({this.props.path});
    //NEW source= {{uri: this.props.post.path}}
    return (
      <View style={styles.container}>
      <StatusBar barStyle="light-content" />

      <View style={styles.fullScreen}>
      <ViewShot ref="captureArea">
      <GestureRecognizer
      onSwipe={(direction, state) => this.onSwipe(direction, state)}
      onSwipeLeft={(state) => this.onSwipeLeft(state)}
      onSwipeRight={(state) => this.onSwipeRight(state)}
      onSwipeUp={(state) => this.onSwipeUp(state)}
      config={config}>

        <Surface width={width} height={height}>
          <ImageFilter saturation={this.state.saturation}
          contrast={this.state.contrast}
          brightness={this.state.brightness}
          temperature={this.state.temperature}>
            <GLImage
            source={{uri: this.props.post.path}}
            imageSize={{ width: width, height: height }}
            resizeMode="stretch" />
          </ImageFilter>
        </Surface>

        </GestureRecognizer>
        <View style={styles.dragArea}>
        <PinchZoom>
        {this.renderDragable()}
        </PinchZoom>
        </View>
        </ViewShot>


      </View>

      <View style={{flex: 0, flexDirection: 'column', alignItems: 'flex-start', marginLeft: 20, marginTop: 10, position: 'absolute'}}>
      <TouchableOpacity onPress={ () => this.props.navigation.dispatch(backAction) }>
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
            <TouchableOpacity style={styles.sendButton} onPress={this.processImage}>
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

  renderDragable() {
    //<Text style={styles.textField}>Testing</Text>
    return (
      <Animated.View {...this.panResponder.panHandlers}
        style={[this.state.pan.getLayout(), styles.animatedText]}>
        <TextInput style={styles.textField}
          ref="locText"
          placeholder="Text"
          autoCorrect={false}
          multiline={true}
          onContentSizeChange={() => {}}
          numberOfLines={3}
          scrollEnabled={false}
          editable={this.state.hideKeypad}
          returnKeyType="done"
          autoFocus={false}
          blurOnSubmit={true}
          onSubmitEditing={() => this.refs['locText'].blur()} />
      </Animated.View>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Preview);
