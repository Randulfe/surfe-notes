import { useQueryClient } from "@tanstack/react-query";
import { useCallback, useEffect, useMemo, useState } from "react";
import { RichInput } from "~/design-system/components/RichInput/RichInput";
import { useDebounce } from "~/hooks/useDebounce";
import { useNotes, useUpdateNote } from "~/web/notes";
import { useUsers } from "~/web/users";
import type { Note as NoteType } from "~/entities/note";
import { LoadingIndicator } from "~/design-system/components/LoadingIndicator/LoadingIndicator";
import { useSessionStore } from "~/stores/session";
import { useNavigate } from "react-router";

const NoteError = () => {
  return (
    <p>
      There was an issue retrieving your note, please refresh the page. If the
      issue persists please reach out at{" "}
      <a
        className="text-primary underline"
        href="mailto:mateorandulfe@surfe.com"
      >
        mateorandulfe@surfe.com
      </a>
      .
    </p>
  );
};

export const Note = ({ id }: { id: string }) => {
  const { activeSession } = useSessionStore();
  const navigate = useNavigate();
  const {
    data: notes,
    isLoading: isLoadingNotes,
    isError: isErrorNotes,
  } = useNotes(activeSession?.value);
  const { data: users } = useUsers();
  const { mutate: updateNote } = useUpdateNote(activeSession?.value);
  const queryClient = useQueryClient();

  const note = useMemo(() => {
    return notes?.find((note) => note.id.toString() === id);
  }, [notes, id]);

  // Redirect to home if note doesn't exist
  useEffect(() => {
    if (!isLoadingNotes && notes && !note) {
      navigate("/");
    }
  }, [isLoadingNotes, notes, note, navigate]);

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
              ["notes", activeSession],
              (oldData: NoteType[]) => {
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
    [note, id, updateNote, queryClient, activeSession],
  );
  useDebounce(content, handleUpdateNote, 1000);

  const handleContentChange = (content: string) => {
    setContent(content);
  };

  return (
    <div className="flex h-[1px] min-h-screen w-full flex-col p-12 sm:p-16">
      {isErrorNotes ? (
        <NoteError />
      ) : isLoadingNotes ? (
        <LoadingIndicator label="Loading your note" />
      ) : note ? (
        <div className="h-full min-h-full">
          <RichInput
            users={users}
            value={note?.body ?? ""}
            onChange={handleContentChange}
          />
        </div>
      ) : (
        <NoteError />
      )}
    </div>
  );
};
