export * from "./problems";
export * from "./contests";
export * from "./users";
export * from "./orgs";

import { getTypesenseClient } from "../client";
import { PROBLEMS_SCHEMA } from "./problems";
import { CONTESTS_SCHEMA } from "./contests";
import { USERS_SCHEMA } from "./users";
import { ORGS_SCHEMA } from "./orgs";

export async function initializeCollections() {
  const client = getTypesenseClient();

  const schemas = [PROBLEMS_SCHEMA, CONTESTS_SCHEMA, USERS_SCHEMA, ORGS_SCHEMA];

  for (const schema of schemas) {
    try {
      await client.collections(schema.name).delete();
    } catch (error) {
      // Collection might not exist, ignore
    }
    await client.collections().create(schema);
  }
}
