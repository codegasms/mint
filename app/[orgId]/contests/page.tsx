"use client";

import { GenericListing, ColumnDef } from "@/mint/generic-listing";
import { GenericEditor, Field } from "@/mint/generic-editor";
import { Contest, mockContests } from "./mockData";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { useToast } from "@/hooks/use-toast";
import { formatValidationErrors } from "@/utils/error";
import { MockAlert } from "@/components/mock-alert";
import { z } from "zod";
import { timeAgo } from "@/lib/utils";

const columns: ColumnDef<Contest>[] = [
  { header: "Contest ID", accessorKey: "nameId", sortable: true },
  { header: "Title", accessorKey: "name", sortable: true },
  // { header: "Description", accessorKey: "description" },
  { header: "Start Time", accessorKey: "startTime", sortable: true },
  { header: "End Time", accessorKey: "endTime", sortable: true },
  { header: "Problems", accessorKey: "problems" },
  { header: "Problem Count", accessorKey: "problemCount" },
];

const fields: Field[] = [
  { name: "name", label: "Title", type: "text" },
  {
    name: "nameId",
    label: "Contest ID",
    type: "text",
    placeholder: "Unique contest ID",
  },
  { name: "description", label: "Description", type: "textarea" },
  { name: "startTime", label: "Start Time", type: "datetime" },
  { name: "endTime", label: "End Time", type: "datetime" },
  {
    name: "problems",
    label: "Problems",
    type: "text",
    placeholder: "Comma-separated problem IDs",
  },
  { name: "rules", label: "Rules", type: "textarea" },
];

const contestSchema = z.object({
  id: z.number().optional(),
  name: z.string().min(2).max(100),
  nameId: z.string().min(2).max(50),
  description: z.string(),
  startTime: z.string(),
  endTime: z.string(),
  problems: z.string(),
  rules: z.string().default(""),
}) as z.ZodType<Contest, z.ZodTypeDef, Contest>;

const injectProblemsCount = (contests: Contest[]) => {
  if (!contests || !Array.isArray(contests)) {
    return [];
  }
  return contests.map((contest) => ({
    ...contest,
    problemCount: contest.problems?.split(",").length || 0,
  }));
};

export default function ContestsPage() {
  const params = useParams();
  const orgId = params.orgId as string;
  const { toast } = useToast();

  const [contests, setContests] = useState<Contest[]>([]);
  const [selectedContest, setSelectedContest] = useState<Contest | null>(null);
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [showMockAlert, setShowMockAlert] = useState(false);

  useEffect(() => {
    const fetchContests = async () => {
      try {
        const response = await fetch(`/api/orgs/${orgId}/contests`);
        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          throw new Error(formatValidationErrors(errorData));
        }
        const data = await response.json();
        for (const contest of data.data) {
          contest.startTime = timeAgo(contest.startTime);
          contest.endTime = timeAgo(contest.endTime);
        }
        setContests(injectProblemsCount(data.data || []));
        setShowMockAlert(false);
      } catch (error) {
        console.error("Error fetching contests:", error);
        toast({
          variant: "destructive",
          title: "Error",
          description:
            error instanceof Error ? error.message : "Failed to fetch contests",
        });
        // Fallback to mock data in case of error
        setContests(injectProblemsCount(mockContests));
        setShowMockAlert(true);
      }
    };
    fetchContests();
  }, [orgId, toast]);

  const deleteContest = async (contest: Contest) => {
    try {
      const response = await fetch(
        `/api/orgs/${orgId}/contests/${contest.nameId}`,
        {
          method: "DELETE",
        },
      );

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(formatValidationErrors(errorData));
      }

      setContests((prevContests) =>
        prevContests.filter((c) => c.id !== contest.id),
      );
      toast({
        title: "Success",
        description: "Contest deleted successfully",
      });
      return Promise.resolve();
    } catch (error) {
      console.error("Error deleting contest:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description:
          error instanceof Error ? error.message : "Failed to delete contest",
      });
      return Promise.reject(error);
    }
  };

  const saveContest = async (contest: Contest) => {
    try {
      const contestWithDefaults = {
        ...contest,
        rules: contest.rules || "",
        registrationStartTime:
          contest.registrationStartTime || contest.startTime,
        registrationEndTime: contest.registrationEndTime || contest.startTime,
      };

      const url = selectedContest
        ? `/api/orgs/${orgId}/contests/${selectedContest.nameId}`
        : `/api/orgs/${orgId}/contests`;

      const response = await fetch(url, {
        method: selectedContest ? "PATCH" : "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(contestWithDefaults),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(formatValidationErrors(errorData));
      }

      const savedContest = await response.json();

      if (selectedContest) {
        setContests((prevContests) =>
          prevContests.map((c) =>
            c.id === savedContest.id ? savedContest : c,
          ),
        );
        toast({
          title: "Success",
          description: "Contest updated successfully",
        });
      } else {
        const contestWithProblemCount = {
          ...savedContest,
          problemCount: savedContest.problems?.split(",").length || 0,
        };
        setContests((prevContests) => [
          ...prevContests,
          contestWithProblemCount,
        ]);
        toast({
          title: "Success",
          description: "Contest created successfully",
        });
      }

      setIsEditorOpen(false);
    } catch (error) {
      console.error("Error saving contest:", error);
      toast({
        variant: "destructive",
        title: "Validation Error",
        description:
          error instanceof Error ? error.message : "Failed to save contest",
      });
      throw error;
    }
  };

  return (
    <>
      <MockAlert show={showMockAlert} />
      <GenericListing
        data={contests}
        columns={columns}
        title="Contests"
        searchableFields={["name", "description"]}
        onAdd={() => {
          setSelectedContest(null);
          setIsEditorOpen(true);
        }}
        onEdit={(contest) => {
          setSelectedContest(contest);
          setIsEditorOpen(true);
        }}
        onDelete={deleteContest}
        rowClickAttr="nameId"
      />

      <GenericEditor
        data={selectedContest}
        isOpen={isEditorOpen}
        onClose={() => setIsEditorOpen(false)}
        onSave={saveContest}
        schema={contestSchema as any}
        fields={fields}
        title="Contest"
      />
    </>
  );
}
