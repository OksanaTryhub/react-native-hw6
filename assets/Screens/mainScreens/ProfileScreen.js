import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from 'react-redux';

import {
  StyleSheet,
  View,
  Text,
  ImageBackground,
  TouchableOpacity,
  Image,
  FlatList
} from "react-native";

import { AntDesign } from '@expo/vector-icons';
import { Feather } from '@expo/vector-icons'; 

import * as ImagePicker from 'expo-image-picker';
import { Asset } from "expo-asset";
import * as FileSystem from 'expo-file-system';

import { authSignOutUser } from "../../../redux/auth/authOperations";

import { collection, onSnapshot, doc, query, where, getDocs  } from "firebase/firestore";
import { db } from '../../../firebase/config';

import { useFonts } from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';

SplashScreen.preventAutoHideAsync();

const ProfileScreen = ({ navigation }) => {
      const [posts, setPosts] = useState([]);
  const [plusIcon, setPlusIcon] = useState('plus')
  const [image, setImage] = useState(null);
  // const [userPosts, setUserPosts] = useState([]);

  const dispatch = useDispatch();
  const {userId} = useSelector((state) => state.auth)

  useEffect(() => {
    const fetchUserPosts = async () => {
      const postsRef = collection(db, 'posts');
      const userPostsQuery = query(postsRef, where('userId', '==', userId));

      const unsubscribe = onSnapshot(userPostsQuery, (snapshot) => {
        const userPosts = snapshot.docs.map((doc) => ({
          ...doc.data(),
          id: doc.id,
        }));
        setPosts(userPosts);
      });

      return () => unsubscribe();
    };

    fetchUserPosts();
  }, [userId]);
  

  const signOut = () => {
    dispatch(authSignOutUser())
  }

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

  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      alert('Permission to access media library is required!');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.canceled) {
      const uri = result.assets[0].uri;
      setImage(uri);
      setPlusIcon('close')
    }
  };

  const deleteImage = async () => {
  if (image) {
    const asset = Asset.fromURI(image);
    const fileUri = asset.localUri || asset.uri;

    await FileSystem.deleteAsync(fileUri);
    setImage(null);
    setPlusIcon('plus')
  }
  };
  
  const plusIconChange = () => {
    if (plusIcon === 'plus') {
    console.log("pick image")
         pickImage()
       }
      deleteImage()
  }
  
  return (
      <View style={styles.container}>
      <ImageBackground source={require('../../images/bg.jpg')} style={styles.imageBg}> 
          <View style={ styles.posts } onLayout={onLayoutRootView}>
            <View style={styles.avatarWrap}>
              <View style={styles.photoWrap}>{image && <Image source={{ uri: image }} style={styles.image} />}
              </View>
              <TouchableOpacity activeOpacity={0.7}>
                {plusIcon === 'plus'
                  ? <AntDesign name="pluscircleo" style={{ ...styles.plusIcon, color: '#FF6C00' }} onPress={() => plusIconChange()} />
                  : <AntDesign name="closecircleo" style={{ ...styles.plusIcon, color: '#E8E8E8' }} onPress={() => plusIconChange()} />}
              </TouchableOpacity>
          </View>
                        <TouchableOpacity onPress={signOut} style={styles.logoutIcon}>
                            <Feather name="log-out" size={24} color='#BDBDBD' />
                        </TouchableOpacity>
          <Text style={styles.title}>Natali Romanova</Text>
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
        
        </ImageBackground>
      </View>  
      )
}


export default ProfileScreen

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  imageBg: {
    flex: 1,
    resizeMode: 'cover',
    justifyContent: 'flex-end',
    },
  avatarWrap: {
    width: 120,
    height: 120,
    backgroundColor: '#F6F6F6',
    borderWidth: 1,
    borderColor: '#E8E8E8',
    borderRadius: 16,
    position: 'absolute',
    top: -60,
    right: '50%',
    transform: [{ translateX: 40 }],
  },
  photoWrap: {
    width: '100%',
    height: '100%',
    borderRadius: 16,
    overflow: 'hidden',
  },
  plusIcon: {
    fontSize: 25,
    position: 'absolute',
    top: -40,
    right: 0,
    transform: [{ translateX: 12 }],
    borderRadius: 50,
    backgroundColor: '#ffffff'
  }, 
  logoutIcon: {
    position: 'absolute',
    right: 16,
    top: 22
  },
  posts: {
    paddingHorizontal: 16,
    paddingTop: 92,
    paddingBottom: 78,
    backgroundColor: '#ffffff',
    width: '100%',
    borderTopRightRadius: 25,
    borderTopLeftRadius: 25,
    marginTop: 200
    
}, 
  title: {
    fontFamily: 'Roboto-Bold',
    color: '#212121',
    fontSize: 30,
    lineHeight: 35.16,
    marginBottom: 32,
    textAlign: 'center',
  },  
  postWrap: {
    width: '100%',
    height: 299,
    backgroundColor: '#ffffff',
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
    alignItems: 'center',
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
    color: "#FF6C00",
    marginRight: 6,    
  },
  locationIcon:{   
     marginRight: 6
  },
  locationTitle: {
    textDecorationLine: 'underline'
  }
});
