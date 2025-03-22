import { useMutation, useQuery } from "@tanstack/react-query";
import { api } from "./webFactory";

const getNotes = async (sessionId: string) => {
  const { data } = await api.get(`/${sessionId}/notes`);
  return data;
};

const getNote = async (sessionId: string, noteId: string) => {
  const { data } = await api.get(`/${sessionId}/notes/${noteId}`);
  return data;
};

const createNote = async (sessionId: string, note: string) => {
  const { data } = await api.post(`/${sessionId}/notes`, { body: note });
  return data;
};

const updateNote = async (sessionId: string, noteId: string, note: string) => {
  const { data } = await api.put(`/${sessionId}/notes/${noteId}`, {
    body: note,
  });
  return data;
};

export const useNotes = (sessionId: string) => {
  return useQuery({
    queryKey: ["notes", sessionId],
    queryFn: () => getNotes(sessionId),
  });
};

export const useNote = (sessionId: string, noteId: string) => {
  return useQuery({
    queryKey: ["note", sessionId, noteId],
    queryFn: () => getNote(sessionId, noteId),
  });
};

export const useCreateNote = (sessionId: string) => {
  return useMutation({
    mutationFn: (params: { note: string }) =>
      createNote(sessionId, params.note),
  });
};

export const useUpdateNote = (sessionId: string) => {
  return useMutation({
    mutationFn: (params: { noteId: string; note: string }) =>
      updateNote(sessionId, params.noteId, params.note),
  });
};
