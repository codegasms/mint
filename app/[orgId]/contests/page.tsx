"use client";

import { GenericListing, ColumnDef } from "@/mint/generic-listing";
import { GenericEditor, Field } from "@/mint/generic-editor";
import { Contest, mockContests } from "./mockData";
import { useEffect, useState } from "react";
import { z } from "zod";
import { fetchApi } from "@/lib/client/fetch";

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
  { name: "startTime", label: "Start Time", type: "date" },
  { name: "endTime", label: "End Time", type: "date" },
  {
    name: "problems",
    label: "Problems",
    type: "text",
    placeholder: "Comma-separated problem IDs",
  },
];

const contestSchema = z.object({
  id: z.number().optional(),
  name: z.string().min(2).max(100),
  nameId: z.string().min(2).max(50),
  description: z.string(),
  startTime: z.string(),
  endTime: z.string(),
  problems: z.string(),
});

const injectProblemsCount = (contests: Contest[]) => {
  return contests.map((contest) => ({
    ...contest,
    problemCount: contest.problems.split(",").length,
  }));
};

export default function ContestsPage() {
  const [contests, setContests] = useState<Contest[]>([]);
  const [selectedContest, setSelectedContest] = useState<Contest | null>(null);
  const [isEditorOpen, setIsEditorOpen] = useState(false);

  useEffect(() => {
    // Simulate API call

    const fetchData = async () => {
      
      try { 
      const mydata = await fetchApi("/me");
      console.log("testing",mydata.orgs[0].nameId);

      const ContestsData = await fetch(`/api/orgs/${mydata.orgs[0].nameId}/contests`);
      console.log("the group data",ContestsData);

    setContests(injectProblemsCount(ContestsData));
      }catch (error) {
        console.error("Error fetching group data:", error);
      }
    };
    fetchData();
  }, []);

  const deleteContest = async (contest: Contest) => {
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 500));

      // Update the state after successful API call
      setContests((prevContests) =>
        prevContests.filter((c) => c.id !== contest.id),
      );
      return Promise.resolve();
    } catch (error) {
      return Promise.reject(error);
    }
  };

  const saveContest = async (contest: Contest) => {
    if (selectedContest) {
      // Update existing contest
      setContests(contests.map((c) => (c.id === contest.id ? contest : c)));
    } else {
      // Add new contest
      setContests([...contests, { ...contest, id: Date.now() }]);
    }
    setIsEditorOpen(false);
  };

  return (
    <>
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
        schema={contestSchema}
        fields={fields}
        title="Contest"
      />
    </>
  );
}
