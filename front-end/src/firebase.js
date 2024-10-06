import { initializeApp } from "firebase/app";
import { getAuth ,signOut} from "firebase/auth";

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCcdvPkkVuKpsl80kDnAG_EPrGr2hvLUs8",
  authDomain: "oop-chatbot.firebaseapp.com",
  databaseURL: "https://oop-chatbot-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "oop-chatbot",
  storageBucket: "oop-chatbot.appspot.com",
  messagingSenderId: "812710836562",
  appId: "1:812710836562:web:6aa380cde67308c2b2e28b",
  measurementId: "G-4RCCMX6LLW"
};

// Initialize Firebase
const firebaseApp = initializeApp(firebaseConfig);
const auth = getAuth(firebaseApp);

export { auth };
export const SignOutUser = async () => await signOut(auth);