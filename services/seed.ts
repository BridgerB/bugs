process.loadEnvFile();
import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import { seed, reset } from 'drizzle-seed';
import * as schema from '../src/lib/server/db/schema.ts';

const client = postgres(process.env.DATABASE_URL!);
const db = drizzle(client, { schema });

async function main() {
	console.log('Resetting database...');
	await reset(db, schema);

	console.log('Seeding database...');
	await seed(db, schema).refine((f) => ({
		organizations: {
			count: 1,
			columns: {
				name: f.valuesFromArray({ values: ['Ace Pest Control'] })
			}
		},
		users: {
			count: 5,
			columns: {
				firstName: f.firstName(),
				lastName: f.lastName(),
				phone: f.phoneNumber({ template: '(###) ###-####' }),
				email: f.email()
			}
		},
		customers: {
			count: 30,
			columns: {
				firstName: f.firstName(),
				lastName: f.lastName(),
				phone: f.phoneNumber({ template: '(###) ###-####' }),
				email: f.email(),
				notes: f.loremIpsum()
			},
			with: {
				properties: 2
			}
		},
		properties: {
			columns: {
				address: f.streetAddress(),
				city: f.city(),
				state: f.state(),
				zip: f.postcode(),
				notes: f.valuesFromArray({
					values: [
						null,
						null,
						null,
						'Dog in backyard, use side gate',
						'Gate code: 1234',
						'Rental property — call tenant before arriving',
						'Key under mat',
						'Ring doorbell, do not knock',
						'Park on street, not driveway'
					]
				})
			},
			with: {
				subscriptions: 1,
				devices: 1
			}
		},
		services: {
			count: 6,
			columns: {
				name: f.valuesFromArray({
					values: ['General Pest', 'Termite', 'Rodent', 'Mosquito', 'Bed Bug', 'Wildlife Removal']
				}),
				description: f.valuesFromArray({
					values: [
						'Interior and exterior spray for common pests',
						'Termite inspection and treatment',
						'Rodent trapping and exclusion',
						'Yard mosquito treatment',
						'Bed bug heat treatment and chemical application',
						'Humane wildlife trapping and removal'
					]
				}),
				defaultPrice: f.int({ minValue: 5000, maxValue: 30000 })
			}
		},
		products: {
			count: 6,
			columns: {
				name: f.valuesFromArray({
					values: [
						'Termidor SC',
						'Demand CS',
						'Contrac Blox',
						'Advion Cockroach Gel',
						'Suspend SC',
						'Talstar P'
					]
				}),
				description: f.valuesFromArray({
					values: [
						'Fipronil-based termiticide',
						'Lambda-cyhalothrin general insecticide',
						'Bromadiolone rodent bait',
						'Indoxacarb cockroach gel bait',
						'Deltamethrin insecticide',
						'Bifenthrin broad-spectrum insecticide'
					]
				}),
				unit: f.valuesFromArray({ values: ['oz', 'gal', 'blocks', 'tubes'] })
			}
		},
		subscriptions: {
			columns: {
				startDate: f.date({ minDate: '2025-01-01', maxDate: '2025-12-31' }),
				nextServiceDate: f.date({ minDate: '2026-02-01', maxDate: '2026-06-30' })
			},
			with: {
				jobs: 2
			}
		},
		jobs: {
			columns: {
				scheduledDate: f.date({ minDate: '2025-06-01', maxDate: '2026-03-31' }),
				completedDate: f.date({ minDate: '2025-06-01', maxDate: '2026-02-28' }),
				notes: f.valuesFromArray({
					values: [
						null,
						null,
						'Treated interior baseboards and exterior perimeter',
						'Heavy ant activity near kitchen',
						'Customer reported roaches in bathroom',
						'Sprayed foundation and eaves',
						'Set 4 bait stations along fence line',
						'Rebaited all stations, no activity',
						'Inspected attic — no signs of rodent entry',
						'Applied granular treatment to yard',
						'Customer heard scratching in attic'
					]
				})
			},
			with: {
				jobProducts: 2
			}
		},
		jobProducts: {
			columns: {
				quantity: f.number({ minValue: 1, maxValue: 10, precision: 10 }),
				notes: f.valuesFromArray({
					values: [
						null,
						null,
						null,
						'Interior + exterior spray',
						'Garage perimeter trench',
						'Full yard application',
						'Bait station refill'
					]
				})
			}
		},
		devices: {
			columns: {
				name: f.valuesFromArray({
					values: ['Bait Station', 'Termite Monitor', 'Rodent Trap', 'Glue Board', 'Insect Monitor']
				}),
				location: f.valuesFromArray({
					values: [
						'Back fence, southeast corner',
						'Garage exterior, west wall',
						'Front yard near foundation',
						'Side of house, north wall',
						'Under deck',
						'Near AC unit',
						'Back patio',
						'Along driveway edge'
					]
				}),
				installedAt: f.date({ minDate: '2025-01-01', maxDate: '2025-12-31' }),
				lastServicedAt: f.date({ minDate: '2025-06-01', maxDate: '2026-02-28' })
			}
		},
		invoices: {
			count: 40,
			columns: {
				amount: f.int({ minValue: 5000, maxValue: 30000 }),
				dueDate: f.date({ minDate: '2026-01-01', maxDate: '2026-06-30' }),
				sentAt: f.date({ minDate: '2025-12-01', maxDate: '2026-02-28' })
			},
			with: {
				payments: 1
			}
		},
		payments: {
			columns: {
				amount: f.int({ minValue: 5000, maxValue: 30000 }),
				paidAt: f.date({ minDate: '2026-01-01', maxDate: '2026-02-28' })
			}
		},
		communications: {
			count: 50,
			columns: {
				subject: f.valuesFromArray({
					values: [
						'Appointment reminder',
						'Invoice attached',
						'Service follow-up',
						'Estimate ready',
						'Subscription renewal',
						'Schedule change',
						'Payment received',
						'Annual inspection due'
					]
				}),
				body: f.loremIpsum(),
				sentAt: f.date({ minDate: '2025-06-01', maxDate: '2026-02-28' })
			}
		},
		pay: {
			count: 30,
			columns: {
				amount: f.int({ minValue: 2500, maxValue: 8000 }),
				paidAt: f.date({ minDate: '2025-06-01', maxDate: '2026-02-28' })
			}
		}
	}));

	console.log('Seed complete.');
	await client.end();
}

main().catch((e) => {
	console.error(e);
	process.exit(1);
});
