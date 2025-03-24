import { useQueryClient } from "@tanstack/react-query";
import { useCallback, useState } from "react";
import { LoadingIndicator } from "~/design-system/components/LoadingIndicator/LoadingIndicator";
import { NoteWrapper } from "~/design-system/components/NoteWrapper/NoteWrapper";
import { RichInput } from "~/design-system/components/RichInput/RichInput";
import type { Note } from "~/entities/note";
import { useDebounce } from "~/hooks/useDebounce";
import { useSessionStore } from "~/stores/session";
import { useUpdateNote } from "~/web/notes";
import { useUsers } from "~/web/users";

interface NoteNodeProps {
  data: {
    body: string;
    id: string;
  };
}

export const NoteNode = ({ data }: NoteNodeProps) => {
  const { activeSession } = useSessionStore();
  const [content, setContent] = useState(data?.body ?? "");
  const { mutate: updateNote } = useUpdateNote(activeSession?.value);
  const queryClient = useQueryClient();

  const { data: users, isLoading: isLoadingUsers } = useUsers();
  const handleUpdateNote = useCallback(
    (value: string) => {
      if (value === data?.body) return;
      updateNote(
        {
          noteId: data.id,
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
    [data?.body, data.id, updateNote, queryClient, activeSession],
  );
  useDebounce(content, handleUpdateNote, 1000);
  const handleContentChange = (content: string) => {
    setContent(content);
  };
  return (
    <NoteWrapper>
      {isLoadingUsers && <LoadingIndicator />}
      {users && (
        <RichInput
          value={data.body}
          users={users}
          onChange={handleContentChange}
        />
      )}
    </NoteWrapper>
  );
};
