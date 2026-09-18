/* ==========================================================================
 * PLAYER NOSTÁLGICO
 * Toca uma rádio de músicas/vídeos nostálgicos em ordem aleatória.
 * Autoplay começa mudo (única forma permitida pelos navegadores) e o som
 * real liga no primeiro clique/tecla do usuário em qualquer lugar da página.
 * ========================================================================== */
const NOSTALGIA_TRACKS = [
  { id: "jVwn1xZEgJ4", title: "SIM, EU VOU!! — AuthenticGames" },
  { id: "LVMHYzVS9Y4", title: "Rap do Minecraft (RapGame 06) — Tauz" },
  { id: "cPJUBQd-PNM", title: "Revenge (Minecraft Parody) — CaptainSparklez" },
  { id: "CU1c3fZ7dSM", title: "Intro do TazerCraft — Tron!" },
  { id: "rQzSiiRe6YM", title: "RAP DO MINECRAFT — BngOficial" },
  { id: "9h1l5Z0mH0w", title: "COM MEUS AMIGOS — AuthenticGames" },
  { id: "w4utAyKFrZY", title: "SOU STEVE (Paródia Believer) — jvnq" },
  { id: "M2GYZhz7B34", title: "RAVINA (Paródia Havana) — jvnq" },
  { id: "WwIvxSWR_B8", title: "Intro do Rezendeevil — Tron!" },
];

const GALLERY_PHOTOS = [
  { src: "assets/img/gallery/foto-01.jpg", alt: "Steve enfrentando um esqueleto na beira de um penhasco", caption: "Duelo com esqueleto" },
  { src: "assets/img/gallery/foto-02.jpg", alt: "Ilha com templo na selva, vista de uma base com cama e baú", caption: "Templo escondido na selva" },
  { src: "assets/img/gallery/foto-03.jpg", alt: "Corte do mundo, da superfície até o Nether", caption: "Da superfície até o Nether" },
  { src: "assets/img/gallery/foto-04.jpg", alt: "Steve sentado ao lado de um Creeper em frente a uma selva", caption: "Amizade com um Creeper" },
  { src: "assets/img/gallery/foto-05.jpg", alt: "Steve correndo pela grama com os mobs do jogo", caption: "Correria com os mobs" },
  { src: "assets/img/gallery/foto-06.png", alt: "Steve enfrentando um esqueleto ao entardecer", caption: "Emboscada ao entardecer" },
];

(function () {
  function shuffle(list) {
    const arr = list.slice();
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
  }

  let queue = shuffle(NOSTALGIA_TRACKS);
  let index = 0;
  let player = null;

  const els = {};

  function currentTrack() {
    return queue[index];
  }

  function updateTitle() {
    els.title.textContent = currentTrack().title;
  }

  function setPlayIcon(isPlaying) {
    els.playPause.textContent = isPlaying ? "⏸" : "▶";
    els.playPause.title = isPlaying ? "Pausar" : "Tocar";
  }

  function playNext() {
    index += 1;
    if (index >= queue.length) {
      queue = shuffle(NOSTALGIA_TRACKS);
      index = 0;
    }
    player.loadVideoById(currentTrack().id);
    updateTitle();
  }

  function playPrev() {
    index = index === 0 ? queue.length - 1 : index - 1;
    player.loadVideoById(currentTrack().id);
    updateTitle();
  }

  function unmuteAndPlay() {
    if (!player || typeof player.isMuted !== "function") return;
    if (player.isMuted()) {
      player.unMute();
      player.setVolume(55);
    }
    if (player.getPlayerState() !== 1) {
      player.playVideo();
    }
  }

  function setupInteractionUnlock() {
    const unlock = () => {
      unmuteAndPlay();
      window.__radioUnlocked = true;
      document.removeEventListener("click", unlock);
      document.removeEventListener("keydown", unlock);
      document.removeEventListener("touchstart", unlock);
    };
    document.addEventListener("click", unlock);
    document.addEventListener("keydown", unlock);
    document.addEventListener("touchstart", unlock);
  }

  function setupControls() {
    els.tick.addEventListener("click", () => {
      els.root.classList.remove("is-collapsed");
      unmuteAndPlay();
    });
    els.close.addEventListener("click", () => {
      els.root.classList.add("is-collapsed");
    });
    els.playPause.addEventListener("click", () => {
      if (!player) return;
      if (player.isMuted()) {
        unmuteAndPlay();
        return;
      }
      if (player.getPlayerState() === 1) {
        player.pauseVideo();
      } else {
        player.playVideo();
      }
    });
    els.next.addEventListener("click", () => {
      playNext();
      if (window.MagicAchievements) window.MagicAchievements.unlock("track-change", "DJ da galera", "Trocou de música no rádio.");
    });
    els.prev.addEventListener("click", () => {
      playPrev();
      if (window.MagicAchievements) window.MagicAchievements.unlock("track-change", "DJ da galera", "Trocou de música no rádio.");
    });
  }

  function initPlayer() {
    if (player) return;
    player = new YT.Player("nostalgiaVideoHost", {
      videoId: currentTrack().id,
      width: "100%",
      height: "100%",
      playerVars: {
        autoplay: 1,
        mute: 1,
        controls: 0,
        modestbranding: 1,
        rel: 0,
        playsinline: 1,
        iv_load_policy: 3,
        origin: window.location.origin,
      },
      events: {
        onReady: (e) => {
          updateTitle();
          e.target.playVideo();
        },
        onStateChange: (e) => {
          if (e.data === YT.PlayerState.PLAYING) setPlayIcon(true);
          if (e.data === YT.PlayerState.PAUSED) setPlayIcon(false);
          if (e.data === YT.PlayerState.ENDED) playNext();
        },
        onError: () => playNext(),
      },
    });
  }

  // Definido ANTES de carregar o script da API: se o script já tiver sido
  // baixado do cache e disparar o callback quase na hora, precisamos que
  // window.onYouTubeIframeAPIReady já exista, senão a chamada se perde.
  window.onYouTubeIframeAPIReady = initPlayer;
  // Rede de segurança: se a API já estava pronta antes mesmo desse ponto.
  if (window.YT && window.YT.Player) initPlayer();

  function renderGallery() {
    const grid = document.getElementById("galleryGrid");
    if (!grid) return;
    grid.innerHTML = "";

    GALLERY_PHOTOS.forEach((photo) => {
      const card = document.createElement("button");
      card.type = "button";
      card.className = "gallery-card";
      card.dataset.full = photo.src;
      card.dataset.alt = photo.alt;

      const img = document.createElement("img");
      img.className = "gallery-thumb";
      img.src = photo.src;
      img.alt = photo.alt;
      img.loading = "lazy";

      const caption = document.createElement("span");
      caption.className = "gallery-caption";
      caption.textContent = photo.caption;

      card.appendChild(img);
      card.appendChild(caption);
      grid.appendChild(card);
    });

    NOSTALGIA_TRACKS.forEach((track) => {
      const card = document.createElement("a");
      card.className = "gallery-card";
      card.href = `https://www.youtube.com/watch?v=${track.id}`;
      card.target = "_blank";
      card.rel = "noopener";

      const img = document.createElement("img");
      img.className = "gallery-thumb";
      img.src = `https://i.ytimg.com/vi/${track.id}/hqdefault.jpg`;
      img.alt = track.title;
      img.loading = "lazy";

      const caption = document.createElement("span");
      caption.className = "gallery-caption";
      caption.textContent = track.title;

      card.appendChild(img);
      card.appendChild(caption);
      grid.appendChild(card);
    });
  }

  function setupGalleryLightbox() {
    const grid = document.getElementById("galleryGrid");
    const lightbox = document.getElementById("galleryLightbox");
    const lightboxImg = document.getElementById("lightboxImg");
    const closeBtn = document.getElementById("lightboxClose");
    if (!grid || !lightbox || !lightboxImg || !closeBtn) return;

    function openLightbox(src, alt) {
      lightboxImg.src = src;
      lightboxImg.alt = alt || "";
      lightbox.hidden = false;
      document.body.classList.add("lightbox-open");
      if (window.MagicAchievements) window.MagicAchievements.unlock("lightbox", "Foto em close-up", "Abriu uma foto da galeria em tamanho grande.");
    }

    function closeLightbox() {
      lightbox.hidden = true;
      lightboxImg.src = "";
      document.body.classList.remove("lightbox-open");
    }

    grid.addEventListener("click", (e) => {
      const card = e.target.closest(".gallery-card[data-full]");
      if (!card) return;
      openLightbox(card.dataset.full, card.dataset.alt);
    });

    closeBtn.addEventListener("click", closeLightbox);
    lightbox.addEventListener("click", (e) => {
      if (e.target === lightbox) closeLightbox();
    });
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && !lightbox.hidden) closeLightbox();
    });
  }

  function setupGalleryCarousel() {
    const viewport = document.getElementById("galleryViewport");
    const prevBtn = document.getElementById("galleryPrev");
    const nextBtn = document.getElementById("galleryNext");
    if (!viewport || !prevBtn || !nextBtn) return;

    function cardStep() {
      const card = viewport.querySelector(".gallery-card");
      if (!card) return viewport.clientWidth;
      const style = getComputedStyle(viewport.querySelector(".carousel-track"));
      const gap = parseFloat(style.columnGap || style.gap || "0") || 0;
      return card.getBoundingClientRect().width + gap;
    }

    prevBtn.addEventListener("click", () => {
      viewport.scrollBy({ left: -cardStep(), behavior: "smooth" });
    });
    nextBtn.addEventListener("click", () => {
      viewport.scrollBy({ left: cardStep(), behavior: "smooth" });
    });
  }

  document.addEventListener("DOMContentLoaded", () => {
    els.root = document.getElementById("nostalgia");
    els.tick = document.getElementById("nostalgiaTick");
    els.close = document.getElementById("nostalgiaClose");
    els.title = document.getElementById("nostalgiaTitle");
    els.playPause = document.getElementById("nostalgiaPlayPause");
    els.next = document.getElementById("nostalgiaNext");
    els.prev = document.getElementById("nostalgiaPrev");

    setupControls();
    setupInteractionUnlock();
    renderGallery();
    setupGalleryLightbox();
    setupGalleryCarousel();
  });
})();
