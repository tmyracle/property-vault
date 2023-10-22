// Example model schema from the Drizzle docs
// https://orm.drizzle.team/docs/sql-schema-declaration

import { relations, sql } from "drizzle-orm";
import {
  bigint,
  index,
  mysqlTableCreator,
  timestamp,
  varchar,
  text,
  decimal,
  mysqlEnum,
  json,
  boolean,
} from "drizzle-orm/mysql-core";

/**
 * This is an example of how to use the multi-project schema feature of Drizzle ORM. Use the same
 * database instance for multiple projects.
 *
 * @see https://orm.drizzle.team/docs/goodies#multi-project-schema
 */
export const mysqlTable = mysqlTableCreator((name) => `property-room_${name}`);

export const posts = mysqlTable(
  "post",
  {
    id: bigint("id", { mode: "number" }).primaryKey().autoincrement(),
    name: varchar("name", { length: 256 }),
    createdAt: timestamp("created_at")
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
    updatedAt: timestamp("updatedAt").onUpdateNow(),
  },
  (example) => ({
    nameIndex: index("name_idx").on(example.name),
  }),
);

export const cases = mysqlTable("case", {
  id: bigint("id", { mode: "number" }).primaryKey().autoincrement(),
  name: varchar("name", { length: 256 }),
  createdAt: timestamp("created_at")
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
  updatedAt: timestamp("updated_at").onUpdateNow(),
  caseNumber: varchar("case_number", { length: 256 }).notNull(),
  createdBy: varchar("created_by", { length: 256 }).notNull(),
  description: text("description"),
  orgId: varchar("org_id", { length: 256 }).notNull(),
});

export const propertyOwners = mysqlTable("property_owner", {
  id: bigint("id", { mode: "number" }).primaryKey().autoincrement(),
  createdAt: timestamp("created_at")
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
  updatedAt: timestamp("updated_at").onUpdateNow(),
  name: varchar("name", { length: 256 }).notNull(),
  phone: varchar("phone", { length: 256 }),
  email: varchar("email", { length: 256 }),
  createdBy: varchar("created_by", { length: 256 }).notNull(),
  orgId: varchar("org_id", { length: 256 }).notNull(),
});

export const addresses = mysqlTable("address", {
  id: bigint("id", { mode: "number" }).primaryKey().autoincrement(),
  createdAt: timestamp("created_at")
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
  updatedAt: timestamp("updated_at").onUpdateNow(),
  street: varchar("street", { length: 256 }).notNull(),
  unit: varchar("unit", { length: 256 }),
  city: varchar("city", { length: 256 }),
  state: varchar("state", { length: 256 }),
  zip: varchar("zip", { length: 256 }),
  createdBy: varchar("created_by", { length: 256 }).notNull(),
  orgId: varchar("org_id", { length: 256 }).notNull(),
});

export const deposits = mysqlTable("deposit", {
  id: bigint("id", { mode: "number" }).primaryKey().autoincrement(),
  createdAt: timestamp("created_at")
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
  updatedAt: timestamp("updated_at").onUpdateNow(),
  caseId: bigint("case_id", { mode: "number" }).notNull(),
  propertyOwnerId: bigint("property_owner_id", { mode: "number" }).notNull(),
  itemNumber: varchar("item_number", { length: 256 }),
  amount: decimal("amount", { precision: 19, scale: 4 }).notNull(),
  description: text("description"),
  createdBy: varchar("created_by", { length: 256 }).notNull(),
  orgId: varchar("org_id", { length: 256 }).notNull(),
});

export const depositsRelations = relations(deposits, ({ one }) => ({
  case: one(cases, {
    fields: [deposits.caseId],
    references: [cases.id],
  }),
  propertyOwner: one(propertyOwners, {
    fields: [deposits.propertyOwnerId],
    references: [propertyOwners.id],
  }),
}));

export const disbursementRequests = mysqlTable("disbursement_request", {
  id: bigint("id", { mode: "number" }).primaryKey().autoincrement(),
  createdAt: timestamp("created_at")
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
  updatedAt: timestamp("updated_at").onUpdateNow(),
  caseId: bigint("case_id", { mode: "number" }).notNull(),
  propertyOwnerId: bigint("property_owner_id", { mode: "number" }).notNull(),
  description: text("description"),
  distributeTo: mysqlEnum("distribute_to", [
    "property_owner",
    "forfeit",
  ]).notNull(),
  status: mysqlEnum("status", ["pending", "approved", "rejected"]).notNull(),
  amount: decimal("amount", { precision: 19, scale: 4 }).notNull(),
  createdBy: varchar("created_by", { length: 256 }).notNull(),
  orgId: varchar("org_id", { length: 256 }).notNull(),
});

export const disbursementRequestsRelations = relations(
  disbursementRequests,
  ({ one }) => ({
    case: one(cases, {
      fields: [disbursementRequests.caseId],
      references: [cases.id],
    }),
    propertyOwner: one(propertyOwners, {
      fields: [disbursementRequests.propertyOwnerId],
      references: [propertyOwners.id],
    }),
    approval: one(approvals, {
      fields: [disbursementRequests.id],
      references: [approvals.disbursementRequestId],
    }),
  }),
);

export const disbursements = mysqlTable("disbursement", {
  id: bigint("id", { mode: "number" }).primaryKey().autoincrement(),
  createdAt: timestamp("created_at")
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
  updatedAt: timestamp("updated_at").onUpdateNow(),
  caseId: bigint("case_id", { mode: "number" }).notNull(),
  disbursementRequestId: bigint("disbursement_request_id", {
    mode: "number",
  }).notNull(),
  createdBy: varchar("created_by", { length: 256 }).notNull(),
  orgId: varchar("org_id", { length: 256 }).notNull(),
});

export const disbursementsRelations = relations(disbursements, ({ one }) => ({
  case: one(cases, {
    fields: [disbursements.caseId],
    references: [cases.id],
  }),
  disbursementRequest: one(disbursementRequests, {
    fields: [disbursements.disbursementRequestId],
    references: [disbursementRequests.id],
  }),
}));

export const approvals = mysqlTable("approval", {
  id: bigint("id", { mode: "number" }).primaryKey().autoincrement(),
  createdAt: timestamp("created_at")
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
  updatedAt: timestamp("updated_at").onUpdateNow(),
  disbursementRequestId: bigint("disbursement_request_id", {
    mode: "number",
  }).notNull(),
  approvers: json("approvers")
    .$type<{ approver: string; approved: boolean }>()
    .notNull(),
  status: mysqlEnum("status", ["pending", "approved", "rejected"]).notNull(),
  createdBy: varchar("created_by", { length: 256 }).notNull(),
  orgId: varchar("org_id", { length: 256 }).notNull(),
});

export const approvalsRelations = relations(approvals, ({ one }) => ({
  disbursementRequest: one(disbursementRequests, {
    fields: [approvals.disbursementRequestId],
    references: [disbursementRequests.id],
  }),
}));

export const notifications = mysqlTable("notification", {
  id: bigint("id", { mode: "number" }).primaryKey().autoincrement(),
  createdAt: timestamp("created_at")
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
  updatedAt: timestamp("updated_at").onUpdateNow(),
  to: varchar("to", { length: 256 }).notNull(),
  from: varchar("from", { length: 256 }).notNull(),
  subject: varchar("subject", { length: 256 }).notNull(),
  link: varchar("link", { length: 256 }).notNull(),
  viewed: boolean("viewed").notNull().default(false),
  createdBy: varchar("created_by", { length: 256 }).notNull(),
  orgId: varchar("org_id", { length: 256 }).notNull(),
});

export const casesRelations = relations(cases, ({ many }) => ({
  deposits: many(deposits),
  propertyOwners: many(propertyOwners),
  disbursementRequests: many(disbursementRequests),
  disbursements: many(disbursements),
}));

export const propertyOwnersRelations = relations(
  propertyOwners,
  ({ many }) => ({
    deposits: many(deposits),
    disbursementRequests: many(disbursementRequests),
  }),
);
