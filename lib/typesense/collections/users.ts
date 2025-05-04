import {
  createSearchParams,
  getTypesenseClient,
  type SearchParams,
  type SearchResponse,
} from "../client";
import { type SelectUser } from "@/db/schema";

export const USERS_SCHEMA = {
  name: "users",
  fields: [
    { name: "id", type: "int32" },
    { name: "name_id", type: "string" },
    { name: "name", type: "string" },
    { name: "about", type: "string", optional: true },
    { name: "avatar", type: "string", optional: true },
    { name: "created_at", type: "int64" },
  ],
  default_sorting_field: "created_at",
};

export interface UserDocument {
  id: number;
  name_id: string;
  name: string;
  about?: string;
  avatar?: string;
  created_at: number;
}

export function userToDocument(user: SelectUser): UserDocument {
  return {
    id: user.id,
    name_id: user.nameId,
    name: user.name,
    about: user.about || undefined,
    avatar: user.avatar || undefined,
    created_at: user.createdAt.getTime(),
  };
}

export async function searchUsers(
  query: string,
  options: Partial<SearchParams> = {},
): Promise<SearchResponse<UserDocument>> {
  const client = getTypesenseClient();

  const searchParameters = createSearchParams(
    query,
    ["name", "name_id", "about"],
    [3, 2, 1],
    {
      per_page: options.per_page || 10,
      page: options.page || 1,
      ...options,
    },
  );

  return await client.collections("users").documents().search(searchParameters);
}

export async function upsertUser(user: SelectUser) {
  const client = getTypesenseClient();
  const document = userToDocument(user);

  return await client.collections("users").documents().upsert(document);
}

export async function deleteUser(id: number) {
  const client = getTypesenseClient();
  return await client.collections("users").documents(id.toString()).delete();
}
