import { useEffect, useRef } from "react";
import { useBoardStore } from "./use-board-store";
import { DrawingElement, UserPresence } from "../types/board";

export function useWebSocket(boardId: string) {
  const socketRef = useRef<WebSocket | null>(null);
  const currentUser = useBoardStore((s) => s.currentUser);
  const { setElements, setUsers, updateLocalElement, deleteLocalElement } = useBoardStore();

  useEffect(() => {
    if (!currentUser || !boardId) return;

    const protocol = window.location.protocol === "https:" ? "wss:" : "ws:";
    const host = window.location.hostname === "localhost" ? "localhost:8080" : window.location.host;
    const url = `${protocol}//${host}?boardId=${boardId}&userId=${currentUser.id}&username=${encodeURIComponent(currentUser.username)}&color=${encodeURIComponent(currentUser.color)}`;

    const socket = new WebSocket(url);
    socketRef.current = socket;

    socket.onmessage = (event) => {
      try {
        const msg = JSON.parse(event.data);
        const currentUsers = useBoardStore.getState().users;

        switch (msg.type) {
          case "init":
            setElements(msg.payload.elements);
            setUsers(msg.payload.users);
            break;
          case "user_joined":
            setUsers([...currentUsers.filter((u) => u.id !== msg.payload.id), msg.payload]);
            break;
          case "user_left":
            setUsers(currentUsers.filter((u) => u.id !== msg.payload.id));
            break;
          case "cursor_update":
            setUsers(currentUsers.map((u) => (u.id === msg.payload.id ? { ...u, cursor: msg.payload.cursor } : u)));
            break;
          case "element_update":
            updateLocalElement(msg.payload);
            break;
          case "element_delete":
            deleteLocalElement(msg.payload.id);
            break;
        }
      } catch (err) {
        console.error(err);
      }
    };

    return () => {
      socket.close();
      socketRef.current = null;
    };
  }, [boardId, currentUser, setElements, setUsers, updateLocalElement, deleteLocalElement]);

  const send = (msg: any) => {
    if (socketRef.current?.readyState === WebSocket.OPEN) {
      socketRef.current.send(JSON.stringify(msg));
    }
  };

  return { send };
}
