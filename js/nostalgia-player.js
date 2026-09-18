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

/* ---------- Clipes de gameplay (Medal.tv) ---------- */
const NOSTALGIA_CLIPS = [
  { src: "assets/video/clipes/clipe-01.mp4", poster: "assets/video/clipes/clipe-01.jpg", caption: "Pérola de Ender debaixo de tempestade" },
  { src: "assets/video/clipes/clipe-02.mp4", poster: "assets/video/clipes/clipe-02.jpg", caption: "Fogos no céu perto do Porto" },
  { src: "assets/video/clipes/clipe-03.mp4", poster: "assets/video/clipes/clipe-03.jpg", caption: "Explorando o Tribunal no escuro" },
  { src: "assets/video/clipes/clipe-04.mp4", poster: "assets/video/clipes/clipe-04.jpg", caption: "Incêndio na farm de XP" },
  { src: "assets/video/clipes/clipe-05.mp4", poster: "assets/video/clipes/clipe-05.jpg", caption: "Escolhendo o destino no teleporte" },
];

/* ---------- Fotos de servidores antigos (seção "Nossa História") ---------- */
const HISTORIA_PHOTOS_2023 = [
  { src: "assets/img/historia/historia-2023-01.jpg", alt: "Print granulado e antigo de uma área de mineração com dois jogadores perto de um baú", caption: "O primeiro print que sobrou" },
  { src: "assets/img/historia/historia-2023-02.jpg", alt: "Cinco jogadores posados lado a lado num banco de madeira em um campo, de dia", caption: "Foto de família da turma" },
  { src: "assets/img/historia/historia-2023-03.jpg", alt: "Os mesmos cinco jogadores no banco de madeira ao anoitecer, com um portal do Nether aceso ao fundo", caption: "Turma perto do portal" },
  { src: "assets/img/historia/historia-2023-04.jpg", alt: "Jogador manokkkk sentado dentro de um barco de madeira ao lado de um portal do Nether", caption: "O manokkkk que morava no barco" },
  { src: "assets/img/historia/historia-2023-05.jpg", alt: "Curral de vacas cercado de madeira com uma placa escrita farm de mãe do Gustavo", caption: "A farm da mãe do Gustavo" },
  { src: "assets/img/historia/historia-2023-06.jpg", alt: "Foto panorâmica em efeito planeta pequeno mostrando floresta, praia, deserto e um portal do Nether", caption: "Nosso mundo em miniatura" },
  { src: "assets/img/historia/historia-2023-07.jpg", alt: "Panorama planeta pequeno com um esqueleto em cima de um pilar de pedra alto", caption: "Esqueleto guardião da torre" },
  { src: "assets/img/historia/historia-2023-08.jpg", alt: "Três jogadores posados à noite em frente a uma construção de pedra coberta de vinhas, com cerejeiras ao fundo", caption: "Encontro noturno na ruína" },
  { src: "assets/img/historia/historia-2023-09.jpg", alt: "Jogador em pé sobre um pilar de madeira no meio do oceano, ao lado de uma ilha minúscula de netherrack com uma torre e um baú", caption: "A ilha mais aleatória do mundo" },
  { src: "assets/img/historia/historia-2023-10.jpg", alt: "Vista em primeira pessoa de duas fornalhas e bancadas de trabalho encaixadas na parede de pedra de uma base", caption: "Cantinho das fornalhas" },
  { src: "assets/img/historia/historia-2023-11.jpg", alt: "Três baús duplos de madeira empilhados numa sala de armazenamento de pedra", caption: "O depósito ficou lotado" },
];

const HISTORIA_PHOTOS_2025 = [
  { src: "assets/img/historia/historia-2025-01.jpg", alt: "Jogador com skin de dragão caminhando sob chuva forte por um vilarejo iluminado por tochas", caption: "Corrida na chuva pelo vilarejo" },
  { src: "assets/img/historia/historia-2025-02.jpg", alt: "Catedral gótica de duas torres construída no servidor, vista ao pôr do sol", caption: "Catedral gótica ao entardecer" },
  { src: "assets/img/historia/historia-2025-03.jpg", alt: "Jogador com asas abertas posando em frente às torres da catedral durante o pôr do sol", caption: "Asas abertas ao entardecer" },
  { src: "assets/img/historia/historia-2025-04.jpg", alt: "Personagem alado em frente à catedral com o sol aparecendo exatamente entre as duas torres", caption: "O sol entre as duas torres" },
  { src: "assets/img/historia/historia-2025-05.jpg", alt: "Personagem alado visto de costas andando por um campo de papoulas rumo a uma vila", caption: "Asas abertas rumo à vila" },
  { src: "assets/img/historia/historia-2025-06.jpg", alt: "Vista de baixo para cima das torres da catedral, destacando os vitrais e pináculos de pedra", caption: "Olhando para o topo da catedral" },
  { src: "assets/img/historia/historia-2025-07.jpg", alt: "Catedral gótica vista à distância, com HUD mostrando os pontos Mercado dos Villagers, Porto e Tribunal no mapa", caption: "Catedral gótica no horizonte" },
  { src: "assets/img/historia/historia-2025-08.jpg", alt: "Personagem com skin alada branca e rosa posando numa ponte de madeira perto da catedral", caption: "Pose na ponte da vila" },
  { src: "assets/img/historia/historia-2025-09.jpg", alt: "O mesmo personagem alado na ponte de madeira, em outra pose, com a catedral ao fundo", caption: "Curtindo a vista da ponte" },
];

const HISTORIA_PHOTOS_EXTRA = [
  { src: "assets/img/historia/historia-extra-01.jpg", alt: "Dois jogadores com armadura clara lado a lado num campo de flores vermelhas durante um pôr do sol", caption: "Pôr do sol entre amigos" },
  { src: "assets/img/historia/historia-extra-02.jpg", alt: "Jogador com armadura ao lado de um lobo domesticado em frente a dois baús de madeira", caption: "Eu e meu fiel lobo" },
  { src: "assets/img/historia/historia-extra-03.jpg", alt: "Close noturno de um personagem com vestimenta roxa segurando um diamante na mão", caption: "Diamante brilhando na noite" },
  { src: "assets/img/historia/historia-extra-04.jpg", alt: "Interior de uma casa de diorito com overlay de desempenho (fps) no canto da tela", caption: "Dentro da nossa casa de diorito" },
  { src: "assets/img/historia/historia-extra-05.jpg", alt: "Jogador abrindo um baú de madeira numa planície gelada cercada de pinheiros nevados, em 2024", caption: "Baú escondido na neve (2024)" },
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

  function buildPhotoCard(photo) {
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
    return card;
  }

  function buildClipCard(clip) {
    const card = document.createElement("button");
    card.type = "button";
    card.className = "gallery-card gallery-card--video";
    card.dataset.full = clip.src;
    card.dataset.alt = clip.caption;
    card.dataset.type = "video";

    const thumbWrap = document.createElement("span");
    thumbWrap.className = "gallery-thumb-wrap";

    const img = document.createElement("img");
    img.className = "gallery-thumb";
    img.src = clip.poster;
    img.alt = clip.caption;
    img.loading = "lazy";

    const playBadge = document.createElement("span");
    playBadge.className = "gallery-play-badge";
    playBadge.setAttribute("aria-hidden", "true");
    playBadge.textContent = "▶";

    thumbWrap.appendChild(img);
    thumbWrap.appendChild(playBadge);

    const caption = document.createElement("span");
    caption.className = "gallery-caption";
    caption.textContent = clip.caption;

    card.appendChild(thumbWrap);
    card.appendChild(caption);
    return card;
  }

  function renderPhotoGrid(gridId, photos) {
    const grid = document.getElementById(gridId);
    if (!grid) return;
    grid.innerHTML = "";
    photos.forEach((photo) => grid.appendChild(buildPhotoCard(photo)));
  }

  function renderHistoriaGalleries() {
    renderPhotoGrid("historiaGrid2023", HISTORIA_PHOTOS_2023);
    renderPhotoGrid("historiaGrid2025", HISTORIA_PHOTOS_2025);
    renderPhotoGrid("historiaGridExtra", HISTORIA_PHOTOS_EXTRA);
  }

  function renderGallery() {
    renderPhotoGrid("galleryGrid", GALLERY_PHOTOS);
    const grid = document.getElementById("galleryGrid");
    if (!grid) return;

    NOSTALGIA_CLIPS.forEach((clip) => grid.appendChild(buildClipCard(clip)));

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
    // Delegação no document (não num grid específico) pra funcionar com
    // qualquer galeria/carrossel que use .gallery-card[data-full], atual ou futura.
    const lightbox = document.getElementById("galleryLightbox");
    const lightboxImg = document.getElementById("lightboxImg");
    const lightboxVideo = document.getElementById("lightboxVideo");
    const closeBtn = document.getElementById("lightboxClose");
    if (!lightbox || !lightboxImg || !closeBtn) return;

    function openLightbox(src, alt, type) {
      if (type === "video" && lightboxVideo) {
        lightboxImg.hidden = true;
        lightboxImg.src = "";
        lightboxVideo.hidden = false;
        lightboxVideo.src = src;
        lightboxVideo.play().catch(() => {});
      } else {
        if (lightboxVideo) {
          lightboxVideo.hidden = true;
          lightboxVideo.pause();
          lightboxVideo.src = "";
        }
        lightboxImg.hidden = false;
        lightboxImg.src = src;
        lightboxImg.alt = alt || "";
      }
      lightbox.hidden = false;
      document.body.classList.add("lightbox-open");
      if (window.MagicAchievements) window.MagicAchievements.unlock("lightbox", "Foto em close-up", "Abriu uma foto da galeria em tamanho grande.");
    }

    function closeLightbox() {
      lightbox.hidden = true;
      lightboxImg.src = "";
      if (lightboxVideo) {
        lightboxVideo.pause();
        lightboxVideo.src = "";
      }
      document.body.classList.remove("lightbox-open");
    }

    document.addEventListener("click", (e) => {
      const card = e.target.closest(".gallery-card[data-full]");
      if (!card) return;
      openLightbox(card.dataset.full, card.dataset.alt, card.dataset.type);
    });

    closeBtn.addEventListener("click", closeLightbox);
    lightbox.addEventListener("click", (e) => {
      if (e.target === lightbox) closeLightbox();
    });
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && !lightbox.hidden) closeLightbox();
    });
  }

  function setupCarousel(viewportId, prevId, nextId) {
    const viewport = document.getElementById(viewportId);
    const prevBtn = document.getElementById(prevId);
    const nextBtn = document.getElementById(nextId);
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

  function setupGalleryCarousels() {
    setupCarousel("galleryViewport", "galleryPrev", "galleryNext");
    setupCarousel("historiaViewport2023", "historiaPrev2023", "historiaNext2023");
    setupCarousel("historiaViewport2025", "historiaPrev2025", "historiaNext2025");
    setupCarousel("historiaViewportExtra", "historiaPrevExtra", "historiaNextExtra");
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
    renderHistoriaGalleries();
    setupGalleryLightbox();
    setupGalleryCarousels();
  });
})();
