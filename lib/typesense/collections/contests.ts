import { getTypesenseClient, SearchParams, SearchResponse } from "../client";

export const CONTESTS_SCHEMA = {
  name: "contests",
  fields: [
    { name: "id", type: "string" },
    { name: "org_id", type: "int32" },
    { name: "name", type: "string" },
    { name: "name_id", type: "string" },
    { name: "description", type: "string" },
    { name: "problems", type: "string" }, // comma-separated problem codes
    { name: "problem_count", type: "int32" },
    { name: "start_time", type: "int64" },
    { name: "end_time", type: "int64" },
  ],
  default_sorting_field: "start_time",
};

export interface ContestDocument {
  id: string;
  org_id: number;
  name: string;
  name_id: string;
  description: string;
  problems: string;
  problem_count: number;
  start_time: number;
  end_time: number;
}

export function contestToDocument(
  contest: any,
  orgId: number,
): ContestDocument {
  return {
    id: contest.id.toString(),
    org_id: orgId,
    name: contest.name,
    name_id: contest.nameId,
    description: contest.description,
    problems: contest.problems || "",
    problem_count: contest.problems ? contest.problems.split(",").length : 0,
    start_time: new Date(contest.startTime).getTime(),
    end_time: new Date(contest.endTime).getTime(),
  };
}

export async function searchContests(
  query: string,
  orgId: number,
  options: Partial<SearchParams> = {},
): Promise<SearchResponse<ContestDocument>> {
  const client = getTypesenseClient();

  const searchParameters = createSearchParams(
    query,
    ["name", "name_id", "description", "problems"],
    [3, 2, 1, 1],
    {
      filter_by: `org_id:=${orgId}`,
      sort_by: "_text_match:desc,start_time:desc",
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

export async function upsertContest(contest: any, orgId: number) {
  const client = getTypesenseClient();
  const document = contestToDocument(contest, orgId);

  return await client.collections("contests").documents().upsert(document);
}

export async function deleteContest(id: string) {
  const client = getTypesenseClient();
  return await client.collections("contests").documents(id).delete();
}
