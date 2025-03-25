import {
  Background,
  BackgroundVariant,
  MiniMap,
  ReactFlow,
  useNodesState,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import { useEffect, useMemo } from "react";
import { LoadingIndicator } from "~/design-system/components/LoadingIndicator/LoadingIndicator";
import { useSessionStore } from "~/stores/session";
import { useNotes } from "~/web/notes";
import { NoteNode } from "./noteNode";
import type { Node } from "@xyflow/react";
import type { Note } from "~/entities/note";

const DEFAULT_Y_POSITION = 250;
const DEFAULT_X_SPACING = 300;
const DEFAULT_X_GAP = 50;

const noteToNode = (note: Note, index?: number): Node => ({
  id: note.id.toString(),
  type: "notes",
  position: {
    x: index ? index * DEFAULT_X_SPACING + DEFAULT_X_GAP : DEFAULT_Y_POSITION,
    y: DEFAULT_Y_POSITION,
  },
  deletable: false,
  data: { body: note.body, id: note.id },
});

const notesToNodes = (notes: Note[]): Node[] => {
  return notes.map((note, index) => noteToNode(note, index));
};

export function HomePage() {
  const { activeSession } = useSessionStore();
  const {
    data: notes,
    isLoading: isLoadingNotes,
    isError: isErrorNotes,
  } = useNotes(activeSession?.value);
  const [nodes, setNodes, onNodesChange] = useNodesState<Node>([]);
  const nodeTypes = useMemo(() => ({ notes: NoteNode }), []);

  useEffect(() => {
    if (!notes) return;
    if (nodes.length === 0) {
      const initialNodes = notesToNodes(notes);
      setNodes(initialNodes);
    } else {
      setNodes((prevNodes) => {
        const updatedNodes = notes?.map((note) => {
          const existingNode = prevNodes.find(
            (node) => node.data.id === note.id,
          );
          if (existingNode) {
            return {
              ...existingNode,
              data: {
                body: note.body,
                id: note.id,
              },
            };
          }
          return noteToNode(note);
        });
        return updatedNodes ?? [];
      });
    }
  }, [notes, nodes.length, setNodes]);

  return (
    <>
      {isLoadingNotes && <LoadingIndicator label="Loading your notes" />}
      {isErrorNotes && <div>Error loading notes</div>}
      {notes && (
        <div className="min-h-full min-w-full">
          <ReactFlow
            nodes={nodes}
            edges={[]}
            fitView
            nodeTypes={nodeTypes}
            onNodesChange={onNodesChange}
          >
            <MiniMap />
            <Background variant={BackgroundVariant.Dots} gap={12} size={1} />
          </ReactFlow>
        </div>
      )}
    </>
  );
}
