import {
  createSearchParams,
  getTypesenseClient,
  type SearchParams,
  type SearchResponse,
} from "../client";
import { type SelectContest } from "@/db/schema";

export const CONTESTS_SCHEMA = {
  name: "contests",
  fields: [
    { name: "id", type: "int32" },
    { name: "name_id", type: "string" },
    { name: "name", type: "string" },
    { name: "description", type: "string" },
    { name: "rules", type: "string" },
    { name: "organizer_id", type: "int32" },
    { name: "start_time", type: "int64" },
    { name: "end_time", type: "int64" },
  ],
  default_sorting_field: "start_time",
};

export interface ContestDocument {
  id: number;
  name_id: string;
  name: string;
  description: string;
  rules: string;
  organizer_id: number;
  start_time: number;
  end_time: number;
}

export function contestToDocument(contest: SelectContest): ContestDocument {
  return {
    id: contest.id,
    name_id: contest.nameId,
    name: contest.name,
    description: contest.description,
    rules: contest.rules,
    organizer_id: contest.organizerId,
    start_time: contest.startTime.getTime(),
    end_time: contest.endTime.getTime(),
  };
}

export async function searchContests(
  query: string,
  options: Partial<SearchParams> = {},
): Promise<SearchResponse<ContestDocument>> {
  const client = getTypesenseClient();

  const searchParameters = createSearchParams(
    query,
    ["name", "name_id", "description"],
    [3, 2, 1],
    {
      per_page: options.per_page || 10,
      page: options.page || 1,
      ...options,
    },
  );

  return await client
    .collections("contests")
    .documents()
    .search(searchParameters);
}

export async function upsertContest(contest: SelectContest) {
  const client = getTypesenseClient();
  const document = contestToDocument(contest);

  return await client.collections("contests").documents().upsert(document);
}

export async function deleteContest(id: number) {
  const client = getTypesenseClient();
  return await client.collections("contests").documents(id.toString()).delete();
}
