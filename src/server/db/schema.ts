import { relations, sql } from 'drizzle-orm';
import { index, integer, sqliteTable, text } from 'drizzle-orm/sqlite-core';

export type Pair = { title: string; text: string };
export type Reference = { label: string; url: string };

const timestamps = {
  createdAt: text('created_at').notNull().default(sql`(datetime('now'))`),
  updatedAt: text('updated_at').notNull().default(sql`(datetime('now'))`),
};

/** Contenus éditoriaux (textes des pages, coordonnées…) : une ligne JSON par section. */
export const settings = sqliteTable('settings', {
  key: text('key').primaryKey(),
  value: text('value', { mode: 'json' }).notNull(),
  updatedAt: text('updated_at').notNull().default(sql`(datetime('now'))`),
});

export const services = sqliteTable('services', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  slug: text('slug').notNull().unique(),
  icon: text('icon').notNull().default('dev'),
  title: text('title').notNull(),
  shortTitle: text('short_title').notNull(),
  summary: text('summary').notNull(),
  tags: text('tags', { mode: 'json' }).$type<string[]>().notNull().default([]),
  needs: text('needs', { mode: 'json' }).$type<string[]>().notNull().default([]),
  offers: text('offers', { mode: 'json' }).$type<string[]>().notNull().default([]),
  benefits: text('benefits', { mode: 'json' }).$type<Pair[]>().notNull().default([]),
  steps: text('steps', { mode: 'json' }).$type<string[]>().notNull().default([]),
  position: integer('position').notNull().default(0),
  published: integer('published', { mode: 'boolean' }).notNull().default(true),
  ...timestamps,
});

export const projects = sqliteTable(
  'projects',
  {
    id: integer('id').primaryKey({ autoIncrement: true }),
    slug: text('slug').notNull().unique(),
    title: text('title').notNull(),
    client: text('client').notNull().default(''),
    sector: text('sector').notNull().default(''),
    location: text('location').notNull().default(''),
    /** Format AAAA-MM. */
    date: text('date').notNull(),
    duration: text('duration').notNull().default(''),
    categories: text('categories', { mode: 'json' }).$type<string[]>().notNull().default([]),
    summary: text('summary').notNull(),
    context: text('context').notNull(),
    needs: text('needs').notNull(),
    expectations: text('expectations').notNull(),
    solution: text('solution').notNull(),
    deliverables: text('deliverables').notNull(),
    results: text('results').notNull().default(''),
    references: text('references', { mode: 'json' }).$type<Reference[]>().notNull().default([]),
    featured: integer('featured', { mode: 'boolean' }).notNull().default(false),
    published: integer('published', { mode: 'boolean' }).notNull().default(true),
    position: integer('position').notNull().default(0),
    ...timestamps,
  },
  (t) => [index('projects_published_idx').on(t.published, t.position)],
);

export const projectImages = sqliteTable('project_images', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  projectId: integer('project_id')
    .notNull()
    .references(() => projects.id, { onDelete: 'cascade' }),
  path: text('path').notNull(),
  alt: text('alt').notNull().default(''),
  position: integer('position').notNull().default(0),
});

export const courses = sqliteTable('courses', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  title: text('title').notNull(),
  description: text('description').notNull(),
  level: text('level').notNull(),
  mode: text('mode').notNull(),
  position: integer('position').notNull().default(0),
  published: integer('published', { mode: 'boolean' }).notNull().default(true),
});

export const faqs = sqliteTable('faqs', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  question: text('question').notNull(),
  answer: text('answer').notNull(),
  position: integer('position').notNull().default(0),
  published: integer('published', { mode: 'boolean' }).notNull().default(true),
});

export const REQUEST_KINDS = ['devis', 'formation', 'message'] as const;
export const REQUEST_STATUSES = ['nouveau', 'en_cours', 'devis_envoye', 'gagne', 'perdu', 'archive'] as const;
export type RequestKind = (typeof REQUEST_KINDS)[number];
export type RequestStatus = (typeof REQUEST_STATUSES)[number];

/** Demandes reçues depuis le site (devis, formation, message). */
export const requests = sqliteTable(
  'requests',
  {
    id: integer('id').primaryKey({ autoIncrement: true }),
    reference: text('reference').notNull().unique(),
    kind: text('kind', { enum: REQUEST_KINDS }).notNull(),
    status: text('status', { enum: REQUEST_STATUSES }).notNull().default('nouveau'),
    subject: text('subject').notNull(),
    /** Réponses détaillées (étapes du formulaire), affichées telles quelles au back-office. */
    details: text('details', { mode: 'json' }).$type<Record<string, string | string[]>>().notNull().default({}),
    name: text('name').notNull(),
    phone: text('phone').notNull(),
    email: text('email').notNull().default(''),
    company: text('company').notNull().default(''),
    contactPreference: text('contact_preference').notNull().default(''),
    ...timestamps,
  },
  (t) => [index('requests_status_idx').on(t.status, t.createdAt)],
);

export const requestFiles = sqliteTable('request_files', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  requestId: integer('request_id')
    .notNull()
    .references(() => requests.id, { onDelete: 'cascade' }),
  originalName: text('original_name').notNull(),
  storedPath: text('stored_path').notNull(),
  mime: text('mime').notNull(),
  size: integer('size').notNull(),
  createdAt: text('created_at').notNull().default(sql`(datetime('now'))`),
});

export const requestNotes = sqliteTable('request_notes', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  requestId: integer('request_id')
    .notNull()
    .references(() => requests.id, { onDelete: 'cascade' }),
  body: text('body').notNull(),
  author: text('author').notNull(),
  createdAt: text('created_at').notNull().default(sql`(datetime('now'))`),
});

export const users = sqliteTable('users', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  email: text('email').notNull().unique(),
  name: text('name').notNull(),
  passwordHash: text('password_hash').notNull(),
  createdAt: text('created_at').notNull().default(sql`(datetime('now'))`),
});

export const projectsRelations = relations(projects, ({ many }) => ({ images: many(projectImages) }));
export const projectImagesRelations = relations(projectImages, ({ one }) => ({
  project: one(projects, { fields: [projectImages.projectId], references: [projects.id] }),
}));
export const requestsRelations = relations(requests, ({ many }) => ({ files: many(requestFiles), notes: many(requestNotes) }));
export const requestFilesRelations = relations(requestFiles, ({ one }) => ({
  request: one(requests, { fields: [requestFiles.requestId], references: [requests.id] }),
}));
export const requestNotesRelations = relations(requestNotes, ({ one }) => ({
  request: one(requests, { fields: [requestNotes.requestId], references: [requests.id] }),
}));

export type Service = typeof services.$inferSelect;
export type Project = typeof projects.$inferSelect;
export type ProjectImage = typeof projectImages.$inferSelect;
export type Course = typeof courses.$inferSelect;
export type Faq = typeof faqs.$inferSelect;
export type Request = typeof requests.$inferSelect;
export type RequestFile = typeof requestFiles.$inferSelect;
export type RequestNote = typeof requestNotes.$inferSelect;
