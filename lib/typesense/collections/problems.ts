import { getTypesenseClient, SearchParams, SearchResponse } from "../client";
import { SelectProblem } from "@/db/schema";
import { getRedis, CACHE_KEYS, CACHE_TTL } from "@/db/redis";

export const PROBLEMS_SCHEMA = {
  name: "problems",
  fields: [
    { name: "id", type: "int32" },
    { name: "code", type: "string" },
    { name: "title", type: "string" },
    { name: "description", type: "string" },
    { name: "allowed_languages", type: "string[]" },
    { name: "org_id", type: "int32" },
    { name: "created_at", type: "int64" },
  ],
  default_sorting_field: "created_at",
};

export interface ProblemDocument {
  id: number;
  code: string;
  title: string;
  description: string;
  allowed_languages: string[];
  org_id: number;
  created_at: number;
}

export function problemToDocument(problem: SelectProblem): ProblemDocument {
  return {
    id: problem.id,
    code: problem.code,
    title: problem.title,
    description: problem.description,
    allowed_languages: problem.allowedLanguages,
    org_id: problem.orgId,
    created_at: problem.createdAt.getTime(),
  };
}

export async function searchProblems(
  query: string,
  options: Partial<SearchParams> = {},
): Promise<SearchResponse<ProblemDocument>> {
  const redis = getRedis();
  const cacheKey = `${CACHE_KEYS.PROBLEM}search:${query}:${JSON.stringify(options)}`;

  // Try to get from cache first
  const cached = await redis.get(cacheKey);
  if (cached) {
    return JSON.parse(cached);
  }

  const client = getTypesenseClient();

  const searchParameters = createSearchParams(
    query,
    ["title", "code", "description"],
    [4, 2, 1],
    {
      per_page: options.per_page || 10,
      page: options.page || 1,
      ...options,
    },
  );
  const searchParameters = createSearchParams(
    query,
    ["title", "code", "description"],
    [4, 2, 1],
    {
      per_page: options.per_page || 10,
      page: options.page || 1,
      filter_by: options.filter_by,
      sort_by: options.sort_by || "_text_match:desc,created_at:desc",
      ...options,
    },
  );

  const results = await client
    .collections("problems")
    .documents()
    .search(searchParameters);

  // Cache results
  await redis.set(
    cacheKey,
    JSON.stringify(results),
    "EX",
    CACHE_TTL.MEDIUM, // Cache for 5 minutes
  );

  return results;
}

export async function upsertProblem(problem: SelectProblem) {
  const client = getTypesenseClient();
  const document = problemToDocument(problem);

  // Clear search cache when updating problems
  const redis = getRedis();
  const keys = await redis.keys(`${CACHE_KEYS.PROBLEM}search:*`);
  if (keys.length > 0) {
    await redis.del(keys);
  }

  return await client.collections("problems").documents().upsert(document);
}

export async function deleteProblem(id: number) {
  const client = getTypesenseClient();

  // Clear search cache when deleting problems
  const redis = getRedis();
  const keys = await redis.keys(`${CACHE_KEYS.PROBLEM}search:*`);
  if (keys.length > 0) {
    await redis.del(keys);
  }

  return await client.collections("problems").documents(id.toString()).delete();
}

// Batch operations for initial data import
export async function batchUpsertProblems(problems: SelectProblem[]) {
  const client = getTypesenseClient();
  const documents = problems.map(problemToDocument);

  return await client
    .collections("problems")
    .documents()
    .import(documents, { action: "upsert" });
}

// Search problems by organization
export async function searchProblemsByOrg(
  query: string,
  orgId: number,
  options: Partial<SearchParams> = {},
): Promise<SearchResponse<ProblemDocument>> {
  return searchProblems(query, {
    ...options,
    filter_by: `org_id:=${orgId}`,
  });
}
