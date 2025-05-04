import { db } from "@/db/drizzle";
import { problems, contests, users, orgs } from "@/db/schema";
import { publishSync } from "./queue";
import { getTypesenseClient } from "./client";

export async function syncExistingData() {
  const client = getTypesenseClient();

  try {
    // Clear existing collections
    const collections = ["problems", "contests", "users", "orgs"];
    for (const collection of collections) {
      try {
        await client
          .collections(collection)
          .documents()
          .delete({ filter_by: "" });
        console.log(`Cleared collection: ${collection}`);
      } catch (error) {
        console.error(`Error clearing collection ${collection}:`, error);
      }
    }

    // Sync all existing data
    const existingProblems = await db.select().from(problems);
    for (const problem of existingProblems) {
      await publishSync("create", "problem", problem);
    }

    const existingContests = await db.select().from(contests);
    for (const contest of existingContests) {
      await publishSync("create", "contest", contest);
    }

    const existingUsers = await db.select().from(users);
    for (const user of existingUsers) {
      await publishSync("create", "user", user);
    }

    const existingOrgs = await db.select().from(orgs);
    for (const org of existingOrgs) {
      await publishSync("create", "org", org);
    }

    console.log("Existing data sync initiated");
  } catch (error) {
    console.error("Error syncing existing data:", error);
  }
}
