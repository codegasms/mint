import {
  createSearchParams,
  getTypesenseClient,
  SearchParams,
  SearchResponse,
} from "../client";

export const GROUPS_SCHEMA = {
  name: "groups",
  fields: [
    { name: "id", type: "string" },
    { name: "org_id", type: "int32" },
    { name: "name", type: "string" },
    { name: "name_id", type: "string" },
    { name: "about", type: "string", optional: true },
    { name: "avatar", type: "string", optional: true },
    { name: "created_at", type: "int64" },
    { name: "users", type: "string" }, // newline separated emails
    { name: "users_count", type: "int32" },
  ],
  default_sorting_field: "created_at",
};

export interface GroupDocument {
  id: string;
  org_id: number;
  name: string;
  name_id: string;
  about?: string;
  avatar?: string;
  created_at: number;
  users: string;
  users_count: number;
}

export function groupToDocument(group: any, orgId: number): GroupDocument {
  return {
    id: group.id.toString(),
    org_id: orgId,
    name: group.name,
    name_id: group.nameId,
    about: group.about || undefined,
    avatar: group.avatar || undefined,
    created_at: new Date(group.createdAt).getTime(),
    users: group.userEmails?.join("\n") || "",
    users_count: group.userEmails?.length || 0,
  };
}

export async function searchGroups(
  query: string,
  orgId: number,
  options: Partial<SearchParams> = {},
): Promise<SearchResponse<GroupDocument>> {
  const client = getTypesenseClient();

  const searchParameters = createSearchParams(
    query,
    ["name", "name_id", "about", "users"],
    [3, 2, 1, 1],
    {
      filter_by: `org_id:=${orgId}`,
      sort_by: "_text_match:desc,created_at:desc",
      per_page: options.per_page || 10,
      page: options.page || 1,
      ...options,
    },
  );

  return await client
    .collections("groups")
    .documents()
    .search(searchParameters);
}

export async function upsertGroup(group: any, orgId: number) {
  const client = getTypesenseClient();
  const document = groupToDocument(group, orgId);

  return await client.collections("groups").documents().upsert(document);
}

export async function deleteGroup(id: string) {
  const client = getTypesenseClient();
  return await client.collections("groups").documents(id).delete();
}
