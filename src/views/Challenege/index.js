import React, { Component } from 'react';
import { View, StatusBar, StyleSheet, Alert, AsyncStorage, Text as TextReact, Share, Modal, Keyboard, Easing, FlatList, ScrollView, Dimensions, InteractionManager, TouchableOpacity, TouchableWithoutFeedback, TouchableHighlight} from 'react-native';

//Styles
import styles from './styles';
import one from '../../views/Profile/Profile';
//Config
import {MapboxToken} from '../../config/mapbox';
//import challenge from '../../views/challenge'
//Component
import DrawerComponent from '../../modules/drawer';
var Challenge1 = require('../challenge/Challenge')
//Redux
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import * as Actions from '../../actions/userAction'
import {showChallenge} from "../../actions/userAction";

//import Button from 'react-native-button';
//import Modal from 'react-native-modalbox';
//UI
import { Title, TextInput, Button, Text, Caption, View as ViewShoutem, NavigationBar,Navigator, Lightbox, Divider, Subtitle, Spinner, Image} from '@shoutem/ui';
import Icon from 'react-native-vector-icons/FontAwesome';
import { AlertIOS } from 'react-native';

//Map
import Mapbox, { MapView, Annotation } from 'react-native-mapbox-gl';

import ActivityView from 'react-native-activity-view';

import AnimatedLinearGradient, {presetColors} from 'react-native-animated-linear-gradient'

import CircleTransition from 'react-native-expanding-circle-transition'
const ANIMATION_DURATION = 600
const TRANSITION_BUFFER = 700
const POSITON = 'custom'




function mapStateToProps(state) {
  return {
    user: state.userReducer.user
  }
}

//function mapDispatchToProps(dispatch) {
 // return bindActionCreators(Actions, dispatch)
//}



class Login extends Component {
  // static navigationOptions = { title: 'Kurssit', header: null };
  static navigationOptions = {
    tabBarLabel: 'My Images',
    // Note: By default the icon is only shown on iOS. Search the showIcon option below.
    tabBarIcon: ({ tintColor }) => (
     <Icon name="map" size={15} style={{ color: tintColor }}/>
    ),
  };

  constructor(props) {
    super(props);

    this.state = {
      interactionsComplete: false,
      center: {
        latitude: 40.72052634,
        longitude: -73.97686958312988
      },
      viewBackgroundColor: '#29C5DB',
      circleColor: '#29C5DB',
      customLeftMargin: 0,
      customTopMargin: 0,
      expand: true,
      openImages: false,
        modalVisible: false,

//        this._onPress()=this.onPress().bind(this);

    }


    const accessToken = MapboxToken;
    Mapbox.setAccessToken(accessToken);
  }


    onPress() {
        console.log("aaa");
        this.props.navigator.push({
            title:'1',
            component: one,
        });
    }

    setModalVisible(visible){
        this.setState({modalVisible: visible});
    }


  componentDidMount() {
    InteractionManager.runAfterInteractions(() => {
          this.setState({interactionsComplete: true});
    });
  }


  handlePress = () => {
    console.log(this.state);
    // Share.share({
    //   message: 'This message has a title',
    //   title: 'Best title ever!',
    //   url: 'http://www.populic.com/'
    // }, {
    //   dialogTitle: 'This is share dialog title',
    //   excludedActivityTypes: [
    //     'com.apple.UIKit.activity.PostToTwitter',
    //     'com.apple.uikit.activity.mail'
    //   ],
    //   tintColor: 'green'
    // })
    // .then(result=> console.log(result))
    // .catch(err => console.log(err))
    // this.setState({
    //     openImages: false,
    // });
    // ActivityView.show({
    //   text: 'Such Populic, much sharing',
    //   url: 'http://www.populic.com/',
    //   imageUrl: 'https://i.warosu.org/data/g/img/0443/33/1411543329057.png',
    // });

    
     // this.circleTransition.start(() => {
      
     // });
    
    
  }

    displayChallenge = () => {
        //const {dispatch} = this.props;
        //dispatch(showChallenge());
        this.props.dispatch(showChallenge());
        console.log("aaaaaaaaaaaaaaaaaaaaa");
       // AlertIOS.alert("aa");
    }
  closeCommunity = () => {
    this.setState({
      openImages: false,
    });
    
    
  }
 
  openImages = () => {

  }

    onChildChanged  = () =>{
        //Alert.alert("aaaa");
        console.log("gossssssssssssssst");
        this.setModalVisible(!this.state.modalVisible)
}

  render() {
    let {
      circleColor,
      viewBackgroundColor,
      customTopMargin,
      customLeftMargin
    } = this.state;
      const { navigate } = this.props.navigation;

      return (



       <View style={styles.container}>
            <CircleTransition
              ref={(circle) => { this.circleTransition = circle }}
              color={circleColor}
              transitionBuffer={TRANSITION_BUFFER}
              duration={ANIMATION_DURATION}
              easing={Easing.linear}
              position={'center'}

            />


            <MapView
              ref={map => { this._map = map; }}
              style={styles.map}
              initialCenterCoordinate={this.state.center}
              initialZoomLevel={11}
              initialDirection={0}
              pitchEnabled={false}
              rotateEnabled={false}
              scrollEnabled={true}
              zoomEnabled={true}
              userTrackingMode={Mapbox.userTrackingMode.followWithCourse}
              showsUserLocation={true}
              //styleURL={'mapbox://styles/viliv/cj52kazmc2cl02sofe1mpeiic'}
            >

              <Annotation
                id="annotation1"
                coordinate={this.state.center}
                style={{alignItems: 'center', justifyContent: 'center', position: 'absolute'}}
              >
                
               
                  <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
                       <View style={{position: 'absolute', top: 30, left: 30, justifyContent: 'center', alignItems: 'center'}}>
                            <AnimatedLinearGradient customColors={presetColors.firefox} speed={700} />
                        </View>
                        <View style={{position: 'absolute', top: 0, left: 0, width: 60, height: 60, justifyContent: 'center', alignItems: 'center'}}>
                            <Spinner color='#fff'/> 
                        </View>
                            
                       <TouchableWithoutFeedback onPress={this.handlePress} >
                          <Lightbox swipeToDismiss={false} pinchToZoom={false} underlayColor={'transparent'} backgroundColor={'transparent'} activeProps={{style: {width: Dimensions.get('window').width, height: Dimensions.get('window').height}}}>  
                              <Image
                                style={{width: 52, height: 52, borderRadius: 26, marginLeft: 4, marginTop: 4, opacity: 0.8}}
                                source={{uri: "https://images.pexels.com/photos/450597/pexels-photo-450597.jpeg?h=' + Dimensions.get('window').height + '&auto=compress&cs=tinysrgb"}}
                              />
                            </Lightbox>
                          
                        </TouchableWithoutFeedback>
                 
                    
                  </View>
                
                
              </Annotation>

               <Annotation
                id="annotation2"
                coordinate={{
                  latitude: 40.73452634,
                  longitude: -73.98386958312988
                }}
                style={{alignItems: 'center', justifyContent: 'center', position: 'absolute'}}
              >
                
                  <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
                    <AnimatedLinearGradient customColors={presetColors.firefox} speed={1000}>
                        <Lightbox swipeToDismiss={true} underlayColor={'transparent'} backgroundColor={'transparent'} activeProps={{style: {width: Dimensions.get('window').width, height: Dimensions.get('window').height}}}>  
                          <Image
                            style={{width: 52, height: 52, borderRadius: 26, marginLeft: 4, marginTop: 4}}
                            source={{uri: "https://images.pexels.com/photos/247/city-cars-vehicles-street.jpg?h=' + Dimensions.get('window').height + '&auto=compress&cs=tinysrgb"}}
                          />
                        </Lightbox>
                    </AnimatedLinearGradient>
                    <View
                      style={{padding: 2, position: 'absolute', bottom: -32, right: -35, backgroundColor: '#8397D6'}}
                    >
                      <TextReact style={{fontSize: 10, color: '#fff'}}>
                          NEW
                      </TextReact> 
                    </View>
                  </View>
                
              </Annotation>
              <Annotation
                id="annotation3"
                coordinate={{
                  latitude: 40.73552634,
                  longitude: -73.93386958312988
                }}
                style={{alignItems: 'center', justifyContent: 'center', position: 'absolute'}}
              >
                
                <TouchableWithoutFeedback onPress={this.handlePress}>
                  <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
                    <View style={{width: 60, height: 60, borderRadius: 30, backgroundColor: '#5093D7'}}>
                        <View style={{position: 'absolute', top: 0, left: 0, width: 60, height: 60, justifyContent: 'center', alignItems: 'center'}}>
                                <Spinner color='#fff'/> 
                        </View>
                    
                        <Lightbox swipeToDismiss={true} onOpen={this.handlePress} underlayColor={'transparent'} backgroundColor={'transparent'} activeProps={{style: {width: Dimensions.get('window').width, height: Dimensions.get('window').height}}}>  
                          <Image
                            style={{width: 52, height: 52, borderRadius: 26, marginLeft: 4, marginTop: 4}}
                            source={{uri: "https://images.pexels.com/photos/442540/pexels-photo-442540.jpeg?h=' + Dimensions.get('window').height + '&auto=compress&cs=tinysrgb"}}
                          />
                        </Lightbox>
                    </View> 
                
                  </View>
                </TouchableWithoutFeedback>
              </Annotation>

            </MapView>
           {/*<Navigator*/}
               {/*initialRoute={{component: challenge}}*/}
               {/*selected={this.state.selectItem == 'challenge'}*/}
               {/*onpress={()=>{this.setState({selectedItem :'challenge'})}}*/}
           {/*>*/}
               {/*<challenge />*/}
           {/*</Navigator>*/}
           {/*<Button onPress={() => this.refs.modal4.open()} style={styles.btn}  ><Text>Position bottom + backdrop + slider</Text></Button>*/}
           <View  >
               <Modal
                   animationType={"slide"}
                   transparent={true}
                   visible={this.state.modalVisible}
                   onRequestClose={() => {alert("Modal has been closed.")}}
               >
                <View style = { position = "absolute"} >
                    <TouchableHighlight style = { styles.button } onPress={() => {
                    this.setModalVisible(!this.state.modalVisible)
                    }}>
                        <Image style ={styles.imageOne}  source={require('../../images/icons8-Cancel-48.png')}/>
                    </TouchableHighlight>
                    <Challenge1 callbackParent = {this.onChildChanged} navigation = {this.props.navigation} visibility = {this.state.modalVisible}/>
                </View>

               </Modal>

               <TouchableHighlight onPress={() => {
                   //this.props.navigator.push({component:one})
                   this.setModalVisible(true)
               }}>
                   <View style={styles.challenge}>
                       <Image style = {{height:40,width:40} } source={require('../../images/lace-2.png')}/>
                   </View>
               </TouchableHighlight>

           </View>
       </View>
      );
    }


}

                 
export default connect(mapStateToProps, null)(Login);
