import React, { Component } from 'react';

import { View, Text, Image, Alert,Button, AsyncStorage,StyleSheet, Text as TextReact, Share, Modal, Keyboard, Easing, FlatList, ScrollView, Dimensions, InteractionManager, TouchableOpacity, TouchableWithoutFeedback, TouchableHighlight} from 'react-native';
//import one from '../../views/challenge/Suggestion';
import {Navigator} from 'react-native-deprecated-custom-components'
import ContactList from '../../views/Challenge/Contacts';
import ChooseChallenger from '../../views/Challenge/ChallengerChoosePage';
import Suggestion from '../../views/Challenge/Suggestion';
import ChallengeDetail from '../../views/Challenge/ChallengeDetail'
import App from '../../views/Challenge/Settings';
import Idea from '../../views/Challenge/Idea'
import SEVER, {SERVER} from '../../config/server';
// const challengeIcon = '../../images/lace-2.png';
import challengeAct from'../../actions/challengeAction'
import {Connect} from "../../views/Challenge/connect";
import {ChallengeAction} from "../../actions/challengeAction"
import Timer from "../../views/Challenge/Timer"
import {FetchChallenge} from "../../modules/fetchChallenge"
import * as challengeAPI from "../../constant/string"
var timer1 = null;
var timer2 = null;
var timer3 = null;
//
var Challenge = React.createClass({
  getInitialState: function () {
    return {
      checked: this.props.initClick,
      showCancel: false,
      modalVisible: false,
      contactVisible: false,
      hour: null,
      minute: null,
      second: null,
      completeTime: [],
      showConfirm: false,
      doItVisible: true,
      ideaVisible: false,
      suggestionVisible: false,
      isConfirm: false,
      isDeclineOther: false,
      upcoming:null,
      load:false,
      todayChallenge: null,
      friends: null,
      challengers:null,
      paired: false,
      challengeDetail: false,
      loadAgain:false,
      proof:null,
      imgURL:"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQHQ91Di8aAgFRiox6qntXdmyQLNVZRT8sHNBYk_7_XHqFvM2-GWw",
      invitedFriends: 0,
      competitorCandidates: 0,
      isMatched: false,
      competitor: null, //the competitor's nickname
      me: null, // the user's nickname
      username: null,
      uploads: null,

    };
  },

  showNewsDetailView() {
    console.log('点击cell')
  },

  getHours() {
    //h = (23 - new Date().getHours());
    //this.setState({hour: h});
  },

  getMin() {
    //min = (59 - new Date().getMinutes());
    //this.setState({minute: min});
  },

  getSec() {
    // sec = (59 - new Date().getSeconds());
    //this.setState({second: sec});
  },

  componentDidMount() {
    timer1 = setInterval(() => this.getSec(), 1000);
    timer2 = setInterval(() => this.getMin(), 1000);
    timer3 = setInterval(() => this.getHours(), 1000);
    this.getData();
    this.getPost();
    //this.pullPost();
    this.getRequest();
    
  },



  componentWillUnmount(){
    clearInterval(timer1);
    clearInterval(timer2);
    clearInterval(timer3);
  },


  setModalVisible(visible){
    this.setState({modalVisible: visible});
  },

  setContactVisible(visible){
    this.setState({contactVisible: visible});
  },

  setDoItVisible(visible){
    this.setState({doItVisible: visible});
  },

  setChallengeDetail(visible){
    this.setState({challengeDetail: visible});
  },

  setideaVisible(visible){
    this.setState({ideaVisible: visible});
  },
  setSuggestionVisible(visible){
    this.setState({ suggestionVisible:visible});
  },
  onCloseSuggestion(){
    this.setSuggestionVisible(!this.state.suggestionVisible);
  },
  onCloseDetail(){
    this.setChallengeDetail(!this.state.challengeDetail);
  },

  getData(){

    // get data of today Challenges
    FetchChallenge(challengeAPI.getChallenge).then((responseJson) =>{
      this.setState({
        todayChallenge:responseJson.challengeName,
        imgURL:responseJson.imgURL,
        proof:responseJson.proof,
      })
      console.log("todayChallenge: " + this.state.todayChallenge);
      console.log("challengeImge: "+ this.state.imgURL);
      console.log("prove: " + this.state.proof);
    }).catch(error => {
      throw  error
    });

    // get data of getUpcomingChallenges
    FetchChallenge(challengeAPI.getUpcomingChallenges).then((responseJson) =>{
      console.log("upcoming challenges: "+responseJson);
      this.setState({
        upcoming:responseJson,
      }, function () {
        this.forceUpdate();
      })
    }).catch(error => {
      throw  error;
    });

    // check if user is matched
    FetchChallenge(challengeAPI.isMatched).then((responseJson) =>{
      let matched = responseJson.length != 0 ? true : false;
      console.log("isMatched: "+matched);
      this.setState({
        isMatched: matched,
      })
    }).catch(error => {
      throw  error;
    });

    // FetchChallenge(challengeAPI.isMatched).then((responseJson) =>{
    //   let matched = responseJson.length != 0 ? true : false;
    //   console.log("isMatched: "+matched);
    //   this.setState({
    //     isMatched: matched,
    //     username: responseJson[0].username,
    //     me: responseJson[0].nickname,
    //     competitor: responseJson[1].nickname
    //   })
    //   if(this.state.username == "test1"){
    //     this.setState ({me: this.state.left});
    //     this.setState ({competitor: this.state.right});
    //  }else{
    //     this.setState ({me: this.state.right});
    //     this.setState ({competitor: this.state.left});
    //  }
    // }).catch(error => {
    //   throw  error;
    // });

 //addPost   
    // FetchChallenge(challengeAPI.addPost).then((responseJson) =>{
    //   console.log("addPost: "+ responseJson);
    //   this.setState({
    //     addPost:responseJson.length,
    //   })
    // }).catch(error => {
    //   throw  error;
    // });

  //getImage  
    // FetchChallenge(challengeAPI.getImage).then((responseJson) =>{
    //   console.log("getImage: "+ responseJson);
    //   this.setState({
    //     uploads: responseJson[0].Img,
    //   })
    // }).catch(error => {
    //   throw  error;
    // });


    // get data of potential competitor
    FetchChallenge(challengeAPI.competitorCandidates).then((responseJson) =>{
      console.log("competitorCandidates: "+responseJson);
      this.setState({
        competitorCandidates:responseJson.length,
      },function () {
        this.forceUpdate();
      })
    }).catch(error => {
      throw  error;
    });

    // get data of invitedFriends
    FetchChallenge(challengeAPI.invitedFriends).then((responseJson) =>{
      console.log("invitedFriends: "+responseJson);
      this.setState({
        invitedFriends:responseJson[0],
      }, function () {
        this.forceUpdate();
      })
    }).catch(error => {
      throw  error;
    });

  },
  

  //------------------------------------------------------------------------
    // isMatched interface
    getRequest(){
      const url = `http://localhost:8888/isMatched`;
      //this.setState({ loading: true });
      return fetch(url,
        {
          method: 'POST',
          headers: {
              'Content-Type': 'application/json',
          },
          body: JSON.stringify({
              //isMatched: "true",
              username: "test2",

          }),
      })
          .then((response) => response.json())
          .then((responseJson) => {
              this.setState({
                username: responseJson[0].username,
                me: responseJson[0].nickname,
                competitor: responseJson[1].nickname
              });
              if(this.state.username == "test2"){
                this.setState ({me: this.state.left});
                this.setState ({competitor: this.state.right});
             }else{
                this.setState ({me: this.state.right});
                this.setState ({competitor: this.state.left});
             }
          })
          .catch(error => {
              this.setState({ error, loading: false });
          });
  },
  
  //------------------------------------------------------------------------
  // addpOST interface
   // pull chanllenege information to addPost ********************************************
  pullPost(){
      const url = `http://localhost:8888/addPost`;
      //this.setState({ loading: true });
      return fetch(url,{

          method: 'POST',
          headers: {
              'Accept': 'application/json',
              'Content-Type': 'application/json',
          },
          body: JSON.stringify({

              username: "test2",
              image: this.state.imgURL,
              date: "10-20-2017",
              isChallenge: true,
              time: this.showFixTime()
              
          }),
      })
      .then((response) => response.json())
      .then((responseJson) => {
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
  },

  // //------------------------------------------------------------------------

  // // getImage 
  getPost(){
      const url = `http://localhost:8888/getImage`;
      //this.setState({ loading: true });
      return fetch(url,{

          method: 'POST',
          headers: {
              'Accept': 'application/json',
              'Content-Type': 'application/json',
          },
          body: JSON.stringify({

              username: "test2",  
              date: "10-20-2017"
          }),
      })
      .then((response) => response.json())
      .then((responseJson) => {
          this.setState({

               uploads: responseJson[0].img,

          });
      })
      .catch(error => {
          this.setState({ error, loading: false });
      });

  },
//------------------------------------------------------------------------

  showDoIt(){
    if(this.state.doItVisible && !this.state.isDeclineOther){

      return(
        <View style={{marginTop: 10}}>
          <TouchableOpacity style={styles.challengeButton}
                            onPress={() => {this.clickDoIt();this.pullPost()}}>
            <Image style={styles.captionImage} source={require('../../images/lace-2.png')}/>
            <Text style={styles.btnText}> Do It</Text>
          </TouchableOpacity>
        </View>
      );
    }
  },

  clickDoIt(){
    time = [];
    time[0] = new Date().getHours();
    time[1] =  new Date().getMinutes();
    time[2] =  new Date().getSeconds();
    this.setState({completeTime:time});
    this.setDoItVisible(!this.state.doItVisible);
  },

  showToConfirm(){
    if (!this.state.isConfirm && !this.state.isDeclineOther) {
      return (
        <View>
          <View style={styles.verification}>
            <Text style={styles.verifyTextRight}> Waiting for Verification</Text>
          </View>
          <View style={styles.verification}>
            <TouchableOpacity
              style={{paddingTop: 20}}
              onPress={() => {
                this.setState({showConfirm: true})
              }}>
              <Text style={styles.verifyTextRight}>Go to Confirm</Text>
            </TouchableOpacity>
          </View>
        </View>
      );
    }
  },

  showWaitConfirm() {
    if (!this.state.doItVisible && !this.state.isConfirm && !this.state.isDeclineOther) {
      return (
        <View>
          <View style={styles.verification}>
            <Image style={styles.captionImage} source={require('../../images/lace-2.png')}/>
            <Text
              style={styles.timeLeftText}>{this.showFixTime()}
            </Text>
          </View>
          {this.showToConfirm()}
        </View>
      );
    } else if(this.state.isConfirm){
      return (
        <View style={styles.verification}>
          <Image style={styles.captionImage} source={require('../../images/lace-2.png')}/>
          <Text
            style={styles.timeLeftText}>{this.showFixTime()}
          </Text>
          <Image style={styles.captionImage} source={require('../../images/checked-box.png')}/>
        </View>
      );
    }
  },

  showWaitConfirm2() {
    if (!this.state.doItVisible) {
      return (
        <View>
          <View style={styles.verification}>
            <Image style={styles.captionImage} source={require('../../images/lace-2.png')}/>
            <Text
              style={styles.timeLeftText}>{this.showFixTime()}
            </Text>
          </View>
          <View style={styles.verification}>
            <Text style={styles.verifyTextRight}> Waiting for Verification</Text>
          </View>
        </View>
      );
    } else {
      return (
        <View/>
      );
    }
  },

  showChallengers() {

    if (!this.state.isMatched) {
      return (
        <View style={styles.GameOff}>
          <TouchableOpacity >
            {this.renderChallengers()}
          </TouchableOpacity>

          <TouchableOpacity >
            {this.renderFriends()}
          </TouchableOpacity>

          <TouchableOpacity style={styles.submitButton} onPress={() => {
            this.setContactVisible(!this.state.contactVisible)
          }}>
            {/*<Image style={styles.captionImage} source={require('../../images/lace-2.png')}/>*/}
            <Text style={styles.btnText}> Challenge your friends</Text>
          </TouchableOpacity>
          <ContactList callbackfromContacts={this.setContactVisible}
                       showContact={this.state.contactVisible}/>

        </View>
      );

    } else {

      return (
        <View style={styles.GameOn}>
          <View>
            <View style={styles.challengersContent}>
              <View style={styles.challengersOne}>
                <Text style={styles.subCaptionText}> {this.state.me} </Text>
                <View style = {{height : 100}}>
                  {this.showWaitConfirm2()}
                </View>
                <Text style={styles.scoreText}> 0 p </Text>
              </View>

              <View style={styles.challengersLine}/>

              <View style={styles.challengersTwo}>
                <Text style={styles.subCaptionText}> {this.state.competitor}</Text>
                <View style = {{height : 100}}>
                  {this.showWaitConfirm()}
                </View>
                {this.showScore()}
              </View>
            </View>
            {this.showDoIt()}
          </View>


        </View>
      );
    }
  },

  showScore(){
    if(this.state.isConfirm) {
      return (
        <Text style={styles.scoreText2}> +400 p </Text>
      );
    }else{
      return(
        <Text style={styles.scoreText}> 0 p </Text>
      );
    }
  },

  setMatched(){
    this.setState({isMatched:true});
  },

  hideConfirm(){
    this.setState({showConfirm:false});
  },

  showTime(){
    var comma1,comma2;

    if(this.state.minute < 10){
      comma1 = ':0';
    }else {
      comma1 = ':';
    }

    if(this.state.second < 10){
      comma2 = ':0';
    }else {
      comma2 = ':';
    }

    return(this.state.hour + comma1 + this.state.minute + comma2 + this.state.second);
  },

  showFixTime(){
    var comma1,comma2;
    ct = this.state.completeTime;

    if(ct[1] < 10){
      comma1 = ':0';
    }else {
      comma1 = ':';
    }

    if(ct[2] < 10){
      comma2 = ':0';
    }else {
      comma2 = ':';
    }
    return(ct[0] + comma1 + ct[1] + comma2 + ct[2]);
  },

  // showFixTime2(){
  //     var comma1,comma2;
  //     ct = this.state.completeTime;
  //     ct2 = [];
  //     s = ct[2] + 8;
  //     m = ct[1] + 15;
  //     h = ct[0];

  //     if(s > 59){
  //         ct2[2] = s - 60 ;
  //         m = m + 1;
  //     }else{
  //         ct2[2] = s;
  //     }

  //     if(m > 59){
  //         ct2[1] = m - 60 ;
  //         h = h + 1;
  //     }else{
  //         ct2[1] = m;
  //     }
  //     ct2[0] = h;

  //     if(ct2[1] < 10){
  //         comma1 = ':0';
  //     }else {
  //         comma1 = ':';
  //     }

  //     if(ct2[2] < 10){
  //         comma2 = ':0';
  //     }else {
  //         comma2 = ':';
  //     }
  //     return(ct2[0] + comma1 + ct2[1] + comma2 + ct2[2]);
  // },
      
  setCompetitor(competitor){
    this.setState({competitor:competitor});
  },

  setConfirm(){
    this.setState({isConfirm:true});
  },

  setDecline(){
    this.setState({isDeclineOther:true});
  },

  render: function () {

    console.log(this.state.uploads+"yyyyyyyyyyyyy");
    //if( this.state.todayChallenge != null && this.state.upComingChallenge != null){// ){


    if( true){//this.state.todayChallenge != null ){
      return (
        <View style={styles.popScreen}>

          <View style={styles.caption}>
            <Image style={styles.captionImageHead} source={require('../../images/lace-2.png')}/>
            <Text style={styles.captionText}>{' '}USC Daily Challenge</Text>
          </View>

          <View style={styles.timeLeft}>
            <Timer hour={this.state.hour} minute = {this.state.minute} second = {this.state.second}></Timer>
          </View>

          {this.renderTodayChallenge()}

          <ChallengeDetail callbackParent = {this.onCloseDetail} showBox = { this.state.challengeDetail} challengeContent = {this.state.todayChallenge}> </ChallengeDetail>

          {this.showChallengers()}

          <View style = {{marginTop:50}}>
            <View style={styles.upChallengeContentCaption}>
              <Text style={styles.subCaptionText}> Upcoming Challenges</Text>
            </View>
            <View style={styles.upComingChallenge}>
              {this.renderUpcomingChallenge()}
            </View>
            <View style = {{alignItems:'center'}}>
              <TouchableOpacity style={styles.submitButton} onPress={() => {this.setSuggestionVisible(!this.state.suggestionVisible); console.log("aaaaaa")}}>
                <Text style={styles.btnText}> Submit Your Idea</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/*<Image style ={styles.imageOne}  source={require('../../images/icons8-Cancel-48.png')}/>*/}
          <Suggestion callbackParent = {this.onCloseSuggestion} showBox = { this.state.suggestionVisible}></Suggestion>
          <ChooseChallenger callbackParent={this.setModalVisible} showPage={this.state.modalVisible}
                            gameOn={this.setMatched} setCompetitor={this.setCompetitor}/>
          <App show={this.hideConfirm} confirm={this.setConfirm} decline = {this.setDecline} visible={this.state.showConfirm}/>

        </View>
      );
    }else{
      return (
        <View style={styles.popScreen}>

          <View style={styles.caption}>
            <Image style={styles.captionImageHead} source={require('../../images/lace-2.png')}/>
            <Text style={styles.captionText}>{' '}USC Daily Challenge</Text>
          </View>
          <View style={styles.noInternet}>
            {/*<Image style={styles.captionImageHead} source={require('../../images/lace-2.png')}/>*/}
            <Text style={styles.captionText}>{' '}Internet Meet Some Problem</Text>
          </View>

        </View>
      );
    }


  },

  renderChallengers(){
    let content = [];
    if(this.state.competitorCandidates != 0){
      let count = this.state.competitorCandidates;
      content.push(
        <TouchableOpacity style={styles.challengerButton} onPress={() => {
          this.setModalVisible(!this.state.modalVisible)//this.setContactVisible(!this.state.contactVisible)
        }}>
          <Image style={styles.captionImage} source={require('../../images/right-black-arrow.png')}/>
          <Text style={styles.btnText}> {count} Challengers</Text>
        </TouchableOpacity>
      )
    }
    return content;
  },

  renderFriends(){
    let content = [];
    if(this.state.invitedFriends == 0){
      content.push(
        <View >
          <Text style={styles.challengerFriends}>You don't have Challenge partner</Text>
        </View>)
    }else{
      let count = this.state.invitedFriends;
      content.push(
        <View style = {styles.challengersContent}>
          <Image style = {styles.challengerImage} source={require('../../images/right-black-arrow.png')}></Image>
          <Text style={styles.challengerFriends}> {count} Friends</Text>
        </View>)
    }
    return content;
  },
  renderTodayChallenge(){
    let content = [];
    if(this.state.todayChallenge == null){
      content.push(<View style={{alignItems:'center'}}>
        <Text style={styles.subCaptionText}>No Challenge Today</Text>
      </View>)
    }else{
      let todayChallenge = this.state.todayChallenge;
      content.push(
        <TouchableOpacity  onPress={() => {
          this.setChallengeDetail(!this.state.challengeDetail)
        }} challengeContent = {this.state.todayChallenge} >
          <View style={{alignItems:'center'}}>
            <Text style={styles.subCaptionText}>{todayChallenge}</Text>
          </View>
        </TouchableOpacity>
      )
    }
    return content
  },
  //render upcoming challenge
  renderUpcomingChallenge() {
    let content = [];
    if( this.state.upcoming == null ){// fail to fetch data
      return;
    }else{//success
      let index = 0;
      while( index < this.state.upcoming.length){
        let itemLeft = "";
        let itemRight = "";
        if( index < this.state.upcoming.length ) itemLeft = this.state.upcoming[index++];
        if( index < this.state.upcoming.length ) itemRight = this.state.upcoming[index++];
        content.push(
          <View style={styles.upChallengeContent}>
            <Text  style={styles.textProperty}>{itemLeft.challengeName}</Text>
            <Text style={styles.textProperty}>{itemRight.challengeName}</Text>
          </View>
        )
      }
      return content;
    }
  }
});
const styles = StyleSheet.create({
  upChallengeContentCaption:{
    flexDirection:'row',
    alignItems:'center',
    justifyContent:'center',
  },
  challengeStatue:{
    flexDirection:'row',
    alignItems:'center',
    justifyContent:'center',
  },
  buttonStyle:{
    borderWidth:3,
    borderColor:'white',
    backgroundColor: '#5CACEE'
  },
  timeLeftText:{
    fontSize: 12,
    color:'white',
    marginRight: 20,
  },
  captionText:{
    fontSize: 20,
    color:'white',
  },
  challengerImage:{
    height:18,
    width: 18,
    resizeMode: 'contain'
  },
  challengerFriends:{
    fontSize:14,
    color:'#FFDA44',
    paddingBottom: 20,
  },
  subCaptionText:{
    fontSize: 18,
    color:'white',
  },
  scoreText:{
    fontSize: 18,
    color:'red',
    fontWeight: 'bold',
  },
  scoreText2:{
    fontSize: 18,
    color:'#83E027',
    fontWeight: 'bold',
  },
  noDataText:{
    fontSize: 12,
    color:'white',
    flexWrap:"wrap",
    justifyContent:"center"
  },
  textProperty:{
    fontSize: 12,
    marginLeft:12,
    margin:5,
    color:'white',
    width : Dimensions.get('window').width /3,
    flexWrap:"wrap",
    justifyContent:"flex-start"
  },
  upComingChallengeContent:{
  },
  upChallengeContent:{
    flexDirection:'row',
    alignItems:'stretch',
    justifyContent:'center',
  },
  upComingChallenge:{
    alignItems:'flex-start',
    justifyContent:'center',
    paddingBottom:20,
    margin:10,
  },
  challengerButton:{
    backgroundColor:'#0B4C98',
    flexDirection:'row',
    alignItems:'center',
    justifyContent:'center',
    borderWidth:2,
    borderColor:'white',
    borderRadius:5,
    paddingVertical: 5,
    width:220,
    height:35,
    marginBottom: 20,
  },
  submitButton:{
    backgroundColor:'#277DE0',
    flexDirection:'row',
    alignItems:'center',
    justifyContent:'center',
    borderWidth:2,
    borderColor:'white',
    borderRadius:5,
    paddingVertical: 5,
    width:220,
    height:35,
  },
  challengeContent:{
    flexDirection:'row',
    alignItems:'center',
    justifyContent:'flex-start',
    margin:10,
  },
  timeLeft:{
    alignItems:'flex-end',
    margin: 10,
    paddingLeft: 50,
  },
  captionImage:{
    width:15,
    height:15,
  },
  captionImageHead:{
    width:25,
    height:25,
  },
  noInternet:{
    top: Dimensions.get('window').height/3,
    alignItems:'center',
    justifyContent:'center',
  },
  caption:{
    flexDirection:'row',
    alignItems:'center',
    justifyContent:'center',
    margin: 10,
  },
  popScreen:{
    position:'relative',
    backgroundColor: '#4AA0DF',
    width: Dimensions.get('window').width-(Dimensions.get('window').width)/7,
    height: Dimensions.get('window').height-(Dimensions.get('window').height)/7,
    left:(Dimensions.get('window').width)/14,
    flexDirection:'column',
    paddingTop:10,
    paddingBottom:30,
    borderColor: 'white',
    borderWidth:3,
    top:30,
    zIndex:-1,
    fontFamily:"apple"
  },
  popScreenSmallBackground:{
    position:'relative',
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height,
    flexDirection:'column',
    paddingTop:Dimensions.get('window').height / 4,
    borderWidth:3
  },
  popScreenSmall:{
    position:'relative',
    backgroundColor: '#0883b1',
    width: Dimensions.get('window').width * 5 / 6,
    height: Dimensions.get('window').height / 4,
    left:(Dimensions.get('window').width)/12,
    flexDirection:'column',
    borderColor: 'white',
    borderWidth:3
  },
  challengeButton:{
    backgroundColor:'#83E027',
    flexDirection:'row',
    alignItems:'center',
    justifyContent:'center',
    margin:10,
    borderWidth:2,
    paddingVertical: 8,
    paddingRight: 1,
    paddingLeft: 1,
    borderColor:'white',
    borderRadius:5,
    padding:5,
    width:260,
  },
  challengersButton:{
    backgroundColor:'#08709e',
    flexDirection:'row',
    alignItems:'center',
    justifyContent:'center',
    margin:10,
    borderWidth:3,
    borderColor:'white',
    borderRadius:5,
  },
  btnText:{
    color:'white',
  },
  modalBackgroundStyle:{
    backgroundColor:  'rgba(0, 0, 0, 0.75)',
  },
  challengersContent:{
    flexDirection:'row',
    alignItems:'flex-start',
    justifyContent:'flex-start',
  },
  challengersOne:{
    alignItems:'center',
    justifyContent:'flex-start',
    width: Dimensions.get('window').width *2 / 5,
  },
  challengersLine:{
    borderColor:'white',
    borderWidth: 1,
    paddingBottom: 140,
  },
  challengersTwo:{
    flexDirection:'column',
    alignItems:'center',
    justifyContent:'flex-start',
    width: Dimensions.get('window').width *2 / 5,
  },
  verification:{
    flexDirection:'row',
    alignItems:'center',
    justifyContent:'center',
  },
  verifyTextLeft:{
    fontSize: 12,
    // flexDirection: 'row',
    // right:15,
    // alignItems:'center',
    // justifyContent:'center',
    color:'#40FB1B'
  },
  verifyTextRight:{
    fontSize: 14,
    // flexDirection: 'row',
    // right:40,
    alignItems:'center',
    justifyContent:'center',
    color:'#40FB1B',
  },
  imageOne:{
  },
  GameOff:{
    paddingTop: Dimensions.get('window').height / 60,
    paddingBottom: Dimensions.get('window').height / 30,
    height:Dimensions.get('window').height*2 / 7 ,
    alignItems:'center',
  },
  GameOn:{
    paddingTop: Dimensions.get('window').height / 30,
    paddingBottom: Dimensions.get('window').height / 30,
    height:Dimensions.get('window').height*2 / 7,
    alignItems:'center',
  }
});
module.exports = Challenge;