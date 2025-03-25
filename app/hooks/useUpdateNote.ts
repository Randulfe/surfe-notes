import { useQueryClient } from "@tanstack/react-query";
import { useCallback } from "react";
import type { Note } from "~/entities/note";
import type { Workspace } from "~/entities/workspace";
import { useUpdateNote } from "~/web/notes";
import { useDebounce } from "./useDebounce";

interface UseUpdateNoteProps {
  activeSession: Workspace | null;
  content: string;
  note: Partial<Note>;
}

export const useUpdateNoteDebounced = ({
  activeSession,
  content,
  note,
}: UseUpdateNoteProps) => {
  const { mutate: updateNote } = useUpdateNote(activeSession?.value);
  const queryClient = useQueryClient();

  const handleUpdateNote = useCallback(
    (value: string) => {
      if (value === note?.body) return;
      updateNote(
        {
          noteId: note.id ?? "",
          note: value,
        },
        {
          onSuccess: (updatedNote: Note) => {
            queryClient.setQueryData(
              ["notes", activeSession],
              (oldData: Note[]) => {
                return oldData.map((note) =>
                  note.id === updatedNote.id ? updatedNote : note,
                );
              },
            );
          },
          onError: () => {
            // TODO: Add toast to show error on update note with useful message
          },
        },
      );
    },
    [note?.body, note.id, updateNote, queryClient, activeSession],
  );
  useDebounce(content, handleUpdateNote, 1000);
};
