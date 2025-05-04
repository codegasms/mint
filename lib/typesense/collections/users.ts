import { getTypesenseClient, SearchParams, SearchResponse } from "../client";
import { SelectUser } from "@/db/schema";

export const USERS_SCHEMA = {
  name: "users",
  fields: [
    { name: "id", type: "string" },
    { name: "org_id", type: "int32" },
    { name: "name", type: "string" },
    { name: "name_id", type: "string" },
    { name: "email", type: "string" },
    { name: "about", type: "string", optional: true },
    { name: "avatar", type: "string", optional: true },
    { name: "role", type: "string" },
    { name: "joined_at", type: "int64" },
  ],
  default_sorting_field: "joined_at",
};

export interface UserDocument {
  id: string;
  org_id: number;
  name: string;
  name_id: string;
  email: string;
  about?: string;
  avatar?: string;
  role: "owner" | "organizer" | "member";
  joined_at: number;
}

export function userToDocument(user: any, orgId: number): UserDocument {
  return {
    id: user.id.toString(),
    org_id: orgId,
    name: user.name,
    name_id: user.nameId,
    email: user.email,
    about: user.about || undefined,
    avatar: user.avatar || undefined,
    role: user.role,
    joined_at: new Date(user.joinedAt).getTime(),
  };
}

export async function searchUsers(
  query: string,
  orgId: number,
  options: Partial<SearchParams> = {},
): Promise<SearchResponse<UserDocument>> {
  const client = getTypesenseClient();

  const searchParameters = createSearchParams(
    query,
    ["name", "name_id", "about"],
    [3, 2, 1],
    {
      filter_by: `org_id:=${orgId}`,
      sort_by: "_text_match:desc,joined_at:desc",
      per_page: options.per_page || 10,
      page: options.page || 1,
      ...options,
    },
  );

  return await client.collections("users").documents().search(searchParameters);
}

export async function upsertUser(user: any, orgId: number) {
  const client = getTypesenseClient();
  const document = userToDocument(user, orgId);

  return await client.collections("users").documents().upsert(document);
}

export async function deleteUser(id: string) {
  const client = getTypesenseClient();
  return await client.collections("users").documents(id).delete();
}
