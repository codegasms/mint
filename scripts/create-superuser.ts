import { db } from "@/db/drizzle";
import { users, orgs, memberships, contests, problems, contestProblems, groups, groupMemberships, sessionTable, testCases } from "@/db/schema";
import { hashPassword } from "@/lib/password";
import { generateUsername } from "@/lib/username";
import * as readline from 'readline';

function prompt(question: string): Promise<string> {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });

  return new Promise((resolve) => {
    rl.question(question, (answer) => {
      rl.close();
      resolve(answer);
    });
  });
}

async function clearDatabase() {
  try {
    console.log("Clearing database...");
    
    // Delete tables in order to respect foreign key constraints
    await db.delete(groupMemberships);
    await db.delete(groups);
    await db.delete(contestProblems);
    await db.delete(testCases);
    await db.delete(problems);
    await db.delete(contests);
    await db.delete(memberships);
    await db.delete(sessionTable);
    await db.delete(orgs);
    await db.delete(users);
    
    console.log("Database cleared successfully!");
    return true;
  } catch (error) {
    console.error("Error clearing database:", error);
    throw error;
  }
}

async function main() {
  try {
    console.log("\n=== Create Superuser ===\n");
    
    // First, clear the database
    const shouldClear = await prompt("This will clear ALL data in the database. Continue? (y/n): ");
    if (shouldClear.toLowerCase() !== 'y') {
      console.log("Operation cancelled.");
      process.exit(0);
    }
    
    await clearDatabase();
    console.log("Database cleared. Creating superuser...\n");

    // Get email
    const email = await prompt("Enter email: ");
    if (!email.includes('@')) {
      throw new Error("Invalid email address");
    }

    // Get password
    const password = await prompt("Enter password (min 8 characters): ");
    if (password.length < 8) {
      throw new Error("Password must be at least 8 characters long");
    }

    // Confirm password
    const confirmPassword = await prompt("Confirm password: ");
    if (password !== confirmPassword) {
      throw new Error("Passwords do not match");
    }

    // Generate username from email
    const nameId = await generateUsername(email);

    // Create user
    const hashedPassword = await hashPassword(password);
    const [user] = await db.insert(users).values({
      nameId,
      name: email.split('@')[0], // Use part before @ as name
      email,
      hashedPassword,
      isSuperuser: true,
    }).returning();

    console.log("\nSuperuser created successfully!");
    console.log("Username:", nameId);
    console.log("Email:", email);

    process.exit(0);
  } catch (error) {
    console.error("\nFailed to create superuser:", error instanceof Error ? error.message : error);
    process.exit(1);
  }
}

main();