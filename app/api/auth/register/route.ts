import { NextRequest, NextResponse } from "next/server";
import { registerSchema } from "@/lib/validations";
import { db } from "@/db/drizzle";
import { users } from "@/db/schema";
import { eq } from "drizzle-orm";
import { generateSessionToken, createSession } from "@/lib/server/session";
import { setSessionTokenCookie } from "@/lib/server/cookies";
import { hashPassword } from "@/lib/password";
import { generateUsername } from "@/lib/username";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validatedData = registerSchema.parse(body);

    const existingUser = await db.query.users.findFirst({
      where: eq(users.email, validatedData.email),
    });

    if (existingUser) {
      return NextResponse.json(
        { error: "Email already exists" },
        { status: 400 },
      );
    }

    const hashedPassword = await hashPassword(validatedData.password);

    const nameId = await generateUsername(validatedData.email);
    const [user] = await db
      .insert(users)
      .values({
        email: validatedData.email,
        hashedPassword: hashedPassword,
        name: validatedData.name,
        nameId,
      })
      .returning();

    const token = generateSessionToken();
    const session = await createSession(token, user.id);
    await setSessionTokenCookie(token, session.expiresAt);

    return NextResponse.json({
      _id: user.id,
      email: user.email,
      name: user.name,
      nameId: user.nameId,
      //   role: user.role,
    });
  } catch (error) {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
}
