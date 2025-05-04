import { NextRequest, NextResponse } from "next/server";
import { searchUsers } from "@/lib/typesense/collections/users";
import { safeSearch } from "@/lib/typesense/client";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const query = searchParams.get("q") || "";
  const page = parseInt(searchParams.get("page") || "1", 10);
  const per_page = parseInt(searchParams.get("per_page") || "10", 10);

  try {
    const results = await safeSearch(
      () => searchUsers(query, { page, per_page }),
      { found: 0, hits: [], page },
    );
    return NextResponse.json(results);
  } catch (error) {
    return NextResponse.json({ error: "Search failed" }, { status: 500 });
  }
}
