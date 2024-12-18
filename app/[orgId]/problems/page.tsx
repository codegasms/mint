"use client";

import { mockProblems, Problem } from "./mockProblems";
import { useToast } from "@/hooks/use-toast";
import { GenericListing, ColumnDef } from "@/mint/generic-listing";
import { useEffect, useState } from "react";

const columns: ColumnDef<Problem>[] = [
  { header: "Problem Code", accessorKey: "nameId", sortable: true },
  { header: "Title", accessorKey: "title", sortable: true },
  { header: "Allowed Languages", accessorKey: "allowedLanguages" },
  { header: "Created At", accessorKey: "createdAt", sortable: true },
];

export default function ProblemsPage({
  params,
}: {
  params: { orgId: string };
}) {
  const [problems, setProblems] = useState<Problem[]>([]);
  const [selectedProblem, setSelectedProblem] = useState<Problem | null>(null);
  const [isEditorOpen, setIsEditorOpen] = useState(false);

  const { toast } = useToast();

  useEffect(() => {
    const fetchProblems = async () => {
      try {
        const response = await fetch(`/api/orgs/${params.orgId}/problems`);
        if (!response.ok) throw new Error("Failed to fetch problems");
        const data = await response.json();
        setProblems(data && data.length ? data : mockProblems);
      } catch (error) {
        console.error("Error fetching problems:", error);
        setProblems(mockProblems);
      }
    };
    fetchProblems();
  }, [params.orgId]);

  const handleAdd = () => {
    setSelectedProblem(null);
    setIsEditorOpen(true);
  };

  // const handleEdit = (problem: Problem) => {
  //   setSelectedProblem(problem);
  //   setIsEditorOpen(true);
  // };

  const handleDelete = async (problem: Problem) => {
    try {
      const response = await fetch(
        `/api/orgs/${params.orgId}/problems/${problem.id}`,
        {
          method: "DELETE",
        },
      );
      if (!response.ok) throw new Error("Failed to delete problem");
      setProblems((prev) => prev.filter((p) => p.id !== problem.id));
    } catch (error) {
      console.error("Error deleting problem:", error);
    }
  };

  /*
  const handleSave = async (problem: Problem) => {
    try {
      const url = selectedProblem
        ? `/api/orgs/${params.orgId}/problems/${selectedProblem.id}`
        : `/api/orgs/${params.orgId}/problems`;

      const response = await fetch(url, {
        method: selectedProblem ? "PATCH" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...problem, orgId: parseInt(params.orgId) }),
      });

      if (!response.ok) throw new Error("Failed to save problem");
      const savedProblem = await response.json();

      setProblems((prev) => {
        if (selectedProblem) {
          return prev.map((p) =>
            p.id === selectedProblem.id ? savedProblem : p,
          );
        }
        return [...prev, savedProblem];
      });
    } catch (error) {
      console.error("Error saving problem:", error);
    }
  };
  */

  // const handleSavelocal = (updatedProblem: Problem) => {
  //   setProblems(
  //     problems.map((p) => (p.id === updatedProblem.id ? updatedProblem : p)),
  //   );
  //   toast({
  //     title: "Success!",
  //     description: "Problem updated successfully",
  //   });
  //   setIsEditorOpen(false);
  // };

  return (
    <>
      <GenericListing
        data={problems}
        columns={columns}
        title="Problems"
        searchableFields={["nameId", "title"]}
        onAdd={handleAdd}
        // onEdit={null}
        onDelete={handleDelete}
        allowDownload={true}
        addPage="new"
        editPathAttr="nameId"
        rowClickAttr="nameId"
        editPathSuffix="edit"
      />
      {/*
      <Dialog open={isEditorOpen} onOpenChange={setIsEditorOpen}>
        <DialogContent className="max-w-4xl">
          <ProblemEditor
            problem={selectedProblem}
            onClose={() => setIsEditorOpen(false)}
            onSave={handleSavelocal}
          />
        </DialogContent>
      </Dialog> */}
    </>
  );
}
