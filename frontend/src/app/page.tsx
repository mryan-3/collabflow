"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Plus, ArrowRight, Shapes } from "@phosphor-icons/react";
import { generateId } from "../utils/id";

export default function Home() {
  const router = useRouter();
  const [boardId, setBoardId] = useState("");

  const handleCreate = () => {
    const newId = generateId();
    router.push(`/board/${newId}`);
  };

  const handleJoin = (e: React.FormEvent) => {
    e.preventDefault();
    if (boardId.trim()) {
      router.push(`/board/${boardId.trim()}`);
    }
  };

  return (
    <div className="relative flex flex-col items-center justify-center h-screen overflow-hidden bg-stone-50 font-sans selection:bg-zinc-900 selection:text-white">

      <div className="absolute top-0 left-0 w-[40vw] h-[40vw] max-w-[500px] max-h-[500px] bg-blue-500 rounded-br-[100px] sm:rounded-br-[200px] -translate-x-1/2 -translate-y-1/2 opacity-10 pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-[50vw] h-[50vw] max-w-[600px] max-h-[600px] bg-red-500 rounded-tl-[100px] sm:rounded-tl-[200px] translate-x-1/3 translate-y-1/3 opacity-10 pointer-events-none" />

      <div className="relative z-10 w-full max-w-3xl px-6 flex flex-col gap-16 text-center">
        <div className="flex flex-col items-center gap-8">
          <div className="p-5 bg-zinc-900 rounded-3xl shadow-2xl shadow-zinc-900/20 rotate-[-4deg] hover:rotate-0 transition-transform duration-300">
            <Shapes size={56} className="text-white" weight="duotone" />
          </div>
          <div className="flex flex-col gap-4">
            <h1 className="text-6xl sm:text-7xl md:text-8xl font-black text-zinc-900 tracking-tighter leading-[0.95]">
              CollabFlow
            </h1>
            <p className="text-xl sm:text-2xl text-stone-500 max-w-xl mx-auto font-medium tracking-tight">
              A blank canvas for your best ideas. No clutter, just creation.
            </p>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 items-center justify-center max-w-lg mx-auto w-full">
          <button
            onClick={handleCreate}
            className="w-full sm:w-auto flex items-center justify-center gap-3 px-8 py-5 bg-zinc-900 hover:bg-zinc-800 text-white font-bold rounded-2xl transition-all shadow-xl shadow-zinc-900/20 hover:-translate-y-1 active:translate-y-0 cursor-pointer text-lg"
          >
            <Plus size={24} weight="bold" />
            New Board
          </button>

          <div className="text-stone-400 font-bold px-4 py-2 uppercase text-sm tracking-widest">
            or
          </div>

          <form onSubmit={handleJoin} className="w-full sm:w-auto flex flex-1 relative group">
            <input
              type="text"
              required
              placeholder="Board ID"
              value={boardId}
              onChange={(e) => setBoardId(e.target.value)}
              className="w-full px-6 py-5 bg-white border-2 border-stone-200 rounded-2xl focus:outline-none focus:border-zinc-900 focus:ring-4 focus:ring-zinc-900/10 transition-all font-bold text-zinc-900 placeholder:text-stone-400 shadow-sm text-lg"
            />
            <button
              type="submit"
              className="absolute right-3 top-1/2 -translate-y-1/2 p-3 bg-stone-100 hover:bg-stone-200 text-zinc-900 rounded-xl transition-all cursor-pointer group-focus-within:bg-zinc-900 group-focus-within:text-white"
            >
              <ArrowRight size={20} weight="bold" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
