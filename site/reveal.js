/* AJR — aparición progresiva, independiente de los datos y filtros.
   Ningún contenido se oculta antes de entrar; sin JS o ante un fallo queda visible. */
(() => {
  const selector = [
    ".schools-section .section-head", ".school-card",
    "#empresas .company-heading", "#empresas .company-work-heading",
    "#empresas .company-logo-card", "#empresas .company-quote",
    "#deportes .sports-heading", "#deportes .sports-quote",
    ".line-products .product-card", ".catalog-section .section-head", "#catalogo .catalog-controls",
    "#products-grid .product-card", ".store-copy", "#contacto .contact-copy",
  ].join(",");
  const preference = window.matchMedia("(prefers-reduced-motion: reduce)");
  const seen = new WeakSet();
  const pending = new Set();
  let observer;
  function finish(element) {
    element.classList.remove("ajr-revealing");
    element.style.removeProperty("--reveal-delay");
  }
  function reveal(entries) {
    entries.forEach(({ target, isIntersecting }) => {
      if (!isIntersecting) return;
      observer.unobserve(target);
      pending.delete(target);
      seen.add(target);
      if (preference.matches) return;
      target.classList.add("ajr-revealing");
      target.addEventListener("animationend", () => finish(target), { once: true });
      target.addEventListener("animationcancel", () => finish(target), { once: true });
    });
  }
  function register(root = document, { immediate = false } = {}) {
    if (immediate) {
      pending.forEach(element => {
        if (!element.isConnected) { observer?.unobserve(element); pending.delete(element); }
      });
      root.querySelectorAll(selector).forEach(element => {
        observer?.unobserve(element);
        pending.delete(element);
        seen.add(element);
        finish(element);
      });
      return;
    }
    if (preference.matches || !("IntersectionObserver" in window)) return;
    try {
      observer ||= new IntersectionObserver(reveal, { threshold: .08, rootMargin: "0px 0px -24px 0px" });
      pending.forEach(element => {
        if (!element.isConnected) { observer.unobserve(element); pending.delete(element); }
      });
      root.querySelectorAll(selector).forEach(element => {
        if (seen.has(element) || pending.has(element)) return;
        const siblings = [...element.parentElement.children];
        const step = element.matches("#colegios .school-card, #empresas .product-card, #empresas .company-logo-card, #deportes .product-card") ? 100 : 40;
        const companyBlock = element.matches("#empresas .company-heading, #empresas .company-work-heading, #empresas .company-quote, #deportes .sports-heading, #deportes .sports-quote");
        element.style.setProperty("--reveal-delay", `${companyBlock ? 0 : (siblings.indexOf(element) % 4) * step}ms`);
        pending.add(element);
        observer.observe(element);
      });
    } catch {
      observer?.disconnect();
      pending.clear();
      document.querySelectorAll(".ajr-revealing").forEach(finish);
    }
  }
  preference.addEventListener("change", () => {
    if (preference.matches) {
      observer?.disconnect();
      pending.clear();
      document.querySelectorAll(".ajr-revealing").forEach(finish);
    } else register();
  });
  // Una navegación explícita o el foco muestran Colegios inmediatamente.
  // Reutiliza el mismo observador y la misma memoria de elementos ya vistos.
  function showSchools() {
    document.querySelectorAll("#colegios .section-head, #colegios .school-card").forEach(element => {
      observer?.unobserve(element);
      pending.delete(element);
      seen.add(element);
      finish(element);
    });
  }
  document.querySelectorAll('a[href="#colegios"]').forEach(link => link.addEventListener("click", showSchools));
  document.querySelector("#colegios")?.addEventListener("focusin", showSchools);
  // Empresas usa el observador existente; navegación y foco no esperan la entrada.
  function showCompanies() {
    document.querySelectorAll("#empresas .company-heading, #empresas .product-card, #empresas .company-work-heading, #empresas .company-logo-card, #empresas .company-quote").forEach(element => {
      observer?.unobserve(element);
      pending.delete(element);
      seen.add(element);
      finish(element);
    });
  }
  document.querySelectorAll('a[href="#empresas"]').forEach(link => link.addEventListener("click", showCompanies));
  document.querySelector("#empresas")?.addEventListener("focusin", showCompanies);
  // Deportes comparte el observador existente y se muestra al navegar o enfocar.
  function showSports() {
    document.querySelectorAll("#deportes .sports-heading, #deportes .product-card, #deportes .sports-quote").forEach(element => {
      observer?.unobserve(element);
      pending.delete(element);
      seen.add(element);
      finish(element);
    });
  }
  document.querySelectorAll('a[href="#deportes"]').forEach(link => link.addEventListener("click", showSports));
  document.querySelector("#deportes")?.addEventListener("focusin", showSports);
  // El catálogo muestra resultados inmediatos al filtrar, ampliar o enfocar.
  function showCatalog() {
    const catalog = document.querySelector("#catalogo");
    if (catalog) register(catalog, { immediate: true });
  }
  document.querySelectorAll('a[href="#catalogo"]').forEach(link => link.addEventListener("click", showCatalog));
  document.querySelector("#catalogo")?.addEventListener("focusin", showCatalog);
  ["local", "contacto"].forEach(id => {
    const section = document.getElementById(id);
    const showSection = () => { if (section) register(section, { immediate: true }); };
    document.querySelectorAll(`a[href="#${id}"]`).forEach(link => link.addEventListener("click", showSection));
    section?.addEventListener("focusin", showSection);
    if (window.location.hash === `#${id}`) showSection();
  });
  window.AJR_MOTION = { register };
  register();
})();
