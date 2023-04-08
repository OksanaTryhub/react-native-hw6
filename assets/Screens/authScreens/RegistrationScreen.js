import React, { useState } from "react";
import { useDispatch } from "react-redux";

import {
  StyleSheet,
  View,
  Text,
  TextInput,
  ImageBackground,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  Image
} from "react-native";

import { AntDesign } from '@expo/vector-icons';

import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import * as ImagePicker from 'expo-image-picker';
import { Asset } from "expo-asset";
import * as FileSystem from 'expo-file-system';

import { useFonts } from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';

import { authSignUpUser } from "../../../redux/auth/authOperations";

SplashScreen.preventAutoHideAsync();

const initialState = {
  login: '',
  email: '',
  password: '',
  avatar: null
}

const RegistrationScreen = ({ navigation }) => {
  const [state, setState] = useState(initialState)
  const [isShownKeyboard, setIsShownKeyboard] = useState(false);
  const [icon, setIcon] = useState('eye-off');
  const [plusIcon, setPlusIcon] = useState('plus')
  const [image, setImage] = useState(null);

  const dispatch = useDispatch();

  const inputHandler = (name, value) => {
    setState((prevState) => ({ ...prevState, [name]: value }));
  };

  const iconChange = () => {
    setIcon(prevIcon => prevIcon === 'eye-off' ? 'eye' : 'eye-off')
    setIsShownKeyboard(true)
  }

  const showKeyboard = () => {
    setIsShownKeyboard(true);
  }

  const keyboardHide = () => {
    setIsShownKeyboard(false);
    Keyboard.dismiss()
  }

  const handleSubmit = () => {
    setIsShownKeyboard(false);
    Keyboard.dismiss();
    setState(initialState);
    console.log('state=>', state)
    dispatch(authSignUpUser(state))
  }

  const [fontsLoaded] = useFonts({
    'Roboto-Regular': require('../../fonts/Roboto-Regular.ttf'),
    'Roboto-Bold': require('../../fonts/Roboto-Bold.ttf'),
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
      setState((prevState) => ({ ...prevState, avatar: uri }))
    }
  };

  const deleteImage = async () => {
  if (image) {
    const asset = Asset.fromURI(image);
    const fileUri = asset.localUri || asset.uri;

    await FileSystem.deleteAsync(fileUri);
    setImage(
      
    );
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
    <TouchableWithoutFeedback onPress={() => keyboardHide()}>
      <View style={styles.container}>
        <ImageBackground source={require('../../images/bg.jpg')} style={styles.image}>
          <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : ''}>
            <View style={{ ...styles.form, paddingBottom: isShownKeyboard ? 0 : 78 }} onLayout={onLayoutRootView}>
              <View style={styles.avatarWrap}>
                <View style={styles.photoWrap}>{image && <Image source={{ uri: image }} style={styles.image} />}</View>
                <TouchableOpacity activeOpacity={0.7}>
                  {plusIcon === 'plus'
                    ? <AntDesign name="pluscircleo" style={{ ...styles.plusIcon, color: '#FF6C00' }} onPress={() => plusIconChange()} />
                    : <AntDesign name="closecircleo" style={{ ...styles.plusIcon, color: '#E8E8E8' }} onPress={() => plusIconChange()} />}
                </TouchableOpacity>
                
              </View>
              <Text style={styles.title}>Регистрация</Text>
              <TextInput style={styles.input}
                  placeholder="Логин"
                  value={state.login}
                  onChangeText={(value) => inputHandler('login', value)}
                  onFocus={()=>showKeyboard()}
              />
              <TextInput style={styles.input}
                placeholder="Адрес электронной почты"
                value={state.email}
                onChangeText={(value) => inputHandler('email', value)}
                onFocus={()=>showKeyboard()}
              />
              <View style={styles.inputWrap}>
                <TextInput style={[styles.input, styles.password]}
                placeholder="Пароль"
                value={state.password}
                secureTextEntry={icon === 'eye-off' ? true: false}
                onChangeText={(value) => inputHandler('password', value)}
                onFocus={()=>showKeyboard()}
              />
                <TouchableOpacity activeOpacity={0.7} >
                  <Icon name={icon} style={styles.icon} onPress={() => iconChange() } /> 
                </TouchableOpacity>
              </View>
            <TouchableOpacity activeOpacity={0.7} style={styles.button}>
              <Text style={styles.buttonTitle} onPress={() => handleSubmit() }>Зарегистрироваться</Text>
            </TouchableOpacity>
            <View style={styles.acc}>
              <Text style={styles.text}>Уже есть аккаунт?</Text>
              <TouchableOpacity activeOpacity={0.6} onPress={() => navigation.navigate("Login")}>
                <Text style={styles.text}> Войти</Text>
              </TouchableOpacity>
            </View>
            </View>
          </KeyboardAvoidingView>
        </ImageBackground>
      </View>  
    </TouchableWithoutFeedback>
      )
}


export default RegistrationScreen

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  image: {
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
  icon: {
    fontSize: 20,
    color: '#1B4371',
    position: 'absolute',
    top: -35,
    right: 20
  },
  inputWrap: {
    flexDirection: 'row',
    alignItems: 'baseline'
  },
  form: {
    paddingHorizontal: 16,
    paddingTop: 92,
    paddingBottom: 78,
    backgroundColor: '#ffffff',
    width: '100%',
    borderTopRightRadius: 25,
    borderTopLeftRadius: 25,
    
},
  input: {
    height:50,
    padding: 16,
    marginBottom: 16,
    backgroundColor: '#F6F6F6',
    borderWidth: 1,
    borderColor: '#E8E8E8',
    borderRadius: 8,
    fontFamily: 'Roboto-Regular',
    fontSize: 16,
  },
  password: {
    flex: 1,
    marginBottom: 43,
  },
  title: {
    fontFamily: 'Roboto-Bold',
    color: '#212121',
    fontSize: 30,
    lineHeight: 35.16,
    marginBottom: 33,
    textAlign: 'center',
    
  },
  button: {
    height:50,
    backgroundColor: '#FF6C00',
    borderRadius: 100,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
    fontFamily: 'Roboto-Regular',
  },
  buttonTitle: {
    fontSize: 16,
    color: '#ffffff'
  },
  text: {
    fontSize: 16,
    color: '#1B4371',
    alignSelf: 'center',
  },
  acc: {
    flexDirection: 'row',
    justifyContent:'center'
  }
});
