export type DashboardCategory = {
  id: string;
  name: string;
};

export type DashboardTask = {
  id: string;
  description: string;
  is_completed: boolean;
  scheduled_date: string | null;
};

export type DashboardTodoList = {
  id: string;
  title: string | null;
  category: DashboardCategory | null;
  tasks: DashboardTask[];
};

export type DashboardUser = {
  id: string;
  firstname: string | null;
  lastname: string | null;
  birthdate: string | null;
  status: string | null;
};

export type DashboardData = {
  user: DashboardUser;
  todoLists: DashboardTodoList[];
  preferences: DashboardCategory[];
  globalProgress: { done: number; total: number; percent: number };
  nextDeadline: DashboardTask | null;
};
