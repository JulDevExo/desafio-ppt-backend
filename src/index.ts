import express from "express";
import cors from "cors";
import "./firebase"; // Inicializar Firebase primero
import routes from "./routes";

// Crear app Express
const app = express();
const PORT = process.env.PORT || 3000;
const Docu = `https://documenter.getpostman.com/view/40679903/2sB3WyLH4k`;

// Middlewares
app.use(
  cors({
    origin: true, // Permitir todos los orígenes temporalmente para debug
    credentials: true,
  })
);

app.use(express.json());

// Rutas
app.use("/api", routes);

// Ruta de health check
app.get("/", (req, res) => {
  res.json({
    message: "Piedra, Papel o Tijera - API REST",
    version: "1.0.0",
    endpoints: {
      createRoom: "POST /api/rooms",
      joinRoom: "POST /api/rooms/:roomId/join",
      play: "POST /api/rooms/:roomId/play",
      getGame: "GET /api/rooms/:roomId/game",
      finishGame: "POST /api/rooms/:roomId/finish",
      getScore: "GET /api/rooms/:roomId/score",
      updateOnline: "PUT /api/rooms/:roomId/players/:playerId/online",
    },
  });
});

// Iniciar servidor (solo en desarrollo local)
if (process.env.NODE_ENV !== "production") {
  app.listen(PORT, () => {
    console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
    console.log(`📚 Documentación en ${Docu}/`);
  });
}

// Exportar para Vercel
export default app;
