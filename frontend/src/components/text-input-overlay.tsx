import { KeyboardEvent, FocusEvent } from "react";

interface TextInputOverlayProps {
  x: number;
  y: number;
  zoom: number;
  pan: { x: number; y: number };
  onSubmit: (val: string) => void;
  onCancel: () => void;
}

export function TextInputOverlay({
  x,
  y,
  zoom,
  pan,
  onSubmit,
  onCancel,
}: TextInputOverlayProps) {
  const handleSubmit = (e: KeyboardEvent<HTMLInputElement> | FocusEvent<HTMLInputElement>) => {
    onSubmit(e.currentTarget.value);
  };

  return (
    <input
      autoFocus
      className="absolute z-50 bg-white text-zinc-900 border border-stone-300 rounded px-1.5 py-0.5 text-sm font-sans focus:outline-none focus:ring-1 focus:ring-zinc-950 shadow-sm"
      style={{ left: x * zoom + pan.x, top: y * zoom + pan.y }}
      onKeyDown={(e) => {
        if (e.key === "Enter") {
          handleSubmit(e);
        } else if (e.key === "Escape") {
          onCancel();
        }
      }}
      onBlur={handleSubmit}
    />
  );
}
