import { initializeApp } from "firebase/app";
import { getAuth, signInAnonymously } from "firebase/auth";

export const firebaseConfig = {
  apiKey: "AIzaSyB9wB2fMvbxEJ34OD2_56pbdv1gtje16h0",
  authDomain: "videobase-49d63.firebaseapp.com",
  projectId: "videobase-49d63",
  storageBucket: "videobase-49d63.appspot.com",
  messagingSenderId: "153125374697",
  appId: "1:153125374697:web:caecd45a90a6aabdcbbe78",
  measurementId: "G-DBVSYEYVDF",
};

const app = initializeApp(firebaseConfig);
export default app;

const auth = getAuth(app);
signInAnonymously(auth)
  .then(() => {})
  .catch((error) => {
    console.error(error);
  });
