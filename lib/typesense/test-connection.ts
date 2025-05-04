import { getTypesenseClient } from "./client";

export async function testTypesenseConnection() {
  try {
    const client = getTypesenseClient();
    const health = await client.health.retrieve();
    console.log("Typesense connection successful:", health);
    return true;
  } catch (error) {
    console.error("Typesense connection failed:", error);
    return false;
  }
}
