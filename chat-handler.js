const fs = require("node:fs");
const path = require("node:path");

const dataPath = path.join(__dirname, "data.js");
const rawData = fs.readFileSync(dataPath, "utf8").replace(/^\uFEFF?window\.STICKERS = /, "").replace(/;\s*$/, "");
const stickers = JSON.parse(rawData);
const validCodes = new Set(stickers.map((item) => item.code.toUpperCase()));

async function handleChatRequest(req, res, body) {
  const text = String(body?.message || "").slice(0, 1000);
  if (!text.trim()) return sendJson(res, 400, { error: "Mensaje vacío." });

  if (!process.env.OPENAI_API_KEY) {
    return sendJson(res, 200, { source: "local", operations: fallbackParse(text) });
  }

  try {
    const operations = await parseWithOpenAI(text);
    return sendJson(res, 200, { source: "openai", operations });
  } catch (error) {
    return sendJson(res, 200, { source: "local", warning: error.message, operations: fallbackParse(text) });
  }
}

async function parseWithOpenAI(text) {
  const response = await fetch("https://api.openai.com/v1/responses", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: process.env.OPENAI_MODEL || "gpt-5.4-mini",
      input: [
        {
          role: "system",
          content:
            "Convierte mensajes de coleccionista Panini en JSON estricto. " +
            "Responde solo un arreglo de operaciones con {code, action}. " +
            "action debe ser add, duplicate, missing o remove. " +
            "Normaliza codigos como COL 1 a COL1. Si dice repetida usa duplicate; si dice falta usa missing.",
        },
        { role: "user", content: `Codigos validos: ${[...validCodes].join(", ")}\nMensaje: ${text}` },
      ],
    }),
  });

  if (!response.ok) throw new Error(`OpenAI respondió ${response.status}`);
  const payload = await response.json();
  const content = payload.output_text || payload.output?.flatMap((item) => item.content || []).map((part) => part.text || "").join("");
  const parsed = JSON.parse(content);
  return sanitizeOperations(parsed);
}

function fallbackParse(text) {
  const normalized = text
    .toUpperCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/([A-Z]{2,4})\s+(\d{1,2})/g, "$1$2");
  const lower = text.toLowerCase();
  const action = /falt|necesit|pendient/.test(lower)
    ? "missing"
    : /quitar|restar|borrar|eliminar/.test(lower)
      ? "remove"
      : /repetid|duplicad/.test(lower)
        ? "duplicate"
        : "add";
  const found = new Set();
  let lastPrefix = "";
  const tokens = normalized.match(/[A-Z]{1,6}-?[A-Z]{0,4}\d{0,2}|00|\d{1,2}/g) || [];

  for (const token of tokens) {
    if (validCodes.has(token)) {
      found.add(token);
      lastPrefix = token.replace(/\d+$/, "");
    } else if (/^\d{1,2}$/.test(token) && lastPrefix && validCodes.has(`${lastPrefix}${token}`)) {
      found.add(`${lastPrefix}${token}`);
    }
  }

  return [...found].map((code) => ({ code, action }));
}

function sanitizeOperations(operations) {
  if (!Array.isArray(operations)) return [];
  return operations
    .map((op) => ({
      code: String(op.code || "").toUpperCase(),
      action: ["add", "duplicate", "missing", "remove"].includes(op.action) ? op.action : "add",
    }))
    .filter((op) => validCodes.has(op.code));
}

function sendJson(res, status, payload) {
  res.writeHead(status, { "Content-Type": "application/json" });
  res.end(JSON.stringify(payload));
}

module.exports = { handleChatRequest };
