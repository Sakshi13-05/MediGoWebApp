// Import the functions you need from the SDKs you need
import { initializeApp ,getAuth,getFirestore} from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDEX8dv6ax0D-iN6dtyw2xrIrE1JgXugwE",
  authDomain: "medigo-ed4a0.firebaseapp.com",
  projectId: "medigo-ed4a0",
  storageBucket: "medigo-ed4a0.firebasestorage.app",
  messagingSenderId: "763733590580",
  appId: "1:763733590580:web:02fab654309b9ef0e2c061"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

const auth = getAuth(app);
const db = getFirestore(app);

export { app, auth, db };