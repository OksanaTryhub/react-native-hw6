import React, { useState, useEffect, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import { NavigationContainer } from "@react-navigation/native";

import useRoute from "../../router";

import { authStateChangeUser } from "../../redux/auth/authOperations";

export default function Main() {
    const [user, setUser] = useState(null);
    
    const {stateChange} = useSelector((state) => state.auth);
    const dispatch = useDispatch();
    
    useEffect(() => {
        dispatch(authStateChangeUser())
    },[user])

    const routing = useRoute(stateChange);

    return (
        <NavigationContainer>
            {routing}
        </NavigationContainer>
    );
}