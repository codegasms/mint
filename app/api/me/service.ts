import { db } from "@/db/drizzle";
import { users, memberships, orgs } from "@/db/schema";
import { eq } from "drizzle-orm";

interface Org {
  id: number;
  name: string;
  nameId: string;
  role: string;
}

interface User {
  id: number;
  email: string;
  name: string;
  nameId: string;
  orgs: Org[];
  isSuperuser: boolean;
}

export async function getUserWithOrgs(userId: number): Promise<User | null> {
  const result = await db
    .select({
      userId: users.id,
      email: users.email,
      name: users.name,
      nameId: users.nameId,
      isSuperuser: users.isSuperuser,
      orgId: orgs.id,
      orgName: orgs.name,
      orgNameId: orgs.nameId,
      role: memberships.role,
    })
    .from(users)
    .leftJoin(memberships, eq(users.id, memberships.userId))
    .leftJoin(orgs, eq(memberships.orgId, orgs.id))
    .where(eq(users.id, userId));

  if (result.length === 0) {
    return null;
  }

  // Transform the flat results into the nested structure
  const userData = result[0];

  return {
    id: userData.userId,
    email: userData.email,
    name: userData.name,
    nameId: userData.nameId,
    isSuperuser: userData.isSuperuser,
    orgs: result
      .filter((row) => row.orgId !== null) // Filter out null orgs from left join
      .map((row) => ({
        id: row.orgId!,
        name: row.orgName!,
        nameId: row.orgNameId!,
        role: row.role!,
      })),
  };
}
