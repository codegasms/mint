"use client";

import { CodeEditor } from "@/components/code-editor";
import { notFound } from "next/navigation";
import { useEffect, useState } from "react";

export default function Page({
  params,
}: {
  params: { orgId: string; id: string; problemId: string };
}) {
  const [problem, setProblem] = useState(null);

  useEffect(() => {
    async function getProblem(
      orgId: string,
      contestId: string,
      problemId: string,
    ) {
      console.log(
        `ENV: ${process.env.NEXT_PUBLIC_APP_URL}`,
        orgId,
        contestId,
        problemId,
      );

      try {
        // Fetch the problem with contest context
        const response = await fetch(
          `/api/orgs/${orgId}/contests/${contestId}/problems/${problemId}`,
          {
            cache: "no-store",
          },
        );

        if (!response.ok) {
          throw new Error("Failed to fetch problem");
        }

        const problem = await response.json();

        // Add the contest ID to the problem data
        return {
          ...problem,
          contestNameId: contestId,
          orgId,
        };
      } catch (error) {
        console.error("Error fetching problem:", error);
        return null;
      }
    }

    getProblem(params.orgId, params.id, params.problemId).then((result) => {
      if (!result) {
        notFound();
      }
      setProblem(result);
    });
  }, [params.orgId, params.id, params.problemId]);

  if (!problem) {
    return null;
  }

  return (
    <>
      <CodeEditor problem={problem} />
    </>
  );
}
