import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
    apiKey: "###################################",
    authDomain: "netflix-clone-3c067.firebaseapp.com",
    projectId: "netflix-clone-3c067",
    storageBucket: "netflix-clone-3c067.appspot.com",
    messagingSenderId: "584817652905",
    appId: "1:584817652905:web:f3e1a07f39f46e8f2225b8"
};

const firebaseApp = initializeApp(firebaseConfig);
const db = getFirestore(firebaseApp);
const auth = getAuth(firebaseApp);

export { auth };
export default db;
