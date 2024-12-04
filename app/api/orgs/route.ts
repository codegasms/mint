import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db/drizzle";
import { orgs } from "@/db/schema";
import { count } from "drizzle-orm";
import { createOrg } from "./service";

export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl;
  const limit = Number(searchParams.get("limit") || 10);
  const offset = Number(searchParams.get("offset") || 0);

  const results = await db.select().from(orgs).limit(limit).offset(offset);
  const total = await db.select({ count: count() }).from(orgs);
  console.log("HERE");

  return NextResponse.json({
    data: results,
    total: total[0].count,
    limit,
    offset,
  });
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const org = await createOrg(body);
    return NextResponse.json(org, { status: 201 });
  } catch (error) {
    console.error("Error creating organization:", error);
    return NextResponse.json(
      { error: "Failed to create organization" },
      { status: 500 },
    );
  }
}
