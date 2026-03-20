import type { Task } from "@/types";
import TaskCard from "./TaskCard";
import { Plus } from "lucide-react";

type Props = {
  tasks: Task[];
  onToggle: (id: number) => void;
  onDelete: (id: number) => void;
  onAddClick: () => void;
  showingForm: boolean;
};

export default function TaskList({ tasks, onToggle, onDelete, onAddClick, showingForm }: Props) {
  return (
    <div className="grid grid-cols-3 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
      {/* Add Task Card — always first in the grid */}
      {!showingForm && (
        <button
          onClick={onAddClick}
          className="aspect-square flex flex-col items-center justify-center gap-2 rounded-2xl border-2 border-dashed border-[#FFD9BB] bg-[#FFF8F3] hover:bg-[#FFEEDD] hover:border-[#E8864A] transition-all duration-200 cursor-pointer group"
        >
          <div className="w-10 h-10 rounded-xl bg-white border border-[#E7E5E4] flex items-center justify-center group-hover:bg-[#E8864A] group-hover:border-[#E8864A] transition-all duration-200">
            <Plus size={20} className="text-[#D6D3D1] group-hover:text-white transition-colors" />
          </div>
          <span className="text-xs font-medium text-[#A8A29E] group-hover:text-[#E8864A] transition-colors">
            Add Task
          </span>
        </button>
      )}

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
