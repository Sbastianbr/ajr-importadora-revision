/* AJR — lógica de la página.
   Los DATOS (colegios, categorías, productos y teléfono) viven en data.js.
   Aquí solo se dibuja el catálogo, se aplican los filtros y se maneja el menú. */
const {
  phone: PHONE,
  demo: IS_DEMO,
  schools: SCHOOLS,
  categories: CATEGORIES,
  lines: LINES,
  products,
} = AJR_DATA;
const SCHOOLS_BY_ID = new Map(SCHOOLS.map((s) => [s.id, s]));
const LINES_BY_ID = new Map(LINES.map((line) => [line.id, line]));

// Aviso temprano si un producto apunta a un colegio o categoría que no existe en data.js.
products.forEach((p) => {
  if (p.line === "colegios" && !SCHOOLS_BY_ID.has(p.school))
    console.warn(
      `data.js: el producto "${p.name}" (id ${p.id}) usa un colegio desconocido: "${p.school}".`,
    );
  if (!CATEGORIES.includes(p.category))
    console.warn(
      `data.js: el producto "${p.name}" (id ${p.id}) usa una categoría desconocida: "${p.category}".`,
    );
});

const schoolGrid = document.getElementById("school-grid");
const grid = document.getElementById("products-grid");
const search = document.getElementById("product-search");
const school = document.getElementById("school-filter");
const category = document.getElementById("category-filter");
const count = document.getElementById("result-count");
const emptyState = document.getElementById("empty-state");
const reset = document.getElementById("reset-filters");
const emptyReset = document.getElementById("empty-reset");
const nav = document.getElementById("main-nav");
const menuToggle = document.querySelector(".menu-toggle");

// Estado de presentación del catálogo; todos los registros siguen en data.js.
const lineButtons = [...document.querySelectorAll("#catalogo [data-line]")];
const more = document.getElementById("catalog-more");
const catalogControls = document.getElementById("catalog-controls");
const catalogFallback = document.getElementById("catalog-fallback");
const BATCH_SIZE = 8;
let activeLine = "all";
let visibleLimit = BATCH_SIZE;
let filteredProducts = [];
let resultKey = null;
let catalogInitialized = false;


function normalize(s) {
  return s
    .toLocaleLowerCase("es-CL")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .trim();
}
function esc(s) {
  return String(s).replace(
    /[&<>"']/g,
    (m) =>
      ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[
        m
      ],
  );
}

// data.js centraliza las etiquetas y filtros; el HTML inicial conserva las tarjetas si JavaScript no carga.
function renderSchools() {
  schoolGrid.innerHTML = SCHOOLS.map(
    (s) => `
    <button class="school-card" type="button" data-school="${esc(s.id)}" aria-label="Ver catálogo de ${esc(s.cardName)}" aria-pressed="false">
      <span class="school-crest">${s.image ? `<img src="${esc(s.id === "san-luis" ? "assets/insignias/san-luis-web.svg" : s.image)}" alt="Insignia de ${esc(s.name)}" loading="lazy" />` : `<span class="school-initials" role="img" aria-label="Insignia pendiente de ${esc(s.name)}">${esc(s.initials)}</span>`}</span>
      <span class="school-name">${esc(s.cardName)}</span>
      <span class="school-arrow" aria-hidden="true">↗</span>
    </button>`,
  ).join("");
}
function fillSelect(select, options) {
  options.forEach(({ value, label }) => {
    const option = document.createElement("option");
    option.value = value;
    option.textContent = label;
    select.append(option);
  });
}
function renderFilters() {
  const previousSchool = school.value;
  const previousCategory = category.value;
  const schoolOptions = activeLine === "all"
    ? [{ value: "all", label: "Todos los colegios y líneas" }, ...SCHOOLS.map((s) => ({ value: s.id, label: s.cardName })), ...LINES.filter((line) => line.id !== "colegios").map((line) => ({ value: line.id, label: line.name }))]
    : activeLine === "colegios"
      ? [{ value: "all", label: "Todos los colegios" }, ...SCHOOLS.map((s) => ({ value: s.id, label: s.cardName }))]
      : [{ value: activeLine, label: LINES_BY_ID.get(activeLine).name }];
  school.replaceChildren();
  fillSelect(school, schoolOptions);
  school.value = schoolOptions.some((option) => option.value === previousSchool) ? previousSchool : schoolOptions[0].value;
  school.disabled = activeLine === "empresas" || activeLine === "deportes";
  const contextProducts = products.filter((p) =>
    (activeLine === "all" || p.line === activeLine) &&
    (school.value === "all" || p.school === school.value || p.line === school.value),
  );
  const available = new Set(contextProducts.map((p) => p.category));
  category.replaceChildren();
  fillSelect(category, [{ value: "all", label: "Todas las prendas" }, ...CATEGORIES.filter((value) => available.has(value)).map((value) => ({ value, label: value }))]);
  category.value = available.has(previousCategory) ? previousCategory : "all";
}

function clothingArt(type, fill, accent, label) {
  const art = {
    polo: `<path d="M97 53 116 45q24 24 48 0l19 8 49 34-30 49-24-16v93H102v-93l-24 16-30-49Z" fill="${fill}" stroke="#667a8a" stroke-opacity=".32" stroke-width="2"/><path d="M116 45q24 36 48 0l-9 33-15 15-15-15Z" fill="${accent}"/><path d="M140 94v47m7-39v24" stroke="#8292a5" stroke-width="2"/><circle cx="141" cy="110" r="2" fill="white"/><circle cx="141" cy="125" r="2" fill="white"/><path d="M103 203h74m-100-74 20-9m105 9-24-9" stroke="#fff" stroke-opacity=".5" stroke-width="5"/>`,
    tee: `<path d="M97 53 116 45q24 22 48 0l19 8 49 34-30 49-24-16v93H102v-93l-24 16-30-49Z" fill="${fill}" stroke="#667a8a" stroke-opacity=".3" stroke-width="2"/><path d="M117 46q23 24 46 0" stroke="${accent}" stroke-width="9" fill="none"/><path d="M103 202h74m-100-73 22-12m101 12-22-12" stroke="${accent}" stroke-width="6"/>`,
    hoodie: `<path d="M116 38q-30 11-30 47l-33 28 31 27 17-17v91h78v-91l17 17 31-27-33-28q0-36-30-47-12 20-24 20t-24-20Z" fill="${fill}" stroke="#5f7789" stroke-opacity=".35" stroke-width="2"/><path d="M116 38q-6 45 24 45t24-45q-5-13-24-13t-24 13Z" fill="${accent}" opacity=".7"/><path d="M130 86l-3 40m23-40 3 40" stroke="#eef3f8" stroke-width="3"/><path d="M119 152h42l10 34h-62Z" fill="${accent}" opacity=".45"/><path d="M100 205h79" stroke="${accent}" stroke-width="7"/>`,
    jacket: `<path d="M113 42 91 57 55 111 85 138l15-16v90h80v-90l15 16 30-27-36-54-22-15q-27 19-54 0Z" fill="${fill}" stroke="#5f7789" stroke-opacity=".35" stroke-width="2"/><path d="M113 42q27 36 54 0l-8 39-19 13-19-13Z" fill="${accent}"/><path d="M140 94v118" stroke="${accent}" stroke-width="5"/><path d="M102 152h25m26 0h25" stroke="#f5f8fa" stroke-width="3"/>`,
    tracksuit: `<path d="M107 27 92 38 61 83 87 105l15-17v64h76V88l15 17 26-22-31-45-15-11q-33 20-66 0Z" fill="${fill}" stroke="#667a8a" stroke-opacity=".3" stroke-width="2"/><path d="M140 43v109" stroke="${accent}" stroke-width="4"/><path d="M109 40q31 28 62 0" fill="none" stroke="${accent}" stroke-width="8"/><path d="M102 169h76l-10 50h-25l-3-27-3 27h-25Z" fill="${fill}" stroke="#667a8a" stroke-opacity=".3" stroke-width="2"/><path d="M139 173v30M111 206l9 2m41-2 9-2" stroke="${accent}" stroke-width="3"/>`,
    pants: `<path d="M100 39h80l-4 74-18 104h-30l-11-98-7 98H80l16-104Z" fill="${fill}" stroke="#667a8a" stroke-opacity=".3" stroke-width="2"/><path d="M101 54h79M139 55l-3 48m-27-31h12m43 0h-12" fill="none" stroke="${accent}" stroke-width="3"/><path d="M81 205h29m19 0h29" stroke="${accent}" stroke-width="5"/>`,
    shorts: `<path d="M83 67h114l-10 100-47-15-47 15Z" fill="${fill}" stroke="#667a8a" stroke-opacity=".35" stroke-width="2"/><path d="M86 80h108M140 81v62" fill="none" stroke="${accent}" stroke-width="4"/><path d="M92 154l48-14 43 14" fill="none" stroke="${accent}" stroke-opacity=".7" stroke-width="3"/>`,
    skirt: `<path d="M110 45h60l36 153H74Z" fill="${fill}" stroke="#667a8a" stroke-opacity=".35" stroke-width="2"/><path d="M108 57h64M121 68l-21 118m40-118v122m19-122 22 118" fill="none" stroke="${accent}" stroke-opacity=".7" stroke-width="5"/>`,
  };
  return `<svg viewBox="0 0 280 245" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Ilustración provisional de ${esc(label)}" preserveAspectRatio="xMidYMid meet"><ellipse cx="140" cy="221" rx="75" ry="11" fill="#566982" opacity=".08"/>${art[type] || art.tee}</svg>`;
}

const priceFormat = new Intl.NumberFormat("es-CL", {
  style: "currency",
  currency: "CLP",
  maximumFractionDigits: 0,
});
// Tallas y precio son opcionales: solo se muestran si existen en data.js; si no, "por confirmar".
function metaText(p) {
  const sizes =
    Array.isArray(p.sizes) && p.sizes.length
      ? `Tallas: ${p.sizes.join(", ")}`
      : "";
  const price = Number.isFinite(p.price) ? priceFormat.format(p.price) : "";
  if (sizes && price) return `${sizes} · ${price}`;
  if (sizes) return `${sizes} · precio por confirmar`;
  if (price) return `${price} · tallas por confirmar`;
  return "Tallas y precio por confirmar";
}
function whatsappUrl(p, context) {
  const msg = p.line === "colegios"
    ? `Hola, vi el catálogo de AJR y quisiera consultar por ${p.name} del ${context}. ¿Me pueden indicar tallas, disponibilidad y precio?`
    : `Hola, vi el catálogo de AJR y quisiera solicitar una cotización por ${p.name} (${context}). ¿Me pueden indicar opciones, tallas y precio?`;
  return `https://wa.me/${PHONE}?text=${encodeURIComponent(msg)}`;
}
function card(p) {
  const schoolInfo = SCHOOLS_BY_ID.get(p.school);
  const context = schoolInfo ? schoolInfo.name : LINES_BY_ID.get(p.line).name;
  const crest = schoolInfo && schoolInfo.image
    ? `<img class="product-crest" src="${esc(schoolInfo.image)}" alt="" loading="lazy" decoding="async" />`
    : "";
  const visual = p.photo
    ? `<img class="product-photo" src="${esc(p.photo)}" alt="${esc(p.name)} — ${esc(context)}" loading="lazy" decoding="async" />`
    : `<span class="mock-tag">Fotografía pendiente</span>${clothingArt(p.type, "#e1e5ea", "#8795a5", p.name)}`;
  const quote = p.line === "empresas";
  const label = quote ? "Solicitar cotización" : "Consultar por WhatsApp";
  const ctaLabel = `${label}: ${p.name}, ${context} (se abre en una pestaña nueva)`;
  return `<article class="product-card"><div class="product-art${p.photo ? " has-photo" : ""}" data-bg="slate">${visual}</div><div class="product-details"><div class="product-context">${crest}<span class="product-school">${esc(context)}</span></div><h3>${esc(p.name)}</h3><p class="product-meta">${esc(metaText(p))}</p><a class="product-cta" href="${whatsappUrl(p, context)}" target="_blank" rel="noopener noreferrer" aria-label="${esc(ctaLabel)}"><span class="cta-full" aria-hidden="true">${label}</span><span class="cta-short" aria-hidden="true">${quote ? "Cotizar" : "WhatsApp"}</span><svg class="icon" aria-hidden="true" viewBox="0 0 24 24"><path d="M4 12h15m-6-6 6 6-6 6"/></svg></a></div></article>`;
}
// Presentación provisional exclusiva de Deportes; no altera el catálogo general.
function pendingSportsCard(p) {
  const message = "Hola, quisiera confirmar si AJR ofrece cortavientos deportivos y si dispone de modelos y fotografías originales.";
  const url = `https://wa.me/${PHONE}?text=${encodeURIComponent(message)}`;
  return `<article class="product-card sports-pending" data-validation="pending-local-review"><div class="product-art sports-photo-pending"><svg class="sports-photo-icon" aria-hidden="true" focusable="false" viewBox="0 0 64 64"><rect x="8" y="12" width="48" height="40" rx="5"/><circle cx="24" cy="25" r="5"/><path d="m10 45 15-12 10 8 8-9 11 13"/></svg><span>Fotografía pendiente</span></div><div class="product-details"><div class="product-context"><span class="product-school">Vestuario deportivo</span></div><h3>${esc(p.name)}</h3><p class="product-meta">Por confirmar</p><a class="product-cta" href="${url}" target="_blank" rel="noopener noreferrer" aria-label="Confirmar si AJR ofrece cortavientos deportivos (se abre en una pestaña nueva)"><span class="cta-full" aria-hidden="true">Consultar por WhatsApp</span><span class="cta-short" aria-hidden="true">WhatsApp</span><svg class="icon" aria-hidden="true" viewBox="0 0 24 24"><path d="M4 12h15m-6-6 6 6-6 6"/></svg></a></div></article>`;
}

// Presentación exclusiva del catálogo; card() mantiene las otras secciones intactas.
function catalogCard(p) {
  const info = SCHOOLS_BY_ID.get(p.school);
  const context = info ? info.cardName : LINES_BY_ID.get(p.line).name;
  const pendingPhoto = !p.photo;
  const crestPath = info?.id === "san-luis" ? "assets/insignias/san-luis-web.svg" : info?.image;
  const crest = crestPath ? `<img class="product-crest" src="${esc(crestPath)}" alt="" loading="lazy" decoding="async" />` : "";
  const visual = pendingPhoto
    ? `<span class="mock-tag">Fotografía pendiente</span>${clothingArt(p.type, "#e1e5ea", "#8795a5", p.name)}`
    : `<img class="product-photo" src="${esc(p.photo)}" alt="${esc(p.name)} — ${esc(context)}" loading="lazy" decoding="async" />`;
  const label = p.line === "empresas" ? "Solicitar cotización" : "Consultar por WhatsApp";
  const message = `Hola, vi una referencia por confirmar de ${p.name} (${context}) en el catálogo de AJR. ¿Ofrecen esta prenda? ¿Pueden confirmar modelos, tallas, precio y disponibilidad?`;
  const url = pendingPhoto
    ? `https://wa.me/${PHONE}?text=${encodeURIComponent(message)}`
    : whatsappUrl(p, info ? info.name : LINES_BY_ID.get(p.line).name);
  const meta = `${pendingPhoto ? "Referencia por confirmar · " : ""}${metaText(p)}`;
  return `<article class="product-card${pendingPhoto ? " catalog-pending" : ""}" data-product-id="${p.id}"><div class="product-art${pendingPhoto ? "" : " has-photo"}" data-bg="slate">${visual}</div><div class="product-details"><div class="product-context">${crest}<span class="product-school">${esc(context)}</span></div><h3>${esc(p.name)}</h3><p class="product-meta">${esc(meta)}</p><a class="product-cta" href="${url}" target="_blank" rel="noopener noreferrer" aria-label="${esc(`${label}: ${p.name}, ${context}${pendingPhoto ? ", referencia por confirmar" : ""} (se abre en una pestaña nueva)`)}"><span class="cta-full" aria-hidden="true">${label}</span><svg class="icon" aria-hidden="true" viewBox="0 0 24 24"><path d="M4 12h15m-6-6 6 6-6 6"/></svg></a></div></article>`;
}

function updateCatalogCount() {
  const shown = Math.min(visibleLimit, filteredProducts.length);
  count.textContent = `Mostrando ${shown} de ${filteredProducts.length} ${filteredProducts.length === 1 ? "producto" : "productos"}${IS_DEMO ? " de ejemplo" : ""}`;
  more.hidden = shown >= filteredProducts.length;
  more.parentElement.hidden = more.hidden;
}

function render() {
  renderFilters();
  const term = normalize(search.value);
  const list = products.filter((p) => {
    const info = SCHOOLS_BY_ID.get(p.school);
    return (
      (activeLine === "all" || p.line === activeLine) &&
      (school.value === "all" || p.school === school.value || p.line === school.value) &&
      (category.value === "all" || p.category === category.value) &&
      (!term || normalize(
        p.name + " " + (info ? `${info.name} ${info.cardName}` : "") + " " + p.category + " " + p.line + " " + LINES_BY_ID.get(p.line).name,
      ).includes(term))
    );
  });
  const nextKey = list.map((p) => p.id).join(",");
  if (nextKey !== resultKey) visibleLimit = BATCH_SIZE;
  resultKey = nextKey;
  filteredProducts = list;
  grid.innerHTML = list.slice(0, visibleLimit).map(catalogCard).join("");
  grid.classList.toggle("school-photo-layout", list.some((p) => p.line === "colegios"));
  // La primera vista usa el observador. Filtros posteriores muestran al instante.
  window.AJR_MOTION?.register(grid, { immediate: catalogInitialized });
  updateCatalogCount();
  emptyState.hidden = list.length > 0;
  grid.hidden = list.length === 0;
  lineButtons.forEach((button) => button.setAttribute("aria-pressed", String(button.dataset.line === activeLine)));
  document.querySelectorAll(".school-card").forEach((btn) => {
    btn.setAttribute("aria-pressed", String(btn.dataset.school === school.value));
  });
  catalogInitialized = true;
  catalogControls.disabled = false;
  reset.disabled = false;
  catalogFallback.hidden = true;
}

function resetFilters() {
  activeLine = "all";
  search.value = "";
  category.value = "all";
  // Puede venir de una línea con un select de una sola opción.
  school.innerHTML = '<option value="all">Todos los colegios y líneas</option>';
  school.value = "all";
  visibleLimit = BATCH_SIZE;
  render();
}

function showMoreProducts() {
  const start = Math.min(visibleLimit, filteredProducts.length);
  visibleLimit += BATCH_SIZE;
  const next = filteredProducts.slice(start, visibleLimit);
  grid.insertAdjacentHTML("beforeend", next.map(catalogCard).join(""));
  window.AJR_MOTION?.register(grid, { immediate: true });
  updateCatalogCount();
  // El foco acompaña a las nuevas referencias sin desplazar bruscamente la vista.
  if (document.activeElement === more) grid.children[start]?.querySelector("a")?.focus({ preventScroll: true });
}

search.addEventListener("input", render);
school.addEventListener("change", () => {
  if (SCHOOLS_BY_ID.has(school.value)) activeLine = "colegios";
  else if (LINES_BY_ID.has(school.value)) activeLine = school.value;
  render();
});
category.addEventListener("change", render);
reset.addEventListener("click", resetFilters);
emptyReset.addEventListener("click", resetFilters);
more.addEventListener("click", showMoreProducts);
lineButtons.forEach((button) => button.addEventListener("click", () => {
  if (!LINES_BY_ID.has(button.dataset.line)) return;
  activeLine = button.dataset.line;
  school.innerHTML = '<option value="all">Todos los colegios y líneas</option>';
  school.value = "all";
  category.value = "all";
  render();
}));
// Una entrada explícita desde el navbar permite consultar el catálogo completo.
// Las tarjetas de Colegios usan su propia selección y conservan ese filtro.
document.querySelector('#main-nav a[href="#catalogo"]').addEventListener("click", resetFilters);

renderSchools();
renderFilters();
document.getElementById("corporate-products").innerHTML = products.filter((p) => p.line === "empresas").map(card).join("");
const sportsProducts = document.getElementById("sports-products");
sportsProducts.innerHTML = products
  .filter((p) => p.line === "deportes" && (p.id !== 34 || sportsProducts.dataset.showPending !== "false"))
  .map((p) => p.id === 34 ? pendingSportsCard(p) : card(p))
  .join("");
document.querySelectorAll(".school-card").forEach((btn) =>
  btn.addEventListener("click", () => {
    activeLine = "colegios";
    renderFilters();
    school.value = btn.dataset.school;
    category.value = "all";
    search.value = "";
    render();
    document.getElementById("catalogo").scrollIntoView({
      behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches
        ? "auto"
        : "smooth",
    });
  }),
);

// Menú móvil: se cierra con Escape, al tocar fuera, al elegir un enlace o al pasar a pantalla ancha.
function setMenu(open) {
  nav.classList.toggle("open", open);
  menuToggle.setAttribute("aria-expanded", String(open));
  menuToggle.setAttribute("aria-label", open ? "Cerrar menú" : "Abrir menú");
  // Al abrir, el teclado continúa por los enlaces del menú, sin desplazar la página.
  if (open) nav.querySelector("a").focus({ preventScroll: true });
}
menuToggle.addEventListener("click", () =>
  setMenu(!nav.classList.contains("open")),
);
nav
  .querySelectorAll("a")
  .forEach((link) => link.addEventListener("click", () => setMenu(false)));
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape" && nav.classList.contains("open")) {
    setMenu(false);
    menuToggle.focus();
  }
});
document.addEventListener("click", (e) => {
  if (
    nav.classList.contains("open") &&
    !nav.contains(e.target) &&
    !menuToggle.contains(e.target)
  )
    setMenu(false);
});
window.matchMedia("(min-width: 961px)").addEventListener("change", (e) => {
  if (e.matches) setMenu(false);
});

render();

// Navegación activa: un único cálculo por frame al desplazar o redimensionar.
const header = document.querySelector(".site-header");
const navLinks = [...nav.querySelectorAll('a[href^="#"]')];
const navSections = navLinks.map((link) => document.querySelector(link.hash));
let navigationFrame = 0;
let selectedSection = null;
function setActiveLink(id) {
  navLinks.forEach((link) => {
    if (link.hash === `#${id}`) link.setAttribute("aria-current", "location");
    else link.removeAttribute("aria-current");
  });
}
function updateNavigation() {
  navigationFrame = 0;
  header.classList.toggle("is-scrolled", window.scrollY > 8);
  // Usar el mismo margen que las anclas, con tolerancia al redondeo del scroll.
  const anchorOffset = parseFloat(getComputedStyle(document.documentElement).scrollPaddingTop) || 0;
  const activationLine = Math.max(header.offsetHeight, anchorOffset) + 2;
  let activeId = navSections[0].id; // La portada presenta la línea Colegios.
  navSections.forEach((section) => {
    if (section.getBoundingClientRect().top <= activationLine) activeId = section.id;
  });
  // Contacto puede no alcanzar la línea de activación por la altura del pie.
  if (window.scrollY > 0 && window.scrollY + window.innerHeight >= document.documentElement.scrollHeight - 2) {
    activeId = navSections[navSections.length - 1].id;
  }
  // Mantener la línea elegida mientras el navegador recorre secciones intermedias.
  if (selectedSection) {
    const targetOffset = anchorOffset + (parseFloat(getComputedStyle(selectedSection).scrollMarginTop) || 0);
    const reachedTarget = Math.abs(selectedSection.getBoundingClientRect().top - targetOffset) <= 2;
    const atBottom = window.scrollY + window.innerHeight >= document.documentElement.scrollHeight - 2;
    if (reachedTarget || atBottom) selectedSection = null;
    else activeId = selectedSection.id;
  }
  setActiveLink(activeId);
}
function scheduleNavigationUpdate() {
  if (!navigationFrame) navigationFrame = requestAnimationFrame(updateNavigation);
}
navLinks.forEach((link) => {
  link.addEventListener("click", () => {
    selectedSection = document.querySelector(link.hash);
    setActiveLink(selectedSection.id);
  });
});
// Cualquier interacción manual devuelve el indicador al seguimiento del scroll.
function resumeScrollTracking() {
  selectedSection = null;
  scheduleNavigationUpdate();
}
window.addEventListener("wheel", resumeScrollTracking, { passive: true });
window.addEventListener("pointerdown", resumeScrollTracking, { passive: true });
window.addEventListener("keydown", (event) => {
  if (["ArrowDown", "ArrowUp", "PageDown", "PageUp", "Home", "End", " "].includes(event.key)) resumeScrollTracking();
});
window.addEventListener("scrollend", resumeScrollTracking);
window.addEventListener("scroll", scheduleNavigationUpdate, { passive: true });
window.addEventListener("resize", scheduleNavigationUpdate);
window.addEventListener("hashchange", scheduleNavigationUpdate);
// El catálogo cambia de altura al filtrar; el footer determina el espacio mínimo
// necesario para que Contacto pueda alcanzar el navbar sin arrastrar una franja de Tienda.
const contactSection = document.getElementById("contacto");
const footer = document.querySelector("footer");
function syncContactAnchorHeight() {
  contactSection.style.setProperty("--contact-footer-height", `${footer.getBoundingClientRect().height}px`);
}
const layoutObserver = new ResizeObserver(() => {
  syncContactAnchorHeight();
  scheduleNavigationUpdate();
});
layoutObserver.observe(document.querySelector("main"));
layoutObserver.observe(footer);
syncContactAnchorHeight();

// Botón flotante único: prepara la consulta, nunca envía mensajes automáticamente.
document.getElementById("whatsapp-floating").href =
  `https://wa.me/${PHONE}?text=${encodeURIComponent("Hola, quisiera consultar por los productos y servicios de AJR.")}`;

// Todas las consultas mantienen el teléfono centralizado en data.js.
document.querySelectorAll('a[href^="https://wa.me/"]').forEach((link) => {
  const url = new URL(link.href);
  url.pathname = `/${PHONE}`;
  link.href = url.href;
});
updateNavigation();

// Registrar las tarjetas creadas por el catálogo, sin alterar datos ni filtros.
window.AJR_MOTION?.register();


// Google Maps: alternativa local ante error o espera excesiva al entrar en pantalla.
// Un load del iframe no permite inspeccionar el contenido de otro origen;
// por eso el enlace externo permanece disponible también cuando carga.
(() => {
  const panel = document.querySelector("[data-store-map]");
  const frame = panel?.querySelector("iframe");
  if (!frame) return;
  let timeout;
  let watcher;
  let loaded = false;
  function stopWaiting() {
    clearTimeout(timeout);
    watcher?.disconnect();
  }
  frame.addEventListener("load", () => {
    loaded = true;
    stopWaiting();
    panel.dataset.mapState = "loaded";
  });
  frame.addEventListener("error", () => {
    stopWaiting();
    panel.dataset.mapState = "unavailable";
  });
  if ("IntersectionObserver" in window) {
    watcher = new IntersectionObserver(entries => {
      if (loaded || !entries.some(entry => entry.isIntersecting)) return;
      watcher.disconnect();
      timeout = setTimeout(() => {
        if (!loaded) panel.dataset.mapState = "unavailable";
      }, 15000);
    });
    watcher.observe(panel);
  }
})();


// Mantener el acceso flotante fuera de textos y controles, sin cambiar las secciones.
(() => {
  const floating = document.getElementById("whatsapp-floating");
  if (!floating) return;
  const content = document.querySelector("main");
  const pageFooter = document.querySelector("footer");
  // Las tarjetas de colegio son botones grandes: proteger su contenido y su flecha, no su superficie vacía.
  const selector = "a, button:not(.school-card), input, select, iframe, h1, h2, h3, p, address, label, .overline, .product-context, .mock-tag, .school-name, .school-arrow, .school-crest";
  let frame = 0;
  let lift = 0;

  function placeFloatingContact() {
    frame = 0;
    const box = floating.getBoundingClientRect();
    const preferredTop = box.top + lift;
    const minimumTop = (document.querySelector(".site-header")?.getBoundingClientRect().bottom || 0) + 12;
    const gap = 12;
    const obstacles = [content, pageFooter].flatMap((root) =>
      [...root.querySelectorAll(selector)].flatMap((element) => {
        const rect = element.getBoundingClientRect();
        if (!rect.width || !rect.height || rect.bottom < minimumTop || rect.top > innerHeight ||
            rect.right + gap <= box.left || rect.left - gap >= box.right) return [];
        return [{ top: rect.top - gap, bottom: rect.bottom + gap }];
      }),
    ).sort((a, b) => b.top - a.top);
    let top = preferredTop;
    for (const obstacle of obstacles) {
      if (top < obstacle.bottom && top + box.height > obstacle.top) {
        top = obstacle.top - box.height;
      }
    }
    // Short viewports can leave no vertical gap; keep the control below the header.
    top = Math.max(minimumTop, top);
    const nextLift = Math.max(0, Math.round(preferredTop - top));
    if (nextLift !== lift) {
      lift = nextLift;
      floating.style.setProperty("--whatsapp-lift", `${lift}px`);
    }
  }
  function scheduleFloatingContact() {
    if (!frame) frame = requestAnimationFrame(placeFloatingContact);
  }
  window.addEventListener("scroll", scheduleFloatingContact, { passive: true });
  window.addEventListener("resize", scheduleFloatingContact);
  const observer = new ResizeObserver(scheduleFloatingContact);
  observer.observe(content);
  observer.observe(pageFooter);
  document.fonts?.ready.then(scheduleFloatingContact);
  scheduleFloatingContact();
})();
