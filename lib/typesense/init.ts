import { getTypesenseClient } from "./client";
import { PROBLEMS_SCHEMA } from "./collections/problems";
import { CONTESTS_SCHEMA } from "./collections/contests";
import { USERS_SCHEMA } from "./collections/users";
import { ORGS_SCHEMA } from "./collections/orgs";

export async function initializeTypesenseCollections() {
  const client = getTypesenseClient();
  const schemas = [PROBLEMS_SCHEMA, CONTESTS_SCHEMA, USERS_SCHEMA, ORGS_SCHEMA];

  for (const schema of schemas) {
    try {
      // Check if collection exists
      const exists = await client.collections(schema.name).exists();

      if (!exists) {
        await client.collections().create(schema);
        console.log(`Created collection: ${schema.name}`);
      }
    } catch (error) {
      console.error(`Error initializing collection ${schema.name}:`, error);
    }
  }
}
