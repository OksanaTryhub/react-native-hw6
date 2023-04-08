import {
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    updateProfile,
    onAuthStateChanged,
    signOut
} from 'firebase/auth';

import { auth } from './../../firebase/config';
import { authSlice } from './authReducer';

const {updateUserProfile, authStateChange, authSignOut} = authSlice.actions;

export const authSignUpUser = ({login, email, password}) => async (dispatch, getState) => {
    try {
        await createUserWithEmailAndPassword(auth, email, password);
        
        await updateProfile(auth.currentUser,
            {
            displayName: login,
        })

        const {uid, displayName} = auth.currentUser;
       
        const userUpdateProfile = {
            userId: uid,
            nickname: displayName
        }
        dispatch(updateUserProfile( userUpdateProfile))

    } catch (error) {
        console.log('error=>', error);
        console.log('error.message=>', error.message)
    }
};

export const authSignInUser = ({email, password}) => async (dispatch, getState) => {
    try {
        const user = await signInWithEmailAndPassword(auth, email, password);
    } catch (error) {
        console.log('error=>', error);
        console.log('error.message=>', error.message)
    }
};

export const authSignOutUser = () => async (dispatch, getState) => {
    await signOut(auth);
    dispatch(authSignOut())
};

export const authStateChangeUser = () => async (dispatch, getState) => {
    await onAuthStateChanged(auth, user => {
        if (user) {

            const userUpdateProfile = {
                userId: user.uid,
                nickname: user.displayName,
            }
            dispatch(updateUserProfile(userUpdateProfile));
            dispatch(authStateChange({stateChange: true}))
            
        }
    
});

};