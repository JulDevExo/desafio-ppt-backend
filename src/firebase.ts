import admin from "firebase-admin";
import dotenv from "dotenv";

// Cargar variables de entorno
dotenv.config();

// Inicializar Firebase Admin
const serviceAccount = require("../serviceAccountKey.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: process.env.FIREBASE_DATABASE_URL,
});

export default admin;

