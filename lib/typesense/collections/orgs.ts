import {
  createSearchParams,
  getTypesenseClient,
  SearchParams,
  SearchResponse,
} from "../client";
import { SelectOrg } from "@/db/schema";

export const ORGS_SCHEMA = {
  name: "orgs",
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

export interface OrgDocument {
  id: number;
  name_id: string;
  name: string;
  about?: string;
  avatar?: string;
  created_at: number;
}

export function orgToDocument(org: SelectOrg): OrgDocument {
  return {
    id: org.id,
    name_id: org.nameId,
    name: org.name,
    about: org.about || undefined,
    avatar: org.avatar || undefined,
    created_at: org.createdAt.getTime(),
  };
}

export async function searchOrgs(
  query: string,
  options: Partial<SearchParams> = {},
): Promise<SearchResponse<OrgDocument>> {
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

  return await client.collections("orgs").documents().search(searchParameters);
}

export async function upsertOrg(org: SelectOrg) {
  const client = getTypesenseClient();
  const document = orgToDocument(org);
  return await client.collections("orgs").documents().upsert(document);
}

export async function deleteOrg(id: number) {
  const client = getTypesenseClient();
  return await client.collections("orgs").documents(id.toString()).delete();
}
