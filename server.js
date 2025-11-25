// Entry point para Railway (inicia el servidor)
const app = require('./dist/index.js').default;

const PORT = process.env.PORT || 3000;

app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Servidor corriendo en puerto ${PORT}`);
  console.log(`📚 Railway deployment`);
});

