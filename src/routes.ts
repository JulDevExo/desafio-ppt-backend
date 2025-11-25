import { Router, Request, Response } from "express";
import { firestoreService } from "./services/firestore";
import { rtdbService } from "./services/rtdb";

const router = Router();

// Generar ID único para rooms
function generateRoomId(): string {
  return Math.random().toString(36).substring(2, 15);
}

// Generar ID único para players
function generatePlayerId(): string {
  return Math.random().toString(36).substring(2, 15) + Date.now().toString(36);
}

// POST /api/rooms - Crear un nuevo room
router.post("/rooms", async (req: Request, res: Response) => {
  try {
    const { playerName } = req.body;

    if (!playerName) {
      return res.status(400).json({ error: "playerName es requerido" });
    }

    const roomId = generateRoomId();
    const playerId = generatePlayerId();

    // Crear room en Firestore
    await firestoreService.createRoom(roomId, playerId, playerName);

    // Crear juego en RTDB
    await rtdbService.createGame(roomId, playerId, playerName);

    res.status(201).json({
      roomId,
      playerId,
      playerName,
    });
  } catch (error: any) {
    console.error("Error creating room:", error);
    res.status(500).json({ error: error.message });
  }
});

// POST /api/rooms/:roomId/join - Unirse a un room
router.post("/rooms/:roomId/join", async (req: Request, res: Response) => {
  try {
    const { roomId } = req.params;
    const { playerName } = req.body;

    if (!playerName) {
      return res.status(400).json({ error: "playerName es requerido" });
    }

    const playerId = generatePlayerId();

    // Unir jugador en Firestore
    await firestoreService.joinRoom(roomId, playerId, playerName);

    // Unir jugador en RTDB
    await rtdbService.joinGame(roomId, playerId, playerName);

    res.status(200).json({
      roomId,
      playerId,
      playerName,
    });
  } catch (error: any) {
    console.error("Error joining room:", error);
    res.status(500).json({ error: error.message });
  }
});

// POST /api/rooms/:roomId/play - Hacer una jugada
router.post("/rooms/:roomId/play", async (req: Request, res: Response) => {
  try {
    const { roomId } = req.params;
    const { playerId, choice } = req.body;

    if (!playerId || !choice) {
      return res
        .status(400)
        .json({ error: "playerId y choice son requeridos" });
    }

    if (!["piedra", "papel", "tijera"].includes(choice)) {
      return res
        .status(400)
        .json({ error: "choice debe ser piedra, papel o tijera" });
    }

    // Hacer jugada en RTDB
    await rtdbService.makeMove(roomId, playerId, choice);

    // Obtener estado del juego
    const gameState = await rtdbService.getGameState(roomId);

    res.status(200).json({
      roomId,
      playerId,
      choice,
      gameState,
    });
  } catch (error: any) {
    console.error("Error making move:", error);
    res.status(500).json({ error: error.message });
  }
});

// GET /api/rooms/:roomId/game - Obtener estado del juego
router.get("/rooms/:roomId/game", async (req: Request, res: Response) => {
  try {
    const { roomId } = req.params;

    const gameState = await rtdbService.getGameState(roomId);

    if (!gameState) {
      return res.status(404).json({ error: "Game no encontrado" });
    }

    res.status(200).json({
      roomId,
      gameState,
    });
  } catch (error: any) {
    console.error("Error getting game state:", error);
    res.status(500).json({ error: error.message });
  }
});

// POST /api/rooms/:roomId/finish - Finalizar partida y actualizar score
router.post("/rooms/:roomId/finish", async (req: Request, res: Response) => {
  try {
    const { roomId } = req.params;
    const { winnerId } = req.body;

    if (winnerId) {
      // Si hay ganador, actualizar score
      await firestoreService.updateScore(roomId, winnerId);
    }

    // Resetear juego en RTDB
    await rtdbService.resetGame(roomId);

    // Obtener score actualizado
    const score = await firestoreService.getRoomScore(roomId);

    res.status(200).json({
      roomId,
      score,
    });
  } catch (error: any) {
    console.error("Error finishing game:", error);
    res.status(500).json({ error: error.message });
  }
});

// GET /api/rooms/:roomId/score - Obtener score del room
router.get("/rooms/:roomId/score", async (req: Request, res: Response) => {
  try {
    const { roomId } = req.params;

    const score = await firestoreService.getRoomScore(roomId);

    res.status(200).json({
      roomId,
      score,
    });
  } catch (error: any) {
    console.error("Error getting score:", error);
    res.status(500).json({ error: error.message });
  }
});

// PUT /api/rooms/:roomId/players/:playerId/online - Actualizar estado online
router.put(
  "/rooms/:roomId/players/:playerId/online",
  async (req: Request, res: Response) => {
    try {
      const { roomId, playerId } = req.params;
      const { online } = req.body;

      if (typeof online !== "boolean") {
        return res.status(400).json({ error: "online debe ser boolean" });
      }

      await rtdbService.updateOnlineStatus(roomId, playerId, online);

      res.status(200).json({
        roomId,
        playerId,
        online,
      });
    } catch (error: any) {
      console.error("Error updating online status:", error);
      res.status(500).json({ error: error.message });
    }
  }
);

// POST /api/rooms/:roomId/reset - Endpoint explícito para resetear
router.post("/rooms/:roomId/reset", async (req: Request, res: Response) => {
  try {
    const { roomId } = req.params;

    // Resetear juego en RTDB
    const result = await rtdbService.resetGame(roomId);

    // Obtener estado actualizado
    const gameState = await rtdbService.getGameState(roomId);

    res.status(200).json({
      roomId,
      reset: true,
      gameState,
    });
  } catch (error: any) {
    console.error("Error resetting game:", error);
    res.status(500).json({ error: error.message });
  }
});

export default router;
