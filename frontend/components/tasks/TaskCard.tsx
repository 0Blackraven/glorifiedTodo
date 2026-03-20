import type { Task } from "@/types";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Card } from "@/components/ui/card";

type Props = {
  task: Task;
  onToggle: () => void;
  onDelete: () => void;
};

export default function TaskCard({ task, onToggle, onDelete }: Props) {
  return (
    <Card className={`flex items-start gap-4 p-4 transition-all duration-200 ${task.completed ? "opacity-60" : "hover:bg-muted/50"}`}>
      <Checkbox
        checked={task.completed}
        onCheckedChange={onToggle}
        className="mt-1"
      />
      <div className="flex-1 min-w-0">
        <p className={`font-medium ${task.completed ? "line-through text-muted-foreground" : "text-foreground"}`}>
          {task.title}
        </p>
        {task.description && (
          <p className="mt-1 text-sm text-muted-foreground">
            {task.description}
          </p>
        )}
        <p className="mt-2 text-xs text-muted-foreground">
          {task.createdAt}
        </p>
      </div>

      <Badge variant={task.completed ? "secondary" : "default"} className="shrink-0 mt-0.5">
        {task.completed ? "Done" : "Active"}
      </Badge>

      <Button
        variant="ghost"
        size="icon"
        onClick={onDelete}
        className="h-7 w-7 text-muted-foreground hover:text-destructive shrink-0"
      >
        ✕
        <span className="sr-only">Delete</span>
      </Button>
    </Card>
  );
}
