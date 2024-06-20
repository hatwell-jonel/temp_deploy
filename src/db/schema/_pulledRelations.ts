import { relations } from "drizzle-orm";
import { branchReference, division, userDetails, users } from "./_pulled";

export const usersRelations = relations(users, ({ one }) => ({
  division: one(division, {
    fields: [users.divisionId],
    references: [division.id],
  }),
  details: one(userDetails, {
    fields: [users.id],
    references: [userDetails.userId],
  }),
}));

export const userDetailsRelations = relations(userDetails, ({ one }) => ({
  branch: one(branchReference, {
    fields: [userDetails.branchId],
    references: [branchReference.id],
  }),
}));
