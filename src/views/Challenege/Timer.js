import React, { Component } from 'react';
import { View, Text, Navigator, StatusBar,Image,StyleSheet, Button, Dimensions, TouchableOpacity,TouchableHighlight,Modal } from 'react-native';

var timer1 = null;
var timer2 = null;
var timer3 = null;


export default class Timber extends Component {
    constructor(props){
        super(props);
        this.state = {
            originH:this.props.hour,
            originM:this.props.minute,
            originS:this.props.second,
            hour: this.props.hour - new Date().getHours(),
            minute: this.props.minute - new Date().getMinutes(),
            second: this.props.second - new Date().getSeconds(),

        }
    }

    getHours() {

        let h = (this.state.originH - new Date().getHours());
        if( h < 0 ) { console.log(h +"negative");this.cancelTimer();}
        this.setState({hour: h});
    }

    getMin() {
        let min = (this.state.originM - new Date().getMinutes());
        this.setState({minute: min});

    }

    getSec() {
        let sec = (this.state.originS - new Date().getSeconds());
        this.setState({second: sec});
    }

    componentDidMount() {
        timer1 = setInterval(() => this.getSec(), 1000);
        timer2 = setInterval(() => this.getMin(), 1000);
        timer3 = setInterval(() => this.getHours(), 1000);
    }

    componentWillUnmount(){
       this.cancelTimer();
    }

    cancelTimer(){
        clearInterval(timer1);
        clearInterval(timer2);
        clearInterval(timer3);
    }

    render(){
        console.log(this.state.visibile + "xl");
        return(
            <View>
                <Text >{this.showTime()}</Text>

            </View>
        )
    }


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
        width: Dimensions.get('window').width - Dimensions.get('window').width / 6,
        height: Dimensions.get('window').height / 4,
        left:(Dimensions.get('window').width)/12,
        flexDirection:'column',
        borderColor: 'white',
        borderWidth:3
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
        backgroundColor:  'rgba(0, 0, 0, 0.75)',
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
    points:{
        paddingTop:Dimensions.get('window').height / 20,
        flexDirection:'column',
        alignItems:'center',
    },
    pointsContent:{
        fontSize: 16,
        color:'white',
        textAlign:'center',
    },
    pointsView:{
        height: Dimensions.get('window').height / 4,
        paddingBottom:Dimensions.get('window').height / 8,
    },
    hintFooter:{
        paddingTop:Dimensions.get('window').height / 3,
    },
    ok:{
        paddingTop:5,
    },
    alert:{
        paddingTop:Dimensions.get('window').height / 20,
        paddingBottom:Dimensions.get('window').height / 13,
        borderBottomWidth:2,
        borderColor:'white',
    },
});


