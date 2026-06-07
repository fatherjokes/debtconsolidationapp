import { eq } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import { InsertUser, users, assessments, results, sharedLinks } from "../drizzle/schema";
import type { InsertAssessment, InsertResult, InsertSharedLink } from "../drizzle/schema";
import { ENV } from "./_core/env";

let _db: ReturnType<typeof drizzle> | null = null;

export async function getDb() {
  if (!_db && process.env.DATABASE_URL) {
    try {
      _db = drizzle(process.env.DATABASE_URL);
    } catch (error) {
      console.warn("[Database] Failed to connect:", error);
      _db = null;
    }
  }
  return _db;
}

export async function upsertUser(user: InsertUser): Promise<void> {
  if (!user.openId) throw new Error("User openId is required for upsert");
  const db = await getDb();
  if (!db) { console.warn("[Database] Cannot upsert user: database not available"); return; }

  const values: InsertUser = { openId: user.openId };
  const updateSet: Record<string, unknown> = {};
  const textFields = ["name", "email", "loginMethod"] as const;
  type TextField = (typeof textFields)[number];
  const assignNullable = (field: TextField) => {
    const value = user[field];
    if (value === undefined) return;
    const normalized = value ?? null;
    values[field] = normalized;
    updateSet[field] = normalized;
  };
  textFields.forEach(assignNullable);
  if (user.lastSignedIn !== undefined) { values.lastSignedIn = user.lastSignedIn; updateSet.lastSignedIn = user.lastSignedIn; }
  if (user.role !== undefined) { values.role = user.role; updateSet.role = user.role; }
  else if (user.openId === ENV.ownerOpenId) { values.role = "admin"; updateSet.role = "admin"; }
  if (!values.lastSignedIn) values.lastSignedIn = new Date();
  if (Object.keys(updateSet).length === 0) updateSet.lastSignedIn = new Date();
  await db.insert(users).values(values).onDuplicateKeyUpdate({ set: updateSet });
}

export async function getUserByOpenId(openId: string) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(users).where(eq(users.openId, openId)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

// ─── Assessment helpers ───────────────────────────────────────────────────────

export async function saveAssessment(data: InsertAssessment): Promise<number> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const [res] = await db.insert(assessments).values(data);
  return (res as { insertId: number }).insertId;
}

export async function getAssessmentById(id: number) {
  const db = await getDb();
  if (!db) return undefined;
  const rows = await db.select().from(assessments).where(eq(assessments.id, id)).limit(1);
  return rows[0];
}

// ─── Results helpers ──────────────────────────────────────────────────────────

export async function saveResult(data: InsertResult): Promise<number> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const [res] = await db.insert(results).values(data);
  return (res as { insertId: number }).insertId;
}

export async function getResultById(id: number) {
  const db = await getDb();
  if (!db) return undefined;
  const rows = await db.select().from(results).where(eq(results.id, id)).limit(1);
  return rows[0];
}

// ─── Shared link helpers ──────────────────────────────────────────────────────

export async function saveSharedLink(data: InsertSharedLink): Promise<string> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.insert(sharedLinks).values(data);
  return data.token;
}

export async function getSharedLinkByToken(token: string) {
  const db = await getDb();
  if (!db) return undefined;
  const rows = await db.select().from(sharedLinks).where(eq(sharedLinks.token, token)).limit(1);
  return rows[0];
}
