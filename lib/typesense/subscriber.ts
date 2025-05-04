import { Redis } from "ioredis";
import { getRedis } from "@/db/redis";
import {
  syncProblemCreate,
  syncProblemUpdate,
  syncProblemDelete,
  syncContestCreate,
  syncContestUpdate,
  syncContestDelete,
  syncUserCreate,
  syncUserUpdate,
  syncUserDelete,
  syncOrgCreate,
  syncOrgUpdate,
  syncOrgDelete,
} from "./sync";
import { type BatchedOperations, MAX_BATCH_SIZE, BATCH_WINDOW } from "./queue";

class TypesenseSubscriber {
  private batch: BatchedOperations = {
    problems: { create: [], update: [], delete: [] },
    contests: { create: [], update: [], delete: [] },
    users: { create: [], update: [], delete: [] },
    orgs: { create: [], update: [], delete: [] },
  };

  private batchTimeout: NodeJS.Timeout | null = null;

  constructor() {
    const redis = new Redis(process.env.REDIS_URL || "redis://localhost:6379");

    redis.subscribe("typesense:sync", (err) => {
      if (err) console.error("Redis subscription error:", err);
    });

    redis.on("message", (channel, message) => {
      if (channel === "typesense:sync") {
        this.handleMessage(JSON.parse(message));
      }
    });
  }

  private handleMessage(message: SyncOperation) {
    const { entity, operation, data, id } = message;

    // Add to appropriate batch
    this.batch[`${entity}s`][operation].push(
      operation === "delete" ? id : data,
    );

    // Reset batch timeout
    if (this.batchTimeout) clearTimeout(this.batchTimeout);

    // Process batch if max size reached or after window
    if (this.getBatchSize() >= MAX_BATCH_SIZE) {
      this.processBatch();
    } else {
      this.batchTimeout = setTimeout(() => this.processBatch(), BATCH_WINDOW);
    }
  }

  private getBatchSize(): number {
    return Object.values(this.batch).reduce(
      (total, entityOps) =>
        total +
        Object.values(entityOps).reduce((sum, ops) => sum + ops.length, 0),
      0,
    );
  }

  private async processBatch() {
    const currentBatch = this.batch;
    this.batch = {
      problems: { create: [], update: [], delete: [] },
      contests: { create: [], update: [], delete: [] },
      users: { create: [], update: [], delete: [] },
      orgs: { create: [], update: [], delete: [] },
    };

    try {
      await Promise.all([
        // Problems
        ...currentBatch.problems.create.map(syncProblemCreate),
        ...currentBatch.problems.update.map(syncProblemUpdate),
        ...currentBatch.problems.delete.map(syncProblemDelete),
        // Contests
        ...currentBatch.contests.create.map(syncContestCreate),
        ...currentBatch.contests.update.map(syncContestUpdate),
        ...currentBatch.contests.delete.map(syncContestDelete),
        // Users
        ...currentBatch.users.create.map(syncUserCreate),
        ...currentBatch.users.update.map(syncUserUpdate),
        ...currentBatch.users.delete.map(syncUserDelete),
        // Organizations
        ...currentBatch.orgs.create.map(syncOrgCreate),
        ...currentBatch.orgs.update.map(syncOrgUpdate),
        ...currentBatch.orgs.delete.map(syncOrgDelete),
      ]);
    } catch (error) {
      console.error("Batch processing error:", error);
      // Could add retry logic or error reporting here
    }
  }
}

export const initializeTypesenseSync = () => new TypesenseSubscriber();
