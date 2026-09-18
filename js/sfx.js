/* ==========================================================================
 * MOTOR DE SFX 8-BIT
 * Bips curtos sintetizados via Web Audio API — sem nenhum arquivo de áudio
 * externo. O AudioContext só é criado dentro de um clique real do usuário
 * (gesto válido pro navegador), então não depende do "unlock" de áudio do
 * player nostálgico — são dois sistemas independentes.
 * ========================================================================== */
(function () {
  let ctx = null;

  function getContext() {
    if (!ctx) {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (!AudioCtx) return null;
      ctx = new AudioCtx();
    }
    if (ctx.state === "suspended") ctx.resume();
    return ctx;
  }

  function beep(freq, duration, type, delay, gainPeak) {
    const audioCtx = getContext();
    if (!audioCtx) return;
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    osc.type = type || "square";
    osc.frequency.value = freq;
    const start = audioCtx.currentTime + (delay || 0);
    gain.gain.setValueAtTime(0, start);
    gain.gain.linearRampToValueAtTime(gainPeak || 0.06, start + 0.005);
    gain.gain.exponentialRampToValueAtTime(0.0001, start + duration);
    osc.connect(gain).connect(audioCtx.destination);
    osc.start(start);
    osc.stop(start + duration + 0.02);
  }

  const PRESETS = {
    click: () => beep(520, 0.07, "square"),
    toggle: () => beep(380, 0.08, "triangle"),
    confirm: () => {
      beep(660, 0.08, "square");
      beep(880, 0.09, "square", 0.08);
    },
    achievement: () => {
      beep(660, 0.09, "triangle");
      beep(880, 0.09, "triangle", 0.09);
      beep(1100, 0.14, "triangle", 0.18);
    },
  };

  function play(name) {
    const preset = PRESETS[name] || PRESETS.click;
    try {
      preset();
    } catch (e) {
      // Web Audio indisponível ou bloqueado pelo navegador — ignora silenciosamente.
    }
  }

  window.SFX = {
    play,
    isReady: () => !!ctx && ctx.state === "running",
  };

  document.addEventListener("DOMContentLoaded", () => {
    const selector = ".btn, #navToggle, .carousel-arrow, .mod-link, #lightboxClose, #copyIpBtn";
    document.addEventListener("click", (e) => {
      const el = e.target.closest ? e.target.closest(selector) : null;
      if (!el) return;
      if (el.id === "navToggle" || el.classList.contains("carousel-arrow")) {
        play("toggle");
      } else if (el.id === "copyIpBtn") {
        play("confirm");
      } else {
        play("click");
      }
    });
  });
})();
