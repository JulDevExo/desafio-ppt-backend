export interface Player {
  choice: "piedra" | "papel" | "tijera" | null;
  name: string;
  online: boolean;
  start: boolean;
}

export interface CurrentGame {
  [playerId: string]: Player;
}

export interface Room {
  id: string;
  currentGame: CurrentGame;
  createdAt: number;
}

export interface RoomScore {
  roomId: string;
  player1: {
    id: string;
    name: string;
    wins: number;
  };
  player2: {
    id: string;
    name: string;
    wins: number;
  };
  createdAt: number;
  updatedAt: number;
}
