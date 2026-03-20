import type { Task } from "@/types";
import { Trash2 } from "lucide-react";

type Props = {
  task: Task;
  onToggle: () => void;
  onDelete: () => void;
};

export default function TaskCard({ task, onToggle, onDelete }: Props) {
  return (
    <div
      className={`group relative aspect-square flex flex-col justify-between p-5 bg-white rounded-2xl border border-[#E7E5E4] transition-all duration-200 hover:shadow-md hover:border-[#FFD9BB] overflow-hidden ${
        task.completed ? "opacity-70" : ""
      }`}
    >
      {/* Top: Status badge + Delete */}
      <div className="flex items-start justify-between">
        <span
          className={`text-[10px] font-semibold px-2.5 py-1 rounded-full uppercase tracking-wide ${
            task.completed
              ? "bg-[#D1FAE5] text-[#059669]"
              : "bg-[#FFEEDD] text-[#E8864A]"
          }`}
        >
          {task.completed ? "Done" : "Active"}
        </span>
        <button
          onClick={onDelete}
          className="opacity-0 group-hover:opacity-100 p-1.5 rounded-lg text-[#D6D3D1] hover:text-[#F87171] hover:bg-[#FEF2F2] transition-all duration-200 cursor-pointer"
        >
          <Trash2 size={14} />
        </button>
      </div>

      {/* Middle: Title + Description */}
      <div className="flex-1 flex flex-col justify-center py-3">
        <p
          className={`font-semibold text-sm leading-snug line-clamp-2 ${
            task.completed
              ? "line-through text-[#A8A29E]"
              : "text-[#1C1917]"
          }`}
        >
          {task.title}
        </p>
        {task.description && (
          <p className="mt-1.5 text-xs text-[#A8A29E] leading-relaxed line-clamp-2">
            {task.description}
          </p>
        )}
      </div>

      {/* Bottom: Checkbox + Date */}
      <div className="flex items-center justify-between">
        <button
          onClick={onToggle}
          className={`w-5 h-5 rounded-md border-2 flex items-center justify-center shrink-0 transition-all duration-200 cursor-pointer ${
            task.completed
              ? "bg-[#34D399] border-[#34D399]"
              : "border-[#D6D3D1] hover:border-[#E8864A]"
          }`}
        >
          {task.completed && (
            <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
              <path
                d="M1 4L3.5 6.5L9 1"
                stroke="white"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          )}
        </button>
        <p className="text-[10px] text-[#D6D3D1] font-medium uppercase tracking-wider">
          {new Date(task.createdAt).toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
          })}
        </p>
      </div>
    </div>
  );
}
