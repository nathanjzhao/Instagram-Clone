import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/firestore';
import 'firebase/compat/storage';

const firebaseApp = firebase.initializeApp({
    apiKey: "AIzaSyAcyLhvWO39VdVqAlRAsvlcCe1gnza84Ow",
    authDomain: "groupee-2ad52.firebaseapp.com",
    projectId: "groupee-2ad52",
    storageBucket: "groupee-2ad52.appspot.com",
    messagingSenderId: "693675781484",
    appId: "1:693675781484:web:190060e600dcb53fe45749",
    measurementId: "G-8453ZR3FZX"
});

const db = firebaseApp.firestore(); // get access to database
const auth = firebase.auth(); // get authentication
const storage = firebase.storage(); // upload stuff

export { db, auth, storage };