"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import Charts from "./textfeature"
import {
  ChevronLeft,
  ChevronRight,
  Search,
  Bell,
  User,
  Users,
  GraduationCap,
  Trophy,
  BookOpen,
  Cpu,
} from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { TotalContestsCard, TotalMembersCard, TotalOrganizersCard, TotalProblemsCard } from "./cards/statistics";

const mockRecentContests = [
  {
    id: 1,
    name: "Weekly Challenge #23",
    date: "2024-09-03",
    participants: 1200,
  },
  {
    id: 2,
    name: "Data Structures Sprint",
    date: "2024-08-28",
    participants: 950,
  },
  {
    id: 3,
    name: "Algorithms Mastery Test",
    date: "2024-08-20",
    participants: 1450,
  },
  { id: 4, name: "Coding Cup 2024", date: "2024-08-15", participants: 2000 },
  {
    id: 5,
    name: "Weekly Challenge #22",
    date: "2024-08-10",
    participants: 1100,
  },
];

const mockServerUptimeData = [
  { name: "Week 1", uptime: 99.99 },
  { name: "Week 2", uptime: 99.95 },
  { name: "Week 3", uptime: 100 },
  { name: "Week 4", uptime: 99.98 },
];

const mockResponseTimeData = [
  { name: "00:00", time: 120 },
  { name: "04:00", time: 110 },
  { name: "08:00", time: 145 },
  { name: "12:00", time: 160 },
  { name: "16:00", time: 185 },
  { name: "20:00", time: 140 },
];

const mockErrorRateData = [
  { name: "Mon", rate: 0.5 },
  { name: "Tue", rate: 0.7 },
  { name: "Wed", rate: 0.3 },
  { name: "Thu", rate: 0.6 },
  { name: "Fri", rate: 0.4 },
  { name: "Sat", rate: 0.2 },
  { name: "Sun", rate: 0.1 },
];

export function AdminDashboard() {
  const [totalTeachers, setTotalTeachers] = useState(500);
  const [totalStudents, setTotalStudents] = useState(10000);
  const [recentContests, setRecentContests] = useState(15);
  const [totalContests, setTotalContests] = useState(100);
  const [totalProblems, setTotalProblems] = useState(1500);
  const [cpuHours, setCpuHours] = useState(5000);

  return (
    <div className="min-h-screen bg-background  text-foreground flex flex-col">
      {/* Top Navigation */}
      <nav className="bg-background p-2 flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button variant="ghost" size="icon">
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <span className="text-lg font-semibold">Admin Dashboard</span>
          <Button variant="ghost" size="icon">
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
        <div className="flex items-center space-x-4">
          <Button variant="ghost" size="icon">
            <Search className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon">
            <Bell className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon">
            <User className="h-4 w-4" />
          </Button>
        </div>
      </nav>

      {/* Main Content */}
      <div className="flex-1 p-6 overflow-auto">
        {/* Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          
          <TotalOrganizersCard totalOrganizers={totalTeachers}/>

          
          <TotalMembersCard totalMembers={totalStudents}/>
          
          
          <TotalContestsCard totalContestsGiven={totalContests}/>

          <TotalProblemsCard totalProblems={totalProblems}/>
         
        </div>

        <Tabs defaultValue="recent-contests" className="w-full">
          <TabsList className="w-full bg-background p-0 mb-6">
            <TabsTrigger
              value="recent-contests"
              className="flex-1 bg-background data-[state=active]:bg-muted"
            >
              Recent Contests
            </TabsTrigger>
            <TabsTrigger
              value="system-health"
              className="flex-1 bg-background data-[state=active]:bg-muted"
            >
              System Health
            </TabsTrigger>
          </TabsList>

          <TabsContent value="recent-contests">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Contest Name</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Participants</TableHead>
                  <TableHead>Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {mockRecentContests.map((contest) => (
                  <TableRow key={contest.id}>
                    <TableCell className="font-medium">
                      {contest.name}
                    </TableCell>
                    <TableCell>{contest.date}</TableCell>
                    <TableCell>{contest.participants}</TableCell>
                    <TableCell>
                      <Button variant="outline" size="sm">
                        View Details
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TabsContent>

          <TabsContent value="system-health">
            <div className="grid   ">
              <Charts/>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
