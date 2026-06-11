"use client";

import { useEffect, useRef, KeyboardEvent, FocusEvent } from "react";
import { useBoardStore } from "../hooks/use-board-store";
import { useCanvasDraw } from "../hooks/use-canvas-draw";
import { drawGrid, drawElements } from "../utils/canvas-renderer";
import { DrawingElement } from "../types/board";

interface CanvasProps {
  sendWS: (msg: any) => void;
}

export default function WhiteboardCanvas({ sendWS }: CanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const { elements, zoom, pan, currentUser, setSelectedTool } = useBoardStore();
  const { handleMouseDown, handleMouseMove, handleMouseUp, textInput, setTextInput } =
    useCanvasDraw(sendWS);

  useEffect(() => {
    const handleResize = () => {
      if (!canvasRef.current || !containerRef.current) return;
      canvasRef.current.width = containerRef.current.clientWidth;
      canvasRef.current.height = containerRef.current.clientHeight;
      draw();
    };
    window.addEventListener("resize", handleResize);
    handleResize();
    return () => window.removeEventListener("resize", handleResize);
  }, [zoom, pan, elements]);

  const draw = () => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawGrid(ctx, canvas.width, canvas.height, zoom, pan);
    drawElements(ctx, elements, zoom, pan);
  };

  const handleTextSubmit = (e: KeyboardEvent<HTMLInputElement> | FocusEvent<HTMLInputElement>) => {
    if (!textInput) return;
    const val = (e.currentTarget as HTMLInputElement).value.trim();
    if (val && currentUser) {
      const newEl: DrawingElement = {
        id: crypto.randomUUID(),
        type: "text",
        x: textInput.x,
        y: textInput.y,
        width: val.length * 9,
        height: 24,
        color: useBoardStore.getState().selectedColor,
        text: val,
        createdBy: currentUser.id,
      };
      useBoardStore.getState().updateLocalElement(newEl);
      sendWS({ type: "element_update", payload: newEl });
      useBoardStore.setState((s) => ({
        myCreatedIds: [...s.myCreatedIds, newEl.id],
        myRedoStack: [],
      }));
    }
    setTextInput(null);
    setSelectedTool("select");
  };

  return (
    <div ref={containerRef} className="relative w-full h-full select-none">
      <canvas
        ref={canvasRef}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        className="block w-full h-full"
      />
      {textInput && (
        <input
          autoFocus
          className="absolute bg-white border border-stone-300 rounded px-1.5 py-0.5 text-sm font-sans focus:outline-none focus:ring-1 focus:ring-zinc-950 shadow-sm"
          style={{ left: textInput.x * zoom + pan.x, top: textInput.y * zoom + pan.y }}
          onKeyDown={(e) => e.key === "Enter" ? handleTextSubmit(e) : e.key === "Escape" ? setTextInput(null) : null}
          onBlur={handleTextSubmit}
        />
      )}
    </div>
  );
}
