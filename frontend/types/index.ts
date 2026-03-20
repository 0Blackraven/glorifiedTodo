export type Task = {
  id: number;
  title: string;
  description?: string;
  completed: boolean;
  createdAt: string;
};

export type FilterStatus = "all" | "active" | "done";

export type AuthMode = "login" | "register";
