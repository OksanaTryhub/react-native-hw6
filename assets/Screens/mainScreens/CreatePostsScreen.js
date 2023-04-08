import React, { useState, useEffect } from 'react'
import { useSelector } from 'react-redux';
// import { useDispatch } from 'react-redux';

import {
  View,
  Text,
  Image,
  TextInput,
  TouchableWithoutFeedback,
  Keyboard,
  TouchableOpacity,
  KeyboardAvoidingView,
  ScrollView,
  StyleSheet
} from 'react-native'

import { Camera } from 'expo-camera';
import * as Location from 'expo-location';

import { FontAwesome, Feather } from '@expo/vector-icons';
import { useFonts } from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';
import { storage, db } from '../../../firebase/config';
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { collection, addDoc } from 'firebase/firestore';

SplashScreen.preventAutoHideAsync();

const initialState = {
  myPhoto: null,
  title: '',
  location: '',
  latitude: 0,
  longitude: 0

}

const CreatePostsScreen = ({ navigation }) => {
  const [state, setState] = useState(initialState)
  const [isShownKeyboard, setIsShownKeyboard] = useState(false);
  const [camera, setCamera] = useState(null)

  const {userId, nickname} = useSelector(state => state.auth)

  // const dispatch = useDispatch()
  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        console.log('Permission to access location was denied');
        return;
      }
    })()
  }, [])

  const takeLocation = async () => {
    const location = await Location.getCurrentPositionAsync();
    setState((prevState) => ({ ...prevState, latitude: location.coords.latitude, longitude:location.coords.longitude}));
  }

  const takePhoto = async () => {
    const photo = await camera.takePictureAsync();
    setState((prevState) => ({ ...prevState, myPhoto: photo.uri }));
    takeLocation()
  }

  const inputHandler = (name, value) => {
    setState((prevState) => ({ ...prevState, [name]: value }));
    };

   const showKeyboard = () => {
    setIsShownKeyboard(true);
  }
  const keyboardHide = () => {
    setIsShownKeyboard(false);
    Keyboard.dismiss()
  }

  const uploadPostToServer = async () => {
    const photo = await uploadPhotoToServer();
    await addDoc(collection(db, "posts"), {
      photo,
      title: state.title,
      location: state.location,
      coordinates: {
        latitude: state.latitude,
        longitude: state.longitude,
      },
      userId,
      nickname
});
    
  }
  const uploadPhotoToServer = async () => {
    const response = await fetch(state.myPhoto);
    const file = await response.blob();
    const uid = Date.now().toString();
    const storageRef = ref(storage, `PostImage/${uid}`);

    await uploadBytes(storageRef, file);
    const downloadPhoto = await getDownloadURL(storageRef)
    console.log('downloadPhoto==>', downloadPhoto)
    return downloadPhoto
    
  };

  const savePost = async () => {
    const { myPhoto } = state;
    
    if (!myPhoto) {
      return console.log('no photo')
    }
    navigation.navigate('DefaultPostsScreen', { state })
    setState(initialState)
    uploadPostToServer()
 
  }

  const deleteAll = () => {
    setState(initialState)
  }
  
  const [fontsLoaded] = useFonts({
     'Roboto-Regular': require('../../fonts/Roboto-Regular.ttf')
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
    <TouchableWithoutFeedback onPress={() => keyboardHide()}>
      <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === 'ios' ? 'padding' : ''} onLayout={onLayoutRootView}>
        <ScrollView>   
          <View style={styles.cameraContainer}>
            {!state.myPhoto ? 
              <Camera style={styles.camera} ref={setCamera}>
                <TouchableOpacity style={styles.iconWrap} onPress={takePhoto}>
                  <FontAwesome name="camera" size={24} color="#BDBDBD" />
                </TouchableOpacity>
              </Camera>
              :
              <View style={styles.previewPhotoContainer}>
                  <Image source={{uri: state.myPhoto}} style={styles.previewPhoto}/>
              </View>
            }
          </View> 
              {!state.myPhoto ?
                <Text style={styles.text}>Загрузите фото </Text>
                : <Text style={styles.text}> Редактировать фото </Text>}
          <View>
            <TextInput style={styles.input}
              placeholderTextColor={"#BDBDBD"}
              placeholder="Название..."
              value={state.title}
              onChangeText={(value) => inputHandler('title', value)}
              onFocus={()=>showKeyboard()}
            />
            <View style={styles.inputWrap}>
              <TouchableOpacity activeOpacity={0.7} >
                <Feather name="map-pin" size={18} color="#BDBDBD" style={styles.locationIcon} />
              </TouchableOpacity>
              <TextInput style={[styles.input, styles.inputLocation]}
                placeholderTextColor={"#BDBDBD"}
                placeholder="Местность..."
                value={state.location}
                onChangeText={(value) => inputHandler('location', value)}
                onFocus={()=>showKeyboard()}
              />
            </View>
            <TouchableOpacity activeOpacity={0.7} style={styles.button}>
              <Text style={styles.buttonTitle} onPress={() => savePost() }>Опубликовать</Text>
            </TouchableOpacity>
            <View style={styles.trashIconWrap }>
              <TouchableOpacity activeOpacity={0.6} onPress={() => deleteAll()} >
                <Feather name="trash-2" size={24} style={styles.trashIcon }/>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </TouchableWithoutFeedback>
  )
}

export default CreatePostsScreen

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop:32,
    paddingHorizontal: 16,
    backgroundColor: '#ffffff'
  },
  cameraContainer: {
    borderRadius: 10,
    overflow: 'hidden',
    width: '100%',
    height: 240,
    marginBottom: 8,
  },
  camera: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    height: '100%',
  },
  previewPhotoContainer: {
    width: '100%',
    height: 240,
    borderRadius: 8,
    overflow: 'hidden',
    marginBottom: 8,
    borderWidth: 1,
  },
  previewPhoto: {
    flex: 1,
    resizeMode: 'cover',
    width: '100%',
    height: 240,
  },
  text: {
    color: "#BDBDBD",
    fontSize: 16,
    marginBottom:32
  },
  iconWrap: {
    display: 'flex',
    justifyContent: 'center',
    alignItems:'center',
    width: 60,
    height: 60,
    backgroundColor: '#ffffff',
    opacity: 0.3,
    borderRadius: 60
  },
  input: {
    height:50,
    paddingVertical: 16,
    marginBottom: 16,
    borderBottomWidth: 1,
    borderColor: '#E8E8E8',
    fontFamily: 'Roboto-Regular',
    fontSize: 16,
  },
  inputWrap: {
    position:'relative'
  },
  inputLocation: {
    paddingLeft: 28,
  },
  locationIcon: {
    position: 'absolute',
    top: 14,
    left: 0,
  },
    button: {
    height:50,
    backgroundColor: '#F6F6F6',
    borderRadius: 100,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
    fontFamily: 'Roboto-Regular',
  },
  buttonTitle: {
    fontSize: 16,
    color: '#BDBDBD'
  },
  trashIcon: {
    width: 70,
    height: 40,
    lineHeight: 40,
    textAlign: 'center',
    color: '#BDBDBD',        
    backgroundColor: "#F6F6F6",
    borderRadius: 20, 
    alignSelf: 'center',
    marginTop:100
    }
  })