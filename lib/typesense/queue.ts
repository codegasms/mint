import { getRedis } from "@/db/redis";

type SyncData = any;

interface SyncOperation {
  operation: "create" | "update" | "delete";
  entity: "problem" | "contest" | "user" | "org";
  data: SyncData;
  id: number;
  timestamp: number;
}

export interface BatchedOperations {
  problems: {
    create: SyncData[];
    update: SyncData[];
    delete: number[];
  };
  contests: {
    create: SyncData[];
    update: SyncData[];
    delete: number[];
  };
  users: {
    create: SyncData[];
    update: SyncData[];
    delete: number[];
  };
  orgs: {
    create: SyncData[];
    update: SyncData[];
    delete: number[];
  };
}

export const BATCH_WINDOW = 5000; // 5 seconds
export const MAX_BATCH_SIZE = 100;

export const publishSync = async (
  operation: "create" | "update" | "delete",
  entity: "problem" | "contest" | "user" | "org",
  data: SyncData,
) => {
  const redis = getRedis();
  const message: SyncOperation = {
    operation,
    entity,
    data,
    id: data.id,
    timestamp: Date.now(),
  };

  await redis.publish("typesense:sync", JSON.stringify(message));
};
