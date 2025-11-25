"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const firestore_1 = require("./services/firestore");
const rtdb_1 = require("./services/rtdb");
const router = (0, express_1.Router)();
// Generar ID único para rooms
function generateRoomId() {
    return Math.random().toString(36).substring(2, 15);
}
// Generar ID único para players
function generatePlayerId() {
    return Math.random().toString(36).substring(2, 15) + Date.now().toString(36);
}
// POST /api/rooms - Crear un nuevo room
router.post("/rooms", async (req, res) => {
    try {
        const { playerName } = req.body;
        if (!playerName) {
            return res.status(400).json({ error: "playerName es requerido" });
        }
        const roomId = generateRoomId();
        const playerId = generatePlayerId();
        // Crear room en Firestore
        await firestore_1.firestoreService.createRoom(roomId, playerId, playerName);
        // Crear juego en RTDB
        await rtdb_1.rtdbService.createGame(roomId, playerId, playerName);
        res.status(201).json({
            roomId,
            playerId,
            playerName,
        });
    }
    catch (error) {
        console.error("Error creating room:", error);
        res.status(500).json({ error: error.message });
    }
});
// POST /api/rooms/:roomId/join - Unirse a un room
router.post("/rooms/:roomId/join", async (req, res) => {
    try {
        const { roomId } = req.params;
        const { playerName } = req.body;
        if (!playerName) {
            return res.status(400).json({ error: "playerName es requerido" });
        }
        const playerId = generatePlayerId();
        // Unir jugador en Firestore
        await firestore_1.firestoreService.joinRoom(roomId, playerId, playerName);
        // Unir jugador en RTDB
        await rtdb_1.rtdbService.joinGame(roomId, playerId, playerName);
        res.status(200).json({
            roomId,
            playerId,
            playerName,
        });
    }
    catch (error) {
        console.error("Error joining room:", error);
        res.status(500).json({ error: error.message });
    }
});
// POST /api/rooms/:roomId/play - Hacer una jugada
router.post("/rooms/:roomId/play", async (req, res) => {
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
        await rtdb_1.rtdbService.makeMove(roomId, playerId, choice);
        // Obtener estado del juego
        const gameState = await rtdb_1.rtdbService.getGameState(roomId);
        res.status(200).json({
            roomId,
            playerId,
            choice,
            gameState,
        });
    }
    catch (error) {
        console.error("Error making move:", error);
        res.status(500).json({ error: error.message });
    }
});
// GET /api/rooms/:roomId/game - Obtener estado del juego
router.get("/rooms/:roomId/game", async (req, res) => {
    try {
        const { roomId } = req.params;
        const gameState = await rtdb_1.rtdbService.getGameState(roomId);
        if (!gameState) {
            return res.status(404).json({ error: "Game no encontrado" });
        }
        res.status(200).json({
            roomId,
            gameState,
        });
    }
    catch (error) {
        console.error("Error getting game state:", error);
        res.status(500).json({ error: error.message });
    }
});
// POST /api/rooms/:roomId/finish - Finalizar partida y actualizar score
router.post("/rooms/:roomId/finish", async (req, res) => {
    try {
        const { roomId } = req.params;
        const { winnerId } = req.body;
        if (winnerId) {
            // Si hay ganador, actualizar score
            await firestore_1.firestoreService.updateScore(roomId, winnerId);
        }
        // Resetear juego en RTDB
        await rtdb_1.rtdbService.resetGame(roomId);
        // Obtener score actualizado
        const score = await firestore_1.firestoreService.getRoomScore(roomId);
        res.status(200).json({
            roomId,
            score,
        });
    }
    catch (error) {
        console.error("Error finishing game:", error);
        res.status(500).json({ error: error.message });
    }
});
// GET /api/rooms/:roomId/score - Obtener score del room
router.get("/rooms/:roomId/score", async (req, res) => {
    try {
        const { roomId } = req.params;
        const score = await firestore_1.firestoreService.getRoomScore(roomId);
        res.status(200).json({
            roomId,
            score,
        });
    }
    catch (error) {
        console.error("Error getting score:", error);
        res.status(500).json({ error: error.message });
    }
});
// PUT /api/rooms/:roomId/players/:playerId/online - Actualizar estado online
router.put("/rooms/:roomId/players/:playerId/online", async (req, res) => {
    try {
        const { roomId, playerId } = req.params;
        const { online } = req.body;
        if (typeof online !== "boolean") {
            return res.status(400).json({ error: "online debe ser boolean" });
        }
        await rtdb_1.rtdbService.updateOnlineStatus(roomId, playerId, online);
        res.status(200).json({
            roomId,
            playerId,
            online,
        });
    }
    catch (error) {
        console.error("Error updating online status:", error);
        res.status(500).json({ error: error.message });
    }
});
exports.default = router;
