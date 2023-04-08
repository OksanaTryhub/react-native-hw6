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
  Platform
} from "react-native";

import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

import { useFonts } from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';
import { authSignInUser } from "../../../redux/auth/authOperations";

SplashScreen.preventAutoHideAsync();

const initialState = {
  email: '',
  password: ''
}
const LoginScreen = ({ navigation }) => {
  const [state, setState] = useState(initialState);
  const [isShownKeyboard, setIsShownKeyboard] = useState(false);
  const [icon, setIcon] = useState('eye-off');

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
    console.log(state)
    dispatch(authSignInUser(state))
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

  return (
    <TouchableWithoutFeedback onPress={() => keyboardHide()}>
      <View style={styles.container}>
        <ImageBackground source={require('../../images/bg.jpg')} style={styles.image}>
          <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : ''}>
            <View style={{ ...styles.form, paddingBottom: isShownKeyboard ? 0 : 144 }} onLayout={onLayoutRootView}>
              <Text style={styles.title}>Войти</Text>
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
              <Text style={styles.buttonTitle} onPress={() => handleSubmit() }>Войти</Text>
            </TouchableOpacity>
            <View style={styles.acc}>
              <Text style={styles.text}>Нет аккаунта?</Text>
              <TouchableOpacity activeOpacity={0.6} onPress={() => navigation.navigate("Registration")}>
                <Text style={styles.text}> Зарегистрироваться</Text>
              </TouchableOpacity>
            </View>
            </View>
          </KeyboardAvoidingView>
        </ImageBackground>
      </View>  
    </TouchableWithoutFeedback>
      )
}


export default LoginScreen

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
    paddingTop: 32,
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
    marginBottom: 32,
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
