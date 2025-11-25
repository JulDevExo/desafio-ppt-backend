import admin from "../firebase";

const rtdb = admin.database();

export const rtdbService = {
  // Crear juego en tiempo real
  async createGame(roomId: string, playerId: string, playerName: string) {
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
  async joinGame(roomId: string, playerId: string, playerName: string) {
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
  async makeMove(
    roomId: string,
    playerId: string,
    choice: "piedra" | "papel" | "tijera"
  ) {
    const playerRef = rtdb.ref(`rooms/${roomId}/currentGame/${playerId}`);

    await playerRef.update({
      choice,
      start: true,
    });

    return { roomId, playerId, choice };
  },

  // Obtener estado del juego
  async getGameState(roomId: string) {
    const gameRef = rtdb.ref(`rooms/${roomId}/currentGame`);
    const snapshot = await gameRef.once("value");
    return snapshot.val();
  },

  // Resetear juego
  async resetGame(roomId: string) {
    const gameRef = rtdb.ref(`rooms/${roomId}/currentGame`);
    const snapshot = await gameRef.once("value");
    const currentGame = snapshot.val();

    if (!currentGame) return { roomId, reset: false };

    const updates: any = {};
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
  async updateOnlineStatus(roomId: string, playerId: string, online: boolean) {
    const playerRef = rtdb.ref(`rooms/${roomId}/currentGame/${playerId}`);
    await playerRef.update({ online });
  },
};
