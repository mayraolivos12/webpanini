const STORAGE_KEY = "webpanini-collection-v1";
const LOGIN_PATH = "/login";
const ALBUM_PATH = "/album";
const stickers = window.STICKERS || [];
const byCode = new Map(stickers.map((item) => [item.code.toUpperCase(), item]));
const albumStickers = stickers.filter((item) => item.inAlbum);
const teamSections = [...new Set(stickers.filter((item) => item.kind === "team").map((item) => item.section))];

const names = {
  Algeria: "Argelia", Argentina: "Argentina", Australia: "Australia", Austria: "Austria",
  Belgium: "Belgica", "Bosnia and Herzegovina": "Bosnia", Brazil: "Brasil", Canada: "Canada",
  "Cape Verde": "Cabo Verde", Colombia: "Colombia", "Congo DR": "Congo DR", Croatia: "Croacia",
  "Curaçao": "Curazao", Czechia: "Chequia", Ecuador: "Ecuador", Egypt: "Egipto",
  England: "Inglaterra", France: "Francia", Germany: "Alemania", Ghana: "Ghana",
  Haiti: "Haiti", Iran: "Iran", Iraq: "Iraq", "Ivory Coast": "Costa de Marfil",
  Japan: "Japon", Jordan: "Jordania", Mexico: "Mexico", Morocco: "Marruecos",
  Netherlands: "Holanda", "New Zealand": "Nueva Zelanda", Norway: "Noruega", Panama: "Panama",
  Paraguay: "Paraguay", Portugal: "Portugal", Qatar: "Qatar", "Saudi Arabia": "Arabia Saudita",
  Scotland: "Escocia", Senegal: "Senegal", "South Africa": "Sudafrica", "South Korea": "Corea",
  Spain: "Espana", Sweden: "Suecia", Switzerland: "Suiza", Tunisia: "Tunez",
  "Türkiye": "Turquia", Uruguay: "Uruguay", USA: "USA", Uzbekistan: "Uzbekistan",
};

const visualByPrefix = {
  ALG: { colors: ["#006233", "#ffffff", "#d21034"], pattern: "halfMoon" },
  ARG: { colors: ["#74acdf", "#ffffff", "#f6b40e"], pattern: "horiz3dot" },
  AUS: { colors: ["#00008b", "#ffffff", "#ff0000"], pattern: "canton" },
  AUT: { colors: ["#ed2939", "#ffffff", "#ed2939"], pattern: "horiz3" },
  BEL: { colors: ["#000000", "#fae042", "#ed2939"], pattern: "vert3" },
  BIH: { colors: ["#002395", "#fecb00", "#ffffff"], pattern: "diag" },
  BRA: { colors: ["#009c3b", "#ffdf00", "#002776"], pattern: "diamond" },
  CAN: { colors: ["#d52b1e", "#ffffff", "#d52b1e"], pattern: "vert3" },
  CIV: { colors: ["#f77f00", "#ffffff", "#009e60"], pattern: "vert3" },
  COD: { colors: ["#007fff", "#f7d618", "#ce1021"], pattern: "diagBand" },
  COL: { colors: ["#fcd116", "#003893", "#ce1126"], pattern: "colombia" },
  CPV: { colors: ["#003893", "#ffffff", "#cf2027"], pattern: "cape" },
  CRO: { colors: ["#ff0000", "#ffffff", "#171796"], pattern: "horiz3" },
  CUW: { colors: ["#002b7f", "#f9e814", "#ffffff"], pattern: "curacao" },
  CZE: { colors: ["#ffffff", "#d7141a", "#11457e"], pattern: "triangle" },
  ECU: { colors: ["#ffd100", "#0072ce", "#ed1c24"], pattern: "colombia" },
  EGY: { colors: ["#ce1126", "#ffffff", "#000000"], pattern: "horiz3" },
  ENG: { colors: ["#ffffff", "#ce1124", "#1d3a8a"], pattern: "cross" },
  ESP: { colors: ["#aa151b", "#f1bf00", "#aa151b"], pattern: "spain" },
  FRA: { colors: ["#0055a4", "#ffffff", "#ef4135"], pattern: "vert3" },
  GER: { colors: ["#000000", "#dd0000", "#ffce00"], pattern: "horiz3" },
  GHA: { colors: ["#ce1126", "#fcd116", "#006b3f"], pattern: "horiz3dot" },
  HAI: { colors: ["#00209f", "#d21034", "#ffffff"], pattern: "horiz2" },
  IRN: { colors: ["#239f40", "#ffffff", "#da0000"], pattern: "horiz3" },
  IRQ: { colors: ["#ce1126", "#ffffff", "#000000"], pattern: "horiz3" },
  JOR: { colors: ["#000000", "#ffffff", "#007a3d", "#ce1126"], pattern: "hoist" },
  JPN: { colors: ["#ffffff", "#bc002d", "#bc002d"], pattern: "dot" },
  KOR: { colors: ["#ffffff", "#c60c30", "#003478"], pattern: "yin" },
  KSA: { colors: ["#006c35", "#ffffff", "#006c35"], pattern: "solidLine" },
  MAR: { colors: ["#c1272d", "#006233", "#006233"], pattern: "dot" },
  MEX: { colors: ["#006847", "#ffffff", "#ce1126"], pattern: "vert3" },
  NED: { colors: ["#ae1c28", "#ffffff", "#21468b"], pattern: "horiz3" },
  NOR: { colors: ["#ba0c2f", "#ffffff", "#00205b"], pattern: "nordic" },
  NZL: { colors: ["#00247d", "#ffffff", "#cc142b"], pattern: "canton" },
  PAN: { colors: ["#ffffff", "#005293", "#d21034"], pattern: "quarter" },
  PAR: { colors: ["#d52b1e", "#ffffff", "#0038a8"], pattern: "horiz3" },
  POR: { colors: ["#046a38", "#da291c", "#ffe900"], pattern: "portugal" },
  QAT: { colors: ["#ffffff", "#8a1538", "#8a1538"], pattern: "serrated" },
  RSA: { colors: ["#007a4d", "#ffb612", "#de3831", "#001489"], pattern: "southAfrica" },
  SCO: { colors: ["#0065bf", "#ffffff", "#0065bf"], pattern: "saltire" },
  SEN: { colors: ["#00853f", "#fdef42", "#e31b23"], pattern: "vert3" },
  SUI: { colors: ["#d52b1e", "#ffffff", "#d52b1e"], pattern: "swiss" },
  SWE: { colors: ["#006aa7", "#fecc00", "#006aa7"], pattern: "nordic" },
  TUN: { colors: ["#e70013", "#ffffff", "#e70013"], pattern: "dot" },
  TUR: { colors: ["#e30a17", "#ffffff", "#e30a17"], pattern: "dot" },
  URU: { colors: ["#ffffff", "#0038a8", "#fcd116"], pattern: "stripesDot" },
  USA: { colors: ["#b22234", "#ffffff", "#3c3b6e"], pattern: "usa" },
  UZB: { colors: ["#1eb53a", "#ffffff", "#0099b5", "#ce1126"], pattern: "uzbek" },
};

const fallbackVisuals = [
  ["#e94e3a", "#f4c324", "#2160c4"],
  ["#2ea757", "#f7f3e7", "#c43a7e"],
  ["#2bb3c7", "#f08a2c", "#7b3ba0"],
  ["#b9d136", "#2160c4", "#e94e3a"],
];

let collection = loadCollection();
let activeSection = teamSections.includes("Colombia") ? "Colombia" : teamSections[0];
let selectedCode = "";
let supabaseClient = null;
let currentUser = null;
let cloudEnabled = false;

const els = {
  loadingView: document.querySelector("#loadingView"),
  appView: document.querySelector("#appView"),
  albumCounter: document.querySelector("#albumCounter"),
  albumProgress: document.querySelector("#albumProgress"),
  ownedPercent: document.querySelector("#ownedPercent"),
  overallProgress: document.querySelector("#overallProgress"),
  ownedTotal: document.querySelector("#ownedTotal"),
  missingTotal: document.querySelector("#missingTotal"),
  dupeTotal: document.querySelector("#dupeTotal"),
  extraTotal: document.querySelector("#extraTotal"),
  messages: document.querySelector("#messages"),
  chatForm: document.querySelector("#chatForm"),
  chatInput: document.querySelector("#chatInput"),
  searchInput: document.querySelector("#searchInput"),
  stateFilter: document.querySelector("#stateFilter"),
  countryGrid: document.querySelector("#countryGrid"),
  stickersGrid: document.querySelector("#stickersGrid"),
  resetBtn: document.querySelector("#resetBtn"),
  authPanel: document.querySelector("#authPanel"),
  authForm: document.querySelector("#authForm"),
  authEmail: document.querySelector("#authEmail"),
  authPassword: document.querySelector("#authPassword"),
  authStatus: document.querySelector("#authStatus"),
  authFeedback: document.querySelector("#authFeedback"),
  signupBtn: document.querySelector("#signupBtn"),
  googleBtn: document.querySelector("#googleBtn"),
  logoutBtn: document.querySelector("#logoutBtn"),
  focusSearch: document.querySelector("#focusSearch"),
  showExtras: document.querySelector("#showExtras"),
  focusChat: document.querySelector("#focusChat"),
  sectionKicker: document.querySelector("#sectionKicker"),
  sectionTitle: document.querySelector("#sectionTitle"),
  sectionProgress: document.querySelector("#sectionProgress"),
  sectionSubstat: document.querySelector("#sectionSubstat"),
  heroFlag: document.querySelector("#heroFlag"),
  missingTitle: document.querySelector("#missingTitle"),
  missingPreview: document.querySelector("#missingPreview"),
  duplicatePreview: document.querySelector("#duplicatePreview"),
  sheet: document.querySelector("#stickerSheet"),
  sheetSection: document.querySelector("#sheetSection"),
  sheetTitle: document.querySelector("#sheetTitle"),
  sheetCode: document.querySelector("#sheetCode"),
  sheetStatus: document.querySelector("#sheetStatus"),
  sheetCount: document.querySelector("#sheetCount"),
  sheetMinus: document.querySelector("#sheetMinus"),
  sheetPlus: document.querySelector("#sheetPlus"),
  closeSheet: document.querySelector("#closeSheet"),
  sheetCloseBtn: document.querySelector("#sheetCloseBtn"),
};

init();

async function init() {
  bindEvents();
  addMessage("Listo. Ejemplo: Tengo COL 1, 2 y CC-LAM7 repetida.");
  await setupSupabase();
  if (!cloudEnabled || currentUser) render();
}

function bindEvents() {
  els.chatForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    await applyChat(els.chatInput.value);
    els.chatInput.value = "";
  });
  els.searchInput.addEventListener("input", render);
  els.stateFilter.addEventListener("change", render);
  document.querySelectorAll("[data-state-short]").forEach((button) => {
    button.addEventListener("click", () => {
      els.stateFilter.value = button.dataset.stateShort;
      render();
    });
  });
  els.focusSearch.addEventListener("click", () => els.searchInput.focus());
  els.focusChat.addEventListener("click", () => els.chatInput.focus());
  els.showExtras.addEventListener("click", () => {
    activeSection = "extras";
    render();
  });
  els.resetBtn.addEventListener("click", () => {
    if (!confirm("Reiniciar todo el control del album?")) return;
    collection = {};
    saveCollection();
    closeSheet();
    addMessage("Datos reiniciados.");
    render();
  });
  els.closeSheet.addEventListener("click", closeSheet);
  els.sheetCloseBtn.addEventListener("click", closeSheet);
  els.sheetMinus.addEventListener("click", () => updateSelected(-1));
  els.sheetPlus.addEventListener("click", () => updateSelected(1));
  els.authForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    await signIn();
  });
  els.signupBtn.addEventListener("click", signUp);
  els.googleBtn.addEventListener("click", signInWithGoogle);
  els.logoutBtn.addEventListener("click", signOut);
}

function loadCollection() {
  try { return JSON.parse(localStorage.getItem(STORAGE_KEY)) || {}; }
  catch { return {}; }
}

function saveCollection() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(collection));
  if (currentUser) saveCloudCollection();
}

async function setupSupabase() {
  setAuthScreenState("loading");
  const env = window.WEBPANINI_ENV || {};
  if (!env.SUPABASE_URL || !env.SUPABASE_ANON_KEY) {
    cloudEnabled = false;
    addMessage("Login apagado: abre la app desde Hostinger/Node, no desde el archivo local.");
    renderAuthState();
    return;
  }

  if (!window.supabase) {
    cloudEnabled = true;
    currentUser = null;
    setAuthFeedback("No cargo la libreria de Supabase. Revisa conexion/CDN.");
    renderAuthState();
    return;
  }

  cloudEnabled = true;
  supabaseClient = window.supabase.createClient(env.SUPABASE_URL, env.SUPABASE_ANON_KEY);
  const { data } = await supabaseClient.auth.getSession();
  currentUser = data.session?.user || null;
  if (currentUser) collection = await loadCloudCollection();
  supabaseClient.auth.onAuthStateChange(async (_event, session) => {
    currentUser = session?.user || null;
    if (currentUser) collection = await loadCloudCollection();
    else collection = loadCollection();
    renderAuthState();
    render();
  });
  renderAuthState();
}

function renderAuthState() {
  if (!cloudEnabled) {
    setAuthScreenState("local");
    els.logoutBtn.hidden = true;
    els.authStatus.textContent = "Modo local";
    return;
  }

  if (currentUser) {
    navigateTo(ALBUM_PATH);
    setAuthScreenState("album");
  } else {
    navigateTo(LOGIN_PATH);
    setAuthScreenState("login");
  }
  els.logoutBtn.hidden = !currentUser;
  els.authStatus.textContent = currentUser ? currentUser.email : "Sin sesion";
}

function setAuthScreenState(state) {
  document.body.classList.remove("auth-loading", "auth-required", "authenticated", "local-mode");
  if (state === "loading") document.body.classList.add("auth-loading");
  if (state === "login") document.body.classList.add("auth-required");
  if (state === "album") document.body.classList.add("authenticated");
  if (state === "local") document.body.classList.add("local-mode");

  els.loadingView.hidden = state !== "loading";
  els.authPanel.hidden = state !== "login";
  els.appView.hidden = !["album", "local"].includes(state);
}

function navigateTo(path) {
  const currentPath = normalizePath(window.location.pathname);
  if (currentPath === path) return;
  window.history.replaceState(null, "", path);
}

function normalizePath(pathname) {
  if (!pathname || pathname === "/") return "/";
  return pathname.replace(/\/+$/, "") || "/";
}

function getAppUrl(path = "") {
  const base = (window.WEBPANINI_ENV?.APP_URL || window.location.origin).replace(/\/+$/, "");
  return `${base}${path}`;
}

function setAuthFeedback(message) {
  if (els.authFeedback) els.authFeedback.textContent = message || "";
}

async function signIn() {
  if (!supabaseClient) {
    setAuthFeedback("Login no disponible: Supabase no cargo correctamente.");
    return;
  }
  const email = els.authEmail.value.trim();
  const password = els.authPassword.value;
  setAuthFeedback("");
  const { error } = await supabaseClient.auth.signInWithPassword({ email, password });
  if (error) setAuthFeedback(`Login: ${error.message}`);
}

async function signUp() {
  if (!supabaseClient) {
    setAuthFeedback("Crear cuenta no disponible: Supabase no cargo correctamente.");
    return;
  }
  const email = els.authEmail.value.trim();
  const password = els.authPassword.value;
  const redirectTo = getAppUrl(ALBUM_PATH);
  setAuthFeedback("");
  const { error } = await supabaseClient.auth.signUp({ email, password, options: { emailRedirectTo: redirectTo } });
  setAuthFeedback(error ? `Crear cuenta: ${error.message}` : "Cuenta creada. Revisa el correo si Supabase pide confirmacion.");
}

async function signInWithGoogle() {
  if (!supabaseClient) {
    setAuthFeedback("Google no disponible: Supabase no cargo correctamente.");
    return;
  }
  const redirectTo = getAppUrl(ALBUM_PATH);
  setAuthFeedback("");
  const { error } = await supabaseClient.auth.signInWithOAuth({
    provider: "google",
    options: { redirectTo },
  });
  if (error) setAuthFeedback(`Google: ${error.message}`);
}

async function signOut() {
  if (!supabaseClient) {
    navigateTo(LOGIN_PATH);
    renderAuthState();
    return;
  }
  await supabaseClient.auth.signOut();
  navigateTo(LOGIN_PATH);
  renderAuthState();
}

async function loadCloudCollection() {
  const { data, error } = await supabaseClient
    .from("user_stickers")
    .select("code,quantity")
    .eq("user_id", currentUser.id);
  if (error) {
    addMessage(`Supabase: ${error.message}`);
    return loadCollection();
  }
  return Object.fromEntries((data || []).map((row) => [row.code, row.quantity]));
}

async function saveCloudCollection() {
  const rows = Object.entries(collection)
    .filter(([, quantity]) => quantity > 0)
    .map(([code, quantity]) => ({ user_id: currentUser.id, code, quantity, updated_at: new Date().toISOString() }));

  await supabaseClient.from("user_stickers").delete().eq("user_id", currentUser.id);
  if (rows.length) await supabaseClient.from("user_stickers").upsert(rows);
}

async function applyChat(text) {
  const operations = await getChatOperations(text);
  if (!operations.length) {
    addMessage("No encontre codigos validos. Usa COL 1, MEX13, FWC9, CC-LAM7, LD o CR.");
    return;
  }
  operations.forEach(({ code, action }) => {
    const current = collection[code] || 0;
    if (action === "missing") collection[code] = 0;
    else if (action === "remove") collection[code] = Math.max(0, current - 1);
    else if (action === "duplicate") collection[code] = Math.max(2, current + 1);
    else collection[code] = current + 1;
  });
  saveCollection();
  addMessage(`Aplicado: ${operations.map((op) => op.code).join(", ")}`);
  render();
}

async function getChatOperations(text) {
  try {
    const response = await fetch("/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message: text }),
    });
    if (response.ok) {
      const payload = await response.json();
      return sanitizeOperations(payload.operations || []);
    }
  } catch {
    // Abrir index.html directo no tiene backend; usamos el parser local.
  }
  return extractCodes(text).map((code) => ({ code, action: inferAction(text) }));
}

function sanitizeOperations(operations) {
  return operations
    .map((op) => ({
      code: String(op.code || "").toUpperCase(),
      action: ["add", "duplicate", "missing", "remove"].includes(op.action) ? op.action : "add",
    }))
    .filter((op) => byCode.has(op.code));
}

function inferAction(text) {
  const lower = text.toLowerCase();
  if (/falt|necesit|pendient/.test(lower)) return "missing";
  if (/quitar|restar|borrar|eliminar/.test(lower)) return "remove";
  if (/repetid|duplicad/.test(lower)) return "duplicate";
  return "add";
}

function extractCodes(text) {
  const normalized = text
    .toUpperCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/([A-Z]{2,4})\s+(\d{1,2})/g, "$1$2");
  const found = new Set();
  const tokens = normalized.match(/[A-Z]{1,6}-?[A-Z]{0,4}\d{0,2}|00|\d{1,2}/g) || [];
  let lastPrefix = "";
  tokens.forEach((token) => {
    if (byCode.has(token)) {
      found.add(token);
      lastPrefix = token.replace(/\d+$/, "");
      return;
    }
    if (/^\d{1,2}$/.test(token) && lastPrefix && byCode.has(`${lastPrefix}${token}`)) {
      found.add(`${lastPrefix}${token}`);
    }
  });
  return [...found];
}

function render() {
  const owned = albumStickers.filter((item) => (collection[item.code] || 0) > 0).length;
  const duplicates = stickers.reduce((sum, item) => sum + Math.max(0, (collection[item.code] || 0) - 1), 0);
  const extras = stickers.filter((item) => !item.inAlbum && (collection[item.code] || 0) > 0).length;
  const percent = Math.round((owned / albumStickers.length) * 100);

  els.albumCounter.textContent = `${owned} / ${albumStickers.length} · ${percent}%`;
  els.albumProgress.style.width = `${percent}%`;
  els.ownedPercent.textContent = `${percent}%`;
  els.ownedTotal.textContent = `${owned} / ${albumStickers.length}`;
  els.overallProgress.style.width = `${percent}%`;
  els.missingTotal.textContent = albumStickers.length - owned;
  els.dupeTotal.textContent = duplicates;
  els.extraTotal.textContent = extras;

  renderCountries();
  renderHeader();
  renderStickers();
  renderSidePreviews();
  updateNavState();
  if (selectedCode) renderSheet();
}

function renderCountries() {
  els.countryGrid.innerHTML = teamSections.map((section) => {
    const items = getSectionItems(section);
    const owned = items.filter((item) => (collection[item.code] || 0) > 0).length;
    const prefix = items[0]?.code.replace(/\d+$/, "") || "";
    const visual = getCountryVisual(section);
    return `
      <button class="country-tab ${activeSection === section ? "active" : ""}" data-country="${escapeHtml(section)}">
        ${renderFlag(visual)}
        <span class="tab-name">${escapeHtml(getCountryName(section))}</span>
        <span class="mono tab-count">${escapeHtml(prefix)} ${owned}/${items.length}</span>
      </button>
    `;
  }).join("");
  els.countryGrid.querySelectorAll(".country-tab").forEach((card) => {
    card.addEventListener("click", () => {
      activeSection = card.dataset.country;
      render();
    });
  });
}

function renderHeader() {
  const items = getVisibleBaseItems();
  const owned = items.filter((item) => (collection[item.code] || 0) > 0).length;
  const duplicates = items.reduce((sum, item) => sum + Math.max(0, (collection[item.code] || 0) - 1), 0);
  const total = items.length;

  if (teamSections.includes(activeSection)) {
    const visual = getCountryVisual(activeSection);
    setCountryColors(visual);
    els.sectionKicker.textContent = `SELECCION · ${visual.prefix}`;
    els.sectionTitle.textContent = getCountryName(activeSection);
    renderHeroFlag(visual);
  } else if (activeSection === "extras") {
    const visual = { prefix: "EXT", primary: "#2bb3c7", secondary: "#c43a7e", accent: "#f08a2c", colors: ["#2bb3c7", "#c43a7e", "#f08a2c"], pattern: "diag" };
    setCountryColors(visual);
    els.sectionKicker.textContent = "COLECCION";
    els.sectionTitle.textContent = "EXTRAS";
    renderHeroFlag(visual);
  }

  els.sectionProgress.textContent = `${owned}/${total}`;
  els.sectionSubstat.textContent = `${Math.max(0, total - owned)} faltan · ${duplicates} repe`;
}

function renderStickers() {
  const query = els.searchInput.value.trim().toLowerCase();
  const state = els.stateFilter.value;
  const visible = getVisibleBaseItems().filter((item) => {
    const count = collection[item.code] || 0;
    const haystack = `${item.code} ${item.name} ${item.section} ${getCountryName(item.section)}`.toLowerCase();
    if (query && !haystack.includes(query)) return false;
    if (state === "owned" && count === 0) return false;
    if (state === "missing" && (!item.inAlbum || count > 0)) return false;
    if (state === "duplicates" && count < 2) return false;
    if (state === "extras" && (item.inAlbum || count === 0)) return false;
    return true;
  });

  document.querySelectorAll("[data-state-short]").forEach((button) => {
    button.classList.toggle("active", button.dataset.stateShort === state);
  });

  if (!visible.length) {
    els.stickersGrid.innerHTML = `<div class="empty-state">No hay laminas con esos filtros.</div>`;
    return;
  }

  els.stickersGrid.innerHTML = visible.map((item) => {
    const count = collection[item.code] || 0;
    const status = count > 1 ? "duplicate" : count > 0 ? "owned" : "missing";
    const flagBandStyle = getTeamStickerBandStyle(item);
    return `
      <button class="sticker ${status} ${!item.inAlbum ? "extra" : ""} ${item.code.length > 5 ? "long-code" : ""}" style="${flagBandStyle}" data-code="${escapeHtml(item.code)}">
        <span class="status-dot status-${status}"></span>
        <span class="sticker-number">${escapeHtml(displayCode(item))}</span>
        <span class="sticker-name">${escapeHtml(item.name || "Sin nombre")}</span>
        <span class="sticker-meta">${count ? `${count} en mano` : "faltante"}</span>
      </button>
    `;
  }).join("");

  els.stickersGrid.querySelectorAll(".sticker").forEach((button) => {
    button.addEventListener("click", () => openSheet(button.dataset.code));
  });
}

function renderSidePreviews() {
  const items = getVisibleBaseItems();
  const missing = items.filter((item) => item.inAlbum && !(collection[item.code] || 0)).slice(0, 5);
  const dupes = items.filter((item) => (collection[item.code] || 0) > 1).slice(0, 6);
  els.missingTitle.textContent = `${missing.length ? items.filter((item) => item.inAlbum && !(collection[item.code] || 0)).length : 0} LAMINAS`;
  els.missingPreview.innerHTML = missing.length
    ? missing.map((item) => `<div class="mini-sticker">${escapeHtml(item.code)}</div>`).join("")
    : `<div class="empty-state">Nada pendiente aqui.</div>`;
  els.duplicatePreview.innerHTML = dupes.length
    ? dupes.map((item) => `<div class="swap-item"><strong>${escapeHtml(item.code)}</strong><span>x${collection[item.code]}</span></div>`).join("")
    : `<div class="empty-state">Sin repetidas en esta vista.</div>`;
}

function getVisibleBaseItems() {
  if (teamSections.includes(activeSection)) return getSectionItems(activeSection);
  if (activeSection === "extras") return stickers.filter((item) => !item.inAlbum);
  return stickers;
}

function getTeamStickerBandStyle(item) {
  if (item.kind !== "team" || !teamSections.includes(item.section)) return "";
  const number = Number(displayCode(item));
  const visual = getCountryVisual(item.section);
  const colors = visual.colors.slice(0, 3);
  const color = colors[Math.min(2, Math.ceil(number / 8) - 1)] || colors[0];
  return `--team-band-color:${color};`;
}

function getSectionItems(section) {
  return stickers.filter((item) => item.section === section && item.kind === "team");
}

function getCountryName(section) {
  return names[section] || section;
}

function getCountryVisual(section) {
  const prefix = getSectionItems(section)[0]?.code.replace(/\d+$/, "") || section.slice(0, 3).toUpperCase();
  const config = visualByPrefix[prefix];
  const colors = config?.colors || fallbackVisuals[Math.abs(hashText(section)) % fallbackVisuals.length];
  return { prefix, primary: colors[0], secondary: colors[1], accent: colors[2], colors, pattern: config?.pattern || "horiz3" };
}

function setCountryColors(visual) {
  document.documentElement.style.setProperty("--country-primary", visual.primary);
  document.documentElement.style.setProperty("--country-secondary", visual.secondary);
  document.documentElement.style.setProperty("--country-accent", visual.accent);
  const darkHero = relativeLuminance(visual.primary) < 0.48;
  document.documentElement.style.setProperty("--hero-ink", darkHero ? "#ffffff" : "#1a1a1a");
  document.documentElement.style.setProperty("--hero-muted", darkHero ? "rgba(255, 255, 255, .78)" : "rgba(26, 26, 26, .72)");
  const stickerInk = relativeLuminance(visual.primary) > 0.72 ? "#1a1a1a" : visual.primary;
  const stickerAccentInk = relativeLuminance(visual.accent) > 0.72 ? "#1a1a1a" : visual.accent;
  document.documentElement.style.setProperty("--sticker-number-ink", stickerInk);
  document.documentElement.style.setProperty("--sticker-accent-ink", stickerAccentInk);
}

function relativeLuminance(hex) {
  const clean = hex.replace("#", "");
  const rgb = [0, 2, 4].map((index) => parseInt(clean.slice(index, index + 2), 16) / 255);
  const linear = rgb.map((value) => value <= 0.03928 ? value / 12.92 : ((value + 0.055) / 1.055) ** 2.4);
  return (0.2126 * linear[0]) + (0.7152 * linear[1]) + (0.0722 * linear[2]);
}

function renderFlag(visual, className = "flag") {
  const [a, b, c, d] = visual.colors;
  const svg = flagSvg(visual.pattern, a, b, c, d);
  return `
    <span class="${className}" style="--flag-a:${visual.primary};--flag-b:${visual.secondary};--flag-c:${visual.accent};">
      ${svg}
    </span>
  `;
}

function renderHeroFlag(visual) {
  els.heroFlag.style.setProperty("--flag-a", visual.primary);
  els.heroFlag.style.setProperty("--flag-b", visual.secondary);
  els.heroFlag.style.setProperty("--flag-c", visual.accent);
  els.heroFlag.innerHTML = flagSvg(visual.pattern, ...visual.colors);
}

function flagSvg(pattern, a, b, c, d) {
  const rect = (x, y, w, h, fill) => `<rect x="${x}" y="${y}" width="${w}" height="${h}" fill="${fill}"/>`;
  const dot = (x, y, r, fill) => `<circle cx="${x}" cy="${y}" r="${r}" fill="${fill}"/>`;
  const base = (inner) => `<svg viewBox="0 0 30 20" preserveAspectRatio="none" aria-hidden="true">${inner}</svg>`;
  if (pattern === "vert3") return base(rect(0, 0, 10, 20, a) + rect(10, 0, 10, 20, b) + rect(20, 0, 10, 20, c));
  if (pattern === "horiz2") return base(rect(0, 0, 30, 10, a) + rect(0, 10, 30, 10, b));
  if (pattern === "colombia") return base(rect(0, 0, 30, 10, a) + rect(0, 10, 30, 5, b) + rect(0, 15, 30, 5, c));
  if (pattern === "spain") return base(rect(0, 0, 30, 5, a) + rect(0, 5, 30, 10, b) + rect(0, 15, 30, 5, c));
  if (pattern === "diamond") return base(rect(0, 0, 30, 20, a) + `<polygon points="15,2.5 27,10 15,17.5 3,10" fill="${b}"/>` + dot(15, 10, 3.7, c));
  if (pattern === "dot" || pattern === "horiz3dot") return base(rect(0, 0, 30, 6.7, a) + rect(0, 6.7, 30, 6.6, b) + rect(0, 13.3, 30, 6.7, c) + dot(15, 10, 2.2, pattern === "dot" ? b : c));
  if (pattern === "cross") return base(rect(0, 0, 30, 20, a) + rect(12, 0, 6, 20, b) + rect(0, 7, 30, 6, b));
  if (pattern === "swiss") return base(rect(0, 0, 30, 20, a) + rect(13, 4, 4, 12, b) + rect(9, 8, 12, 4, b));
  if (pattern === "nordic") return base(rect(0, 0, 30, 20, a) + rect(8, 0, 4, 20, b) + rect(0, 8, 30, 4, b) + rect(9, 0, 2, 20, c) + rect(0, 9, 30, 2, c));
  if (pattern === "saltire") return base(rect(0, 0, 30, 20, a) + `<polygon points="0,0 4,0 30,16 30,20 26,20 0,4" fill="${b}"/>` + `<polygon points="30,0 26,0 0,16 0,20 4,20 30,4" fill="${b}"/>`);
  if (pattern === "triangle") return base(rect(0, 0, 30, 10, a) + rect(0, 10, 30, 10, b) + `<polygon points="0,0 13,10 0,20" fill="${c}"/>`);
  if (pattern === "hoist") return base(rect(0, 0, 30, 6.7, a) + rect(0, 6.7, 30, 6.6, b) + rect(0, 13.3, 30, 6.7, c) + `<polygon points="0,0 12,10 0,20" fill="${d}"/>`);
  if (pattern === "diag" || pattern === "diagBand") return base(rect(0, 0, 30, 20, a) + `<polygon points="0,20 30,0 30,20" fill="${b}"/>` + `<polygon points="0,20 30,0 30,3 3,20" fill="${c}"/>`);
  if (pattern === "portugal") return base(rect(0, 0, 12, 20, a) + rect(12, 0, 18, 20, b) + dot(12, 10, 2.2, c));
  if (pattern === "serrated") return base(rect(0, 0, 30, 20, b) + `<polygon points="0,0 10,0 6,2 10,4 6,6 10,8 6,10 10,12 6,14 10,16 6,18 10,20 0,20" fill="${a}"/>`);
  if (pattern === "quarter") return base(rect(0, 0, 15, 10, a) + rect(15, 0, 15, 10, b) + rect(0, 10, 15, 10, c) + rect(15, 10, 15, 10, a));
  if (pattern === "usa") return base(Array.from({ length: 7 }, (_, i) => rect(0, i * 3, 30, 1.5, a)).join("") + rect(0, 0, 12, 9, c));
  if (pattern === "canton") return base(rect(0, 0, 30, 20, a) + rect(0, 0, 13, 9, b) + `<path d="M0 0 L13 9 M13 0 L0 9" stroke="${c}" stroke-width="2"/>`);
  if (pattern === "cape") return base(rect(0, 0, 30, 20, a) + rect(0, 11, 30, 2, b) + rect(0, 13, 30, 2, c));
  if (pattern === "curacao") return base(rect(0, 0, 30, 20, a) + rect(0, 13, 30, 2, b) + dot(7, 5, 1.5, c) + dot(10, 7, 1, c));
  if (pattern === "southAfrica") return base(rect(0, 0, 30, 10, c) + rect(0, 10, 30, 10, d) + `<polygon points="0,0 14,10 0,20" fill="${a}"/>` + `<polygon points="0,3 10,10 0,17" fill="${b}"/>`);
  if (pattern === "uzbek") return base(rect(0, 0, 30, 6, c) + rect(0, 7, 30, 6, b) + rect(0, 14, 30, 6, a) + rect(0, 6, 30, 1, d) + rect(0, 13, 30, 1, d));
  if (pattern === "stripesDot") return base(rect(0, 0, 30, 20, a) + rect(0, 3, 30, 2, b) + rect(0, 8, 30, 2, b) + rect(0, 13, 30, 2, b) + rect(0, 0, 10, 8, a) + dot(5, 4, 2, c));
  if (pattern === "halfMoon" || pattern === "yin" || pattern === "solidLine") return base(rect(0, 0, 30, 20, a) + rect(15, 0, 15, 20, b) + dot(15, 10, 4, c));
  return base(rect(0, 0, 30, 6.7, a) + rect(0, 6.7, 30, 6.6, b) + rect(0, 13.3, 30, 6.7, c));
}

function hashText(text) {
  return [...text].reduce((sum, char) => sum + char.charCodeAt(0), 0);
}

function updateNavState() {
  els.showExtras.classList.toggle("solid", activeSection === "extras");
}

function displayCode(item) {
  if (teamSections.includes(item.section) && item.kind === "team") return item.code.replace(/^[A-Z]+/, "");
  return item.code;
}

function openSheet(code) {
  selectedCode = code;
  els.sheet.hidden = false;
  renderSheet();
}

function closeSheet() {
  selectedCode = "";
  els.sheet.hidden = true;
}

function renderSheet() {
  const item = byCode.get(selectedCode);
  if (!item) return closeSheet();
  const count = collection[item.code] || 0;
  els.sheetSection.textContent = teamSections.includes(item.section) ? getCountryName(item.section) : item.section;
  els.sheetTitle.textContent = item.name || "Sin nombre";
  els.sheetCode.textContent = item.code;
  els.sheetCount.textContent = count;
  els.sheetStatus.textContent = count > 1
    ? `Tienes ${count}; ${count - 1} repetida(s) para cambiar.`
    : count === 1
      ? "Ya esta conseguida."
      : "Aun falta en tu album.";
}

function updateSelected(delta) {
  if (!selectedCode) return;
  collection[selectedCode] = Math.max(0, (collection[selectedCode] || 0) + delta);
  saveCollection();
  render();
}

function addMessage(text) {
  const div = document.createElement("div");
  div.className = "message";
  div.textContent = text;
  els.messages.prepend(div);
}

function escapeHtml(value) {
  return String(value).replace(/[&<>"']/g, (char) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#039;",
  }[char]));
}
