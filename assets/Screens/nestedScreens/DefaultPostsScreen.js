import React, { useState, useEffect } from 'react'
import { useSelector } from 'react-redux';
import { View, Text, Image, FlatList, StyleSheet } from 'react-native'

import { Feather } from '@expo/vector-icons';

import { useFonts } from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';
import { TouchableOpacity } from 'react-native-gesture-handler';

import { collection, onSnapshot } from "firebase/firestore";
import { db } from '../../../firebase/config';

SplashScreen.preventAutoHideAsync();

const DefaultPostsScreen = ({ navigation }) => {
    const [posts, setPosts] = useState([]);
    const [commentNumber, setCommentNumber] = useState(null)
    const {nickname,email} = useSelector(state => state.auth)

    const getPosts = async () => {
        await onSnapshot(collection(db, 'posts'), snapshots => {
            setPosts(snapshots.docs.map(doc => ({ ...doc.data(), id: doc.id })));
        });
    };

    useEffect(() => {
        getPosts()
    }, [ ])

    const [fontsLoaded] = useFonts({
        'Roboto-Regular': require('../../fonts/Roboto-Regular.ttf'),
        'Roboto-Bold': require('../../fonts/Roboto-Bold.ttf'),
        'Roboto-Medium': require('../../fonts/Roboto-Medium.ttf')
    });
    const onLayoutRootView = async () => {
        if (fontsLoaded) {
        await SplashScreen.hideAsync();
    }
    };

    if (!fontsLoaded) {
        return null;
    }

    return (
        <View style={styles.container} onLayout={onLayoutRootView}>
            <View style={styles.userInfo}>
                <Image style={styles.avatarImage } />
                <View style={styles.info}>
                <Text style={styles.name}> {nickname} </Text>
                <Text style={styles.email}> {email} </Text>
                </View>
            </View>
            <FlatList
                data={posts}
                keyExtractor={(item, index) => index.toString()}
                renderItem={({ item }) => (
                <View style={styles.postWrap}> 
                        <Image source={{ uri: item.photo }} style={styles.imagePost} />
                        <Text style={styles.titlePost}> {item.title}</Text>
                        <View style={styles.marksWrap}>
                            <TouchableOpacity style= {styles.comments} onPress={() => navigation.navigate("Comments", {postId: item.id, photo: item.photo})}>
                                <Feather name="message-circle" size={24} color="#BDBDBD" style={styles.messageIcon} />
                                <Text style={styles.commentsNumber}>8</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style= {styles.location} onPress={() => navigation.navigate("Map", {location: item})}>
                                <Feather name="map-pin" size={24} color="#BDBDBD" style={styles.locationIcon} />
                                <Text style={styles.locationTitle }>{item.location}</Text>
                            </TouchableOpacity>
                        </View>
                </View>
                )
                }
            />
        </View>
    )
}

export default DefaultPostsScreen

const styles = StyleSheet.create({
    container: {
        flex: 1,
        display: 'flex',
        paddingTop: 32,
        paddingHorizontal: 16,
        backgroundColor: '#ffffff'
    },
    userInfo: {
        flexDirection: 'row',
        alignItems: 'center', 
        marginBottom:32
    },
    avatarImage: {
        width: 60,
        height: 60,
        borderWidth: 1,
        borderColor: 'red',
        borderRadius: 16,
        marginRight:8
    },
    name: {
        fontFamily: 'Roboto-Bold',
        fontSize: 13
    },
    email: {
        fontFamily: 'Roboto-Regular',
        fontSize: 11
    },
    postWrap: {
        width: '100%',
        height: 299,
        backgroundColor: '#ffffff',
        marginBottom:32
    },
    imagePost: {
        width: '100%',
        height: 240,
        borderRadius: 8,
        marginBottom:8,
    },
    marksWrap: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%'
    },
    comments: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        marginRight: 24
    },
    location: {
        marginLeft: 'auto',
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
    },
    titlePost: {
        fontFamily: 'Roboto-Medium',
        fontSize: 16,
        color: '#212121',
        marginBottom:8
    },
    messageIcon: {
        marginRight: 6,
        transform: [{ rotate: '-90deg' }],
    },
    locationIcon:{   
        marginRight: 6
    },
    commentsNumber: {
        fontFamily: 'Roboto-Regular',
        fontSize: 16,
        color:'#BDBDBD'
    },
    locationTitle: {
        fontFamily: 'Roboto-Regular',
        fontSize: 16,
        textDecorationLine: 'underline'
    }
})

