import { getTypesenseClient, SearchParams, SearchResponse } from "../client";

export const SUBMISSIONS_SCHEMA = {
  name: "submissions",
  fields: [
    { name: "id", type: "string" },
    { name: "org_id", type: "int32" },
    // User details for searching
    { name: "user_name_id", type: "string" },
    { name: "user_name", type: "string" },
    // Contest details for searching
    { name: "contest_name_id", type: "string" },
    { name: "contest_name", type: "string" },
    // Problem details for searching
    { name: "problem_title", type: "string" },
    { name: "problem_code", type: "string" },
    // Submission details
    { name: "language", type: "string" },
    { name: "status", type: "string" },
    { name: "submitted_at", type: "int64" },
    { name: "execution_time", type: "int32" },
    { name: "memory_usage", type: "int32" },
  ],
  default_sorting_field: "submitted_at",
};

export interface SubmissionDocument {
  id: string;
  org_id: number;
  // User details
  user_name_id: string;
  user_name: string;
  // Contest details
  contest_name_id: string;
  contest_name: string;
  // Problem details
  problem_title: string;
  problem_code: string;
  // Submission details
  language: string;
  status: string;
  submitted_at: number;
  execution_time: number;
  memory_usage: number;
}

export function submissionToDocument(
  submission: any,
  orgId: number,
): SubmissionDocument {
  return {
    id: submission.id.toString(),
    org_id: orgId,
    // User details
    user_name_id: submission.user.nameId,
    user_name: submission.user.name,
    // Contest details
    contest_name_id: submission.contest.nameId,
    contest_name: submission.contest.name,
    // Problem details
    problem_title: submission.problem.title,
    problem_code: submission.problem.id,
    // Submission details
    language: submission.language,
    status: submission.status,
    submitted_at: new Date(submission.submittedAt).getTime(),
    execution_time: submission.executionTime,
    memory_usage: submission.memoryUsage,
  };
}

export async function searchSubmissions(
  query: string,
  orgId: number,
  options: {
    userNameId?: string;
    contestNameId?: string;
    problemNameId?: string;
    language?: string;
    status?: string;
    startTime?: number;
    endTime?: number;
    page?: number;
    per_page?: number;
  } = {},
): Promise<SearchResponse<SubmissionDocument>> {
  const client = getTypesenseClient();

  let filterBy = `org_id:=${orgId}`;
  if (options.userNameId) filterBy += ` && user_name_id:=${options.userNameId}`;
  if (options.contestNameId)
    filterBy += ` && contest_name_id:=${options.contestNameId}`;
  if (options.problemNameId)
    filterBy += ` && contest_problem_name_id:=${options.problemNameId}`;
  if (options.language) filterBy += ` && language:=${options.language}`;
  if (options.status) filterBy += ` && status:=${options.status}`;
  if (options.startTime) filterBy += ` && submitted_at:>=${options.startTime}`;
  if (options.endTime) filterBy += ` && submitted_at:<=${options.endTime}`;

  const searchParameters = createSearchParams(
    query,
    [
      "user_name",
      "user_name_id",
      "contest_name",
      "problem_title",
      "problem_code",
    ],
    [3, 2, 2, 2, 1],
    {
      filter_by: filterBy,
      sort_by: query
        ? "_text_match:desc,submitted_at:desc"
        : "submitted_at:desc",
      per_page: options.per_page || 10,
      page: options.page || 1,
    },
  );

  return await client
    .collections("submissions")
    .documents()
    .search(searchParameters);
}

export async function upsertSubmission(submission: any, orgId: number) {
  const client = getTypesenseClient();
  const document = submissionToDocument(submission, orgId);

  return await client.collections("submissions").documents().upsert(document);
}

export async function deleteSubmission(id: string) {
  const client = getTypesenseClient();
  return await client.collections("submissions").documents(id).delete();
}
