import React, { Component } from 'react';
import {  View, StyleSheet, StatusBar, Text,
          Image, TouchableOpacity, TouchableHighlight, PanResponder,
          TouchableWithoutFeedback, Dimensions } from 'react-native';
//import Camera from 'react-native-camera';
//import MovToMp4 from 'react-native-mov-to-mp4';
//import ReactNativeEventEmitter from 'ReactNativeEventEmitter';
//import NodeHandle from 'NodeHandle';

//Redux
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import * as Actions from '../../actions/postAction'
//import * as Progress from 'react-native-progress';
//import renderIf from './renderIf';

//import Icon from 'react-native-vector-icons/FontAwesome';
//import IonIcon from 'react-native-vector-icons/Ionicons';

export const {height, width} = Dimensions.get('window');

var ImagePicker = require('react-native-image-picker');

const styles = StyleSheet.create({

  preview: {
    flex: 1,
    justifyContent: 'flex-end',
    //alignItems: 'center',
    //height: Dimensions.get('window').height,
    //width: Dimensions.get('window').width,
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
});

function mapStateToProps(state) {
  return {
    test: 'test'
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

  componentWillMount() {

    const options = {
      quality: 1,
      videoQuality: 'high',
      durationLimit: 30,
      allowsEditing: false
    };

    ImagePicker.launchCamera(options, (response) => {
      if (response.error) {
        alert("Error");
      } else {
        let source = { uri: response.uri };
      }
    });
  }

  render() {
    const {navigate} = this.props.navigation;
    return (
      <View style={{flex: 1}}>
      <StatusBar hidden={true} />
       <Text>Hello world!</Text>
      </View>
    )
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(CameraView);
