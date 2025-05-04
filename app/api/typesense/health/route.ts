import { testTypesenseConnection } from "@/lib/typesense/test-connection";
import { NextResponse } from "next/server";

export async function GET() {
  const isHealthy = await testTypesenseConnection();

  if (!isHealthy) {
    return NextResponse.json(
      { error: "Typesense connection failed" },
      { status: 500 },
    );
  }

  return NextResponse.json({ status: "healthy" });
}
