export interface User {
  id: number;
  name: string;
  nameId: string;
  avatar?: string;
  about?: string;
  role: "owner" | "organizer" | "member";
  joinedAt: string;
}

export const mockUsers: User[] = [
  {
    id: 1,
    name: "John Smith",
    nameId: "john.smith",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=john",
    about: "Senior Software Engineer with passion for algorithms",
    role: "owner",
    joinedAt: "2024-01-01",
  },
  {
    id: 2,
    name: "Alice Johnson",
    nameId: "alice.j",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=alice",
    about: "Full-stack developer and competitive programmer",
    role: "organizer",
    joinedAt: "2024-01-05",
  },
  {
    id: 3,
    name: "Bob Wilson",
    nameId: "bob.wilson",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=bob",
    role: "member",
    joinedAt: "2024-01-10",
  },
  {
    id: 4,
    name: "Emma Davis",
    nameId: "emma.d",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=emma",
    about: "Computer Science student interested in AI/ML",
    role: "member",
    joinedAt: "2024-01-15",
  },
  {
    id: 5,
    name: "Michael Brown",
    nameId: "michael.b",
    role: "organizer",
    joinedAt: "2024-01-20",
  },
];