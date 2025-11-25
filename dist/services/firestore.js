"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.firestoreService = void 0;
const firebase_1 = __importDefault(require("../firebase"));
const db = firebase_1.default.firestore();
exports.firestoreService = {
    // Crear un nuevo room
    async createRoom(roomId, player1Id, player1Name) {
        const roomScore = {
            roomId,
            player1: {
                id: player1Id,
                name: player1Name,
                wins: 0,
            },
            player2: {
                id: "",
                name: "",
                wins: 0,
            },
            createdAt: Date.now(),
            updatedAt: Date.now(),
        };
        await db.collection("rooms").doc(roomId).set(roomScore);
        return roomScore;
    },
    // Unir jugador 2 al room
    async joinRoom(roomId, player2Id, player2Name) {
        const roomRef = db.collection("rooms").doc(roomId);
        const roomDoc = await roomRef.get();
        if (!roomDoc.exists) {
            throw new Error("Room no encontrado");
        }
        await roomRef.update({
            "player2.id": player2Id,
            "player2.name": player2Name,
            updatedAt: Date.now(),
        });
        return roomDoc.data();
    },
    // Obtener score del room
    async getRoomScore(roomId) {
        const roomDoc = await db.collection("rooms").doc(roomId).get();
        if (!roomDoc.exists) {
            throw new Error("Room no encontrado");
        }
        return roomDoc.data();
    },
    // Actualizar score después de una partida
    async updateScore(roomId, winnerId) {
        const roomRef = db.collection("rooms").doc(roomId);
        const roomDoc = await roomRef.get();
        if (!roomDoc.exists) {
            throw new Error("Room no encontrado");
        }
        const data = roomDoc.data();
        if (data?.player1.id === winnerId) {
            await roomRef.update({
                "player1.wins": firebase_1.default.firestore.FieldValue.increment(1),
                updatedAt: Date.now(),
            });
        }
        else if (data?.player2.id === winnerId) {
            await roomRef.update({
                "player2.wins": firebase_1.default.firestore.FieldValue.increment(1),
                updatedAt: Date.now(),
            });
        }
        return await roomRef.get().then((doc) => doc.data());
    },
};
