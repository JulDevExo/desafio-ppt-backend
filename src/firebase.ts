import admin from "firebase-admin";
import dotenv from "dotenv";
import path from "path";

// Cargar variables de entorno
dotenv.config();

// Inicializar Firebase Admin
let serviceAccount;

if (process.env.FIREBASE_SERVICE_ACCOUNT) {
  // En producción: usar variable de entorno
  serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);
} else {
  // En desarrollo: usar archivo local
  // Ajustar la ruta dependiendo de si estamos en src o dist
  const keyPath = path.join(__dirname, "..", "serviceAccountKey.json");
  serviceAccount = require(keyPath);
}

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: process.env.FIREBASE_DATABASE_URL,
});

export default admin;
