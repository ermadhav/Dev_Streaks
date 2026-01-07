import { initializeApp } from "firebase/app";
import {
  initializeAuth,
  getReactNativePersistence,
} from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import ReactNativeAsyncStorage from "@react-native-async-storage/async-storage";

const firebaseConfig = {
  apiKey: "AIzaSyDMQdeUdvA6_cJRSR_pwTls0dcx2LgoVFw",
  authDomain: "devstreaks24.firebaseapp.com",
  projectId: "devstreaks24",
  appId: "1:561565930488:web:bf31117aed969fc99c3c0d",
};

const app = initializeApp(firebaseConfig);

export const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(ReactNativeAsyncStorage),
});

export const db = getFirestore(app); // ✅ Firestore
