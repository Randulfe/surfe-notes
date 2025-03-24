import { useQueryClient } from "@tanstack/react-query";
import { NavLink, Outlet, useNavigate } from "react-router";
import { Button } from "~/design-system/components/Button/Button";
import { SidebarItem } from "~/design-system/components/SideBarItem/SidebarItem";
import type { Note } from "~/entities/note";
import { useCreateNote, useNotes } from "~/web/notes";
export default function ProjectLayout() {
  const { data: notes } = useNotes("DEFAULT_SESSION");
  const { mutate: createNote } = useCreateNote("DEFAULT_SESSION");
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const handleCreateNote = () => {
    createNote(undefined, {
      onSuccess: (data) => {
        queryClient.setQueryData(
          ["notes", "DEFAULT_SESSION"],
          (oldData: Note[]) => {
            oldData.push(data);
            return oldData;
          },
        );
        navigate(`/note/${data.id}`);
      },
      onError: () => {
        // TODO: Handle error
      },
    });
  };

  return (
    <div>
      <aside
        className="bg-lighter fixed start-0 end-auto top-0 bottom-0 z-60 block h-full w-64 translate-x-0 border-e border-gray-200"
        aria-label="Sidebar"
      >
        <div className="flex h-full w-full flex-col justify-between">
          <div className="flex flex-col divide-y divide-gray-300">
            {notes &&
              notes.length > 0 &&
              notes.map((note) => (
                <NavLink key={note.id} to={`/note/${note.id}`}>
                  <SidebarItem
                    content={note.body.length > 0 ? note.body : "Empty note 🍃"}
                  />
                </NavLink>
              ))}
          </div>
          <div className="px-2 py-5">
            <Button variant="tertiary" onClick={handleCreateNote}>
              Create Note
            </Button>
          </div>
        </div>
      </aside>
      <main className="ms-64">
        <Outlet />
      </main>
    </div>
  );
}
