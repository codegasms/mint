import { getTypesenseClient, SearchParams, SearchResponse } from "../client";

export const PROBLEMS_SCHEMA = {
  name: "problems",
  fields: [
    { name: "id", type: "string" },
    { name: "org_id", type: "int32" },
    { name: "code", type: "string" },
    { name: "title", type: "string" },
    { name: "description", type: "string", optional: true },
    { name: "allowed_languages", type: "string[]" },
    { name: "created_at", type: "int64" },
  ],
  default_sorting_field: "created_at",
};

export interface ProblemDocument {
  id: string;
  org_id: number;
  code: string;
  title: string;
  description?: string;
  allowed_languages: string[];
  created_at: number;
}

export function problemToDocument(
  problem: any,
  orgId: number,
): ProblemDocument {
  return {
    id: problem.id.toString(),
    org_id: orgId,
    code: problem.code,
    title: problem.title,
    description: problem.description,
    allowed_languages: problem.allowedLanguages,
    created_at: new Date(problem.createdAt).getTime(),
  };
}

export async function searchProblems(
  query: string,
  orgId: number,
  options: Partial<SearchParams> = {},
): Promise<SearchResponse<ProblemDocument>> {
  const client = getTypesenseClient();

  const searchParameters = createSearchParams(
    query,
    ["title", "code", "description"],
    [3, 2, 1],
    {
      filter_by: `org_id:=${orgId}`,
      sort_by: "_text_match:desc,created_at:desc",
      per_page: options.per_page || 10,
      page: options.page || 1,
      ...options,
    },
  );

  return await client
    .collections("problems")
    .documents()
    .search(searchParameters);
}

export async function upsertProblem(problem: any, orgId: number) {
  const client = getTypesenseClient();
  const document = problemToDocument(problem, orgId);

  return await client.collections("problems").documents().upsert(document);
}

export async function deleteProblem(id: string) {
  const client = getTypesenseClient();
  return await client.collections("problems").documents(id).delete();
}
