"use client";

import { useBoardStore } from "../hooks/use-board-store";

export default function CursorLayer() {
  const users = useBoardStore((s) => s.users);
  const currentUser = useBoardStore((s) => s.currentUser);
  const zoom = useBoardStore((s) => s.zoom);
  const pan = useBoardStore((s) => s.pan);

  const otherUsers = users.filter((u) => u.id !== currentUser?.id && u.cursor !== undefined);

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden z-20">
      {otherUsers.map((user) => {
        const x = user.cursor!.x * zoom + pan.x;
        const y = user.cursor!.y * zoom + pan.y;

        return (
          <div
            key={user.id}
            className="absolute transition-all duration-75 ease-out"
            style={{
              transform: `translate(${x}px, ${y}px)`,
            }}
          >
            <svg
              className="w-5 h-5 drop-shadow-sm"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M5.65376 12.3825L19.5702 4.49477C20.522 3.95509 21.625 4.79525 21.3934 5.86796L18.1568 20.8522C17.9252 21.925 16.5199 22.2573 15.8286 21.41L11.7584 16.425C11.5348 16.1508 11.206 15.9904 10.8587 15.9866L4.53697 15.918C3.46231 15.9064 2.89437 14.5901 3.73809 13.9189L5.65376 12.3825Z"
                fill={user.color}
                stroke="white"
                strokeWidth="2"
                strokeLinejoin="round"
              />
            </svg>
            <div
              className="ml-4 mt-2 px-2 py-0.5 rounded text-[11px] font-bold text-white shadow-sm whitespace-nowrap uppercase select-none"
              style={{ backgroundColor: user.color }}
            >
              {user.username}
            </div>
          </div>
        );
      })}
    </div>
  );
}
