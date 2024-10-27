import React, { createContext, useReducer, useContext, useEffect } from "react";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import "firebase/firestore";

import { app } from "../firebase";

export const UserContext = createContext(undefined);

const SET_USER = "SET_USER";

const initialState = {
  isLoggedIn: false,
  authUser: null,
  loadingUser: true,
  uid: null,
};

const userReducer = (state, action) => {
  switch (action.type) {
    case SET_USER:
      return {
        ...state,
        isLoggedIn: !!action.payload.user,
        authUser: action.payload.user || null,
        loadingUser: false,
        uid: action.payload.user ? action.payload.user.uid : null,
      };
    default:
      return state;
  }
};

export const UserProvider = ({ children }) => {
  const auth = getAuth(app);
  const [userState, dispatch] = useReducer(userReducer, initialState);

  const handleAuthStateChange = (user) => {
    dispatch({ type: SET_USER, payload: { user } });
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, handleAuthStateChange);
    return () => {
      unsubscribe();
    };
  }, [auth]);

  return (
    <UserContext.Provider
      value={{
        isLoggedIn: userState.isLoggedIn,
        authUser: userState.authUser,
        loadingUser: userState.loadingUser,
        uid: userState.uid,
      }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUserContext = () => useContext(UserContext);
