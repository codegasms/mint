import { NextRequest, NextResponse } from "next/server";
import { searchProblems } from "@/lib/typesense/collections/problems";
import { safeSearch } from "@/lib/typesense/client";

export async function GET(
  request: NextRequest,
  { params }: { params: { orgId: string } },
) {
  const searchParams = request.nextUrl.searchParams;
  const query = searchParams.get("q") || "";
  const page = parseInt(searchParams.get("page") || "1", 10);
  const per_page = parseInt(searchParams.get("per_page") || "10", 10);
  const orgId = parseInt(params.orgId, 10);

  try {
    const results = await safeSearch(
      () => searchProblems(query, orgId, { page, per_page }),
      { found: 0, hits: [], page },
    );
    return NextResponse.json(results);
  } catch (error) {
    console.error("Problems search error:", error);
    return NextResponse.json({ error: "Search failed" }, { status: 500 });
  }
}
