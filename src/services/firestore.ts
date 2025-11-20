import admin from "../firebase";

const db = admin.firestore();

export const firestoreService = {
  // Crear un nuevo room
  async createRoom(roomId: string, player1Id: string, player1Name: string) {
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
  async joinRoom(roomId: string, player2Id: string, player2Name: string) {
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
  async getRoomScore(roomId: string) {
    const roomDoc = await db.collection("rooms").doc(roomId).get();

    if (!roomDoc.exists) {
      throw new Error("Room no encontrado");
    }

    return roomDoc.data();
  },

  // Actualizar score después de una partida
  async updateScore(roomId: string, winnerId: string) {
    const roomRef = db.collection("rooms").doc(roomId);
    const roomDoc = await roomRef.get();

    if (!roomDoc.exists) {
      throw new Error("Room no encontrado");
    }

    const data = roomDoc.data();

    if (data?.player1.id === winnerId) {
      await roomRef.update({
        "player1.wins": admin.firestore.FieldValue.increment(1),
        updatedAt: Date.now(),
      });
    } else if (data?.player2.id === winnerId) {
      await roomRef.update({
        "player2.wins": admin.firestore.FieldValue.increment(1),
        updatedAt: Date.now(),
      });
    }

    return await roomRef.get().then((doc) => doc.data());
  },
};
