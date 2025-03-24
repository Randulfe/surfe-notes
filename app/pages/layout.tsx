import { useQueryClient } from "@tanstack/react-query";
import { NavLink, Outlet, useNavigate } from "react-router";
import { Button } from "~/design-system/components/Button/Button";
import { SidebarItem } from "~/design-system/components/SideBarItem/SidebarItem";
import type { Note } from "~/entities/note";
import { useCreateNote, useNotes } from "~/web/notes";
import { useState } from "react";
import { BurgerIcon } from "~/design-system/components/Icons";
import { useSessionStore } from "~/stores/session";
import { Select, type Option } from "~/design-system/components/Select/Select";
import { Input } from "~/design-system/components/Input/Input";
import { Modal } from "~/design-system/components/Modal/Modal";
import DOMPurify from "dompurify";

export default function ProjectLayout() {
  const { sessions, activeSession, setActiveSession, addSession } =
    useSessionStore();
  const { data: notes } = useNotes(activeSession?.value);
  const { mutate: createNote } = useCreateNote(activeSession?.value);
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [newWorkspace, setNewWorkspace] = useState("");
  const [isNewSessionModalOpen, setIsNewSessionModalOpen] = useState(
    sessions.length === 0,
  );

  const handleCreateNote = () => {
    createNote(undefined, {
      onSuccess: (data) => {
        queryClient.setQueryData(
          ["notes", activeSession],
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

  const handleCreateSession = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!e.currentTarget.checkValidity()) return;

    // Sanitize the workspace name
    const sanitizedWorkspace = DOMPurify.sanitize(
      newWorkspace.trim(),
      {},
    ).trim();
    if (sanitizedWorkspace.length < 1 || sanitizedWorkspace.length > 50) return;
    const encodedWorkspace = encodeURIComponent(sanitizedWorkspace);

    addSession({ value: encodedWorkspace, label: sanitizedWorkspace });
    setActiveSession({ value: encodedWorkspace, label: sanitizedWorkspace });
    setNewWorkspace("");
    setIsNewSessionModalOpen(false);
  };

  // TODO: Add toast to show error if notes aren't reachable

  const handleSessionChange = (option: Option) => {
    setActiveSession(option as { value: string; label: string });
  };

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
          className="bg-opacity-50 fixed inset-0 z-30 bg-black opacity-20 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      <aside
        className={`bg-lighter fixed start-0 end-auto top-0 bottom-0 z-40 block h-full w-64 transform border-e border-gray-200 transition-transform duration-300 ease-in-out sm:translate-x-0 ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
        aria-label="Sidebar"
      >
        <div className="flex h-full w-full flex-col justify-between pt-5">
          <div className="pt-2">
            <p className="text-primary pl-5 text-sm font-medium">Workspaces</p>
            <div className="flex flex-col gap-5 px-2 pt-2 pb-5">
              {activeSession && sessions.length > 0 && (
                <Select
                  options={sessions}
                  selectedOption={activeSession}
                  onChange={handleSessionChange}
                />
              )}

              <Button
                variant="tertiary"
                size="s"
                onClick={() => setIsNewSessionModalOpen(true)}
              >
                Create New Workspace
              </Button>
            </div>

            <div className="py-5">
              <p className="text-primary pl-5 text-sm font-medium">Notes</p>
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
                        content={
                          note.body.length > 0 ? note.body : "Empty note 🍃"
                        }
                      />
                    </NavLink>
                  ))}
              </div>
            </div>
          </div>

          <div className="px-2 py-5">
            <Button variant="tertiary" onClick={handleCreateNote}>
              Create Note
            </Button>
          </div>
        </div>
      </aside>
      <Modal
        isOpen={isNewSessionModalOpen}
        onClose={() => {
          if (sessions.length > 0) {
            setIsNewSessionModalOpen(false);
          }
        }}
      >
        <form onSubmit={handleCreateSession}>
          <div className="flex flex-col items-center gap-5">
            <h2 className="text-primary pb-2 text-2xl">Create a Workspace</h2>
            <Input
              type="text"
              placeholder="Workspace name"
              value={newWorkspace}
              onChange={(e) => setNewWorkspace(e.target.value)}
              minLength={1}
              maxLength={50}
              required
            />
            <div className="w-fit">
              <Button type="submit" variant="primary">
                Create Workspace
              </Button>
            </div>
          </div>
        </form>
      </Modal>
      <main className="sm:ms-64">
        <Outlet />
      </main>
    </div>
  );
}
