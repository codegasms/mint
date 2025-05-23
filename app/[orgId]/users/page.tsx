"use client";

import { GenericListing, ColumnDef } from "@/mint/generic-listing";
import { GenericEditor, Field } from "@/mint/generic-editor";
import { inviteUserSchema } from "@/lib/validations";
import { useEffect, useState, useCallback } from "react";
import { useToast } from "@/hooks/use-toast";
import { formatValidationErrors } from "@/utils/error";
import { MockAlert } from "@/components/mock-alert";
import { User, mockUsers } from "./mockUsers";
import { timeAgo } from "@/lib/utils";

interface InviteUserData {
  email: string;
  role: "owner" | "organizer" | "member";
}

const columns: ColumnDef<User>[] = [
  { header: "Name", accessorKey: "name" },
  { header: "Username", accessorKey: "nameId" },
  { header: "Email", accessorKey: "email" },
  { header: "Role", accessorKey: "role" },
  { header: "Joined", accessorKey: "joinedAt" },
  {
    header: "About",
    accessorKey: "about",
  },
];

const fields: Field[] = [
  { name: "email", label: "Email", type: "text" },
  {
    name: "role",
    label: "Role",
    type: "select",
    options: [
      { value: "member", label: "Member" },
      { value: "organizer", label: "Organizer" },
      { value: "owner", label: "Owner" },
    ],
  },
];

function makeJoinedAtReadable(users: User[]) {
  return users.map((user) => {
    return {
      ...user,
      joinedAt: timeAgo(user.joinedAt),
    };
  });
}

export default function UsersPage({
  params: { orgId },
}: {
  params: { orgId: string };
}) {
  const { toast } = useToast();
  const [users, setUsers] = useState<User[]>([]);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [showMockAlert, setShowMockAlert] = useState(false);

  const fetchUsers = useCallback(async () => {
    try {
      const response = await fetch(`/api/orgs/${orgId}/users`);
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(formatValidationErrors(errorData));
      }
      const data: User[] = makeJoinedAtReadable(await response.json());
      for (const user of data) {
        if (!user.about) {
          user.about = "No description";
        }
      }
      setUsers(data);
      setShowMockAlert(false);
    } catch (error) {
      console.error("Error fetching users:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description:
          error instanceof Error ? error.message : "Failed to fetch users",
      });
      setUsers(makeJoinedAtReadable(mockUsers));
      setShowMockAlert(true);
    }
  }, [orgId, toast, setUsers, setShowMockAlert]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const inviteUser = async (data: InviteUserData) => {
    try {
      const response = await fetch(`/api/orgs/${orgId}/users`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(formatValidationErrors(errorData));
      }

      await fetchUsers();
      setIsEditorOpen(false);
      toast({
        title: "Success",
        description: "User invited successfully",
      });
      return Promise.resolve();
    } catch (error) {
      console.error("Error inviting user:", error);
      toast({
        variant: "destructive",
        title: "Validation Error",
        description:
          error instanceof Error ? error.message : "Failed to invite user",
      });
      return Promise.reject(error);
    }
  };

  const deleteUser = async (user: User) => {
    try {
      const response = await fetch(`/api/orgs/${orgId}/users/${user.nameId}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        const errorMessage =
          errorData.message || formatValidationErrors(errorData);
        throw new Error(errorMessage);
      }

      await fetchUsers();
      toast({
        title: "Success",
        description: "User removed successfully",
      });
      return Promise.resolve();
    } catch (error) {
      console.error("Error removing user:", error);
      return Promise.reject(error);
    }
  };

  const handleCsvUpload = async (file: File) => {
    try {
      const formData = new FormData();
      formData.append("file", file);

      const response = await fetch(`/api/orgs/${orgId}/users/csv`, {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(formatValidationErrors(errorData));
      }

      const result = await response.json();
      await fetchUsers();

      const failedCount = result.results?.filter(
        (r: any) => r.status === "error",
      ).length;

      if (failedCount > 0) {
        console.error("Failed imports details:", {
          failures: result.results.filter((r: any) => r.status === "error"),
          stackTraces: result.results
            .filter((r: any) => r.status === "error")
            .map((r: any) => ({ email: r.email, error: r.error })),
        });
      }

      toast({
        variant: failedCount > 0 ? "destructive" : "default",
        title: failedCount > 0 ? "Warning" : "Success",
        description:
          failedCount > 0
            ? `${result.message} (${failedCount} failed imports. Check console for details)`
            : result.message,
      });
    } catch (error) {
      console.error("Error uploading CSV:", {
        error,
        stack: error instanceof Error ? error.stack : undefined,
      });
      toast({
        variant: "destructive",
        title: "Error",
        description:
          error instanceof Error ? error.message : "Failed to upload CSV",
      });
    }
  };

  return (
    <>
      <MockAlert show={showMockAlert} />
      <GenericListing
        data={users}
        columns={columns}
        title="Users"
        searchableFields={["name", "email", "nameId"]}
        onAdd={() => {
          setSelectedUser(null);
          setIsEditorOpen(true);
        }}
        onDelete={deleteUser}
        allowCsvUpload={true}
        onCsvUpload={handleCsvUpload}
      />

      <GenericEditor
        data={selectedUser}
        isOpen={isEditorOpen}
        onClose={() => setIsEditorOpen(false)}
        onSave={inviteUser}
        schema={inviteUserSchema}
        fields={fields}
        title="Invite User"
      />
    </>
  );
}
