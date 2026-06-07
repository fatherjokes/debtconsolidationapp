import {
  int,
  mysqlEnum,
  mysqlTable,
  text,
  timestamp,
  varchar,
  json,
  float,
} from "drizzle-orm/mysql-core";

export const users = mysqlTable("users", {
  id: int("id").autoincrement().primaryKey(),
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: mysqlEnum("role", ["user", "admin"]).default("user").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

// Assessment inputs from the multi-step questionnaire
export const assessments = mysqlTable("assessments", {
  id: int("id").autoincrement().primaryKey(),
  // Optional user link (anonymous assessments allowed)
  userId: int("userId"),
  // Financial profile
  totalDebt: float("totalDebt").notNull(),
  monthlyIncome: float("monthlyIncome").notNull(),
  monthlyExpenses: float("monthlyExpenses").notNull(),
  creditScoreRange: mysqlEnum("creditScoreRange", [
    "excellent", // 750+
    "good",      // 700-749
    "fair",      // 650-699
    "poor",      // 600-649
    "bad",       // below 600
  ]).notNull(),
  numberOfCreditors: int("numberOfCreditors").notNull(),
  // Home buying timeline
  homePurchaseTimeline: mysqlEnum("homePurchaseTimeline", [
    "within_1_year",
    "within_2_years",
    "within_3_years",
    "within_5_years",
    "not_planning",
  ]).notNull(),
  // Priorities
  primaryPriority: mysqlEnum("primaryPriority", [
    "speed",              // Pay off debt as fast as possible
    "credit_preservation", // Protect credit score
    "lowest_payment",     // Minimize monthly payment
  ]).notNull(),
  riskTolerance: mysqlEnum("riskTolerance", [
    "conservative",
    "moderate",
    "aggressive",
  ]).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type Assessment = typeof assessments.$inferSelect;
export type InsertAssessment = typeof assessments.$inferInsert;

// LLM-generated results for an assessment
export const results = mysqlTable("results", {
  id: int("id").autoincrement().primaryKey(),
  assessmentId: int("assessmentId").notNull(),
  // Full ranked recommendations as JSON
  recommendations: json("recommendations").notNull(),
  // Summary text
  summary: text("summary"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type Result = typeof results.$inferSelect;
export type InsertResult = typeof results.$inferInsert;

// Shareable link tokens
export const sharedLinks = mysqlTable("shared_links", {
  id: int("id").autoincrement().primaryKey(),
  token: varchar("token", { length: 64 }).notNull().unique(),
  assessmentId: int("assessmentId").notNull(),
  resultId: int("resultId").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  expiresAt: timestamp("expiresAt"),
});

export type SharedLink = typeof sharedLinks.$inferSelect;
export type InsertSharedLink = typeof sharedLinks.$inferInsert;
