"use client";

import { useWebSocket } from "../hooks/use-websocket";
import { useBoardStore } from "../hooks/use-board-store";
import WhiteboardCanvas from "./whiteboard-canvas";
import WhiteboardToolbar from "./whiteboard-toolbar";
import PresenceList from "./presence-list";
import CursorLayer from "./cursor-layer";
import WhiteboardViewControls from "./whiteboard-view-controls";

interface BoardProps {
  boardId: string;
}

export default function BoardContainer({ boardId }: BoardProps) {
  const { send } = useWebSocket(boardId);
  const elements = useBoardStore((s) => s.elements);
  const myCreatedIds = useBoardStore((s) => s.myCreatedIds);
  const myRedoStack = useBoardStore((s) => s.myRedoStack);
  const { deleteLocalElement, updateLocalElement, setElements } = useBoardStore();

  const handleUndo = () => {
    if (myCreatedIds.length === 0) return;
    const nextCreated = [...myCreatedIds];
    const undoneId = nextCreated.pop()!;
    const undoneEl = elements.find((el) => el.id === undoneId);

    if (undoneEl) {
      deleteLocalElement(undoneId);
      send({ type: "element_delete", payload: { id: undoneId } });
      useBoardStore.setState({
        myCreatedIds: nextCreated,
        myRedoStack: [...myRedoStack, undoneEl],
      });
    }
  };

  const handleRedo = () => {
    if (myRedoStack.length === 0) return;
    const nextRedo = [...myRedoStack];
    const redoneEl = nextRedo.pop()!;

    updateLocalElement(redoneEl);
    send({ type: "element_update", payload: redoneEl });
    useBoardStore.setState({
      myCreatedIds: [...myCreatedIds, redoneEl.id],
      myRedoStack: nextRedo,
    });
  };

  const handleClear = () => {
    setElements([]);
    send({ type: "clear_board" });
    useBoardStore.setState({ myCreatedIds: [], myRedoStack: [] });
  };

  return (
    <div className="relative w-screen h-screen overflow-hidden bg-stone-50 select-none">
      <PresenceList />
      <WhiteboardToolbar
        onUndo={handleUndo}
        onRedo={handleRedo}
        onClear={handleClear}
        canUndo={myCreatedIds.length > 0}
        canRedo={myRedoStack.length > 0}
      />
      <CursorLayer />
      <WhiteboardCanvas sendWS={send} />
      <WhiteboardViewControls />
    </div>
  );
}
