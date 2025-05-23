"use client";

import { CalendarIcon, ClockIcon } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";

// Default data as fallback
const defaultContestData = {
  name: "Default Contest",
  nameId: "default-contest",
  description: "This is a default contest description.",
  startTime: "2024-07-01T09:00:00Z",
  endTime: "2025-07-01T17:00:00Z",
  problems: [
    { id: "default-1", title: "Default Problem 1" },
    { id: "default-2", title: "Default Problem 2" },
  ],
};

export default function ContestDetailsPage() {
  const params = useParams();
  const orgId = params.orgId as string;
  const contestId = params.id as string;

  const [contestData, setContestData] = useState(defaultContestData);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [userRole, setUserRole] = useState<string | null>(null);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const res = await fetch("/api/me");
        if (!res.ok) {
          throw new Error("Failed to fetch user data");
        }
        const userData = await res.json();

        // Find the user's role in the current organization
        const currentOrg = userData.orgs.find(
          (org: any) => org.nameId === orgId,
        );
        if (currentOrg) {
          setUserRole(currentOrg.role);
        }
      } catch (err) {
        console.error("Error fetching user data:", err);
      }
    };

    fetchUserData();
  }, [orgId]);

  useEffect(() => {
    const fetchContestData = async () => {
      try {
        setIsLoading(true);
        const url = `/api/orgs/${orgId}/contests/${contestId}`;
        console.log(`Fetching contest data from: ${url}`);

        const res = await fetch(url);

        if (!res.ok) {
          console.error(
            `Failed to fetch contest data: ${res.status} ${res.statusText}`,
          );
          throw new Error(`Failed to fetch contest data: ${res.status}`);
        }

        const data = await res.json();
        console.log("Successfully fetched contest data:", data);

        // Convert comma-separated problem IDs to the expected format
        const problemsArray = data.problems.split(",").map((id: string) => ({
          id: id.trim(),
          title: `Problem ${id.trim()}`,
        }));

        setContestData({
          ...data,
          problems: problemsArray,
        });
        setError(null);
      } catch (err) {
        console.error("Error fetching contest data:", err);
        setError(
          err instanceof Error ? err.message : "An unknown error occurred",
        );
      } finally {
        setIsLoading(false);
      }
    };

    if (orgId && contestId) {
      fetchContestData();
    }
  }, [orgId, contestId]);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      timeZoneName: "short",
    });
  };

  const getContestStatus = () => {
    const now = new Date();
    const startTime = new Date(contestData.startTime);
    const endTime = new Date(contestData.endTime);
    if (now < startTime) {
      // TODO: add in how many hours/days left
      return {
        text: "Upcoming",
        color: "text-yello-500",
        dotColor: "bg-yellow-500",
        animate: false,
      };
    } else if (now >= startTime && now <= endTime) {
      return {
        text: "Live",
        color: "text-green-500",
        dotColor: "bg-green-500",
        animate: true,
      };
    } else {
      return {
        text: "Contest is over",
        color: "text-primary-muted",
        dotColor: "bg-gray-400",
        animate: false,
      };
    }
  };

  const status = getContestStatus();

  // Determine if problems should be shown
  const shouldShowProblems = () => {
    const now = new Date();
    const startTime = new Date(contestData.startTime);

    // If contest has started, show problems to everyone
    if (now >= startTime) return true;

    // For upcoming contests, only show problems to non-members (admins, instructors)
    return userRole !== "member";
  };

  if (isLoading) {
    return (
      <div className="container px-8 py-2">Loading contest details...</div>
    );
  }

  if (error) {
    return (
      <div className="container px-8 py-2 text-red-500">Error: {error}</div>
    );
  }

  return (
    <div className="container px-8 py-2 w-3xl h-screen">
      <Card className="bg-background">
        <CardHeader>
          <div className="flex justify-between items-start">
            <div>
              <CardTitle className="text-2xl font-bold">
                {contestData.name}
              </CardTitle>
              <CardDescription className="text-muted-foreground">
                Contest Code: {contestData.nameId}
              </CardDescription>
            </div>
            <div
              className={`font-semibold ${status.color} flex items-center gap-2`}
            >
              <div className="relative flex">
                <div className={`w-3 h-3 rounded-full ${status.dotColor}`} />
                {status.animate && (
                  <div className="absolute top-0 left-0 w-2 h-2">
                    <div
                      className={`w-3 h-3 rounded-full ${status.dotColor} animate-ping`}
                    />
                  </div>
                )}
              </div>
              {status.text}
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <p className="text-foreground">{contestData.description}</p>

          <div className="flex flex-col space-y-2">
            <div className="flex items-center text-muted-foreground">
              <CalendarIcon className="mr-2 h-4 w-4" />
              <span>Starts {formatDate(contestData.startTime)}</span>
            </div>
            <div className="flex items-center text-muted-foreground">
              <ClockIcon className="mr-2 h-4 w-4" />
              <span>Ends {formatDate(contestData.endTime)}</span>
            </div>
          </div>

          {shouldShowProblems() ? (
            <div>
              <h3 className="text-lg font-semibold mb-2 flex items-center">
                Problems
              </h3>
              <ul className="space-y-2 px-2">
                {contestData.problems.map(
                  (problem: { id: string; title: string }) => (
                    <li key={problem.id}>
                      <Link
                        href={`/${orgId}/contests/${contestId}/problems/${problem.id}`}
                      >
                        <Button
                          variant="link"
                          className="p-0 h-auto text-primary hover:text-primary/80"
                        >
                          {problem.title}
                        </Button>
                      </Link>
                    </li>
                  ),
                )}
              </ul>
            </div>
          ) : (
            <div className="text-muted-foreground italic">
              Problems will be available when the contest starts.
            </div>
          )}

          {shouldShowProblems() ? (
            <div>
              <h3 className="text-lg font-semibold mb-2 flex items-center">
                <Link href={`/${orgId}/contests/${contestId}/submissions`}>
                  <Button
                    variant="link"
                    className="p-0 h-auto text-primary hover:text-primary/80"
                  >
                    View Submissions
                  </Button>
                </Link>
              </h3>
            </div>
          ) : (
            <div className="text-muted-foreground italic">
              Submissions will be available when the contest starts.
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
