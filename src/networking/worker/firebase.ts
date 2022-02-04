import { initializeApp } from 'firebase/app'
import { getFirestore } from 'firebase/firestore'

const firebaseConfig = {
    apiKey: "AIzaSyCuZpzrSujOQCQ8cxkNtdw6Lmr5Vzbcux8",
    authDomain: "webrtc-test-af4df.firebaseapp.com",
    projectId: "webrtc-test-af4df",
    storageBucket: "webrtc-test-af4df.appspot.com",
    messagingSenderId: "520284588613",
    appId: "1:520284588613:web:8a739063aa2d749297b12c"
};

const createFirebase = () => {
    const app = initializeApp(firebaseConfig)
    const db = getFirestore(app)
    
    return {
        app,
        db
    }
}

export const firebase = createFirebase()