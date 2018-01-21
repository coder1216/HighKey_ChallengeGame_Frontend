import React, { Component } from 'react';
import { View, Text, Image, Alert,Button, AsyncStorage,StyleSheet, Text as TextReact, Share, Modal, Keyboard, Easing, FlatList, ScrollView, Dimensions, InteractionManager, TouchableOpacity, TouchableWithoutFeedback, TouchableHighlight} from 'react-native';
// import {List, ListItem } from 'react-native-elements';

let ITEM_HEIGHT = Dimensions.get('window').height / 15;

export default class ChallengerList extends Component{
    constructor(props) {
        super(props);
        this.state = {
            ItemColor: '#0883b1',
            index: 0,
            data:this.props.data,
            error:null,
            loading:false,
            json:'',
            person:{username:'',nickname:''},
        };
    }

    componentDidMount() {
        this.makeRemoteRequest();
    }

    _onPress(item, index)  {
        // this.setState({ItemColor:'#3a99bb'});
        // alert("you choose " + item.key);
        var newState = true;
        this.props.setClicked(true);
        this.setState({index:index});
        this.setState({person:{username:item.username,
                                nickname:item.nickname}
                    },function(){
                        this.props.callbackParent(newState,this.state.person)
                    });
        // this.props.callbackParent(newState,this.state.person);
        // alert('press ' + this.state.index);
    }

    renderItemComponent = ({item, index}) => {


            return (
                <TouchableHighlight

                    onPress={() => this._onPress(item, index)}>
                    <View
                        style={[styles.item, (this.state.index === index) && this.props.anyClicked && {backgroundColor: '#8CEA4D'}]}>
                        <Text style={styles.itemText}>{'      '} {item.nickname}</Text>
                        {/*{this.showHideCheck(index)}*/}
                    </View>

                </TouchableHighlight>
            );

    };



    makeRemoteRequest = () => {
        // const { page, seed } = this.state;
        // const url = `https://randomuser.me/api/?seed=${seed}&page=${page}&results=20`;
        const url = `http://104.236.189.217:8888/competitorCandidates`;
        this.setState({ loading: true });

        return fetch(url,{
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                challengee: this.props.myUsername,
                date:"10-20-2017",
            }),
        })
            .then((response) => response.json())
            .then((responseJson) => {
                this.setState({data:responseJson});
                this.props.updateData(this.state.data);
            })
            .catch(error => {
                this.setState({ error, loading: false });
            });
    };

    _keyExtractor = (item, index) => item.username;

    render(){

        return(
            <FlatList
                style = { styles.list }
                data = { this.props.data }
                renderItem = { this.renderItemComponent }
                ListHeaderComponent = {this._header}
                ItemSeparatorComponent = { ItemDivideComponent }
                keyExtractor = { this._keyExtractor }
                getItemLayout = {(data,index)=>(
                     {length: ITEM_HEIGHT, offset: (ITEM_HEIGHT + 1) * index, index}
                )}

            />
        );
    }
};

//create list separator
class ItemDivideComponent extends Component {
    render() {

        return (
            <View style={{height: 1, backgroundColor: '#979797'}}
            />
        );
    }
};

const styles = StyleSheet.create({
    list:{
        height: (ITEM_HEIGHT + 1) * 8 + 20,
    },
    item:{
        flexDirection:'row',
        backgroundColor: '#4A90E2',
        height:ITEM_HEIGHT,
        // justifyContent:"space-around",
        alignItems:'center',
        paddingLeft:5,
    },
    itemAlt:{
        flexDirection:'row',
        backgroundColor: '#8CEA4D',
        height:ITEM_HEIGHT,
        // justifyContent:"space-around",
        alignItems:'center',
        paddingLeft:5,
    },
    itemText:{
        fontFamily:'Avenir',
        fontSize: 16,
        fontWeight: 'bold',
        color:'white',
        textAlign:'left',
        width:Dimensions.get('window').width * 2 / 3,
    },
    portraitImage:{
        width:40,
        height:40,
        borderRadius:20,
        paddingRight:12,
    },
    checkMark:{
        width:25,
        height:25,

    },
    Text:{
        fontFamily:'Avenir',
    },

});

module.exports = ChallengerList;