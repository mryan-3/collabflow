"use client";

import { useBoardStore } from "../hooks/use-board-store";
import { Plus, Minus, ArrowCounterClockwise } from "@phosphor-icons/react";

export default function WhiteboardViewControls() {
  const { zoom, setZoom, setPan } = useBoardStore();

  const handleZoomIn = () => setZoom((z) => Math.min(3, z + 0.1));
  const handleZoomOut = () => setZoom((z) => Math.max(0.2, z - 0.1));
  const handleReset = () => {
    setZoom(1);
    setPan({ x: 0, y: 0 });
  };

  return (
    <div className="absolute right-6 bottom-6 z-10 flex items-center gap-2 p-1.5 bg-white/90 backdrop-blur-md border border-stone-200 rounded-xl shadow-md">
      <button
        onClick={handleZoomOut}
        title="Zoom Out"
        className="p-1.5 rounded-lg text-zinc-500 hover:bg-stone-50 hover:text-zinc-900 transition-all cursor-pointer"
      >
        <Minus size={16} />
      </button>
      <span className="text-xs font-semibold text-zinc-600 w-12 text-center select-none">
        {Math.round(zoom * 100)}%
      </span>
      <button
        onClick={handleZoomIn}
        title="Zoom In"
        className="p-1.5 rounded-lg text-zinc-500 hover:bg-stone-50 hover:text-zinc-900 transition-all cursor-pointer"
      >
        <Plus size={16} />
      </button>
      <div className="w-px h-4 bg-stone-200 mx-1" />
      <button
        onClick={handleReset}
        title="Reset view"
        className="p-1.5 rounded-lg text-zinc-500 hover:bg-stone-50 hover:text-zinc-900 transition-all cursor-pointer"
      >
        <ArrowCounterClockwise size={16} />
      </button>
    </div>
  );
}
