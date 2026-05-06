const { handleChatRequest } = require("../chat-handler");

module.exports = async function chat(req, res) {
  if (req.method !== "POST") {
    res.statusCode = 405;
    res.setHeader("Content-Type", "application/json");
    res.end(JSON.stringify({ error: "Método no permitido." }));
    return;
  }

  await handleChatRequest(req, res, req.body || {});
};
