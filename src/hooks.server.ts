import { eq } from 'drizzle-orm';
import type { Handle } from '@sveltejs/kit';
import { verifySessionCookie } from '$lib/server/firebase';
import { db } from '$lib/server/db';
import { users } from '$lib/server/db/schema';

export const handle: Handle = async ({ event, resolve }) => {
	const sessionCookie = event.cookies.get('session');
	if (!sessionCookie) return resolve(event);

	const decodedToken = await verifySessionCookie(sessionCookie);
	if (!decodedToken) {
		event.cookies.delete('session', { path: '/' });
		return resolve(event);
	}

	const row = await db.query.users.findFirst({
		where: eq(users.firebaseUid, decodedToken.uid)
	});

	if (!row) {
		// Authenticated with Firebase but no user row — not linked to an org
		event.locals.user = undefined;
		return resolve(event);
	}

	event.locals.user = {
		id: row.id,
		organizationId: row.organizationId,
		firebaseUid: decodedToken.uid,
		firstName: row.firstName,
		lastName: row.lastName,
		email: row.email ?? '',
		role: row.role,
		picture: decodedToken.picture ?? ''
	};

	return resolve(event);
};
