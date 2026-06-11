import { WebSocketServer, WebSocket } from "ws";
import * as http from "http";
import * as fs from "fs";
import * as path from "path";
import { parse } from "url";
import { WSMessage, DrawingElement, UserPresence, Point } from "./types";

const PORT = process.env.PORT || 8080;
const DATA_DIR = path.join(__dirname, "../data");

// Create data directory if it doesn't exist
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

interface Room {
  elements: Map<string, DrawingElement>;
  users: Map<string, UserPresence>;
  clients: Map<string, WebSocket>; // userId -> WebSocket
}

const rooms = new Map<string, Room>();

// Helper to get persistence file path for a board
const getFilePath = (boardId: string) => path.join(DATA_DIR, `${boardId}.json`);

// Load board elements from file
const loadBoardState = (boardId: string): DrawingElement[] => {
  const filePath = getFilePath(boardId);
  if (fs.existsSync(filePath)) {
    try {
      const data = fs.readFileSync(filePath, "utf-8");
      return JSON.parse(data);
    } catch (err) {
      console.error(`Error loading state for board ${boardId}:`, err);
    }
  }
  return [];
};

// Save board elements to file
const saveBoardState = (boardId: string, elements: DrawingElement[]) => {
  const filePath = getFilePath(boardId);
  try {
    fs.writeFileSync(filePath, JSON.stringify(elements, null, 2), "utf-8");
  } catch (err) {
    console.error(`Error saving state for board ${boardId}:`, err);
  }
};

const server = http.createServer((req, res) => {
  res.writeHead(200, { "Content-Type": "text/plain" });
  res.end("CollabFlow WS Server is running");
});

const wss = new WebSocketServer({ noServer: true });

server.on("upgrade", (req, socket, head) => {
  const { query } = parse(req.url || "", true);
  const boardId = query.boardId as string;
  const userId = query.userId as string;
  const username = query.username as string;

  if (!boardId || !userId || !username) {
    socket.write("HTTP/1.1 400 Bad Request\r\n\r\n");
    socket.destroy();
    return;
  }

  wss.handleUpgrade(req, socket, head, (ws) => {
    wss.emit("connection", ws, req);
  });
});

// Broadcast helper
const broadcastToRoom = (boardId: string, message: WSMessage, excludeUserId?: string) => {
  const room = rooms.get(boardId);
  if (!room) return;

  const msgString = JSON.stringify(message);
  room.clients.forEach((client, id) => {
    if (id !== excludeUserId && client.readyState === WebSocket.OPEN) {
      client.send(msgString);
    }
  });
};

wss.on("connection", (ws: WebSocket, req) => {
  const { query } = parse(req.url || "", true);
  const boardId = query.boardId as string;
  const userId = query.userId as string;
  const username = query.username as string;
  const color = (query.color as string) || "#000000";

  // Initialize room if not exists
  if (!rooms.has(boardId)) {
    const loadedElements = loadBoardState(boardId);
    const elementMap = new Map<string, DrawingElement>();
    loadedElements.forEach((el) => elementMap.set(el.id, el));

    rooms.set(boardId, {
      elements: elementMap,
      users: new Map(),
      clients: new Map(),
    });
  }

  const room = rooms.get(boardId)!;
  
  // Create user presence
  const newUserPresence: UserPresence = {
    id: userId,
    username,
    color,
  };

  // Register client
  room.users.set(userId, newUserPresence);
  room.clients.set(userId, ws);

  // Broadcast join event
  broadcastToRoom(boardId, { type: "user_joined", payload: newUserPresence }, userId);

  // Send initial state to new user
  const initMsg: WSMessage = {
    type: "init",
    payload: {
      elements: Array.from(room.elements.values()),
      users: Array.from(room.users.values()),
    },
  };
  ws.send(JSON.stringify(initMsg));

  ws.on("message", (rawMessage) => {
    try {
      const message: WSMessage = JSON.parse(rawMessage.toString());

      switch (message.type) {
        case "cursor_update": {
          const user = room.users.get(userId);
          if (user) {
            user.cursor = message.payload.cursor;
            broadcastToRoom(
              boardId,
              { type: "cursor_update", payload: { id: userId, cursor: user.cursor } },
              userId
            );
          }
          break;
        }

        case "element_update": {
          const element = message.payload;
          room.elements.set(element.id, element);
          broadcastToRoom(boardId, { type: "element_update", payload: element }, userId);
          saveBoardState(boardId, Array.from(room.elements.values()));
          break;
        }

        case "element_delete": {
          const { id } = message.payload;
          room.elements.delete(id);
          broadcastToRoom(boardId, { type: "element_delete", payload: { id } }, userId);
          saveBoardState(boardId, Array.from(room.elements.values()));
          break;
        }

        case "clear_board": {
          room.elements.clear();
          broadcastToRoom(boardId, { type: "clear_board" }, userId);
          saveBoardState(boardId, []);
          break;
        }
      }
    } catch (err) {
      console.error("Failed to parse websocket message:", err);
    }
  });

  ws.on("close", () => {
    room.users.delete(userId);
    room.clients.delete(userId);

    broadcastToRoom(boardId, { type: "user_left", payload: { id: userId } });

    // Clean up room if completely empty
    if (room.clients.size === 0) {
      rooms.delete(boardId);
    }
  });

  ws.on("error", (err) => {
    console.error(`Socket error for user ${username} in room ${boardId}:`, err);
  });
});

server.listen(PORT, () => {
  console.log(`WebSocket server is listening on port ${PORT}`);
});
