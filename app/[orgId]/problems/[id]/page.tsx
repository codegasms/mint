"use client";

import { CodeEditor } from "@/components/code-editor";
import { notFound } from "next/navigation";
import { useEffect, useState } from "react";
// import { getProblemIdFromCode } from "@/app/api/orgs/[orgId]/problems/service";

export default function Page({
  params,
}: {
  params: { orgId: string; id: string };
}) {
  const [problem, setProblem] = useState(null);

  useEffect(() => {
    async function getProblem(orgId: string, problemId: string) {
      console.log(`ENV: ${process.env.NEXT_PUBLIC_APP_URL}`, orgId, problemId);

      try {
        // const problemIdNumber = await getProblemIdFromCode(orgId, problemId);

        const response = await fetch(
          `/api/orgs/${orgId}/problems/${problemId}`,
          {
            cache: "no-store",
          },
        );

        if (!response.ok) {
          throw new Error("Failed to fetch problem");
        }

        // Return the problem without adding contestId
        const problem = await response.json();
        return {
          ...problem,
          orgId,
          // No contestId here, as this is a standalone problem
        };
      } catch (error) {
        console.error("Error fetching problem:", error);
        return null;
      }
    }

    getProblem(params.orgId, params.id).then((result) => {
      if (!result) {
        notFound();
      }
      setProblem(result);
    });
  }, [params.orgId, params.id]);

  if (!problem) {
    return null;
  }

  return (
    <>
      <CodeEditor problem={problem} />
    </>
  );
}
