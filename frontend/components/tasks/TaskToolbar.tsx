import type { FilterStatus } from "@/types";
import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";

type Counts = { all: number; active: number; done: number };

type Props = {
  filter: FilterStatus;
  onFilterChange: (f: FilterStatus) => void;
  counts: Counts;
};

export default function TaskToolbar({
  filter,
  onFilterChange,
  counts,
}: Props) {
  return (
    <div className="flex flex-col gap-4 mb-6 justify-between h-[65%]">
      <div className="flex flex-col p-1 rounded-lg gap-1 border h-[70%]">
        {(["all", "active", "done"] as FilterStatus[]).map((f) => (
          <Button
            key={f}
            size="lg"
            variant={"secondary"}
            onClick={() => onFilterChange(f)}
            className="capitalize "
          >
            {f} <span className="opacity-60 ml-1">({counts[f]})</span>
          </Button>
        ))}
      </div>
    </div>
  );
}
