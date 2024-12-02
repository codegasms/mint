import { z } from "zod";

// Common Types
export const NameIdSchema = z
  .string()
  .regex(/^[a-z0-9-]+$/)
  .min(2)
  .max(50);
export const EmailSchema = z.string().email();
export const TimestampSchema = z.coerce.date();

// User Schemas
export const createUserSchema = z.object({
  nameId: NameIdSchema,
  name: z.string().min(2).max(100),
  email: EmailSchema,
  password: z.string().min(8),
  about: z.string().optional(),
  avatar: z.string().optional(),
});

export const updateUserSchema = createUserSchema
  .partial()
  .omit({ email: true });

// Organization Schemas
export const createOrgSchema = z.object({
  nameId: NameIdSchema,
  name: z.string().min(2).max(100),
  about: z.string().optional(),
  avatar: z.string().optional(),
});

export const updateOrgSchema = createOrgSchema.partial();

export const createMembershipSchema = z.object({
  userId: z.number().int().positive(),
  role: z.enum(["owner", "organizer", "member"]),
});

// Contest Schemas
export const createContestSchema = z.object({
  nameId: NameIdSchema,
  name: z.string().min(2).max(100),
  description: z.string(),
  rules: z.string(),
  registrationStartTime: TimestampSchema,
  registrationEndTime: TimestampSchema,
  startTime: TimestampSchema,
  endTime: TimestampSchema,
  allowList: z.array(z.string()),
  disallowList: z.array(z.string()),
});

// Group Schemas
export const createGroupSchema = z.object({
  nameId: NameIdSchema,
  name: z.string().min(2).max(100),
  description: z.string().optional(),
});

export const updateGroupSchema = createGroupSchema.partial();

// Problem Schemas
export const createProblemSchema = z.object({
  nameId: NameIdSchema,
  name: z.string().min(2).max(100),
  statement: z.string(),
  timeLimit: z.number().int().positive(),
  memoryLimit: z.number().int().positive(),
});

export const updateProblemSchema = createProblemSchema.partial();

// Test Case Schema
export const createTestCaseSchema = z.object({
  input: z.string(),
  output: z.string(),
  isExample: z.boolean().optional(),
});

// Participant Schema
export const createParticipantSchema = z.object({
  userId: z.number().int().positive(),
});
