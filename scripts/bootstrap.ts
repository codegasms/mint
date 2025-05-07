import { db } from "../db/drizzle";
import {
  users,
  orgs,
  memberships,
  contests,
  problems,
  testCases,
} from "../db/schema";
import { hash } from "bcryptjs";
import {
  users as seedUsers,
  organization,
  contests as seedContests,
  problems as seedProblems,
} from "./bootstrap.data";
import type { InsertUser } from "../db/schema";

type UserWithRole = {
  id: number;
  email: string;
  nameId: string;
  name: string;
  hashedPassword: string;
  createdAt: Date;
  isSuperuser: boolean;
  about: string | null;
  avatar: string | null;
  role: "owner" | "admin" | "member";
};

type MembershipRole = "owner" | "member" | "organizer";

async function bootstrap() {
  try {
    // Create users with hashed passwords
    const createdUsers = await Promise.all(
      seedUsers.map(async (user) => {
        const hashedPassword = await hash("hello world", 10);
        const [createdUser] = await db
          .insert(users)
          .values({
            ...user,
            hashedPassword,
          })
          .returning();
        return { ...createdUser, role: user.role } as UserWithRole;
      }),
    );

    // Create organization
    const [org] = await db.insert(orgs).values(organization).returning();

    // Create memberships
    await db.insert(memberships).values(
      createdUsers.map((user) => {
        const role: MembershipRole =
          user.role === "admin"
            ? "organizer"
            : user.role === "owner"
              ? "owner"
              : "member";
        return {
          userId: user.id,
          orgId: org.id,
          role,
        };
      }),
    );

    // Create problems with test cases
    for (const problem of seedProblems) {
      const { testCases: problemTestCases, ...problemData } = problem;
      const [createdProblem] = await db
        .insert(problems)
        .values({
          ...problemData,
          orgId: org.id,
        })
        .returning();

      await db.insert(testCases).values(
        problemTestCases.map((testCase) => ({
          input: testCase.input,
          output: testCase.output,
          kind: testCase.kind as "example" | "test",
          problemId: createdProblem.id,
        })),
      );
    }

    // Create contests
    const createdContests = await Promise.all(
      seedContests.map(async (contest) => {
        const [createdContest] = await db
          .insert(contests)
          .values({
            nameId: contest.nameId,
            name: contest.name,
            description: contest.description,
            rules: contest.rules,
            registrationStartTime: new Date(
              contest.startTime.getTime() - 7 * 24 * 60 * 60 * 1000,
            ), // 7 days before
            registrationEndTime: new Date(
              contest.startTime.getTime() - 1 * 60 * 60 * 1000,
            ), // 1 hour before
            startTime: contest.startTime,
            endTime: contest.endTime,
            organizerId: org.id,
            organizerKind: "org",
            allowList: [],
            disallowList: [],
          })
          .returning();

        return createdContest;
      }),
    );

    console.log("Database bootstrapped successfully!");
    process.exit(0);
  } catch (error) {
    console.error("Error bootstrapping database:", error);
    process.exit(1);
  }
}

// Run bootstrap if this file is executed directly
if (require.main === module) {
  bootstrap();
}

export { bootstrap };
