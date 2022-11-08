import firebase from 'firebase/compat/app';
import { getFirestore, enableIndexedDbPersistence } from "firebase/firestore";
import 'firebase/compat/auth';

const firebaseConfig = {
    apiKey: "AIzaSyBMrMgUWOlxVfW4cUNSSJvLRdfT2smwq7U",
    authDomain: "siscot-fe.firebaseapp.com",
    projectId: "siscot-fe",
    storageBucket: "siscot-fe.appspot.com",
    messagingSenderId: "595143961784",
    appId: "1:595143961784:web:569f376833e7dc0b3c184d"
};

const firebaseApp = firebase.initializeApp(firebaseConfig);
const auth = firebaseApp.auth();

const db = getFirestore(firebaseApp);
enableIndexedDbPersistence(db);

export {
    auth,
    firebaseApp
}