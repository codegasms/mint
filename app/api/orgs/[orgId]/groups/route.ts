import { z } from "zod";
import { NextRequest } from "next/server";
import { createGroupSchema } from "@/lib/validations";
import * as groupService from "./service";
import { NameIdSchema } from "@/app/api/types";
import { getOrgIdFromNameId } from "@/app/api/service";

import { updateGroupSchema } from "@/lib/validations"; // Define schema for validation





export async function GET(
  _req: NextRequest,
  { params }: { params: { orgId: string } },
) {
  try {
    const orgId = await getOrgIdFromNameId(NameIdSchema.parse(params.orgId));

    const groups = await groupService.getGroups(orgId);
    return Response.json(groups);
  } catch (error) {
    return Response.json({ error: "Failed to fetch groups" }, { status: 500 });
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: { orgId: string } },
) {
  try {
    const orgId = await getOrgIdFromNameId(NameIdSchema.parse(params.orgId));
    const data = createGroupSchema.parse(await request.json());

    const group = await groupService.createGroup(orgId, data);
    return Response.json(group, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return Response.json({ error: error.errors }, { status: 400 });
    }
    return Response.json({ error: "Failed to create group" }, { status: 500 });
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: { orgId: string; groupId: string } } // Adding groupId as a dynamic parameter
) {
  try {
    const orgId = await getOrgIdFromNameId(NameIdSchema.parse(params.orgId));
    const groupId = params.groupId; // Extract groupId from the params
    const data = updateGroupSchema.parse(await request.json()); // Parse and validate incoming data

    const updatedGroup = await groupService.updateGroup(orgId, groupId, data); // Update group logic
    return Response.json(updatedGroup, { status: 200 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return Response.json({ error: error.errors }, { status: 400 });
    }
    return Response.json({ error: "Failed to update group" }, { status: 500 });
  }
}



export async function DELETE(
  _req: NextRequest,
  { params }: { params: { orgId: string; groupId: string } },
) {
  try {
    const orgId = await getOrgIdFromNameId(NameIdSchema.parse(params.orgId));
    const groupId = params.groupId;

    await groupService.deleteGroup(orgId, groupId); // Call service to delete group
    return Response.json({ message: "Group deleted successfully" }, { status: 200 });
  } catch (error) {
    return Response.json({ error: "Failed to delete group" }, { status: 500 });
  }
}