import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { createContest } from "./service";
import { db } from "@/db/drizzle";
import { contests } from "@/db/schema";
import { count, eq } from "drizzle-orm";
import { createContestSchema } from "@/lib/validations";
import { IdSchema } from "@/app/api/types";

export async function POST(
  request: NextRequest,
  { params }: { params: { orgId: string } },
) {
  try {
    const orgId = IdSchema.parse(params.orgId);
    const data = createContestSchema.parse(await request.json());
    const contest = await createContest(orgId, data);
    return NextResponse.json(contest, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ errors: error.errors }, { status: 400 });
    }
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 },
    );
  }
}

export async function GET(
  req: NextRequest,
  { params }: { params: { orgId: string } },
) {
  const { searchParams } = req.nextUrl;
  const limit = Number(searchParams.get("limit") || 10);
  const offset = Number(searchParams.get("offset") || 0);

  const results = await db.query.contests.findMany({
    where: eq(contests.organizerId, Number(params.orgId)),
    limit,
    offset,
  });

  const total = await db
    .select({ count: count() })
    .from(contests)
    .where(eq(contests.organizerId, Number(params.orgId)));

  return NextResponse.json({
    data: results,
    total: total[0].count,
    limit,
    offset,
  });
}
