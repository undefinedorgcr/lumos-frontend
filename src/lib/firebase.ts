import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';

const firebaseConfig = {
	apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
	authDomain: 'lumos-9a450.firebaseapp.com',
	projectId: 'lumos-9a450',
	storageBucket: 'lumos-9a450.firebasestorage.app',
	messagingSenderId: '96591293591',
	appId: '1:96591293591:web:1f862b10232aa8e8d08dd2',
	measurementId: 'G-YXNXQCWRWC',
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

export { auth, provider };
