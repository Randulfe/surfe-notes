import { useQueryClient } from "@tanstack/react-query";
import { useCallback, useEffect, useMemo, useState } from "react";
import { RichInput } from "~/design-system/components/RichInput/RichInput";
import { useDebounce } from "~/hooks/useDebounce";
import { useNotes, useUpdateNote } from "~/web/notes";
import { useUsers } from "~/web/users";
import type { Note as NoteType } from "~/entities/note";

export const Note = ({ id }: { id: string }) => {
  const { data: notes } = useNotes("DEFAULT_SESSION");
  const { data: users } = useUsers();
  const { mutate: updateNote } = useUpdateNote("DEFAULT_SESSION");
  const queryClient = useQueryClient();

  const note = useMemo(() => {
    return notes?.find((note) => note.id.toString() === id);
  }, [notes, id]);

  const [content, setContent] = useState(note?.body ?? "");

  useEffect(() => {
    if (note?.body !== undefined) {
      setContent(note.body);
    }
  }, [note?.body]);

  const handleUpdateNote = useCallback(
    (value: string) => {
      if (value === note?.body) return;
      updateNote(
        {
          noteId: id,
          note: value,
        },
        {
          onSuccess: (updatedNote: NoteType) => {
            queryClient.setQueryData(
              ["notes", "DEFAULT_SESSION"],
              (oldData: NoteType[]) => {
                return oldData.map((note) =>
                  note.id === updatedNote.id ? updatedNote : note,
                );
              },
            );
          },
          onError: () => {
            // TODO: handle error state
          },
        },
      );
    },
    [note, id, updateNote, queryClient],
  );
  useDebounce(content, handleUpdateNote, 1000);

  const handleContentChange = (content: string) => {
    setContent(content);
  };

  return (
    <div className="flex h-[1px] min-h-screen w-full flex-col p-16">
      {note ? (
        <div className="h-full min-h-full">
          <RichInput
            users={users}
            value={note?.body ?? ""}
            onChange={handleContentChange}
          />
        </div>
      ) : (
        <p>No note found</p>
      )}
    </div>
  );
};
