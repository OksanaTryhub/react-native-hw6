import React from "react";
import { StyleSheet } from "react-native";
import { createStackNavigator } from "@react-navigation/stack";

import LoginScreen from "./assets/Screens/authScreens/LoginScreen";
import RegistrationScreen from "./assets/Screens/authScreens/RegistrationScreen";
import HomeScreen from './assets/Screens/mainScreens/HomeScreen';
import MapScreen from './assets/Screens/nestedScreens/MapScreen';
import CommentsScreen from './assets/Screens/nestedScreens/CommentsScreen';


const MainStack = createStackNavigator()

const useRoute = (isLoggedIn) => {
 
    if (!isLoggedIn) {
        return (
            <MainStack.Navigator initialRouteName="Login"> 
                <MainStack.Screen name="Login" component={LoginScreen} options={{ headerShown: false }} />
                <MainStack.Screen name="Registration" component={RegistrationScreen} options={{ headerShown: false }} /> 
            </MainStack.Navigator>
        )
    }

    return (
        <MainStack.Navigator >  
            <MainStack.Screen name="Home" component={HomeScreen} options={{ headerShown: false }} />
            <MainStack.Screen name="Map" component={MapScreen} options={{ headerShown: false }} />
            <MainStack.Screen name="Comments" component={CommentsScreen} options={{ headerShown: false }} />
        </MainStack.Navigator>
    )
}

export default useRoute

const styles = StyleSheet.create({
    focused: {
        width: 70,
        height: 40,
        lineHeight: 40,
        textAlign: 'center',
        color: '#ffffff',        
        backgroundColor: "#FF6C00",
        borderRadius: 20
    }
})