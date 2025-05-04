import {
  SelectProblem,
  SelectContest,
  SelectUser,
  SelectOrg,
} from "@/db/schema";
import { upsertProblem, deleteProblem } from "./collections/problems";
import { upsertContest, deleteContest } from "./collections/contests";
import { upsertUser, deleteUser } from "./collections/users";
import { upsertOrg, deleteOrg } from "./collections/orgs";

// Problem sync hooks
export async function syncProblemCreate(problem: SelectProblem) {
  try {
    await upsertProblem(problem);
  } catch (error) {
    console.error("Failed to sync problem creation:", error);
  }
}

export async function syncProblemUpdate(problem: SelectProblem) {
  try {
    await upsertProblem(problem);
  } catch (error) {
    console.error("Failed to sync problem update:", error);
  }
}

export async function syncProblemDelete(id: number) {
  try {
    await deleteProblem(id);
  } catch (error) {
    console.error("Failed to sync problem deletion:", error);
  }
}

// Contest sync hooks
export async function syncContestCreate(contest: SelectContest) {
  try {
    await upsertContest(contest);
  } catch (error) {
    console.error("Failed to sync contest creation:", error);
  }
}

export async function syncContestUpdate(contest: SelectContest) {
  try {
    await upsertContest(contest);
  } catch (error) {
    console.error("Failed to sync contest update:", error);
  }
}

export async function syncContestDelete(id: number) {
  try {
    await deleteContest(id);
  } catch (error) {
    console.error("Failed to sync contest deletion:", error);
  }
}

// User sync hooks
export async function syncUserCreate(user: SelectUser) {
  try {
    await upsertUser(user);
  } catch (error) {
    console.error("Failed to sync user creation:", error);
  }
}

export async function syncUserUpdate(user: SelectUser) {
  try {
    await upsertUser(user);
  } catch (error) {
    console.error("Failed to sync user update:", error);
  }
}

export async function syncUserDelete(id: number) {
  try {
    await deleteUser(id);
  } catch (error) {
    console.error("Failed to sync user deletion:", error);
  }
}

// Organization sync hooks
export async function syncOrgCreate(org: SelectOrg) {
  try {
    await upsertOrg(org);
  } catch (error) {
    console.error("Failed to sync organization creation:", error);
  }
}

export async function syncOrgUpdate(org: SelectOrg) {
  try {
    await upsertOrg(org);
  } catch (error) {
    console.error("Failed to sync organization update:", error);
  }
}

export async function syncOrgDelete(id: number) {
  try {
    await deleteOrg(id);
  } catch (error) {
    console.error("Failed to sync organization deletion:", error);
  }
}
