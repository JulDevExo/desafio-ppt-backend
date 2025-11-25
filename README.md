# 🎮 Piedra, Papel o Tijera - API REST

API REST para juego multijugador de Piedra, Papel o Tijera en tiempo real.

## 🚀 Tecnologías

- **Node.js** + **Express** + **TypeScript**
- **Firebase Realtime Database** (sincronización en tiempo real)
- **Firestore** (almacenamiento persistente de scores)
- **Firebase Admin SDK**

## 📦 Instalación

npm install## ⚙️ Configuración

1. Crea un archivo `.env` en la raíz del proyecto:

PORT=3000
FIREBASE_DATABASE_URL=https://tu-proyecto.firebaseio.com2. Coloca tu archivo `serviceAccountKey.json` de Firebase en la raíz del proyecto.

## 🏃 Ejecutar en desarrollo

npm run devEl servidor estará disponible en `http://localhost:3000`

## 🏗️ Build para producción

npm run build
npm start

## 🚀 Deploy en Vercel

### 1. Configurar Variables de Entorno en Vercel

Ve a tu proyecto en Vercel → Settings → Environment Variables y agrega:

- `FIREBASE_DATABASE_URL`: URL de tu Realtime Database (ej: `https://tu-proyecto-default-rtdb.firebaseio.com`)
- `FIREBASE_SERVICE_ACCOUNT`: El contenido completo del archivo `serviceAccountKey.json` como un string JSON (copia todo el contenido del archivo)
- `NODE_ENV`: `production`

### 2. Desplegar

```bash
# Instalar Vercel CLI (si no lo tienes)
npm i -g vercel

# Desplegar
vercel
```

O simplemente conecta tu repositorio de GitHub con Vercel y se desplegará automáticamente.

**Nota importante:** El archivo `serviceAccountKey.json` NO debe subirse a Git. En producción, usa la variable de entorno `FIREBASE_SERVICE_ACCOUNT`.

## 📚 Documentación de la API

### Link a documentación interactiva de Postman:

**[📖 Ver Documentación Completa](https://documenter.getpostman.com/view/40679903/2sB3WyLH4k)**

### Endpoints principales:

#### 1. Crear Room

POST /api/rooms
Content-Type: application/json

{
"playerName": "Jugador1"
}**Respuesta:**
{
"roomId": "abc123",
"playerId": "player_xxx",
"playerName": "Jugador1"
}---

#### 2. Unirse a Room

POST /api/rooms/:roomId/join
Content-Type: application/json

{
"playerName": "Jugador2"
}---

#### 3. Hacer Jugada

POST /api/rooms/:roomId/play
Content-Type: application/json

{
"playerId": "player_xxx",
"choice": "piedra"
}Opciones válidas: `"piedra"`, `"papel"`, `"tijera"`

---

#### 4. Obtener Estado del Juego

GET /api/rooms/:roomId/game---

#### 5. Finalizar Partida

POST /api/rooms/:roomId/finish
Content-Type: application/json

{
"winnerId": "player_xxx"
}---

#### 6. Obtener Score

GET /api/rooms/:roomId/score## 🎯 Flujo del Juego

1. **Jugador 1** crea un room → obtiene `roomId` y `playerId`
2. **Jugador 2** se une al room usando el `roomId` → obtiene su `playerId`
3. Ambos jugadores hacen sus jugadas con sus respectivos `playerId`
4. El cliente determina el ganador y llama a `/finish` con el `winnerId`
5. El score se actualiza en Firestore
6. Para jugar otra ronda, repetir desde el paso 3

## 📁 Estructura del Proyecto
