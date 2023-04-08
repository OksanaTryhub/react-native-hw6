import React from 'react'
import { useDispatch } from 'react-redux';

import { TouchableOpacity } from 'react-native-gesture-handler';

import { createStackNavigator } from '@react-navigation/stack'; 

import DefaultPostsScreen from './../nestedScreens/DefaultPostsScreen';
import CommentsScreen from './../nestedScreens/CommentsScreen';
import MapScreen from './../nestedScreens/MapScreen';

import { authSignOutUser } from '../../../redux/auth/authOperations';

import { Feather } from '@expo/vector-icons'; 

const NestedScreen = createStackNavigator()

const PostsScreen = () => {
  const dispatch = useDispatch();

  const signOut = () => {
    dispatch(authSignOutUser())
  }
  
  return <NestedScreen.Navigator>
    <NestedScreen.Screen name='DefaultPostsScreen'
      component={DefaultPostsScreen}
      options={{
        headerTitle: 'Публикации',
        headerTitleAlign: 'center',
        headerTintColor: '#212121',
        headerRight: () => (
            <TouchableOpacity onPress={signOut} style={{ marginRight: 16 }}>
                <Feather name="log-out" size={24} color='#BDBDBD' />
            </TouchableOpacity>
        )
      }} />
    <NestedScreen.Screen name='Comments'
      component={CommentsScreen}
      options={{
        headerTitle: 'Комментарии',
        headerTitleAlign: 'center',
        headerTintColor: '#212121', }}/>
    <NestedScreen.Screen name='Map'
      component={MapScreen}
      options={{
        headerTitle: 'Карта',
        headerTitleAlign: 'center',
        headerTintColor: '#212121', }}/>
  </NestedScreen.Navigator>
}

export default PostsScreen