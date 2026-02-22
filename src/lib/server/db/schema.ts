import { pgTable, serial, text, timestamp, pgEnum, integer, numeric } from 'drizzle-orm/pg-core';

// Enums

export const userRoleEnum = pgEnum('user_role', ['admin', 'technician']);

export const customerSourceEnum = pgEnum('customer_source', [
	'referral',
	'google',
	'facebook',
	'door_knock',
	'website',
	'phone'
]);

export const jobStatusEnum = pgEnum('job_status', [
	'estimate',
	'scheduled',
	'in_progress',
	'completed',
	'cancelled'
]);

export const deviceStatusEnum = pgEnum('device_status', ['active', 'needs_service', 'removed']);

export const attachableTypeEnum = pgEnum('attachable_type', [
	'job',
	'property',
	'customer',
	'device'
]);

export const subscriptionFrequencyEnum = pgEnum('subscription_frequency', [
	'weekly',
	'biweekly',
	'monthly',
	'quarterly',
	'annually'
]);

export const subscriptionStatusEnum = pgEnum('subscription_status', [
	'active',
	'paused',
	'cancelled'
]);

export const invoiceStatusEnum = pgEnum('invoice_status', [
	'draft',
	'sent',
	'paid',
	'overdue',
	'void'
]);

export const paymentMethodEnum = pgEnum('payment_method', ['cash', 'check', 'card']);

export const communicationTypeEnum = pgEnum('communication_type', ['email', 'text', 'phone']);

// Tables

export const organizations = pgTable('organizations', {
	id: serial('id').primaryKey(),
	name: text('name').notNull(),
	createdAt: timestamp('created_at').notNull().defaultNow()
});

export const users = pgTable('users', {
	id: serial('id').primaryKey(),
	organizationId: integer('organization_id')
		.notNull()
		.references(() => organizations.id),
	firstName: text('first_name').notNull(),
	lastName: text('last_name').notNull(),
	phone: text('phone'),
	email: text('email'),
	role: userRoleEnum('role').notNull().default('technician'),
	createdAt: timestamp('created_at').notNull().defaultNow()
});

export const customers = pgTable('customers', {
	id: serial('id').primaryKey(),
	organizationId: integer('organization_id')
		.notNull()
		.references(() => organizations.id),
	firstName: text('first_name').notNull(),
	lastName: text('last_name').notNull(),
	phone: text('phone'),
	email: text('email'),
	source: customerSourceEnum('source'),
	notes: text('notes'),
	createdAt: timestamp('created_at').notNull().defaultNow()
});

export const properties = pgTable('properties', {
	id: serial('id').primaryKey(),
	organizationId: integer('organization_id')
		.notNull()
		.references(() => organizations.id),
	customerId: integer('customer_id')
		.notNull()
		.references(() => customers.id),
	address: text('address'),
	city: text('city'),
	state: text('state'),
	zip: text('zip'),
	notes: text('notes'),
	createdAt: timestamp('created_at').notNull().defaultNow()
});

export const services = pgTable('services', {
	id: serial('id').primaryKey(),
	organizationId: integer('organization_id')
		.notNull()
		.references(() => organizations.id),
	name: text('name').notNull(),
	description: text('description'),
	defaultPrice: integer('default_price'),
	createdAt: timestamp('created_at').notNull().defaultNow()
});

export const subscriptions = pgTable('subscriptions', {
	id: serial('id').primaryKey(),
	organizationId: integer('organization_id')
		.notNull()
		.references(() => organizations.id),
	propertyId: integer('property_id')
		.notNull()
		.references(() => properties.id),
	serviceId: integer('service_id')
		.notNull()
		.references(() => services.id),
	frequency: subscriptionFrequencyEnum('frequency').notNull(),
	startDate: timestamp('start_date').notNull(),
	nextServiceDate: timestamp('next_service_date'),
	preferredTechnicianId: integer('preferred_technician_id').references(() => users.id),
	status: subscriptionStatusEnum('status').notNull().default('active'),
	notes: text('notes'),
	createdAt: timestamp('created_at').notNull().defaultNow()
});

export const products = pgTable('products', {
	id: serial('id').primaryKey(),
	organizationId: integer('organization_id')
		.notNull()
		.references(() => organizations.id),
	name: text('name').notNull(),
	description: text('description'),
	unit: text('unit'),
	createdAt: timestamp('created_at').notNull().defaultNow()
});

export const jobs = pgTable('jobs', {
	id: serial('id').primaryKey(),
	organizationId: integer('organization_id')
		.notNull()
		.references(() => organizations.id),
	propertyId: integer('property_id')
		.notNull()
		.references(() => properties.id),
	serviceId: integer('service_id')
		.notNull()
		.references(() => services.id),
	subscriptionId: integer('subscription_id').references(() => subscriptions.id),
	technicianId: integer('technician_id')
		.notNull()
		.references(() => users.id),
	status: jobStatusEnum('status').notNull().default('scheduled'),
	scheduledDate: timestamp('scheduled_date').notNull(),
	completedDate: timestamp('completed_date'),
	notes: text('notes'),
	createdAt: timestamp('created_at').notNull().defaultNow()
});

export const jobProducts = pgTable('job_products', {
	id: serial('id').primaryKey(),
	jobId: integer('job_id')
		.notNull()
		.references(() => jobs.id),
	productId: integer('product_id')
		.notNull()
		.references(() => products.id),
	quantity: numeric('quantity'),
	notes: text('notes')
});

export const invoices = pgTable('invoices', {
	id: serial('id').primaryKey(),
	organizationId: integer('organization_id')
		.notNull()
		.references(() => organizations.id),
	customerId: integer('customer_id')
		.notNull()
		.references(() => customers.id),
	jobId: integer('job_id').references(() => jobs.id),
	amount: integer('amount').notNull(),
	status: invoiceStatusEnum('status').notNull().default('draft'),
	dueDate: timestamp('due_date'),
	sentAt: timestamp('sent_at'),
	createdAt: timestamp('created_at').notNull().defaultNow()
});

export const payments = pgTable('payments', {
	id: serial('id').primaryKey(),
	organizationId: integer('organization_id')
		.notNull()
		.references(() => organizations.id),
	invoiceId: integer('invoice_id')
		.notNull()
		.references(() => invoices.id),
	amount: integer('amount').notNull(),
	method: paymentMethodEnum('method'),
	paidAt: timestamp('paid_at').notNull().defaultNow(),
	createdAt: timestamp('created_at').notNull().defaultNow()
});

export const communications = pgTable('communications', {
	id: serial('id').primaryKey(),
	organizationId: integer('organization_id')
		.notNull()
		.references(() => organizations.id),
	customerId: integer('customer_id')
		.notNull()
		.references(() => customers.id),
	type: communicationTypeEnum('type').notNull(),
	subject: text('subject'),
	body: text('body'),
	sentAt: timestamp('sent_at').notNull().defaultNow(),
	createdAt: timestamp('created_at').notNull().defaultNow()
});

export const devices = pgTable('devices', {
	id: serial('id').primaryKey(),
	organizationId: integer('organization_id')
		.notNull()
		.references(() => organizations.id),
	propertyId: integer('property_id')
		.notNull()
		.references(() => properties.id),
	serviceId: integer('service_id').references(() => services.id),
	name: text('name').notNull(),
	location: text('location'),
	status: deviceStatusEnum('status').notNull().default('active'),
	installedAt: timestamp('installed_at'),
	lastServicedAt: timestamp('last_serviced_at'),
	notes: text('notes'),
	createdAt: timestamp('created_at').notNull().defaultNow()
});

export const attachments = pgTable('attachments', {
	id: serial('id').primaryKey(),
	organizationId: integer('organization_id')
		.notNull()
		.references(() => organizations.id),
	attachableType: attachableTypeEnum('attachable_type').notNull(),
	attachableId: integer('attachable_id').notNull(),
	storagePath: text('storage_path').notNull(),
	fileName: text('file_name').notNull(),
	contentType: text('content_type'),
	createdAt: timestamp('created_at').notNull().defaultNow()
});

export const pay = pgTable('pay', {
	id: serial('id').primaryKey(),
	organizationId: integer('organization_id')
		.notNull()
		.references(() => organizations.id),
	userId: integer('user_id')
		.notNull()
		.references(() => users.id),
	jobId: integer('job_id').references(() => jobs.id),
	amount: integer('amount').notNull(),
	notes: text('notes'),
	paidAt: timestamp('paid_at'),
	createdAt: timestamp('created_at').notNull().defaultNow()
});
