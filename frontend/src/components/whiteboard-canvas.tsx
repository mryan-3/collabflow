"use client";
import { useEffect, useRef } from "react";
import { useBoardStore } from "../hooks/use-board-store";
import { useCanvasDraw } from "../hooks/use-canvas-draw";
import { drawGrid, drawElements } from "../utils/canvas-renderer";
import { DrawingElement } from "../types/board";
import { generateId } from "../utils/id";
import { TextInputOverlay } from "./text-input-overlay";

export default function WhiteboardCanvas({ sendWS }: { sendWS: (msg: any) => void }) {
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
    const canvas = canvasRef.current, ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawGrid(ctx, canvas.width, canvas.height, zoom, pan);
    drawElements(ctx, elements, zoom, pan);
  };

  const handleTextSubmit = (val: string) => {
    if (!textInput) return;
    const trimmed = val.trim();
    if (trimmed && currentUser) {
      const newEl: DrawingElement = {
        id: generateId(), type: "text", x: textInput.x, y: textInput.y,
        width: trimmed.length * 9, height: 24, text: trimmed,
        color: useBoardStore.getState().selectedColor, createdBy: currentUser.id,
      };
      useBoardStore.getState().updateLocalElement(newEl);
      sendWS({ type: "element_update", payload: newEl });
      useBoardStore.setState((s) => ({ myCreatedIds: [...s.myCreatedIds, newEl.id], myRedoStack: [] }));
    }
    setTextInput(null);
    if (useBoardStore.getState().selectedTool === "text") setSelectedTool("select");
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
        <TextInputOverlay
          x={textInput.x} y={textInput.y} zoom={zoom} pan={pan}
          onSubmit={handleTextSubmit} onCancel={() => setTextInput(null)}
        />
      )}
    </div>
  );
}

