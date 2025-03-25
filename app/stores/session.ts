import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Workspace } from "~/entities/workspace";

interface SessionStore {
  sessions: Workspace[];
  activeSession: Workspace | null;
  addSession: (session: Workspace) => void;
  setActiveSession: (session: Workspace) => void;
  removeSession: (session: Workspace) => void;
  removeAllSessions: () => void;
}

export const useSessionStore = create<SessionStore>()(
  persist(
    (set) => ({
      sessions: [],
      activeSession: null,
      addSession: (session: Workspace) =>
        set((state) => ({ sessions: [...state.sessions, session] })),
      removeSession: (sessionToRemove: Workspace) =>
        set((state) => ({
          sessions: state.sessions.filter(
            (session) => session.value !== sessionToRemove.value,
          ),
        })),
      removeAllSessions: () => set({ sessions: [], activeSession: null }),
      setActiveSession: (session: Workspace) => set({ activeSession: session }),
    }),
    { name: "session" },
  ),
);
