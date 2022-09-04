const express = require("express");
const next = require("next");

const PORT = parseInt(process.env.PORT, 10) || 3011;
const prod = process.env.NODE_ENV !== "development";
const app = next({ prod });
const handle = app.getRequestHandler();

app.prepare().then(() => {
  const server = express();

  server.get("*", (req, res) => handle(req, res));

  server.listen(PORT, err => {
    if (err) throw err;
    console.log(`🐎 => Ready on http://192.168.20.14:${PORT}`);
  });
});