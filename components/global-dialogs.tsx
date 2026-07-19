import { CreateTaskDialog } from "@/features/tasks/components/create-task-dialog";
import { CreateCaseDialog } from "@/features/cases/components/create-case-dialog";
import { CreateNoteDialog } from "@/features/notes/components/create-note-dialog";
import { CreateEventDialog } from "@/features/calendar/components/create-event-dialog";

export function GlobalDialogs() {
  return (
    <>
      <CreateTaskDialog />
      <CreateCaseDialog />
      <CreateNoteDialog />
      <CreateEventDialog />
    </>
  );
}
