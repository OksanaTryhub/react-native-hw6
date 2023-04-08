import React from 'react'
import { StyleSheet, TouchableOpacity } from 'react-native'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import PostsScreen from './PostsScreen';
import CreatePostsScreen from '../mainScreens/CreatePostsScreen';
import ProfileScreen from '../mainScreens/ProfileScreen';

import { Feather } from '@expo/vector-icons'; 
import { AntDesign } from '@expo/vector-icons'; 

const HomeTab = createBottomTabNavigator();

const HomeScreen = ({ navigation }) => {
  return (
    <HomeTab.Navigator screenOptions={{tabBarShowLabel:false}}>
      <HomeTab.Screen name="Posts"
                component={PostsScreen}
                options={{ headerShown: false,
                tabBarIcon: ({ focused, size, color }) => (<Feather name="grid" size={size} style={focused ? styles.focused : '#212121'} />)
        }} />
      <HomeTab.Screen name="CreatePost"
                component={CreatePostsScreen}
                options={{
                    headerTitle: 'Создать публикацию',
                    headerTitleAlign: 'center',
                    headerTintColor: '#212121',
                    headerLeft: () => (
                        <TouchableOpacity onPress={() => navigation.navigate("DefaultPostsScreen")} style={{ marginLeft: 16 }}>
                            <Feather name="arrow-left" size={24} color='#212121' />
                        </TouchableOpacity>
                  ),
                    tabBarStyle: ({ display: 'none' }),
                    tabBarIcon: ({ focused, size, color }) => (<AntDesign name="plus" size={18} style={focused ? styles.focused : '#212121'} />)
            }} />
      <HomeTab.Screen name="Profile"
                component={ProfileScreen}
                options={{
                    headerShown: false,
                    tabBarIcon: ({ focused, size, color }) => (<Feather name="user" size={size} style={focused ? styles.focused : '#212121'} />)
        }} />
    </HomeTab.Navigator>
  );
}

export default HomeScreen

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
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