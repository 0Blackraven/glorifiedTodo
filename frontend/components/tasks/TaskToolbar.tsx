import type { FilterStatus } from "@/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

type Counts = { all: number; active: number; done: number };

type Props = {
  filter: FilterStatus;
  onFilterChange: (f: FilterStatus) => void;
  search: string;
  onSearchChange: (s: string) => void;
  onAddClick: () => void;
  counts: Counts;
};

export default function TaskToolbar({
  filter,
  onFilterChange,
  search,
  onSearchChange,
  onAddClick,
  counts,
}: Props) {
  return (
    <div className="flex flex-wrap gap-4 mb-6 items-center">
      <Input
        value={search}
        onChange={(e) => onSearchChange(e.target.value)}
        placeholder="Search tasks..."
        className="flex-1 min-w-[200px]"
      />
      
      <div className="flex bg-muted/50 p-1 rounded-lg gap-1 border">
        {(["all", "active", "done"] as FilterStatus[]).map((f) => (
          <Button
            key={f}
            variant={filter === f ? "default" : "ghost"}
            size="sm"
            onClick={() => onFilterChange(f)}
            className="capitalize"
          >
            {f} <span className="opacity-60 ml-1">({counts[f]})</span>
          </Button>
        ))}
      </div>

      <Button onClick={onAddClick}>+ New Task</Button>
    </div>
  );
}
