import { useMutation, useQuery } from "@tanstack/react-query";
import { api } from "./webFactory";
import type { Note } from "~/entities/note";

const getNotes = async (sessionId?: string): Promise<Note[]> => {
  if (!sessionId) throw new Error("Session ID is required");
  const { data } = await api.get(`/${sessionId}/notes`);
  return data;
};

const getNote = async (noteId: string, sessionId?: string): Promise<Note> => {
  if (!sessionId) throw new Error("Session ID is required");
  const { data } = await api.get(`/${sessionId}/notes/${noteId}`);
  return data;
};

const createNote = async (sessionId?: string): Promise<Note> => {
  if (!sessionId) throw new Error("Session ID is required");
  const { data } = await api.post(`/${sessionId}/notes`, {
    body: `Your note from ${new Date().toLocaleDateString("en-US", { weekday: "long" })}`,
  });
  return data;
};

const updateNote = async (
  noteId: string,
  note: string,
  sessionId?: string,
): Promise<Note> => {
  if (!sessionId) throw new Error("Session ID is required");
  const { data } = await api.put(`/${sessionId}/notes/${noteId}`, {
    body: note,
  });
  return data;
};

export const useNotes = (sessionId?: string) => {
  return useQuery({
    queryKey: ["notes", sessionId],
    queryFn: () => getNotes(sessionId),
    enabled: !!sessionId,
  });
};

export const useNote = (sessionId: string, noteId: string) => {
  return useQuery({
    queryKey: ["note", sessionId, noteId],
    queryFn: () => getNote(sessionId, noteId),
    enabled: !!sessionId,
  });
};

export const useCreateNote = (sessionId?: string) => {
  return useMutation({
    mutationFn: () => createNote(sessionId),
    mutationKey: ["createNote", sessionId],
  });
};

export const useUpdateNote = (sessionId?: string) => {
  return useMutation({
    mutationFn: (params: { noteId: string; note: string }) =>
      updateNote(params.noteId, params.note, sessionId),
    mutationKey: ["updateNote", sessionId],
  });
};
