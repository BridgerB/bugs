import { json } from '@sveltejs/kit';
import { dev } from '$app/environment';
import type { RequestHandler } from './$types';
import { createSessionCookie, verifyIdToken } from '$lib/server/firebase';

const SESSION_DURATION_MS = 1000 * 60 * 60 * 24 * 14;

export const POST: RequestHandler = async ({ request, cookies }) => {
	const { idToken } = await request.json();
	if (!idToken) return json({ error: 'No token provided' }, { status: 400 });

	const decodedToken = await verifyIdToken(idToken);
	if (!decodedToken) return json({ error: 'Invalid token' }, { status: 401 });

	const sessionCookie = await createSessionCookie(idToken, SESSION_DURATION_MS);
	cookies.set('session', sessionCookie, {
		path: '/',
		httpOnly: true,
		secure: !dev,
		sameSite: 'lax',
		maxAge: Math.floor(SESSION_DURATION_MS / 1000)
	});

	return json({
		user: {
			uid: decodedToken.uid,
			email: decodedToken.email,
			name: decodedToken.name,
			picture: decodedToken.picture
		}
	});
};
