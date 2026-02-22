declare global {
	namespace App {
		interface Locals {
			user?: {
				id: number;
				organizationId: number;
				firebaseUid: string;
				firstName: string;
				lastName: string;
				email: string;
				role: string;
				picture: string;
			};
		}
	}
}

export {};
