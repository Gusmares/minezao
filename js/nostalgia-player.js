/* ==========================================================================
 * PLAYER NOSTÁLGICO
 * Toca uma rádio de músicas/vídeos nostálgicos em ordem aleatória.
 * Autoplay começa mudo (única forma permitida pelos navegadores) e o som
 * real liga no primeiro clique/tecla do usuário em qualquer lugar da página.
 * ========================================================================== */
const NOSTALGIA_TRACKS = [
  { id: "ey1kyI19x5g", title: "Transformer — Young Squage" },
  { id: "jVwn1xZEgJ4", title: "SIM, EU VOU!! — AuthenticGames" },
  { id: "LVMHYzVS9Y4", title: "Rap do Minecraft (RapGame 06) — Tauz" },
  { id: "ALZHF5UqnU4", title: "Alone — Marshmello" },
  { id: "cPJUBQd-PNM", title: "Revenge (Minecraft Parody) — CaptainSparklez" },
  { id: "CU1c3fZ7dSM", title: "Intro do TazerCraft — Tron!" },
  { id: "rQzSiiRe6YM", title: "RAP DO MINECRAFT — BngOficial" },
  { id: "9h1l5Z0mH0w", title: "COM MEUS AMIGOS — AuthenticGames" },
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
    els.next.addEventListener("click", playNext);
    els.prev.addEventListener("click", playPrev);
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
  });
})();
