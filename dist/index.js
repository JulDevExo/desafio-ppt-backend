"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
require("./firebase"); // Inicializar Firebase primero
const routes_1 = __importDefault(require("./routes"));
// Crear app Express
const app = (0, express_1.default)();
const PORT = process.env.PORT || 3000;
const Docu = `https://documenter.getpostman.com/view/40679903/2sB3WyLH4k`;
// Middlewares
app.use((0, cors_1.default)({
    origin: [
        "http://localhost:1234",
        "https://desafio-ppt.vercel.app",
        "https://desafio-ndg62b281-julian94xd-gmailcoms-projects.vercel.app/", // o tu dominio real
    ],
    credentials: true,
}));
app.use(express_1.default.json());
// Rutas
app.use("/api", routes_1.default);
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
exports.default = app;
