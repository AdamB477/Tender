import { sql } from "drizzle-orm";
import { 
  pgTable, 
  text, 
  varchar, 
  integer, 
  timestamp, 
  boolean, 
  decimal,
  jsonb,
  pgEnum,
  real
} from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Enums
export const userTypeEnum = pgEnum("user_type", ["tenderer", "contractor", "admin"]);
export const tenderStatusEnum = pgEnum("tender_status", ["draft", "open", "closed", "awarded"]);
export const bidStatusEnum = pgEnum("bid_status", ["pending", "shortlisted", "awarded", "rejected"]);
export const complianceStatusEnum = pgEnum("compliance_status", ["valid", "expiring", "expired"]);

// Organizations (both tenderers and contractors)
export const organizations = pgTable("organizations", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  type: userTypeEnum("type").notNull(),
  email: text("email").notNull().unique(),
  phone: text("phone"),
  address: text("address"),
  latitude: real("latitude"),
  longitude: real("longitude"),
  logoUrl: text("logo_url"),
  description: text("description"),
  capabilities: text("capabilities").array(),
  rating: decimal("rating", { precision: 3, scale: 2 }).default("0"),
  reviewCount: integer("review_count").default(0),
  reliabilityScore: integer("reliability_score").default(50),
  available: boolean("available").default(true),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Users
export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  organizationId: varchar("organization_id").references(() => organizations.id).notNull(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  email: text("email").notNull(),
  role: text("role").default("user"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Tenders
export const tenders = pgTable("tenders", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  organizationId: varchar("organization_id").references(() => organizations.id).notNull(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  latitude: real("latitude").notNull(),
  longitude: real("longitude").notNull(),
  address: text("address").notNull(),
  budget: jsonb("budget").notNull(),
  requiredSkills: text("required_skills").array().notNull(),
  requiredCompliance: text("required_compliance").array(),
  scopeOfWork: text("scope_of_work").array(),
  startDate: timestamp("start_date"),
  deadline: timestamp("deadline").notNull(),
  duration: integer("duration"),
  status: tenderStatusEnum("status").default("draft").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Bids
export const bids = pgTable("bids", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  tenderId: varchar("tender_id").references(() => tenders.id).notNull(),
  contractorId: varchar("contractor_id").references(() => organizations.id).notNull(),
  price: decimal("price", { precision: 12, scale: 2 }).notNull(),
  duration: integer("duration").notNull(),
  methodStatement: text("method_statement"),
  crewCount: integer("crew_count"),
  proposedCrew: text("proposed_crew").array(),
  selectedScopeItems: text("selected_scope_items").array(),
  status: bidStatusEnum("status").default("pending").notNull(),
  matchScore: integer("match_score"),
  submittedAt: timestamp("submitted_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Crew Members
export const crewMembers = pgTable("crew_members", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  organizationId: varchar("organization_id").references(() => organizations.id).notNull(),
  name: text("name").notNull(),
  role: text("role").notNull(),
  email: text("email"),
  phone: text("phone"),
  photoUrl: text("photo_url"),
  skills: text("skills").array(),
  available: boolean("available").default(true),
  complianceScore: integer("compliance_score").default(0),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Compliance Documents
export const complianceDocs = pgTable("compliance_docs", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  entityType: text("entity_type").notNull(),
  entityId: varchar("entity_id").notNull(),
  type: text("type").notNull(),
  status: complianceStatusEnum("status").default("valid").notNull(),
  issuedDate: timestamp("issued_date"),
  expiryDate: timestamp("expiry_date"),
  fileUrl: text("file_url"),
  fileName: text("file_name"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Messages
export const messages = pgTable("messages", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  tenderId: varchar("tender_id").references(() => tenders.id),
  senderId: varchar("sender_id").references(() => organizations.id).notNull(),
  receiverId: varchar("receiver_id").references(() => organizations.id).notNull(),
  content: text("content").notNull(),
  read: boolean("read").default(false),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Reviews
export const reviews = pgTable("reviews", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  tenderId: varchar("tender_id").references(() => tenders.id).notNull(),
  reviewerId: varchar("reviewer_id").references(() => organizations.id).notNull(),
  revieweeId: varchar("reviewee_id").references(() => organizations.id).notNull(),
  rating: integer("rating").notNull(),
  comment: text("comment"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Insert Schemas
export const insertOrganizationSchema = createInsertSchema(organizations).omit({
  id: true,
  rating: true,
  reviewCount: true,
  reliabilityScore: true,
  createdAt: true,
});

export const insertUserSchema = createInsertSchema(users).omit({
  id: true,
  createdAt: true,
});

export const insertTenderSchema = createInsertSchema(tenders).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertBidSchema = createInsertSchema(bids).omit({
  id: true,
  matchScore: true,
  submittedAt: true,
  updatedAt: true,
});

export const insertCrewMemberSchema = createInsertSchema(crewMembers).omit({
  id: true,
  complianceScore: true,
  createdAt: true,
});

export const insertComplianceDocSchema = createInsertSchema(complianceDocs).omit({
  id: true,
  createdAt: true,
});

export const insertMessageSchema = createInsertSchema(messages).omit({
  id: true,
  read: true,
  createdAt: true,
});

export const insertReviewSchema = createInsertSchema(reviews).omit({
  id: true,
  createdAt: true,
});

// Types
export type Organization = typeof organizations.$inferSelect;
export type InsertOrganization = z.infer<typeof insertOrganizationSchema>;

export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;

export type Tender = typeof tenders.$inferSelect;
export type InsertTender = z.infer<typeof insertTenderSchema>;

export type Bid = typeof bids.$inferSelect;
export type InsertBid = z.infer<typeof insertBidSchema>;

export type CrewMember = typeof crewMembers.$inferSelect;
export type InsertCrewMember = z.infer<typeof insertCrewMemberSchema>;

export type ComplianceDoc = typeof complianceDocs.$inferSelect;
export type InsertComplianceDoc = z.infer<typeof insertComplianceDocSchema>;

export type Message = typeof messages.$inferSelect;
export type InsertMessage = z.infer<typeof insertMessageSchema>;

export type Review = typeof reviews.$inferSelect;
export type InsertReview = z.infer<typeof insertReviewSchema>;
