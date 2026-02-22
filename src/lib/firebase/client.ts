import { type FirebaseApp, getApps, initializeApp } from 'firebase/app';
import { type Auth, getAuth, GoogleAuthProvider, signInWithPopup, signOut } from 'firebase/auth';
import firebaseConfig from '$lib/assets/firebase-config.json';

let app: FirebaseApp;
let auth: Auth;

const getFirebaseApp = (): FirebaseApp => {
	if (!app) {
		app = getApps().length ? getApps()[0] : initializeApp(firebaseConfig);
	}
	return app;
};

const getFirebaseAuth = (): Auth => {
	if (!auth) {
		auth = getAuth(getFirebaseApp());
	}
	return auth;
};

export const signInWithGoogle = async (): Promise<string> => {
	const result = await signInWithPopup(getFirebaseAuth(), new GoogleAuthProvider());
	return result.user.getIdToken();
};

export const signOutUser = (): Promise<void> => signOut(getFirebaseAuth());
