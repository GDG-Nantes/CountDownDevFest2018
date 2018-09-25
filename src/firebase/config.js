import firebase from 'firebase/app'
import 'firebase/firestore'
import config from './firebase-config.js'


 firebase.initializeApp(config);
export default firebase;