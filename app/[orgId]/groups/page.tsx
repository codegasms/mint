"use client";

import { GenericListing, ColumnDef } from "@/mint/generic-listing";
import { GenericEditor, Field } from "@/mint/generic-editor";
import { Group, mockGroups } from "./mockData";
import { useEffect, useState } from "react";
import { z } from "zod";
import { fetchApi } from "@/lib/client/fetch";

const columns: ColumnDef<{ id: string | number } & Group>[] = [
  { header: "Name", accessorKey: "name" as const },
  { header: "Name ID", accessorKey: "nameId" as const },
  { header: "About", accessorKey: "about" as const },
  { header: "Created At", accessorKey: "createdAt" as const },
  { header: "Users", accessorKey: "usersCount" as const },
];

const groupSchema = z.object({
  name: z.string().min(2).max(100),
  nameId: z
    .string()
    .min(3)
    .max(50)
    .regex(/^[a-z0-9-]+$/),
  about: z.string().optional(),
  users: z
    .string()
    .min(1)
    .refine((value) => value.split(/\r?\n/).length > 0, {
      message: "Must contain at least one email.",
    })
    .refine(
      (value) =>
        value.split(/\r?\n/).every((line) => line.trim().match(/^\S+@\S+$/)),
      {
        message: "Each line must be a valid email address.",
      },
    ),
});

const injectUsersCount = (groups: Group[]) => {
  return groups.map((group) => ({
    ...group,
    usersCount: group.users.split(/\r?\n/).length,
  }));
};

const fields: Field[] = [
  { name: "name", label: "Name", type: "text" },
  {
    name: "nameId",
    label: "Group ID",
    type: "text",
    placeholder: "Unique code/identifier for group",
  },
  { name: "about", label: "About", type: "textarea" },
  { name: "users", label: "Users (one email per line)", type: "textarea" },
];

export default function GroupsPage() {
  const [groups, setGroups] = useState<Group[]>([]);
  const [selectedGroup, setSelectedGroup] = useState<Group | null>(null);
  const [isEditorOpen, setIsEditorOpen] = useState(false);

  useEffect(() => {
    
    const fetchData = async () => {
      
      try {
       // Fetch user data after successful login
       const mydata = await fetchApi("/me");
        console.log("testing",mydata.orgs[0].nameId);

        const GroupData = await fetch(`/api/orgs/${mydata.orgs[0].nameId}/groups`);
        console.log("the group data",GroupData);
        setGroups(injectUsersCount(GroupData));
      } catch (error) {
        console.error("Error fetching group data:", error);
      }
    };
    fetchData();
  }, []);

  const deleteGroup = async (group: Group) => {
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 500));

      // Update the state after successful API call
      setGroups((prevGroups) => prevGroups.filter((g) => g.id !== group.id));
      return Promise.resolve();
    } catch (error) {
      return Promise.reject(error);
    }
  };

  const saveGroup = async (group: Group) => {
    const mydata = await fetchApi("/me");
    if (selectedGroup) {
      
      const groupdata = await fetch(`/api/orgs/${mydata.orgs[0].nameId}/groups`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(group),
      });
      console.log("the group data",groupdata);

      setGroups(
        injectUsersCount(groups.map((g) => (g.id === group.id ? group : g))),
      );
    } else {
      
      const groupdata = await fetch(`/api/orgs/${mydata.orgs[0].nameId}/groups`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(group),
      });
      console.log("the group data",groupdata);

      setGroups(
        injectUsersCount([
          ...groups,
          { ...group, id: Date.now(), createdAt: new Date().toISOString() },
        ]),
      );
    }
    setIsEditorOpen(false);
  };


  return (
    <>
      <GenericListing
        data={groups}
        columns={columns}
        title="Groups"
        searchableFields={["name", "nameId"]}
        onAdd={() => {
          setSelectedGroup(null);
          setIsEditorOpen(true);
        }}
        onEdit={(group) => {
          setSelectedGroup(group);
          setIsEditorOpen(true);
        }}
        onDelete={deleteGroup}
      />

      <GenericEditor
        data={selectedGroup}
        isOpen={isEditorOpen}
        onClose={() => setIsEditorOpen(false)}
        onSave={saveGroup}
        schema={groupSchema}
        fields={fields}
        title="Group"
      />
    </>
  );
}
