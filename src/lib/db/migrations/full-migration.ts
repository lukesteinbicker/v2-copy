import { Kysely, sql } from 'kysely';

export async function up(db: Kysely<any>): Promise<void> {
  // Create companies table first since users reference it
  await db.schema
    .createTable("companies")
    .addColumn("id", "varchar", (col) => col.primaryKey().notNull())
    .addColumn("name", "varchar", (col) => col.notNull())
    .addColumn("domain", "varchar")
    .addColumn("website", "varchar")
    .addColumn("industry", "varchar")
    .addColumn("size", "varchar")
    .addColumn("logo", "varchar")
    .addColumn("address", "varchar")
    .addColumn("city", "varchar")
    .addColumn("state", "varchar")
    .addColumn("country", "varchar")
    .addColumn("zip", "varchar")
    .addColumn("phone", "varchar")
    .addColumn("active", "boolean", (col) => col.notNull())
    .addColumn("premium", "boolean", (col) => col.notNull())
    .addColumn("premiumExpiresAt", "timestamp")
    .addColumn("settings", "json")
    .addColumn("createdAt", "timestamp", (col) =>
      col.defaultTo(sql`CURRENT_TIMESTAMP`).notNull(),
    )
    .addColumn("updatedAt", "timestamp", (col) =>
      col.defaultTo(sql`CURRENT_TIMESTAMP`).notNull(),
    )
    .execute();

  await db.schema
    .createTable("user")
    .addColumn("id", "varchar", (col) => col.primaryKey().notNull())
    .addColumn("name", "varchar", (col) => col.notNull())
    .addColumn("username", "varchar", (col) => col.notNull())
    .addColumn("email", "varchar", (col) => col.notNull())
    .addColumn("emailVerified", "boolean", (col) => col.notNull())
    .addColumn("image", "varchar")
    .addColumn("role", "varchar", (col) => col.notNull())
    .addColumn("companyId", "varchar", (col) =>
      col.references("companies.id").onDelete("cascade").notNull(),
    )
    .addColumn("bannerImage", "varchar")
    .addColumn("address", "varchar")
    .addColumn("city", "varchar")
    .addColumn("state", "varchar")
    .addColumn("zip", "varchar")
    .addColumn("active", "boolean", (col) => col.notNull())
    .addColumn("premium", "boolean", (col) => col.notNull())
    .addColumn("premiumExpiresAt", "timestamp")
    .addColumn("communications", "boolean", (col) => col.notNull())
    .addColumn("createdAt", "timestamp", (col) =>
      col.defaultTo(sql`CURRENT_TIMESTAMP`).notNull(),
    )
    .addColumn("updatedAt", "timestamp", (col) =>
      col.defaultTo(sql`CURRENT_TIMESTAMP`).notNull(),
    )
    .execute();

  await db.schema
    .createTable("session")
    .addColumn("id", "varchar", (col) => col.primaryKey().notNull())
    .addColumn("userId", "varchar", (col) =>
      col.references("user.id").onDelete("cascade").notNull(),
    )
    .addColumn("token", "varchar", (col) => col.notNull())
    .addColumn("expiresAt", "timestamp", (col) => col.notNull())
    .addColumn("ipAddress", "varchar")
    .addColumn("userAgent", "varchar")
    .addColumn("createdAt", "timestamp", (col) =>
      col.defaultTo(sql`CURRENT_TIMESTAMP`).notNull(),
    )
    .addColumn("updatedAt", "timestamp", (col) =>
      col.defaultTo(sql`CURRENT_TIMESTAMP`).notNull(),
    )
    .execute();

  await db.schema
    .createTable("account")
    .addColumn("id", "varchar", (col) => col.primaryKey().notNull())
    .addColumn("userId", "varchar", (col) =>
      col.references("user.id").onDelete("cascade").notNull(),
    )
    .addColumn("accountId", "varchar", (col) => col.notNull())
    .addColumn("providerId", "varchar", (col) => col.notNull())
    .addColumn("accessToken", "varchar")
    .addColumn("refreshToken", "varchar")
    .addColumn("accessTokenExpiresAt", "timestamp")
    .addColumn("refreshTokenExpiresAt", "timestamp")
    .addColumn("scope", "varchar")
    .addColumn("idToken", "varchar")
    .addColumn("password", "varchar")
    .addColumn("createdAt", "timestamp", (col) =>
      col.defaultTo(sql`CURRENT_TIMESTAMP`).notNull(),
    )
    .addColumn("updatedAt", "timestamp", (col) =>
      col.defaultTo(sql`CURRENT_TIMESTAMP`).notNull(),
    )
    .execute();

  await db.schema
    .createTable("verification")
    .addColumn("id", "varchar", (col) => col.primaryKey().notNull())
    .addColumn("identifier", "varchar", (col) => col.notNull())
    .addColumn("value", "varchar", (col) => col.notNull())
    .addColumn("expiresAt", "timestamp", (col) => col.notNull())
    .addColumn("createdAt", "timestamp", (col) =>
      col.defaultTo(sql`CURRENT_TIMESTAMP`).notNull(),
    )
    .addColumn("updatedAt", "timestamp", (col) =>
      col.defaultTo(sql`CURRENT_TIMESTAMP`).notNull(),
    )
    .execute();

  await db.schema
    .createTable("embedTokens")
    .addColumn("id", "varchar", (col) => col.primaryKey().notNull())
    .addColumn("companyId", "varchar", (col) =>
      col.references("companies.id").onDelete("cascade").notNull(),
    )
    .addColumn("token", "varchar", (col) => col.notNull().unique())
    .addColumn("name", "varchar", (col) => col.notNull())
    .addColumn("active", "boolean", (col) => col.notNull())
    .addColumn("allowedDomains", "json")
    .addColumn("expiresAt", "timestamp")
    .addColumn("lastUsedAt", "timestamp")
    .addColumn("createdAt", "timestamp", (col) =>
      col.defaultTo(sql`CURRENT_TIMESTAMP`).notNull(),
    )
    .addColumn("updatedAt", "timestamp", (col) =>
      col.defaultTo(sql`CURRENT_TIMESTAMP`).notNull(),
    )
    .execute();

  await db.schema
    .createTable("visitors")
    .addColumn("id", "varchar", (col) => col.primaryKey().notNull())
    .addColumn("companyId", "varchar", (col) =>
      col.references("companies.id").onDelete("cascade").notNull(),
    )
    .addColumn("sessionId", "varchar", (col) => col.notNull())
    .addColumn("ipAddress", "varchar", (col) => col.notNull())
    .addColumn("userAgent", "varchar", (col) => col.notNull())
    .addColumn("referrer", "varchar")
    .addColumn("utmParams", "json")
    .addColumn("enriched", "boolean", (col) => col.notNull())
    .addColumn("enrichmentData", "json")
    .addColumn("currentPage", "varchar")
    .addColumn("online", "boolean", (col) => col.notNull())
    .addColumn("startedAt", "timestamp", (col) =>
      col.defaultTo(sql`CURRENT_TIMESTAMP`).notNull(),
    )
    .addColumn("lastActivity", "timestamp", (col) =>
      col.defaultTo(sql`CURRENT_TIMESTAMP`).notNull(),
    )
    .execute();

  await db.schema
    .createTable("leads")
    .addColumn("id", "varchar", (col) => col.primaryKey().notNull())
    .addColumn("companyId", "varchar", (col) =>
      col.references("companies.id").onDelete("cascade").notNull(),
    )
    .addColumn("visitorId", "varchar", (col) =>
      col.references("visitors.id").onDelete("cascade").notNull(),
    )
    .addColumn("status", "varchar", (col) => col.notNull())
    .addColumn("claimedBy", "varchar", (col) =>
      col.references("user.id").onDelete("set null"),
    )
    .addColumn("claimAt", "timestamp")
    .addColumn("slackId", "varchar")
    .addColumn("callId", "varchar")
    .addColumn("callStatus", "varchar", (col) => col.notNull())
    .addColumn("notes", "text")
    .execute();

  await db.schema
    .createTable("calls")
    .addColumn("id", "varchar", (col) => col.primaryKey().notNull())
    .addColumn("companyId", "varchar", (col) =>
      col.references("companies.id").onDelete("cascade").notNull(),
    )
    .addColumn("leadId", "varchar", (col) =>
      col.references("leads.id").onDelete("cascade").notNull(),
    )
    .addColumn("dailyRoomId", "varchar", (col) => col.notNull())
    .addColumn("startedAt", "timestamp", (col) =>
      col.defaultTo(sql`CURRENT_TIMESTAMP`).notNull(),
    )
    .addColumn("endedAt", "timestamp")
    .addColumn("transcriptUrl", "varchar")
    .addColumn("recordingUrl", "varchar")
    .addColumn("summary", "text")
    .execute();

  await db.schema
    .createTable("visitorHistory")
    .addColumn("id", "varchar", (col) => col.primaryKey().notNull())
    .addColumn("visitorId", "varchar", (col) =>
      col.references("visitors.id").onDelete("cascade").notNull(),
    )
    .addColumn("responseTime", "integer")
    .addColumn("callDuration", "integer")
    .addColumn("outcome", "varchar", (col) => col.notNull())
    .execute();
}

export async function down(db: Kysely<any>): Promise<void> {
  await db.schema.dropTable("visitorHistory").execute();
  await db.schema.dropTable("calls").execute();
  await db.schema.dropTable("leads").execute();
  await db.schema.dropTable("visitors").execute();
  await db.schema.dropTable("embedTokens").execute();
  await db.schema.dropTable("verification").execute();
  await db.schema.dropTable("account").execute();
  await db.schema.dropTable("session").execute();
  await db.schema.dropTable("user").execute();
  await db.schema.dropTable("companies").execute();
}

// Run the migration
import { db } from '~/lib/pg/connect'

async function runMigration() {
  try {
    await up(db)
    console.log('Migration completed successfully')
  } catch (error) {
    console.error('Migration failed:', error)
    throw error
  } finally {
    await db.destroy()
  }
}

runMigration()
  .then(() => process.exit(0))
  .catch(() => process.exit(1))