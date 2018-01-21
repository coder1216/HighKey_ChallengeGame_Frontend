import React, { Component } from 'react';
import Toast from 'react-native-root-toast';
import { View, Keyboard,KeyboardAvoidingView,Text,ToastAndroid, TextInput,Navigator, StatusBar,Image,StyleSheet, Button, Dimensions, TouchableOpacity,TouchableHighlight,Modal } from 'react-native';
 import { toastShort } from "../../utils/ToastUtils"
import { SERVER } from '../../config/server';
export default class Suggestion extends Component {
    constructor(props){
        super(props);
        this.state = {
            boxVisibile : this.props.showBox,
            inputValue : null,
            toastVisible: false,

        }



    }


    componentWillUnmount() {

    }

    componentWillMount() {

    }


    setToastVisible(visible){
        this.setState({toastVisible: visible});
    }

    sendSuggestion(){
        toastShort("thanks for your suggestion");

        console.log("user input:" + this.state.inputValue );
        let date = (new Date().getMonth()+1)+"-"+(new Date().getDate())+"-"+(new Date().getFullYear());
        const url = `${SERVER}/submitIdea`;
        //this.setState({ loading: true });
        return fetch(url,{
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                challengeName: null,
                description: this.state.inputValue,
                date: date,
                image: null,
            })
        }).catch(error => {
                throw  error
            });
    }


    render(){

        return(
            <View>

                <Modal
                    animationType = {'fade'}
                    transparent={true}
                    visible = {this.props.showBox}>
                    <View>
                        {this.inputBox()}

                    </View>

                </Modal>

            </View>
        )
    }


    inputBox() {
        return(

            <View style={[styles.popScreenSmallBackground]}>
                <KeyboardAvoidingView behavior='position' >
                <View style={styles.popScreenSmall}>
                    <View style = {styles.alertText}>
                        <Text style = {styles.pointsContent}> My challenge idea for USC</Text >
                        <TextInput style = {styles.inputs}
                               placeholder= " please input"
                               //onEndEditing = {this.hide.bind(this,this.state.value)}
                               //value = {this.state.value}
                               onChangeText = {(text) => {this.setState({inputValue : text})}}
                                   autoFocus = "true"
                        />
                </View>
                    <TouchableOpacity onPress={()=> {this.props.callbackParent();this.sendSuggestion();  } }>
                        <View style = {styles.pressArea}>
                            <Text style = {styles.pointsContent}> OK </Text >
                        </View>
                    </TouchableOpacity>
                </View>
                </KeyboardAvoidingView>
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
    welcome: {
        fontSize: 20,
        textAlign: 'center',
        margin: 10,
    },
    instructions: {
        textAlign: 'center',
        color: '#333333',
        marginBottom: 5,
    },
    inputs:{
        width: Dimensions.get('window').width - Dimensions.get('window').width / 3,
        left:(Dimensions.get('window').width)/30,
        marginTop:10,
        height: 40,
        backgroundColor:"white",
        borderRadius:5,
        paddingLeft:10,
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
    myBtnText:{
        color:'white'
    },
    popScreenSmall:{
        position:'relative',
        backgroundColor: '#4A90E2',
        width: Dimensions.get('window').width - Dimensions.get('window').width / 4,
        height: Dimensions.get('window').height/3,
        left:(Dimensions.get('window').width)/8.5,
        flexDirection:'column',
        borderColor: 'white',
        borderWidth:3,
        borderRadius:5,
        justifyContent: "center",

    },
    popScreenSmallBackground:{
        position:'relative',
        height: Dimensions.get('window').height,
        paddingTop:Dimensions.get('window').height / 4,
        borderWidth:3,
        backgroundColor:  'rgba(0, 0, 0, 0.75)',
    },
    challengerPage:{
        position:'relative',
        backgroundColor: '#4A90E2',
        width: Dimensions.get('window').width,
        height: Dimensions.get('window').height,
        paddingTop:Dimensions.get('window').height / 20,
        flexDirection:'column',
    },
    inputView :{
      justifyContent: "center",
    },
    captionImage:{
        width:25,
        height:30,
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
        paddingBottom:24,
        alignItems:'center',
        borderBottomWidth:2,
        borderColor:'skyblue',
    },
    hintHeader:{
        flexDirection:'row',
        justifyContent:'center',
        paddingBottom:24,
        alignItems:'center',
    },
    headerText:{

        fontWeight: 'bold',
        fontSize: 20,
        color:'white',
        textAlign:'center',

    },
    listBottomSeparator:{
        borderTopWidth:2,
        borderColor:'skyblue',
    },
    footer:{
        paddingTop:Dimensions.get('window').height / 25,
        paddingBottom:20
    },

    challengeTitle:{
        fontSize: 20,
        color:'white',
        textAlign:'center',
    },
    subtitleText:{
        fontSize: 20,
        color:'#8CEA4D',
        textAlign:'center',
    },

    pointsContent:{
        fontSize: 16,
        color:'white',
        textAlign:'center',
        paddingTop:5

    },
    pointsView:{
        height: Dimensions.get('window').height / 4,
        paddingBottom:Dimensions.get('window').height / 8,
    },
    hintFooter:{
        paddingTop:Dimensions.get('window').height / 3,
    },
    pressArea:{
        height: Dimensions.get('window').height / 3 * (1/6),
        justifyContent:'center',
    },
    textToast : {
        zIndex:2,
    },

    alertText:{
        height: Dimensions.get('window').height / 3 * (4/5),
        borderBottomWidth:2,
        borderColor:'white',
    },
});


