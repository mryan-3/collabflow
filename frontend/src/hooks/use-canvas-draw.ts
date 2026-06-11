import { useState, useRef, MouseEvent } from "react";
import { useBoardStore } from "./use-board-store";
import { DrawingElement, Point } from "../types/board";
import { getElementAtPosition } from "../utils/hit-test";
import { generateId } from "../utils/id";

export function useCanvasDraw(sendWS: (msg: any) => void) {
  const {
    elements,
    selectedTool,
    selectedColor,
    zoom,
    pan,
    setPan,
    updateLocalElement,
    currentUser,
  } = useBoardStore();

  const [action, setAction] = useState<"none" | "drawing" | "moving" | "panning">("none");
  const [activeElement, setActiveElement] = useState<DrawingElement | null>(null);
  const [textInput, setTextInput] = useState<{ x: number; y: number; val: string } | null>(null);

  const startPan = useRef<Point>({ x: 0, y: 0 });
  const startDrag = useRef<Point>({ x: 0, y: 0 });
  const elementOffset = useRef<Point>({ x: 0, y: 0 });
  const lastCursorSent = useRef<number>(0);

  const getAbsCoords = (e: MouseEvent<HTMLCanvasElement>): Point => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = (e.clientX - rect.left - pan.x) / zoom;
    const y = (e.clientY - rect.top - pan.y) / zoom;
    return { x, y };
  };

  const handleMouseDown = (e: MouseEvent<HTMLCanvasElement>) => {
    if (e.button === 1 || selectedTool === "select") {
      const pt = getAbsCoords(e);
      const hit = getElementAtPosition(elements, pt);
      if (hit && e.button !== 1) {
        setAction("moving");
        setActiveElement(hit);
        elementOffset.current = { x: pt.x - hit.x, y: pt.y - hit.y };
      } else {
        setAction("panning");
        startPan.current = { x: e.clientX - pan.x, y: e.clientY - pan.y };
      }
      return;
    }

    const pt = getAbsCoords(e);
    if (selectedTool === "text") {
      setTextInput({ x: pt.x, y: pt.y, val: "" });
      return;
    }

    const newEl: DrawingElement = {
      id: generateId(),
      type: selectedTool === "rectangle" ? "rectangle" : "pencil",
      x: pt.x,
      y: pt.y,
      width: 0,
      height: 0,
      color: selectedColor,
      createdBy: currentUser?.id || "",
      points: selectedTool === "pencil" ? [pt] : undefined,
    };

    setAction("drawing");
    setActiveElement(newEl);
    updateLocalElement(newEl);
  };

  const handleMouseMove = (e: MouseEvent<HTMLCanvasElement>) => {
    const pt = getAbsCoords(e);

    // Throttle cursor updates (50ms)
    const now = Date.now();
    if (now - lastCursorSent.current > 50 && currentUser) {
      sendWS({ type: "cursor_update", payload: { cursor: pt } });
      lastCursorSent.current = now;
    }

    if (action === "panning") {
      setPan({ x: e.clientX - startPan.current.x, y: e.clientY - startPan.current.y });
    } else if (action === "drawing" && activeElement) {
      const updated = { ...activeElement };
      if (updated.type === "pencil" && updated.points) {
        updated.points = [...updated.points, pt];
      } else {
        updated.width = pt.x - updated.x;
        updated.height = pt.y - updated.y;
      }
      setActiveElement(updated);
      updateLocalElement(updated);
    } else if (action === "moving" && activeElement) {
      const updated = {
        ...activeElement,
        x: pt.x - elementOffset.current.x,
        y: pt.y - elementOffset.current.y,
      };
      setActiveElement(updated);
      updateLocalElement(updated);
      sendWS({ type: "element_update", payload: updated });
    }
  };

  const handleMouseUp = () => {
    if ((action === "drawing" || action === "moving") && activeElement) {
      sendWS({ type: "element_update", payload: activeElement });
      // Record created IDs for undo
      if (action === "drawing") {
        useBoardStore.setState((s) => ({
          myCreatedIds: [...s.myCreatedIds, activeElement.id],
          myRedoStack: [],
        }));
      }
    }
    setAction("none");
    setActiveElement(null);
  };

  return {
    handleMouseDown,
    handleMouseMove,
    handleMouseUp,
    textInput,
    setTextInput,
  };
}
