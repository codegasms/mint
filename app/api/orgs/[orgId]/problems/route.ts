import { createProblemSchema, createTestCaseSchema } from "@/lib/validations";
import * as problemService from "./service";
import { getOrgIdFromNameId } from "@/app/api/service";
import { NextRequest, NextResponse } from "next/server";
import { NameIdSchema } from "@/app/api/types";
import { problemSchema } from "@/lib/validations";
import { z } from "zod";
import { invalidateCacheKey } from "@/lib/cache/utils";

export async function GET(
  _req: NextRequest,
  { params }: { params: { orgId: string } },
) {
  try {
    const orgId = await getOrgIdFromNameId(NameIdSchema.parse(params.orgId));
    const problems = await problemService.getOrgProblems(orgId);
    const validatedProblems = z.array(problemSchema).parse(problems);
    return NextResponse.json(validatedProblems);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors }, { status: 400 });
    }
    if (error instanceof Error && error.message === "Organization not found") {
      return NextResponse.json({ error: error.message }, { status: 404 });
    }
    return NextResponse.json(
      { error: "Failed to fetch problems" },
      { status: 500 },
    );
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: { orgId: string } },
) {
  try {
    const orgId = await getOrgIdFromNameId(NameIdSchema.parse(params.orgId));
    const body = await request.json();
    console.log("body", request.body);

    const { testCases, ...problemData } = body;
    console.log("testCases", testCases);
    const validatedProblem = createProblemSchema.parse(body);
    const validatedTestCases = z
      .array(createTestCaseSchema)
      .min(1)
      .parse(testCases);

    const problem = await problemService.createProblem(
      orgId,
      validatedProblem,
      validatedTestCases,
    );

    await invalidateCacheKey(`org:problems:${orgId}`);

    return NextResponse.json(problem, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      console.log(error.errors);
      return NextResponse.json({ error: error.errors }, { status: 400 });
    }
    return NextResponse.json(
      { error: "Failed to create problem" },
      { status: 500 },
    );
  }
}
