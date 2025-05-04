import { initializeTypesenseCollections } from "./typesense/init";
import { initializeTypesenseSync } from "./typesense/subscriber";
import { syncExistingData } from "./typesense/sync-existing";

let initialized = false;

export async function initializeServices() {
  if (initialized) return;

  // Initialize Typesense collections
  await initializeTypesenseCollections();

  // Initialize TypesenseSubscriber
  initializeTypesenseSync();

  // Sync existing data
  await syncExistingData();

  initialized = true;
}
