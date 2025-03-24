import { useMemo } from "react";
import { RichInput } from "~/design-system/components/RichInput/RichInput";
import { useNotes } from "~/web/notes";
import { useUsers } from "~/web/users";

export const Note = ({ id }: { id: string }) => {
  const { data: notes } = useNotes("DEFAULT_SESSION");
  const { data: users } = useUsers();
  const note = useMemo(() => {
    return notes?.find((note) => note.id.toString() === id);
  }, [notes, id]);

  return (
    <div className="flex h-[1px] min-h-screen w-full flex-col p-16">
      {note ? (
        <div className="h-full min-h-full">
          <RichInput users={users ?? []} value={note.body} />
        </div>
      ) : (
        <p>No note found</p>
      )}
    </div>
  );
};
