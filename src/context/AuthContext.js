import { createContext, useContext, useEffect, useState } from 'react';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
} from 'firebase/auth';
import { auth } from '../firebase';

const UserContext = createContext();

export const AuthContextProvider = ({ children }) => {
  const [user, setUser] = useState({});



  // CREATING NEW USERS
  const createUser = (email, password) => {
    return createUserWithEmailAndPassword(auth, email, password);
  };

  // LOG OUT USER
  const logout = () => {
    return signOut(auth)
}

  // SIGN IN USER
  const signIn = (email, password) =>  {
    return signInWithEmailAndPassword(auth, email, password)
   }



  useEffect(()=>{
    const unsubscribe = onAuthStateChanged(auth, (currentUser) =>{
      console.log(currentUser)
      setUser(currentUser)
    })
    return()=>{
      unsubscribe()
    }
  })



  return (
    <UserContext.Provider value={{ createUser, user, logout, signIn }}>
      {children}
    </UserContext.Provider>
  );
};

export const UserAuth = () => {
  return useContext(UserContext);
};
