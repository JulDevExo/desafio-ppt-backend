"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.rtdbService = void 0;
const firebase_1 = __importDefault(require("../firebase"));
const rtdb = firebase_1.default.database();
exports.rtdbService = {
    // Crear juego en tiempo real
    async createGame(roomId, playerId, playerName) {
        const gameRef = rtdb.ref(`rooms/${roomId}/currentGame`);
        await gameRef.set({
            [playerId]: {
                choice: null,
                name: playerName,
                online: true,
                start: false,
            },
        });
        return { roomId, playerId };
    },
    // Unir segundo jugador
    async joinGame(roomId, playerId, playerName) {
        const gameRef = rtdb.ref(`rooms/${roomId}/currentGame/${playerId}`);
        await gameRef.set({
            choice: null,
            name: playerName,
            online: true,
            start: false,
        });
        return { roomId, playerId };
    },
    // Hacer una jugada
    async makeMove(roomId, playerId, choice) {
        const playerRef = rtdb.ref(`rooms/${roomId}/currentGame/${playerId}`);
        await playerRef.update({
            choice,
            start: true,
        });
        return { roomId, playerId, choice };
    },
    // Obtener estado del juego
    async getGameState(roomId) {
        const gameRef = rtdb.ref(`rooms/${roomId}/currentGame`);
        const snapshot = await gameRef.once("value");
        return snapshot.val();
    },
    // Resetear juego
    async resetGame(roomId) {
        const gameRef = rtdb.ref(`rooms/${roomId}/currentGame`);
        const snapshot = await gameRef.once("value");
        const currentGame = snapshot.val();
        if (!currentGame)
            return { roomId, reset: false };
        const updates = {};
        Object.keys(currentGame).forEach((playerId) => {
            // Resetear completamente el estado del jugador
            updates[`${playerId}/choice`] = null;
            updates[`${playerId}/start`] = false;
        });
        await gameRef.update(updates);
        // Verificar que se actualizó correctamente
        const updatedSnapshot = await gameRef.once("value");
        const updatedGame = updatedSnapshot.val();
        console.log(`🔄 Juego reseteado en room ${roomId}:`, updatedGame);
        return { roomId, reset: true, gameState: updatedGame };
    },
    // Actualizar estado online
    async updateOnlineStatus(roomId, playerId, online) {
        const playerRef = rtdb.ref(`rooms/${roomId}/currentGame/${playerId}`);
        await playerRef.update({ online });
    },
};
