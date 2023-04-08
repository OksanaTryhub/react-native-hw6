import React from 'react'
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Keyboard,
  Image,
  FlatList,
  StyleSheet,
} from 'react-native'
import { useState, useEffect } from 'react'; 
import { useSelector } from 'react-redux';
import { Ionicons } from '@expo/vector-icons';

import { collection, onSnapshot, doc, addDoc } from "firebase/firestore";
import { db } from '../../../firebase/config';

const CommentsScreen = ({ route }) => {
  const { postId, photo } = route.params;
  const [comment, setComment] = useState('');
  const [allComments, setAllComments] = useState([]);
  const [isShownKeyboard, setIsShownKeyboard] = useState(false);
  const {nickname} = useSelector(state => state.auth) 

  useEffect(() => {
    getAllComments()
  }, [])
  
  const uploadCommentsToServer = async () => {
        const postRef = await doc(db, 'posts', postId);
        await addDoc(collection(postRef, 'comments'), {
        comment,
        nickname
      });
   
  };

  const getAllComments = async () => {
    const postRef = await doc(db, 'posts', postId);
    
    onSnapshot(collection(postRef, 'comments'), data =>
      setAllComments(
        data.docs.map(doc => ({...doc.data(),}))
      )
    ) 
  }

  const inputHandler = (value) => {
    setComment(value);
  };
  
  const showKeyboard = () => {
    setIsShownKeyboard(true);
  }

  const keyboardHide = () => {
    setIsShownKeyboard(false);
    Keyboard.dismiss()
  }

  const createComment = () => {
    if (!comment.trim()) {
      console.log('comment empty')
      return;
    }
    uploadCommentsToServer();
    keyboardHide();
    setComment('')

  }

  const renderItem = ({ item, index }) => (
    <View style={[styles.item, index % 2 === 0 ? styles.leftItem : styles.rightItem]}>
      <TouchableWithoutFeedback >
      {index % 2 === 0? (
        <>
            <Image style={styles.avatarImageLeft} />
            <View style={styles.commentWrapLeft}>
              <Text>{item.nickname}</Text>
              <Text>{item.comment}</Text>
            </View>
          
          </>
        ) : ( 
        <>
          <View style={styles.commentWrapRight}>
            <Text>{item.nickname}</Text>
            <Text>{item.comment}</Text>
          </View>
          <Image style={styles.avatarImageRight } />
          </>
        )}
        </TouchableWithoutFeedback>
      </View>
  );
  
  return (
    <TouchableWithoutFeedback onPress={() => keyboardHide()}>
      <View style={styles.container}>
        <Image source={{ uri: photo }} style={styles.imagePost} />
        <FlatList
          data={allComments}
          keyExtractor={(item, index) => index.toString()}
          renderItem={renderItem}
          style={styles.commentsWrap}
        />
        <View style={styles.inputWrap}>
          <TextInput style={styles.input}
                  placeholderTextColor={"#BDBDBD"}
                  placeholder="Комментировать..."
                  value={comment}
                  onChangeText={(value) => inputHandler(value)}
                  onFocus={()=>showKeyboard()}
          /> 
          <TouchableOpacity activeOpacity={0.7} onPress={() => {createComment() }} >
            <Ionicons name="arrow-up-circle" style={styles.icon}/> 
          </TouchableOpacity>
        </View> 
      </View>
    </TouchableWithoutFeedback>
  )
}

export default CommentsScreen

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop:32,
    paddingHorizontal: 16,
    backgroundColor: '#ffffff'
  },
  item: {
    display: 'flex',
    flexDirection: "row",
    width: '100%',
    marginBottom: 24,
  }, 
  leftItem: {
    justifyContent: 'flex-start',
  },
  rightItem: { 
    justifyContent: 'flex-end',
  }, 
    avatarImageLeft: {
        width: 28,
        height: 28,
        borderWidth: 1,
        borderColor: 'red',
        borderRadius: 14,
        marginRight:8
  },
  avatarImageRight: {
      width: 28,
        height: 28,
        borderWidth: 1,
        borderColor: 'red',
        borderRadius: 14,
        marginLeft:8
    },
  commentWrapLeft: {
    flex: 1,
    padding:16,
    borderRadius: 6,
    borderTopLeftRadius: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.03)'
  },
  commentWrapRight: {
    flex: 1,
    padding:16,
    borderRadius: 6,
    borderTopRightRadius: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.03)',
    },
   imagePost: {
    width: '100%',
    height: 240,
    borderRadius: 8,
    marginBottom: 32,
  },
  inputWrap: { 
    width: '100%',
    alignSelf: 'center',
    paddingBottom: 16,
    paddingTop:16, 
    backgroundColor: '#ffffff'
  },
  input: { 
    width:'100%',
    height:50,
    padding: 16,
    backgroundColor: '#F6F6F6',
    borderRadius: 100,
    fontFamily: 'Roboto-Regular',
    fontSize: 16,
  },
  icon: {
    position: 'absolute',
    bottom: 6,
    right:7,
    fontSize: 36,
    color:"#FF6C00" 
  },
  buttonTitle: {
    fontSize: 16,
    color: '#BDBDBD'
  },
  })