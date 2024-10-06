import { createContext, useContext, useEffect, useState } from 'react';
 // Make sure to adjust the path based on your project structure
import {onAuthStateChanged,fetchSignInMethodsForEmail, updatePassword,sendPasswordResetEmail, reauthenticateWithCredential, EmailAuthProvider,updateProfile,setPersistence,GoogleAuthProvider ,browserSessionPersistence,signInWithEmailAndPassword,createUserWithEmailAndPassword,signInWithPopup,getAuth} from "firebase/auth";
import {auth} from './firebase';
import { SignOutUser, userStateListener } from "./firebase";
import axios from "axios";
const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState({});
  const [method,setMethod] = useState({})
  const [loading,setLoading] = useState(true)
  const [logoutTimer, setLogoutTimer] = useState(null);
  useEffect(()=>{
    console.log('method',method)
  },[method])
  useEffect(() => {
    setLoading(true);
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user)
      // alert("Updated")
      setLoading(false)
    });
    return unsubscribe;
  }, [setCurrentUser])
  const validEmailPassword = (email,password) =>{
    let err = {}
    if(email.includes('@') != true){
      err.email = 'Invalid email';
    }
    if(password <7){
      err.password = 'Password is too short'
    }
    return err;
  }
  const signup = async(email,password) =>{
    const authInstance = getAuth();
    let err = validEmailPassword(email,password);
    if(Object.keys(err).length!=0){
      return err;
    }
    try{
      await setPersistence(authInstance,browserSessionPersistence);
      const result = await createUserWithEmailAndPassword(authInstance, email, password);
      
    // If the signup is successful, you can access the user information from the result
    console.log(result.user.uid)  
    const response = await axios.post('http://localhost:3001/add-user', {
      'UserID': result.user.uid,
      'Username': result.user.email,
      'Type': 'email'
    });
      setMethod('password')
      return {error : null};
    // Additional steps, such as setting the user's display name or sending a verification email, can be added here.
    } catch (error) {
    // Handle errors that might occur during signup
    console.log("mess",error.message)
    if(error.message === 'Firebase: Error (auth/email-already-in-use).'){
      error.account = 'Email is already axist';
      return error;
    }
    return error;
    }
  }
  const googleSignUp = async () =>{
    const provider = new GoogleAuthProvider();
    const authInstance = getAuth();
    try {
      await setPersistence(authInstance,browserSessionPersistence);
      const result = await signInWithPopup(authInstance, provider);
      console.log(result.user.uid)
      const response = await axios.post('http://localhost:3001/add-user', {
        'UserID': result.user.id,
        'Username': result.user.displayName,
        'Type':'google'
      });
      
      if(response.statusText != 'Ok')
      {
        setMethod('google')
        return {'error':null}
      }else{
        console.error('Sign up with google failed',response.statusText);
        return {'error':'Sign up failed' +response.status + response.statusText}
      }
    }  catch (error) {
      console.error('Google sign up failed:', error.message);
    }
  }
  const googleSignIn = async () => {
    const provider = new GoogleAuthProvider();
    const authInstance = getAuth();
    try {
      await setPersistence(authInstance,browserSessionPersistence);
      const result = await signInWithPopup(authInstance, provider);
      setMethod('google')
    }  catch (error) {
      console.error('Google login failed:', error.message);
    }
  };
  const login = async (email, password) => {
    const authInstance = getAuth();
    let err = validEmailPassword(email, password);
    if(Object.keys(err).length){
      return err;
    }
    try {
      await setPersistence(authInstance,browserSessionPersistence);
      const result = await signInWithEmailAndPassword(authInstance, email, password);
      const response = await axios.get(`http://localhost:3001/get-user/${result.user.uid}`);
      if(response.status==200)
      {
        setMethod('password')
        return null;
      }else console.log(response.data)
    } catch (error) {
      console.error('Email login failed:', error.message);
      if(error.message=== 'Firebase: Error (auth/invalid-login-credentials).' ||error.message=== 'Firebase: Error (auth/wrong-password).' )
       return {account: 'Inccorect password'};
      return {account: 'Account not found'}
    }
  };
  
  const logout = async () => {
    try {
      SignOutUser();
      setCurrentUser({});
      setMethod(null);
      localStorage.removeItem('currentUser');
    } catch (error) {
      console.error('Logout failed:', error.message);
      
    }
  };
  const resetPassword = async (email) =>{
    const authInstance = getAuth();
    try{
      try{
        const signInMethods = await fetchSignInMethodsForEmail(authInstance, email);
        if (signInMethods.length === 0) {
          console.log('Email does not exist');
          return false;
        } else {
          const ans = await sendPasswordResetEmail(authInstance, email);
          console.log('Email exists');
          setMethod('password')
          return true;
        }
      }catch(error){
        console.log(error)
        return false;
      }
     
    }catch(err){
      console.log(err)
      return false;
    }
  }
  const changePassword = async (oldPassword, newPassword) =>{
    const authInstance = getAuth();
    const  credentials = EmailAuthProvider.credential(currentUser.email, oldPassword);
    try {
      const res = await reauthenticateWithCredential(authInstance.currentUser, credentials);
      setMethod('password')
      const result = await updatePassword(authInstance.currentUser,newPassword)
      return {ok:true}
    
    } catch (error) {
      console.error('Reauthentication failed:', error.message);
      return { error: 'Reauthentication failed. Please check your old password.' };
    }
  };
  const value = {
    currentUser,
    googleSignIn,
    logout,
    login,
    signup,
    googleSignUp,
    changePassword,
    resetPassword,
    method
  };

  return <AuthContext.Provider value={value}>{!loading && children}</AuthContext.Provider>;
}

export default function useAuth() {
  return useContext(AuthContext);
}
