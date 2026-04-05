import React, { useState } from "react";
import ChatScreen from "./screens/ChatScreen";
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";




export default function App() {

return <ChatScreen />;


}

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCW_mTIKn2becc3GDS4F1hpBJhp8JmZkDw",
  authDomain: "paytech-tracking.firebaseapp.com",
  projectId: "paytech-tracking",
  storageBucket: "paytech-tracking.firebasestorage.app",
  messagingSenderId: "1089601430309",
  appId: "1:1089601430309:web:f3dfb5ff4856ea3fe0f0cc",
  measurementId: "G-DET9KRYLM4"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
