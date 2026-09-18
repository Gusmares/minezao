/* ==========================================================================
 * CONFIGURAÇÃO DO SERVIDOR
 * Edite só este bloco quando tiver as informações reais.
 * serverIP: null -> mostra "em breve"; preencha com o endereço quando existir.
 * ========================================================================== */
const CONFIG = {
  serverName: "wGusmares",
  serverIP: "enx-cirion-97.enx.host:10073",
  version: "1.21.1",
  modpackName: "Personalizado",
  modpackLink: "https://github.com/Gusmares/minezao/releases/download/modpack-v1/mods.rar",
};

function applyConfig() {
  document.querySelectorAll('[data-config="serverName"]').forEach(el => {
    el.textContent = CONFIG.serverName;
  });

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

function setupModListToggle() {
  const details = document.getElementById("modListToggle");
  if (!details) return;

  function openIfTargeted() {
    if (location.hash === "#mod-list") details.open = true;
  }
  window.addEventListener("hashchange", openIfTargeted);
  openIfTargeted();
}

/* ==========================================================================
 * AVISO MOBILE — "F3" com diagnóstico do dispositivo
 * Detecta SO/aparelho/navegador (só decorativo, pra mostrar que o site é
 * autoral) e avisa que o modpack/mods baixam melhor num computador, sem
 * travar quem só quer ver a história e as fotos pelo celular.
 * ========================================================================== */
function detectClientInfo() {
  const ua = navigator.userAgent || "";

  let os = "Desconhecido";
  if (/Windows/i.test(ua)) os = "Windows";
  else if (/iPhone|iPad|iPod/i.test(ua)) os = "iOS";
  else if (/Android/i.test(ua)) os = "Android";
  else if (/Mac OS X/i.test(ua)) os = "macOS";
  else if (/Linux/i.test(ua)) os = "Linux";

  let device = "Dispositivo móvel";
  if (/iPad/i.test(ua)) device = "iPad";
  else if (/iPhone/i.test(ua)) device = "iPhone";
  else if (/Android/i.test(ua)) {
    const match = ua.match(/Android\s[^;]+;\s*([^)]+)\)/i);
    device = match ? match[1].split(/\s+Build|\s+wv/i)[0].trim() : "Smartphone Android";
  }

  let browser = "Navegador";
  if (/EdgA|EdgiOS|Edg\//i.test(ua)) browser = "Edge";
  else if (/CriOS/i.test(ua)) browser = "Chrome";
  else if (/FxiOS|Firefox/i.test(ua)) browser = "Firefox";
  else if (/Chrome/i.test(ua)) browser = "Chrome";
  else if (/Safari/i.test(ua)) browser = "Safari";

  return { os, device, browser };
}

function setupDeviceNotice() {
  const notice = document.getElementById("deviceNotice");
  if (!notice) return;

  const isMobile = window.innerWidth > 0 && window.matchMedia("(max-width: 640px)").matches;
  if (!isMobile || sessionStorage.getItem("deviceNoticeDismissed") === "1") return;

  const { os, device, browser } = detectClientInfo();
  const debugList = document.getElementById("deviceNoticeDebug");
  const rows = [
    ["Dispositivo", device],
    ["Sistema", os],
    ["Navegador", browser],
    ["Tela", `${window.innerWidth}×${window.innerHeight}`],
  ];
  debugList.replaceChildren(
    ...rows.map(([k, v]) => {
      const li = document.createElement("li");
      const key = document.createElement("span");
      key.className = "k";
      key.textContent = k;
      const val = document.createElement("span");
      val.className = "v";
      val.textContent = v;
      li.append(key, val);
      return li;
    })
  );

  function dismiss() {
    notice.classList.remove("is-visible");
    sessionStorage.setItem("deviceNoticeDismissed", "1");
    setTimeout(() => { notice.hidden = true; }, 350);
  }

  document.getElementById("deviceNoticeClose").addEventListener("click", dismiss);
  document.getElementById("deviceNoticeOk").addEventListener("click", dismiss);

  notice.hidden = false;
  requestAnimationFrame(() => {
    setTimeout(() => notice.classList.add("is-visible"), 400);
  });
}

function setupRevealOnScroll() {
  const items = document.querySelectorAll(".reveal");
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        entry.target.classList.add("glint-once");
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
  setupModListToggle();
  setupDeviceNotice();
  setupRevealOnScroll();
});
