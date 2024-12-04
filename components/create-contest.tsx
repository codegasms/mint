"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";

export function CreateContest() {
  const [contestData, setContestData] = useState({
    name: "",
    duration: "",
  });

  const handleSetProblems = () => {
    if (!contestData.name || !contestData.duration) {
      alert(
        "Please fill in both contest name and duration before setting problems",
      );
      return;
    }
    // Store contest data before navigating
    localStorage.setItem("pendingContest", JSON.stringify(contestData));
  };

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      {/* Top Navigation */}
      <nav className="bg-background p-2 flex items-center justify-between">
        <div className="flex items-center space-x-4">
          {/* Using Link for navigation */}
          <Link href="/create">
            <Button variant="ghost" size="icon">
              <ChevronLeft className="h-4 w-4" />
            </Button>
          </Link>
          <span className="text-lg font-semibold">Create New Contest</span>
          <Button variant="ghost" size="icon">
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </nav>

      {/* Main Content */}
      <div className="flex-1 p-6">
        <div className="max-w-2xl mx-auto space-y-6">
          <div className="bg-muted rounded-lg p-6 space-y-6">
            <div className="space-y-4">
              <div>
                <label
                  htmlFor="name"
                  className="block text-sm font-medium mb-2"
                >
                  Contest Name
                </label>
                <Input
                  id="name"
                  value={contestData.name}
                  onChange={(e) =>
                    setContestData({ ...contestData, name: e.target.value })
                  }
                  placeholder="Enter contest name"
                  required
                  className="w-full bg-background border-border text-foreground placeholder-muted-foreground focus:border-ring"
                />
              </div>

              <div>
                <label
                  htmlFor="duration"
                  className="block text-sm font-medium mb-2"
                >
                  Duration (in Minutes)
                </label>
                <Input
                  id="duration"
                  type="number"
                  value={contestData.duration}
                  onChange={(e) =>
                    setContestData({ ...contestData, duration: e.target.value })
                  }
                  placeholder="Enter duration in Minutes"
                  required
                  className="w-full bg-background border-border text-foreground placeholder-muted-foreground focus:border-ring"
                />
              </div>
            </div>

            <Button
              onClick={handleSetProblems}
              className="w-full bg-primary hover:bg-primary/90 text-primary-foreground"
            >
              Set Problems
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
