/* ==========================================================================
 * EFEITOS MÁGICOS
 * Camada decorativa/interativa por cima do site: céu dinâmico no hero,
 * poeira ambiente, brilho de tocha, glint + anel de impacto, barra de XP,
 * conquistas estilo "Advancement" e um easter egg. Tudo em CSS/JS puro, sem
 * bibliotecas externas e sem nenhum asset extraído do jogo.
 *
 * Regras que todo efeito aqui respeita:
 * - prefers-reduced-motion: reduce -> nada de decoração animada.
 * - Nenhum listener de click/touchstart/keydown chama preventDefault ou
 *   stopPropagation, pra nunca competir com o "unlock" de áudio do player
 *   nostálgico (js/nostalgia-player.js).
 * ========================================================================== */
(function () {
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---------- Hero vivo: céu dinâmico conforme a hora do dia ---------- */
  function setupHeroSky() {
    const hero = document.querySelector(".hero");
    if (!hero) return;

    const hour = new Date().getHours();
    let phase = "noite";
    if (hour >= 6 && hour < 11) phase = "manha";
    else if (hour >= 11 && hour < 17) phase = "tarde";
    else if (hour >= 17 && hour < 19) phase = "entardecer";
    hero.dataset.phase = phase;

    if (reduceMotion) return;

    const sky = document.createElement("div");
    sky.className = "hero-sky";
    sky.setAttribute("aria-hidden", "true");
    sky.innerHTML =
      '<div class="stars"></div>' +
      '<div class="sky-orb"></div>' +
      '<div class="cloud-layer">' +
        '<span class="cloud cloud--1"></span>' +
        '<span class="cloud cloud--2"></span>' +
        '<span class="cloud cloud--3"></span>' +
      "</div>";
    hero.insertBefore(sky, hero.firstChild);
  }

  /* ---------- Poeira mágica ambiente (vaga-lumes) ---------- */
  function setupAmbientParticles() {
    if (reduceMotion) return;
    const sections = document.querySelectorAll(".hero, #mods.mods-guide, #historia.historia, #galeria.gallery");
    sections.forEach((section) => {
      const field = document.createElement("div");
      field.className = "particle-field";
      field.setAttribute("aria-hidden", "true");
      for (let i = 0; i < 7; i++) {
        const particle = document.createElement("span");
        particle.className = "particle";
        particle.style.left = `${Math.random() * 100}%`;
        const duration = 6 + Math.random() * 8;
        particle.style.animationDuration = `${duration}s`;
        particle.style.animationDelay = `-${(Math.random() * duration).toFixed(2)}s`;
        field.appendChild(particle);
      }
      section.insertBefore(field, section.firstChild);
    });

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        const state = entry.isIntersecting ? "running" : "paused";
        entry.target.querySelectorAll(".particle").forEach((p) => {
          p.style.animationPlayState = state;
        });
      });
    }, { threshold: 0 });
    document.querySelectorAll(".particle-field").forEach((field) => observer.observe(field));

    document.addEventListener("visibilitychange", () => {
      const state = document.hidden ? "paused" : "running";
      document.querySelectorAll(".particle").forEach((p) => {
        p.style.animationPlayState = state;
      });
    });
  }

  /* ---------- Glint mágico (hover/foco/toque + brinde no primeiro reveal) ---------- */
  function setupGlint() {
    if (reduceMotion) return;
    const selector = ".mc-title, .section-title, .btn, .gallery-caption";

    function trigger(el) {
      el.classList.remove("glint-active");
      void el.offsetWidth; // força reflow pra permitir retrigger da animação
      el.classList.add("glint-active");
      clearTimeout(el._glintTimer);
      el._glintTimer = setTimeout(() => el.classList.remove("glint-active"), 950);
    }

    function delegate(e) {
      const el = e.target.closest ? e.target.closest(selector) : null;
      if (el) trigger(el);
    }

    document.addEventListener("pointerover", delegate);
    document.addEventListener("focusin", delegate);
    document.addEventListener("touchstart", delegate, { passive: true });
  }

  /* ---------- Anel de impacto ao clicar/tocar ---------- */
  function setupImpactRing() {
    if (reduceMotion) return;
    const selector = ".btn, .gallery-card, .mod-link, .carousel-arrow";
    let lastTouchAt = 0;

    function spawnRing(x, y) {
      const ring = document.createElement("div");
      ring.className = "impact-ring";
      ring.style.left = `${x}px`;
      ring.style.top = `${y}px`;
      document.body.appendChild(ring);
      ring.addEventListener("animationend", () => ring.remove());
    }

    document.addEventListener("touchstart", (e) => {
      const el = e.target.closest ? e.target.closest(selector) : null;
      if (!el || !e.touches || !e.touches[0]) return;
      lastTouchAt = Date.now();
      spawnRing(e.touches[0].clientX, e.touches[0].clientY);
    }, { passive: true });

    document.addEventListener("click", (e) => {
      if (Date.now() - lastTouchAt < 500) return; // evita anel duplicado do click sintético em touch
      const el = e.target.closest ? e.target.closest(selector) : null;
      if (!el) return;
      spawnRing(e.clientX, e.clientY);
    });
  }

  /* ---------- Barra de XP da jornada (progresso de rolagem) ---------- */
  function setupXpBar() {
    const fill = document.getElementById("xpFill");
    if (!fill) return;
    let ticking = false;

    function update() {
      const scrollable = document.documentElement.scrollHeight - window.innerHeight;
      const progress = scrollable > 0 ? Math.min(100, Math.max(0, (window.scrollY / scrollable) * 100)) : 0;
      fill.style.width = `${progress}%`;
      ticking = false;
    }

    update();
    window.addEventListener("scroll", () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(update);
    }, { passive: true });
    window.addEventListener("resize", update);
  }

  /* ---------- Conquistas estilo "Advancement Made!" ---------- */
  const AchievementSystem = (function () {
    const seen = new Set();
    let stack = null;

    function ensureStack() {
      if (stack) return stack;
      stack = document.createElement("div");
      stack.id = "achievementStack";
      stack.setAttribute("aria-live", "polite");
      document.body.appendChild(stack);
      return stack;
    }

    function unlock(id, title, desc) {
      if (seen.has(id)) return;
      seen.add(id);

      const toast = document.createElement("div");
      toast.className = "achievement-toast pixel-panel";
      toast.innerHTML =
        '<div class="achievement-toast__icon" aria-hidden="true"><div></div><div></div><div></div><div></div></div>' +
        '<div class="achievement-toast__text">' +
        '<p class="achievement-toast__eyebrow">Conquista desbloqueada!</p>' +
        `<p class="achievement-toast__title">${title}</p>` +
        (desc ? `<p class="achievement-toast__desc">${desc}</p>` : "") +
        "</div>";
      ensureStack().appendChild(toast);

      if (window.SFX && window.__radioUnlocked) window.SFX.play("achievement");

      requestAnimationFrame(() => toast.classList.add("is-visible"));
      setTimeout(() => {
        toast.classList.remove("is-visible");
        setTimeout(() => toast.remove(), 400);
      }, 3800);
    }

    return { unlock };
  })();
  window.MagicAchievements = AchievementSystem;

  /* ---------- Marcos de seção: badge de nível + conquistas de progresso ---------- */
  function setupSectionMilestones() {
    // Observa o TÍTULO de cada seção (elemento pequeno), não a seção inteira —
    // uma seção com tutorial longo pode nunca cruzar 40% de área visível.
    const milestones = [
      { id: "mods", level: 3, name: "Mods", achievement: "Chegou nos mods", el: document.querySelector("#mods .section-title") },
      { id: "historia", level: 4, name: "História", achievement: "Relembrou a história", el: document.querySelector("#historia .section-title") },
      { id: "galeria", level: 5, name: "Galeria", achievement: "Chegou na galeria", el: document.querySelector("#galeria .section-title") },
      { id: "mod-list", level: null, name: null, achievement: "Viu a lista completa de mods", el: document.getElementById("mod-list") },
    ].filter((m) => m.el);

    if (!milestones.length) return;

    let badge = null;
    function ensureBadge() {
      if (badge) return badge;
      badge = document.createElement("div");
      badge.className = "level-badge";
      badge.setAttribute("aria-hidden", "true");
      document.body.appendChild(badge);
      return badge;
    }

    function showLevel(m) {
      if (m.level == null) return;
      const b = ensureBadge();
      b.textContent = `NÍVEL ${m.level} — ${m.name}`;
      b.classList.add("is-visible");
      clearTimeout(showLevel._t);
      showLevel._t = setTimeout(() => b.classList.remove("is-visible"), 1800);
    }

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        const m = milestones.find((item) => item.el === entry.target);
        if (!m) return;
        showLevel(m);
        AchievementSystem.unlock(`section-${m.id}`, m.achievement, "");
        observer.unobserve(entry.target);
      });
    }, { threshold: 0.25 });

    milestones.forEach((m) => observer.observe(m.el));
  }

  /* ---------- Achievement ao copiar o IP ---------- */
  function setupCopyAchievement() {
    const copyBtn = document.getElementById("copyIpBtn");
    if (!copyBtn) return;
    copyBtn.addEventListener("click", () => {
      if (copyBtn.disabled) return;
      AchievementSystem.unlock("copy-ip", "Endereço copiado", "Já pode colar no Minecraft.");
    });
  }

  /* ---------- Easter egg: código Konami ---------- */
  function setupKonami() {
    const sequence = ["ArrowUp", "ArrowUp", "ArrowDown", "ArrowDown", "ArrowLeft", "ArrowRight", "ArrowLeft", "ArrowRight", "b", "a"];
    let buffer = [];

    document.addEventListener("keydown", (e) => {
      buffer.push(e.key);
      buffer = buffer.slice(-sequence.length);
      if (buffer.length === sequence.length && buffer.every((k, i) => k === sequence[i])) {
        buffer = [];
        triggerKonami();
      }
    });

    function triggerKonami() {
      AchievementSystem.unlock("konami", "Lenda da Galera", "Achou o código secreto.");
      if (window.SFX) window.SFX.play("achievement");

      if (!reduceMotion) {
        const colors = ["var(--grass)", "var(--dirt)", "var(--wood)", "var(--stone)"];
        for (let i = 0; i < 20; i++) {
          const block = document.createElement("div");
          block.className = "falling-block";
          block.style.left = `${Math.random() * 100}vw`;
          block.style.background = colors[Math.floor(Math.random() * colors.length)];
          block.style.animationDuration = `${1.6 + Math.random() * 1.2}s`;
          block.style.animationDelay = `${(Math.random() * 0.6).toFixed(2)}s`;
          document.body.appendChild(block);
          block.addEventListener("animationend", () => block.remove());
        }
      }

      const banner = document.createElement("div");
      banner.className = "konami-banner";
      banner.textContent = "LENDA DA GALERA";
      document.body.appendChild(banner);
      requestAnimationFrame(() => banner.classList.add("is-visible"));
      setTimeout(() => {
        banner.classList.remove("is-visible");
        setTimeout(() => banner.remove(), 400);
      }, 2200);
    }
  }

  document.addEventListener("DOMContentLoaded", () => {
    setupHeroSky();
    setupAmbientParticles();
    setupGlint();
    setupImpactRing();
    setupXpBar();
    setupSectionMilestones();
    setupCopyAchievement();
    setupKonami();
  });
})();
