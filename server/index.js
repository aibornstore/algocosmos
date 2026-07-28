/**
 * ALGOKOSMOS Game Server
 * Multiplayer WebSocket server for Tetris Battle, Pong Online, Snake Arena
 */
const http = require('http');
const WebSocket = require('ws');
const { v4: uuidv4 } = require('uuid');

const PORT = process.env.PORT || 3000;

// Game rooms
const rooms = {
  tetris: new Map(),
  pong: new Map(),
  snake: new Map()
};

// HTTP server
const server = http.createServer((req, res) => {
  res.writeHead(200, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify({
    status: 'ok',
    games: ['tetris', 'pong', 'snake'],
    rooms: {
      tetris: rooms.tetris.size,
      pong: rooms.pong.size,
      snake: rooms.snake.size
    }
  }));
});

// WebSocket server
const wss = new WebSocket.Server({ server });

wss.on('connection', (ws) => {
  console.log('New connection');
  let currentRoom = null;
  let playerId = uuidv4();

  ws.on('message', (data) => {
    try {
      const msg = JSON.parse(data);
      
      switch(msg.type) {
        case 'join':
          handleJoin(ws, msg, playerId);
          break;
        case 'move':
          handleMove(ws, msg, playerId);
          break;
        case 'leave':
          handleLeave(ws, playerId);
          break;
        default:
          ws.send(JSON.stringify({ type: 'error', message: 'Unknown type' }));
      }
    } catch (e) {
      ws.send(JSON.stringify({ type: 'error', message: e.message }));
    }
  });

  ws.on('close', () => {
    handleLeave(ws, playerId);
  });

  function handleJoin(ws, msg, playerId) {
    const { game, room } = msg;
    
    if (!rooms[game]) {
      ws.send(JSON.stringify({ type: 'error', message: 'Invalid game' }));
      return;
    }

    // Create room if not exists
    if (!rooms[game].has(room)) {
      rooms[game].set(room, {
        id: room,
        game: game,
        players: new Map(),
        state: null,
        started: false
      });
    }

    const gameRoom = rooms[game].get(room);
    
    // Max players per game
    const maxPlayers = game === 'snake' ? 20 : 2;
    if (gameRoom.players.size >= maxPlayers) {
      ws.send(JSON.stringify({ type: 'error', message: 'Room full' }));
      return;
    }

    // Add player
    gameRoom.players.set(playerId, {
      id: playerId,
      ws: ws,
      ready: false,
      score: 0
    });

    ws.roomId = room;
    ws.gameType = game;
    ws.playerId = playerId;

    // Send confirmation
    ws.send(JSON.stringify({
      type: 'joined',
      playerId: playerId,
      room: room,
      players: Array.from(gameRoom.players.keys())
    }));

    // Notify others
    broadcastToRoom(game, room, {
      type: 'player_joined',
      playerId: playerId,
      playerCount: gameRoom.players.size
    }, playerId);

    console.log(`Player ${playerId} joined ${game}/${room}`);
  }

  function handleMove(ws, msg, playerId) {
    const { game, room } = msg;
    
    if (!rooms[game] || !rooms[game].has(room)) return;

    const gameRoom = rooms[game].get(room);
    
    // Broadcast move to all players
    broadcastToRoom(game, room, {
      type: 'move',
      playerId: playerId,
      data: msg.data
    }, playerId);
  }

  function handleLeave(ws, playerId) {
    if (!ws.roomId || !ws.gameType) return;

    const game = ws.gameType;
    const room = ws.roomId;

    if (rooms[game] && rooms[game].has(room)) {
      const gameRoom = rooms[game].get(room);
      gameRoom.players.delete(playerId);

      // Notify others
      broadcastToRoom(game, room, {
        type: 'player_left',
        playerId: playerId,
        playerCount: gameRoom.players.size
      });

      // Delete empty room
      if (gameRoom.players.size === 0) {
        rooms[game].delete(room);
        console.log(`Room ${game}/${room} deleted (empty)`);
      }

      console.log(`Player ${playerId} left ${game}/${room}`);
    }
  }

  function broadcastToRoom(game, room, message, excludeId = null) {
    if (!rooms[game] || !rooms[game].has(room)) return;

    const gameRoom = rooms[game].get(room);
    const data = JSON.stringify(message);

    gameRoom.players.forEach((player, id) => {
      if (id !== excludeId && player.ws.readyState === WebSocket.OPEN) {
        player.ws.send(data);
      }
    });
  }
});

// Start server
server.listen(PORT, () => {
  console.log(`ALGOKOSMOS Game Server running on port ${PORT}`);
});

// Graceful shutdown
process.on('SIGINT', () => {
  console.log('Shutting down...');
  wss.clients.forEach(client => client.close());
  server.close();
  process.exit(0);
});
