import firebase from 'firebase/app'
import 'firebase/database'
import 'firebase/storage'
import 'firebase/auth'

const firebaseConfig = {
    apiKey: 'AIzaSyAKLI_axi7erWcoAcMMd3gzilMeIJbW2ew',
    authDomain: 'escola-dominical-vida-nova.firebaseapp.com',
    projectId: 'escola-dominical-vida-nova',
    storageBucket: 'escola-dominical-vida-nova.appspot.com',
    messagingSenderId: '13984471929',
    appId: '1:13984471929:web:da06ebc9543049db1c2da8'
}

firebase.initializeApp(firebaseConfig)

export default firebase
