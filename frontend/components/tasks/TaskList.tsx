import type { Task } from "@/types";
import TaskCard from "./TaskCard";

type Props = {
  tasks: Task[];
  onToggle: (id: number) => void;
  onDelete: (id: number) => void;
};

export default function TaskList({ tasks, onToggle, onDelete }: Props) {
  if (tasks.length === 0) {
    return (
      <div className="text-center py-12 px-4 text-muted-foreground text-sm">
        No tasks found.
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-[0.6rem]">
      {tasks.map((task) => (
        <TaskCard
          key={task.id}
          task={task}
          onToggle={() => onToggle(task.id)}
          onDelete={() => onDelete(task.id)}
        />
      ))}
    </div>
  );
}
