import { useState } from "react";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

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
    <Card className="mb-6 overflow-hidden">
      <form onSubmit={handleSubmit}>
        <CardContent className="pt-6 pb-4 flex flex-col gap-4">
          <Input
            autoFocus
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Task title..."
          />
          <Input
            value={desc}
            onChange={(e) => setDesc(e.target.value)}
            placeholder="Description (optional)..."
          />
        </CardContent>
        <CardFooter className="bg-muted/50 px-6 py-4 flex gap-3 m-0">
          <Button type="submit">Add Task</Button>
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}
