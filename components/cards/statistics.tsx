"use client";
import {
  Users,
  FileText,
  CheckCircle,
  Clock,
  Calendar,
  UserCheck,
  ListChecks,
} from "lucide-react";

export const TotalMembersCard = ({
  totalMembers,
}: {
  totalMembers: number;
}) => (
  <div className="bg-muted p-4 rounded-lg flex items-center justify-between">
    <div>
      <p className="text-sm text-foreground">Total Members</p>
      <p className="text-xl font-bold">{totalMembers}</p>
    </div>
    <Users className="h-8 w-8 text-blue-400" />
  </div>
);

export const TotalContestsCard = ({
  totalContestsGiven,
}: {
  totalContestsGiven: number;
}) => (
  <div className="bg-muted p-4 rounded-lg flex items-center justify-between">
    <div>
      <p className="text-sm text-foreground">Total Contests Given</p>
      <p className="text-xl font-bold">{totalContestsGiven}</p>
    </div>
    <FileText className="h-8 w-8 text-green-400" />
  </div>
);

export const TotalSubmissionsCard = ({
  totalSubmissions,
}: {
  totalSubmissions: number;
}) => (
  <div className="bg-muted p-4 rounded-lg flex items-center justify-between">
    <div>
      <p className="text-sm text-foreground">Total Submissions</p>
      <p className="text-xl font-bold">{totalSubmissions}</p>
    </div>
    <CheckCircle className="h-8 w-8 text-yellow-400" />
  </div>
);

// export const PendingSubmissionsCard = ({
//   pendingSubmissions,
// }: {
//   pendingSubmissions: number;
// }) => (
//   <div className="bg-muted p-4 rounded-lg flex items-center justify-between">
//     <div>
//       <p className="text-sm text-foreground">Pending Submissions</p>
//       <p className="text-xl font-bold">{pendingSubmissions}</p>
//     </div>
//     <Clock className="h-8 w-8 text-red-400" />
//   </div>
// );

export const SubmissionsLastWeekCard = ({
  submissionsLastWeek,
}: {
  submissionsLastWeek: number;
}) => (
  <div className="bg-muted p-4 rounded-lg flex items-center justify-between">
    <div>
      <p className="text-sm text-foreground">Submissions Last Week</p>
      <p className="text-xl font-bold">{submissionsLastWeek}</p>
    </div>
    <Calendar className="h-8 w-8 text-purple-400" />
  </div>
);

export const DateOfContestCard = ({
  dateOfContest,
}: {
  dateOfContest: string;
}) => (
  <div className="bg-muted p-4 rounded-lg flex items-center justify-between">
    <div>
      <p className="text-sm text-foreground">Date of Contest</p>
      <p className="text-xl font-bold">{dateOfContest}</p>
    </div>
    <Calendar className="h-8 w-8 text-purple-400" />
  </div>
);

export const TotalOrganizersCard = ({
  totalOrganizers,
}: {
  totalOrganizers: number;
}) => (
  <div className="bg-muted p-4 rounded-lg flex items-center justify-between">
    <div>
      <p className="text-sm text-foreground">Total Organizers</p>
      <p className="text-xl font-bold">{totalOrganizers}</p>
    </div>
    <UserCheck className="h-8 w-8 text-indigo-400" />
  </div>
);

export const TotalProblemsCard = ({
  totalProblems,
}: {
  totalProblems: number;
}) => (
  <div className="bg-muted p-4 rounded-lg flex items-center justify-between">
    <div>
      <p className="text-sm text-foreground">Total Problems</p>
      <p className="text-xl font-bold">{totalProblems}</p>
    </div>
    <ListChecks className="h-8 w-8 text-teal-400" />
  </div>
);
