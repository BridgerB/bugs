import { type App, cert, getApps, initializeApp } from 'firebase-admin/app';
import { type Auth, getAuth } from 'firebase-admin/auth';
import { env } from '$env/dynamic/private';

let app: App;
let auth: Auth;

type AdminSecrets = {
	firebase: Record<string, string>;
};

let _secrets: AdminSecrets;

export const getAdminSecrets = (): AdminSecrets => {
	if (!_secrets) {
		if (!env.ADMIN) throw new Error('ADMIN env var is required');
		_secrets = JSON.parse(env.ADMIN);
	}
	return _secrets;
};

const initAdminApp = (): App => {
	const secrets = getAdminSecrets();
	return initializeApp({ credential: cert(secrets.firebase) });
};

const getFirebaseAdminApp = (): App => {
	if (!app) {
		app = getApps().length ? getApps()[0] : initAdminApp();
	}
	return app;
};

export const getFirebaseAdminAuth = (): Auth => {
	if (!auth) {
		auth = getAuth(getFirebaseAdminApp());
	}
	return auth;
};

const tryCatch = async <T>(fn: () => Promise<T>, label = 'tryCatch'): Promise<T | null> => {
	try {
		return await fn();
	} catch (error) {
		console.error(`[${label}] Error:`, error);
		return null;
	}
};

export const verifyIdToken = (idToken: string) =>
	tryCatch(() => getFirebaseAdminAuth().verifyIdToken(idToken), 'verifyIdToken');

export const createSessionCookie = (idToken: string, expiresInMs: number) =>
	getFirebaseAdminAuth().createSessionCookie(idToken, { expiresIn: expiresInMs });

export const verifySessionCookie = (sessionCookie: string) =>
	tryCatch(
		() => getFirebaseAdminAuth().verifySessionCookie(sessionCookie, true),
		'verifySessionCookie'
	);
