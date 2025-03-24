import { create } from "zustand";
import { persist } from "zustand/middleware";

interface SessionStore {
  sessions: { value: string; label: string }[];
  activeSession: { value: string; label: string } | null;
  addSession: (session: { value: string; label: string }) => void;
  setActiveSession: (session: { value: string; label: string }) => void;
  removeSession: (session: { value: string; label: string }) => void;
  removeAllSessions: () => void;
}

export const useSessionStore = create<SessionStore>()(
  persist(
    (set) => ({
      sessions: [],
      activeSession: null,
      addSession: (session: { value: string; label: string }) =>
        set((state) => ({ sessions: [...state.sessions, session] })),
      removeSession: (sessionToRemove: { value: string; label: string }) =>
        set((state) => ({
          sessions: state.sessions.filter(
            (session) => session.value !== sessionToRemove.value,
          ),
        })),
      removeAllSessions: () => set({ sessions: [], activeSession: null }),
      setActiveSession: (session: { value: string; label: string }) =>
        set({ activeSession: session }),
    }),
    { name: "session" },
  ),
);
