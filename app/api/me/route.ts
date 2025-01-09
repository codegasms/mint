import { NextResponse } from "next/server";
import { getCurrentSession } from "@/lib/server/session";
import { getUserWithOrgs } from "./service";

export async function GET() {
  try {
    const { session } = await getCurrentSession();

    if (!session || !session.userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await getUserWithOrgs(session.userId);
    console.log(user);
    

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json(user);
  } catch (error) {
    console.error("Error in me route:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
