import { NextRequest, NextResponse } from "next/server";
import { filterSubmissions } from "@/lib/typesense/collections/submissions";
import { safeSearch } from "@/lib/typesense/client";

export async function GET(
  request: NextRequest,
  { params }: { params: { orgId: string } },
) {
  const searchParams = request.nextUrl.searchParams;
  const orgId = parseInt(params.orgId, 10);

  // Extract filter parameters
  const options = {
    userNameId: searchParams.get("user") || undefined,
    contestNameId: searchParams.get("contest") || undefined,
    problemNameId: searchParams.get("problem") || undefined,
    language: searchParams.get("language") || undefined,
    status: searchParams.get("status") || undefined,
    startTime: searchParams.get("start")
      ? parseInt(searchParams.get("start")!, 10)
      : undefined,
    endTime: searchParams.get("end")
      ? parseInt(searchParams.get("end")!, 10)
      : undefined,
    page: parseInt(searchParams.get("page") || "1", 10),
    per_page: parseInt(searchParams.get("per_page") || "10", 10),
  };

  try {
    const query = searchParams.get("q") || "";
    const results = await safeSearch(
      () => searchSubmissions(query, orgId, options),
      { found: 0, hits: [], page: options.page },
    );
    return NextResponse.json(results);
  } catch (error) {
    console.error("Submissions search error:", error);
    return NextResponse.json({ error: "Search failed" }, { status: 500 });
  }
}
