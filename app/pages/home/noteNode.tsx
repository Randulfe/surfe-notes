import { useState } from "react";
import { LoadingIndicator } from "~/design-system/components/LoadingIndicator/LoadingIndicator";
import { NoteWrapper } from "~/design-system/components/NoteWrapper/NoteWrapper";
import { RichInput } from "~/design-system/components/RichInput/RichInput";
import { useUpdateNoteDebounced } from "~/hooks/useUpdateNote";
import { useSessionStore } from "~/stores/session";
import { useUsers } from "~/web/users";

interface NoteNodeProps {
  data: {
    body: string;
    id: string;
  };
}

export const NoteNode = ({ data }: NoteNodeProps) => {
  const [content, setContent] = useState(data?.body ?? "");
  const { activeSession } = useSessionStore();

  const { data: users, isLoading: isLoadingUsers } = useUsers();
  useUpdateNoteDebounced({
    activeSession,
    content,
    note: data,
  });
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
