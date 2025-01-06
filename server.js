const { createServer } = require("https");
const { parse } = require("url");
const next = require("next");
const fs = require("fs");

const app = next({ dev: true }); // Modo desarrollo
const handle = app.getRequestHandler();

// Carga los certificados generados por mkcert
const httpsOptions = {
  key: fs.readFileSync("./190.1.117.20-key.pem"), // Clave privada
  cert: fs.readFileSync("./190.1.117.20.pem"),   // Certificado
};

app.prepare().then(() => {
  createServer(httpsOptions, (req, res) => {
    const parsedUrl = parse(req.url, true);
    handle(req, res, parsedUrl);
  }).listen(3001, () => {
    console.log("> Ready on https://190.1.117.20:3001");
  });
});
