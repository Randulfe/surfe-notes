import { useEffect, useMemo, useState } from "react";
import { RichInput } from "~/design-system/components/RichInput/RichInput";
import { useNotes } from "~/web/notes";
import { useUsers } from "~/web/users";
import { LoadingIndicator } from "~/design-system/components/LoadingIndicator/LoadingIndicator";
import { useSessionStore } from "~/stores/session";
import { useNavigate } from "react-router";
import { useUpdateNoteDebounced } from "~/hooks/useUpdateNote";

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
  const [content, setContent] = useState("");
  const { activeSession } = useSessionStore();
  const {
    data: notes,
    isLoading: isLoadingNotes,
    isError: isErrorNotes,
  } = useNotes(activeSession?.value);
  const { data: users } = useUsers();
  const navigate = useNavigate();

  const note = useMemo(() => {
    return notes?.find((note) => note.id.toString() === id);
  }, [notes, id]);

  useUpdateNoteDebounced({
    activeSession,
    content,
    note: { id, body: note?.body },
  });

  // Redirect to home if note doesn't exist
  useEffect(() => {
    if (!isLoadingNotes && notes && !note) {
      navigate("/");
    }
  }, [isLoadingNotes, notes, note, navigate]);

  useEffect(() => {
    if (note?.body !== undefined) {
      setContent(note.body);
    }
  }, [note?.body]);

  const handleContentChange = (content: string) => {
    setContent(content);
  };

  return (
    <div className="h-full p-12 sm:p-16">
      {isErrorNotes && <NoteError />}
      {isLoadingNotes && <LoadingIndicator label="Loading your note" />}
      {note && (
        <div className="h-full min-h-full">
          <RichInput
            users={users}
            value={note?.body ?? ""}
            onChange={handleContentChange}
          />
        </div>
      )}
    </div>
  );
};
