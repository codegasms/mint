import { type NextRequest, NextResponse } from "next/server";
import { db } from "@/db/drizzle";
import { orgs } from "@/db/schema";
import { eq } from "drizzle-orm";
import { z } from "zod";
import { getOrgIdFromNameId } from "../../service";
import { getOrgByOrgId } from "./service";
import { invalidateCacheKey } from "@/lib/cache/utils";

const updateOrgSchema = z.object({
  name: z.string().optional(),
  about: z.string().optional(),
  avatar: z.string().optional(),
});

export async function GET(
  req: NextRequest,
  { params }: { params: { orgId: string } },
) {
  // Get numeric ID from nameId
  const orgId = await getOrgIdFromNameId(params.orgId);
  if (!orgId) {
    return NextResponse.json(
      { message: "Organization not found" },
      { status: 404 },
    );
  }

  const org = getOrgByOrgId(orgId);

  return org
    ? NextResponse.json(org)
    : NextResponse.json({ message: "Organization not found" }, { status: 404 });
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: { orgId: string } },
) {
  // Get numeric ID from nameId
  const orgId = await getOrgIdFromNameId(params.orgId);
  if (!orgId) {
    return NextResponse.json(
      { message: "Organization not found" },
      { status: 404 },
    );
  }

  const body = await req.json();
  const validatedData = updateOrgSchema.parse(body);

  const [updatedOrg] = await db
    .update(orgs)
    .set(validatedData)
    .where(eq(orgs.id, orgId))
    .returning();

  await invalidateCacheKey(`org:${orgId}`);

  return updatedOrg
    ? NextResponse.json(updatedOrg)
    : NextResponse.json({ message: "Organization not found" }, { status: 404 });
}
