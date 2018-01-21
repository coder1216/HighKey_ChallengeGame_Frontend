import React from 'react';
import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(255, 204, 1, 1)'
    },
    overlay: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(255, 204, 1, 0.8)'
    },
    header: {
        alignItems: 'flex-start',
        justifyContent: 'flex-start'
    },
    headerContainer: {
        backgroundColor: 'white',
        justifyContent: 'center',
        alignItems: 'center'
    },
    card: {
        justifyContent: 'center',
        alignItems: 'center'
    },
    backgroundImage: {
        flex: 1,
        alignSelf: 'stretch',
        width: null,
        justifyContent: 'center',
        backgroundColor: 'rgba(28, 96, 202, 0.2)'
    },
    content: {
        alignItems: 'center',
    },
    input: {
        backgroundColor: 'transparent',
    },
    topContainer: {
        height: 400,
        backgroundColor: 'rgba(255, 204, 1, 1)'
    },
    inputTop: {
        fontSize: 16,
        marginLeft: 10,
        marginRight: 10,
        height: 40,
        padding: 10,
        marginTop: 7,
        backgroundColor: 'rgba(255,255,255,1)',
        borderBottomColor: '#999',
        borderBottomWidth: 1
    },
    termsContainer: {
        marginTop: 40
    },
    inputBottom: {
        fontSize: 16,
        marginLeft: 10,
        marginRight: 10,
        height: 40,
        padding: 10,
        marginBottom: 10,
        backgroundColor: 'rgba(255,255,255,1)',
    },
    forget: {
        color: '#fff',
        textDecorationLine: "underline",
        textDecorationStyle: "solid",
        textDecorationColor: "#fff",
        alignSelf: 'stretch',
        textAlign: 'center'
    },
    inputContainer: {
        justifyContent:'center',
        alignItems: 'center',
        marginTop: 50
    },
    logo: {
        marginTop: -100,
        transform: [{ scale: 0.75 }],
    },
    slideContainer: {
        height: 100,
    },
    slide: {
        padding: 15,
        height: 100,
    },
    slide1: {
        backgroundColor: '#FEA900',
    },
    slide2: {
        backgroundColor: '#B3DC4A',
    },
    slide3: {
        backgroundColor: '#6AC0FF',
    },
    text: {
        color: '#fff',
        fontSize: 16,
    },
});

export default styles;