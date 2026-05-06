const http = require("node:http");
const fs = require("node:fs");
const path = require("node:path");
const { handleChatRequest } = require("./chat-handler");

const root = __dirname;
const port = Number(process.env.PORT || 3000);
const types = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
};

const server = http.createServer(async (req, res) => {
  if (req.method === "GET" && req.url === "/env.js") {
    res.writeHead(200, { "Content-Type": "text/javascript; charset=utf-8" });
    res.end(`window.WEBPANINI_ENV = ${JSON.stringify({
      SUPABASE_URL: process.env.SUPABASE_URL || "",
      SUPABASE_ANON_KEY: process.env.SUPABASE_ANON_KEY || "",
      APP_URL: process.env.APP_URL || "",
    })};`);
    return;
  }

  if (req.method === "POST" && req.url === "/api/chat") {
    const chunks = [];
    req.on("data", (chunk) => chunks.push(chunk));
    req.on("end", () => {
      let body = {};
      try {
        body = JSON.parse(Buffer.concat(chunks).toString("utf8") || "{}");
      } catch {
        res.writeHead(400, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ error: "JSON inválido." }));
        return;
      }
      handleChatRequest(req, res, body);
    });
    return;
  }

  const cleanUrl = decodeURIComponent(req.url.split("?")[0]);
  const routePath = cleanUrl.replace(/\/+$/, "") || "/";
  const appRoutes = new Set(["/", "/login", "/album"]);
  const requestPath = appRoutes.has(routePath) ? "/index.html" : cleanUrl;
  const filePath = path.normalize(path.join(root, requestPath));
  if (!filePath.startsWith(root)) return notFound(res);

  fs.readFile(filePath, (error, content) => {
    if (error) return notFound(res);
    res.writeHead(200, { "Content-Type": types[path.extname(filePath)] || "application/octet-stream" });
    res.end(content);
  });
});

server.listen(port, () => {
  console.log(`WebPanini listo en http://localhost:${port}`);
});

function notFound(res) {
  res.writeHead(404, { "Content-Type": "text/plain; charset=utf-8" });
  res.end("No encontrado");
}
