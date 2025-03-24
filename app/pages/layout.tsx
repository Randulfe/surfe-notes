import { useQueryClient } from "@tanstack/react-query";
import { NavLink, Outlet, useNavigate } from "react-router";
import { Button } from "~/design-system/components/Button/Button";
import { SidebarItem } from "~/design-system/components/SideBarItem/SidebarItem";
import type { Note } from "~/entities/note";
import { useCreateNote, useNotes } from "~/web/notes";
import { useState } from "react";
import { BurgerIcon } from "~/design-system/components/Icons";

export default function ProjectLayout() {
  const { data: notes } = useNotes("DEFAULT_SESSION");
  const { mutate: createNote } = useCreateNote("DEFAULT_SESSION");
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

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
        // TODO: Add toast to show error on create note
      },
    });
  };

  // TODO: Add toast to show error if notes aren't reachable

  return (
    <div>
      {!isSidebarOpen && (
        <button
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          className="fixed top-4 left-4 z-70 cursor-pointer rounded-lg p-2 text-gray-300 transition-all duration-300 hover:bg-gray-100 sm:hidden lg:hidden"
          aria-label="Toggle sidebar"
        >
          <BurgerIcon />
        </button>
      )}

      {isSidebarOpen && (
        <div
          className="bg-opacity-50 fixed inset-0 z-50 bg-black opacity-20 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      <aside
        className={`bg-lighter fixed start-0 end-auto top-0 bottom-0 z-60 block h-full w-64 transform border-e border-gray-200 transition-transform duration-300 ease-in-out sm:translate-x-0 ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
        aria-label="Sidebar"
      >
        <div className="flex h-full w-full flex-col justify-between">
          <div className="flex flex-col divide-y divide-gray-300">
            {notes &&
              notes.length > 0 &&
              notes.map((note) => (
                <NavLink
                  key={note.id}
                  to={`/note/${note.id}`}
                  onClick={() => setIsSidebarOpen(false)}
                >
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
      <main className="sm:ms-64">
        <Outlet />
      </main>
    </div>
  );
}
