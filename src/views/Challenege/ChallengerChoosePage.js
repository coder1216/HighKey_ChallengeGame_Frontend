import React, { Component } from 'react';
import { View, Text, Image, Alert,Button, AsyncStorage,StyleSheet, Text as TextReact, Share, Modal, Keyboard, Easing, FlatList, ScrollView, Dimensions, InteractionManager, TouchableOpacity, TouchableWithoutFeedback, TouchableHighlight} from 'react-native';
// import {List, ListItem } from 'react-native-elements';

var ChallengerList = require('./ChallengerList')

export default class ChooseChallenger extends Component {

    constructor(props) {
        super(props);
        this.state = {
            // modalVisible: false,
            showGo:false,
            whoBeClick:{username:'',nickname:''},
            alertModalVisible:false,
            hintModalVisible:false,
            isGameOn:false,
            loading:false,
            whoToPair:{username:'',nickname:''},
            data:[],//the data got when "go"  button in list page is clicked
            newData:[],//will be updated iff data is changed and data is not empty.
            clicked:false,
        };
    }

    // setModalVisible(visible){
    //     this.setState({modalVisible: visible});
    // }

    onClickPerson = (newState,who)=> {
        this.setState({showGo: newState,whoBeClick:who});

    }

    showGo = () =>{
        if(this.state.showGo){
            var nickname = this.state.whoBeClick.nickname;
            return(
                <View style = {styles.footer}>
                    <View>
                        <Text style = {styles.hintName}>{nickname}</Text>
                        <Text style = {styles.hint}> will be paired with you</Text>
                    </View>
                    <View style = {{alignItems: 'center'}}>
                        <TouchableOpacity style = {{height:50,width:50}} onPress = {()=> this.clickGo()}>
                            <Image style = {{height:50,width:50} } source={require('../../images/handmade-go-signal-with-right-arrow.png')} />
                        </TouchableOpacity>
                    </View>
                </View>
            );
        }
    }

    clickGo = ()=>{

        this.setState({whoToPair:this.state.whoBeClick}, function(){
            this.makeRemoteRequest()
        });
        // this.makeRemoteRequest();

        // if(this.state.whoBeClick.length > 12){
        //
        //     this.setState({alertModalVisible:true});
        // }else{
        //     this.setState({hintModalVisible:true});
        //     this.setState({isGameOn:true});
        //     this.props.gameOn(true);
        // }
    }

    setNewData = (data) => {
        this.setState({newData:data});
    }

    makeRemoteRequest = () => {
        // const { page, seed } = this.state;
        // const url = `https://randomuser.me/api/?seed=${seed}&page=${page}&results=20`;
        const url = `http://104.236.189.217:8888/getCompetitor`;
        this.setState({ loading: true });

        return fetch(url,{
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                challengee: this.props.myUsername,
                challenger: this.state.whoToPair.username,
                date:"10-20-2017",
            }),
        })
            .then((response) => response.json())
            .then((responseJson) => {
                this.setState({data:responseJson});
                if(this.state.data[0].username === this.state.whoToPair.username){
                    this.setState({hintModalVisible:true});
                    this.setState({isGameOn:true});
                    this.props.gameOn(true);
                    this.props.setCompetitor(this.state.data[0].nickname);
                }else{
                    var d = this.state.data;
                    this.setNewData(d);
                    this.setState({clicked:false});
                    this.setState({showGo:false});
                    this.setState({alertModalVisible:true});
                }

            })
            .catch(error => {
                this.setState({ error, loading: false });
            });
    }

    clickBack() {
        this.setState({showGo: false,whoBeClick:{username:'',nickname:''}});
        // this.props.showPage = false;
        this.props.callbackParent(false);
    }

    showAlertContent() {
            return(
                <View style={[styles.popScreenSmallBackground, styles.modalBackgroundStyle]}>
                    <View style={styles.popScreenSmall}>
                        <View style = {styles.alertContent}>
                            <Text style = {styles.alertText}>{this.state.whoToPair.nickname} already has a Challenge partner for today. Please repick.</Text >
                        </View>
                        <TouchableOpacity onPress={()=> this.setState({alertModalVisible:false})}>
                            <View style = {styles.ok}>
                                <Text style = {styles.plainText}> OK </Text >
                            </View>
                        </TouchableOpacity>
                    </View>
                </View>
            );
    }

    setClicked = (isClicked)=>{
      this.setState({clicked:isClicked});
    }

    showList(){
        return(
            <View>
                <View style = {{alignItems: 'flex-start'}}>
                    <TouchableOpacity style = {{height:30,width:30}} onPress = {()=>this.clickBack()}>
                        <Image style = {styles.backIcon} source={require('../../images/back.png')} />
                    </TouchableOpacity>
                </View>
                <View style = {styles.header}>
                    <Image style = {styles.captionImage } source={require('../../images/lace-2.png')} />
                    <Text style = {styles.headerText}>   Pick a competitor</Text>
                </View>
                <View>
                    <ChallengerList callbackParent = {this.onClickPerson} updateData = {this.setNewData} data = {this.state.newData} myUsername = {this.props.myUsername} anyClicked = {this.state.clicked} setClicked = {this.setClicked}/>
                </View>
                <View style = {styles.listBottomSeparator}>
                </View>
                {this.showGo()}

            </View>
        );
    }

    showHint(){
        return(
            <View>
                <View style = {styles.hintHeader}>
                    <Image style = {styles.captionImage } source={require('../../images/lace-2.png')} />
                    <Text style = {styles.headerText}> {'   '}GAME IS ON</Text >
                </View>

                <View style = {styles.challengeTitle}>
                    <Image style = {styles.captionImage2 } source={require('../../images/Filled_Circle.png')} />
                    <Text style = {styles.challengeTitleText}>  {this.props.challengeName}</Text >
                </View>

                <View style = {styles.pointsView}>
                    <View style = {styles.points}>
                        <Text style = {styles.subtitleText}> Available points in this Challenge:</Text >
                        <View style = {{flexDirection:'row'}}>
                            <Text style = {styles.pointsContent}> Complete Challenge:</Text >
                            <Text style = {[styles.pointsContent, {color:'#8CEA4D'}]}> +400p</Text >
                        </View>
                        <View style = {{flexDirection:'row'}}>
                            <Text style = {styles.pointsContentII}> Both of you can complete it: </Text >
                            <Text style = {[styles.pointsContentII, {color:'#8CEA4D'}]}> +300p</Text >
                        </View>
                    </View>

                    <View style = {styles.points}>
                        <Text style = {styles.subtitleText}> Extra Points:</Text >
                        <View style = {{flexDirection:'row'}}>
                            <Text style = {styles.pointsContent}> First Bonus: </Text >
                            <Text style = {[styles.pointsContent, {color:'#8CEA4D'}]}> +200p</Text >
                        </View>
                    </View>
                </View>

                <View style = {styles.hintFooter}>
                    <TouchableOpacity onPress={()=> this.clickBack()}>
                        <View>
                            <View style = {{alignItems: 'center'}}>
                                <TouchableOpacity style = {{height:50,width:50}} onPress = {()=> this.clickBack()}>
                                    <Image style = {{height:50,width:50} } source={require('../../images/handmade-go-signal-with-right-arrow.png')} />
                                </TouchableOpacity>
                            </View>
                        </View>
                    </TouchableOpacity>
                </View>
            </View>

        );
    }

    showContent(){
        if(!this.state.isGameOn){
            return(
                this.showList()
            );
        }else{
            return(
                this.showHint()
            );
        }
    }

    render(){

        return(<View>
        <Modal
            animationType={'fade'}
            transparent={true}
            visible={this.props.showPage}
        >
            <View style={styles.challengerPage}>

                {this.showContent()}
                <Modal
                    animationType = {'fade'}
                    transparent = {true}
                    visible = {this.state.alertModalVisible}
                >
                    {this.showAlertContent()}
                </Modal>
            </View>


        </Modal>
        </View>
        );
    }

}



const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#44d1ff',
    },
    popScreenSmall:{
        position:'relative',
        backgroundColor: '#4A90E2',
        width: Dimensions.get('window').width - Dimensions.get('window').width / 6,
        height: Dimensions.get('window').height / 4,
        left:(Dimensions.get('window').width) / 12,
        flexDirection:'column',
        borderColor: 'white',
        borderRadius:8,
        borderWidth:4,
        shadowColor: '#979797',
        shadowOffset: { width: 1, height: 1 },
        shadowOpacity:1,
    },
    popScreenSmallBackground:{
        position:'relative',
        width: Dimensions.get('window').width,
        height: Dimensions.get('window').height,
        flexDirection:'column',
        paddingTop:Dimensions.get('window').height / 4,
        borderWidth:3
    },
    challengerPage:{
        position:'relative',
        backgroundColor: '#4A90E2',
        width: Dimensions.get('window').width,
        height: Dimensions.get('window').height,
        paddingTop:Dimensions.get('window').height / 20,
        flexDirection:'column',
    },
    modalBackgroundStyle:{
        backgroundColor:  'rgba(255, 255, 255, 0.75)',
    },
    captionImage:{
        width:25,
        height:30,
        alignItems: 'center',
    },
    captionImage2:{
        width:Dimensions.get('window').height * 0.02,
        height:Dimensions.get('window').height * 0.02,
        alignItems: 'center',
    },
    backIcon:{
        width:30,
        height:30,
        alignItems: 'center',
    },
    hint:{
        fontWeight: 'bold',
        fontSize: 16,
        color:'#3cbadc',
        textAlign:'center',
        paddingBottom:14,
    },
    hintName:{
        fontWeight: 'bold',
        fontSize: 16,
        color:'#144655',
        textAlign:'center',
    },
    header:{
        flexDirection:'row',
        justifyContent:'center',
        paddingBottom:Dimensions.get('window').height / 40,
        alignItems:'center',
        borderBottomWidth:2,
        borderColor:'#979797',
    },
    hintHeader:{
        flexDirection:'row',
        justifyContent:'center',
        paddingBottom:24,
        alignItems:'center',
    },
    challengeTitle:{
        flexDirection:'row',
        justifyContent:'center',
        alignItems:'center',
    },
    headerText:{
        fontFamily:'Avenir',
        fontWeight: 'bold',
        fontSize: 20,
        color:'white',
        textAlign:'center',

    },
    listBottomSeparator:{
        borderTopWidth:2,
        borderColor:'#979797',
    },
    footer:{
        paddingTop:Dimensions.get('window').height / 25,
        paddingBottom:20
    },
    challengeTitleText:{
        fontFamily:'Avenir',
        fontSize: Dimensions.get('window').height * 0.03,
        color:'white',
        textAlign:'center',
    },
    subtitleText:{
        fontFamily:'Avenir',
        fontSize: Dimensions.get('window').height * 0.025,
        color:'#8CEA4D',
        textAlign:'center',
    },
    points:{
        paddingTop:Dimensions.get('window').height / 20,
        flexDirection:'column',
        alignItems:'flex-start',
    },
    pointsContent:{
        fontFamily:'Avenir',
        fontSize: Dimensions.get('window').height * 0.02,
        paddingTop:Dimensions.get('window').height / 24,
        color:'white',
        textAlign:'left',
    },
    pointsContentII:{
        fontFamily:'Avenir',
        fontSize: Dimensions.get('window').height * 0.02,
        paddingTop:Dimensions.get('window').height / 30,
        color:'white',
        textAlign:'left',
    },
    plainText:{
        fontSize: 16,
        color:'white',
        textAlign:'center',
    },
   alertText:{
        fontSize: 16,
        color:'white',
        textAlign:'center',
        width:Dimensions.get('window').width / 2,
    },
    pointsView:{
        height: Dimensions.get('window').height / 3,
        paddingBottom:Dimensions.get('window').height / 8,
        paddingLeft:Dimensions.get('window').height * 0.05,
    },
    hintFooter:{
        paddingTop:Dimensions.get('window').height / 3,
    },
    ok:{
        height:Dimensions.get('window').height * 0.06,
        alignItems:'center',
        justifyContent:'center',
    },
    alertContent:{
        height:Dimensions.get('window').height * 0.18,
        borderBottomWidth:2,
        borderColor:'#979797',
        alignItems:'center',
        justifyContent:'center',
    },
    Text:{
        fontFamily:'Avenir',
    }
});


module.exports = ChooseChallenger;