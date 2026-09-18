/* ==========================================================================
 * CONFIGURAÇÃO DO SERVIDOR
 * Edite só este bloco quando tiver as informações reais.
 * serverIP: null -> mostra "em breve"; preencha com o endereço quando existir.
 * ========================================================================== */
const CONFIG = {
  serverName: "wGusmares",
  serverIP: "enx-cirion-97.enx.host:10073",
  version: "1.21.x",
  modpackName: "Personalizado",
  modpackLink: null, // ex: "https://exemplo.com/modpack.zip"
};

function applyConfig() {
  document.querySelectorAll('[data-config="serverName"]').forEach(el => {
    el.textContent = CONFIG.serverName;
  });
  document.title = `${CONFIG.serverName} — Minecraft`;

  document.querySelectorAll('[data-config="version"]').forEach(el => {
    el.textContent = CONFIG.version;
  });
  document.querySelectorAll('[data-config="modpackName"]').forEach(el => {
    el.textContent = CONFIG.modpackName;
  });

  const ipEl = document.querySelector('[data-config="serverIP"]');
  const copyBtn = document.getElementById("copyIpBtn");
  if (CONFIG.serverIP) {
    ipEl.textContent = CONFIG.serverIP;
    ipEl.closest(".field-box").classList.remove("field-box--pending");
    copyBtn.disabled = false;
    copyBtn.title = "Copiar endereço";
    copyBtn.addEventListener("click", () => {
      navigator.clipboard.writeText(CONFIG.serverIP).then(() => {
        const original = copyBtn.textContent;
        copyBtn.textContent = "copiado!";
        setTimeout(() => (copyBtn.textContent = original), 1500);
      });
    });
  }

  const modpackBtn = document.getElementById("modpackBtn");
  if (CONFIG.modpackLink) {
    modpackBtn.href = CONFIG.modpackLink;
  } else {
    modpackBtn.setAttribute("aria-disabled", "true");
    modpackBtn.addEventListener("click", (e) => e.preventDefault());
    modpackBtn.textContent = "Modpack em breve";
  }
}

function setupPhotoFallback() {
  const img = document.getElementById("serverPhoto");
  const placeholder = document.getElementById("photoPlaceholder");

  function showPhoto() {
    img.style.display = "block";
    placeholder.style.display = "none";
  }
  function showPlaceholder() {
    img.style.display = "none";
    placeholder.style.display = "flex";
  }

  img.addEventListener("load", showPhoto);
  img.addEventListener("error", showPlaceholder);

  // A imagem pode já ter carregado (cache/disco local) antes desses
  // listeners serem anexados, e nesse caso o evento "load" nunca dispara.
  if (img.complete) {
    img.naturalWidth > 0 ? showPhoto() : showPlaceholder();
  }
}

function setupNavToggle() {
  const toggle = document.getElementById("navToggle");
  const nav = document.getElementById("siteNav");
  toggle.addEventListener("click", () => {
    const isOpen = nav.classList.toggle("is-open");
    toggle.setAttribute("aria-expanded", String(isOpen));
  });
  nav.querySelectorAll("a").forEach(link => {
    link.addEventListener("click", () => {
      nav.classList.remove("is-open");
      toggle.setAttribute("aria-expanded", "false");
    });
  });
}

function setupRevealOnScroll() {
  const items = document.querySelectorAll(".reveal");
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });
  items.forEach(item => observer.observe(item));
}

document.addEventListener("DOMContentLoaded", () => {
  applyConfig();
  setupPhotoFallback();
  setupNavToggle();
  setupRevealOnScroll();
});
