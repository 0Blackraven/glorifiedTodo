import { useState } from "react";
import { Plus, X } from "lucide-react";

type Props = {
  onAdd: (title: string, description?: string) => void;
  onCancel: () => void;
};

export default function AddTaskForm({ onAdd, onCancel }: Props) {
  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState("");

  const handleSubmit = (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!title.trim()) return;
    onAdd(title.trim(), desc.trim() || undefined);
    setTitle("");
    setDesc("");
  };

  return (
    <div className="bg-white rounded-2xl border border-[#FFD9BB] p-5 shadow-sm">
      <form onSubmit={handleSubmit} className="flex flex-col gap-3">
        <input
          autoFocus
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="What needs to be done?"
          className="w-full text-sm font-medium text-[#1C1917] placeholder:text-[#D6D3D1] bg-transparent border-b border-[#E7E5E4] pb-3 outline-none focus:border-[#E8864A] transition-colors"
        />
        <input
          value={desc}
          onChange={(e) => setDesc(e.target.value)}
          placeholder="Add a description (optional)"
          className="w-full text-sm text-[#78716C] placeholder:text-[#D6D3D1] bg-transparent border-b border-[#E7E5E4] pb-3 outline-none focus:border-[#E8864A] transition-colors"
        />
        <div className="flex justify-end gap-2 pt-1">
          <button
            type="button"
            onClick={onCancel}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-medium text-[#A8A29E] hover:bg-[#F5F5F4] transition-colors cursor-pointer"
          >
            <X size={14} />
            Cancel
          </button>
          <button
            type="submit"
            className="flex items-center gap-1.5 px-5 py-2 rounded-xl text-xs font-semibold text-white bg-gradient-to-r from-[#F5A461] to-[#E8864A] hover:shadow-md hover:shadow-[#E8864A]/25 transition-all cursor-pointer"
          >
            <Plus size={14} />
            Add Task
          </button>
        </div>
      </form>
    </div>
  );
}
