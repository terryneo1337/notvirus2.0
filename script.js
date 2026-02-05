const $ = (selector) => document.querySelector(selector);

const stages = {
  question: $("#question-stage"),
  yes: $("#yes-stage"),
  games: $("#games-stage")
};

const state = {
  noIndex: 0,
  completed: new Set(),
  activeGame: null,
  meterValue: 0,
  meterLastClick: 0,
  meterInterval: null,
  heartsInterval: null
};

const elements = {
  valentineName: $("#valentine-name"),
  valentinePhoto: $("#valentine-photo"),
  heroMessage: $("#hero-message"),
  questionText: $("#question-text"),
  questionSubtitle: $("#question-subtitle"),
  yesTitle: $("#yes-title"),
  yesMessage: $("#yes-message"),
  yesBtn: $("#yes-btn"),
  noBtn: $("#no-btn"),
  noMessage: $("#no-message"),
  startGamesBtn: $("#start-games-btn"),
  emailStatus: $("#email-status"),
  finalStage: $("#final-stage"),
  finalTitle: $("#final-title"),
  finalMessage: $("#final-message"),
  finalImage: $("#final-image"),
  finalSubtext: $("#final-subtext"),
  finalEmojis: $("#final-emojis"),
  heartsField: $("#hearts-field"),
  heartsScore: $("#hearts-score"),
  matchPhotos: $("#match-photos"),
  matchCities: $("#match-cities"),
  matchScore: $("#match-score"),
  meterFill: $("#meter-fill"),
  meterScore: $("#meter-score"),
  meterBtn: $("#meter-btn"),
  celebration: $("#celebration"),
  winBanners: document.querySelectorAll(".game-win"),
  photoModal: $("#photo-modal"),
  photoModalImage: $("#photo-modal-image"),
  photoModalCaption: $("#photo-modal-caption"),
  photoModalClose: $("#photo-modal-close"),
  musicToggle: $("#music-toggle"),
  musicPlayer: $("#music-player")
};

const gamePanels = {
  hearts: $("#game-hearts"),
  match: $("#game-match"),
  meter: $("#game-meter")
};

const gameCards = document.querySelectorAll(".game-card");
const gameStartButtons = document.querySelectorAll(".game-start");
const gameCloseButtons = document.querySelectorAll(".game-close");

const applyConfig = () => {
  const { theme } = CONFIG;
  if (theme) {
    const root = document.documentElement;
    root.style.setProperty("--bg", theme.background);
    root.style.setProperty("--surface", theme.surface || theme.background);
    root.style.setProperty("--accent", theme.accent);
    root.style.setProperty("--accent-soft", theme.accentSoft || "#ffd1e4");
    root.style.setProperty("--dark", theme.dark);
    root.style.setProperty("--text", theme.text || "#2a1220");
  }

  elements.valentineName.textContent = CONFIG.valentineName;
  elements.valentinePhoto.src = CONFIG.photoPath;
  elements.heroMessage.textContent = CONFIG.heroMessage;
  elements.questionText.textContent = CONFIG.questionText;
  elements.questionSubtitle.textContent = CONFIG.questionSubtitle;
  elements.yesTitle.textContent = CONFIG.yesTitle;
  elements.yesMessage.textContent = CONFIG.yesMessage;
  elements.finalTitle.textContent = CONFIG.final.title;
  elements.finalMessage.textContent = CONFIG.final.message;
  elements.finalImage.src = CONFIG.final.image || "";
  elements.finalSubtext.textContent = CONFIG.final.subtext || "";
  elements.finalEmojis.textContent = CONFIG.final.emojis;
};

const initMusic = () => {
  const music = CONFIG.music;
  if (!music?.enabled) {
    elements.musicToggle.classList.add("is-hidden");
    return;
  }

  if (!music.musicUrl) {
    elements.musicToggle.textContent = "Add music URL";
    elements.musicToggle.disabled = true;
    return;
  }

  elements.musicToggle.textContent = music.startText || "Play Music";
  elements.musicPlayer.src = music.musicUrl;
  elements.musicPlayer.volume = typeof music.volume === "number" ? music.volume : 0.6;

  const updateButton = () => {
    const isPlaying = !elements.musicPlayer.paused;
    elements.musicToggle.textContent = isPlaying
      ? music.stopText || "Pause Music"
      : music.startText || "Play Music";
    elements.musicToggle.classList.toggle("is-playing", isPlaying);
  };

  const tryPlay = async () => {
    try {
      await elements.musicPlayer.play();
      updateButton();
    } catch (error) {
      updateButton();
    }
  };

  elements.musicToggle.addEventListener("click", async () => {
    if (elements.musicPlayer.paused) {
      await tryPlay();
    } else {
      elements.musicPlayer.pause();
      updateButton();
    }
  });

  elements.musicPlayer.addEventListener("ended", () => {
    updateButton();
  });

  if (music.autoplay) {
    tryPlay();
  }
};

const showStage = (stageId) => {
  Object.values(stages).forEach((stage) => stage.classList.remove("stage--active"));
  stages[stageId].classList.add("stage--active");
  if (stageId !== "games") {
    closeAllGames();
  }
};

const rotateNoMessage = () => {
  const message = CONFIG.noMessages[state.noIndex % CONFIG.noMessages.length];
  elements.noMessage.textContent = message;
  state.noIndex += 1;
};

const sendEmailNotification = async () => {
  if (!CONFIG.email?.enabled) {
    elements.emailStatus.textContent = "Email is not enabled yet.";
    return;
  }

  if (!CONFIG.email.serviceId || !CONFIG.email.templateId || !CONFIG.email.publicKey) {
    elements.emailStatus.textContent = "Email config missing. Still sending all the love.";
    return;
  }

  try {
    emailjs.init(CONFIG.email.publicKey);
    await emailjs.send(CONFIG.email.serviceId, CONFIG.email.templateId, {
      to_email: CONFIG.email.toEmail,
      valentine_name: CONFIG.valentineName,
      message: CONFIG.yesMessage
    });
    elements.emailStatus.textContent = "Email sent to you. Time to celebrate!";
  } catch (error) {
    elements.emailStatus.textContent = "Email failed, but the love still landed.";
  }
};

const openGame = (gameId) => {
  closeAllGames();
  state.activeGame = gameId;
  const panel = gamePanels[gameId];
  if (panel) {
    panel.classList.add("active");
    smoothScrollTo(panel);
  }
  if (gameId === "hearts") initHeartsGame();
  if (gameId === "match") initMatchGame();
  if (gameId === "meter") initMeterGame();
};

const closeAllGames = () => {
  Object.values(gamePanels).forEach((panel) => panel.classList.remove("active"));
  elements.winBanners.forEach((banner) => banner.classList.remove("active"));
  state.activeGame = null;
  clearInterval(state.heartsInterval);
  clearInterval(state.meterInterval);
  state.heartsInterval = null;
  state.meterInterval = null;
};

const markGameComplete = (gameId) => {
  state.completed.add(gameId);
  const card = document.querySelector(`.game-card[data-game="${gameId}"]`);
  if (card) {
    card.classList.add("game-card--done");
  }
  showWinBanner(gameId);
  if (gameId === "hearts") stopHeartsGame();
  launchCelebration();
  checkAllComplete();
};

const checkAllComplete = () => {
  const total = Object.keys(gamePanels).length;
  if (state.completed.size === total) {
    closeAllGames();
    stages.games.classList.add("games-complete");
    elements.finalStage.classList.remove("hidden");
    smoothScrollTo(elements.finalStage);
  }
};

let heartsScore = 0;

const initHeartsGame = () => {
  heartsScore = 0;
  elements.heartsField.innerHTML = "";
  updateHeartsScore();
  clearInterval(state.heartsInterval);
  state.heartsInterval = setInterval(spawnHeart, CONFIG.games.hearts.spawnIntervalMs);
};

const stopHeartsGame = () => {
  clearInterval(state.heartsInterval);
  state.heartsInterval = null;
  elements.heartsField.innerHTML = "";
};

const updateHeartsScore = () => {
  elements.heartsScore.textContent = `${heartsScore} / ${CONFIG.games.hearts.goal}`;
};

const spawnHeart = () => {
  const heart = document.createElement("button");
  heart.className = "heart";
  heart.textContent = "❤";
  heart.style.left = `${Math.random() * 80 + 10}%`;
  heart.style.bottom = "-20px";
  heart.style.animationDuration = `${CONFIG.games.hearts.heartLifespanMs}ms`;

  heart.addEventListener("click", () => {
    heart.remove();
    heartsScore += 1;
    updateHeartsScore();
    if (heartsScore >= CONFIG.games.hearts.goal) {
      stopHeartsGame();
      markGameComplete("hearts");
    }
  });

  elements.heartsField.appendChild(heart);
  setTimeout(() => heart.remove(), CONFIG.games.hearts.heartLifespanMs);
};

let matchSelectedPhoto = null;
let matchSelectedCity = null;
let matchScore = 0;

const shuffle = (array) => [...array].sort(() => Math.random() - 0.5);

const initMatchGame = () => {
  matchSelectedPhoto = null;
  matchSelectedCity = null;
  matchScore = 0;
  elements.matchPhotos.innerHTML = "";
  elements.matchCities.innerHTML = "";
  updateMatchScore();

  const pairs = CONFIG.games.match.pairs;
  const photoCards = shuffle(pairs).map((pair, index) => ({
    ...pair,
    id: `photo-${index}`
  }));
  const cityCards = shuffle(pairs).map((pair, index) => ({
    ...pair,
    id: `city-${index}`
  }));

  photoCards.forEach((pair) => {
    const card = document.createElement("button");
    card.className = "match-card";
    card.dataset.city = pair.city;
    card.innerHTML = `
      <button class="match-card__preview" type="button" aria-label="View full photo">
        <img src="${pair.photo}" alt="${pair.city}" />
        <span>View</span>
      </button>
      <span>${pair.caption || ""}</span>
    `;
    const preview = card.querySelector(".match-card__preview");
    preview.addEventListener("click", (event) => {
      event.stopPropagation();
      openPhotoModal(pair.photo, pair.caption || pair.city);
    });
    card.addEventListener("click", () => selectMatchCard(card, "photo"));
    elements.matchPhotos.appendChild(card);
  });

  cityCards.forEach((pair) => {
    const card = document.createElement("button");
    card.className = "match-card";
    card.dataset.city = pair.city;
    card.textContent = pair.city;
    card.addEventListener("click", () => selectMatchCard(card, "city"));
    elements.matchCities.appendChild(card);
  });
};

const selectMatchCard = (card, type) => {
  if (card.classList.contains("matched")) return;

  if (type === "photo") {
    if (matchSelectedPhoto) matchSelectedPhoto.classList.remove("selected");
    matchSelectedPhoto = card;
  } else {
    if (matchSelectedCity) matchSelectedCity.classList.remove("selected");
    matchSelectedCity = card;
  }

  card.classList.add("selected");
  if (matchSelectedPhoto && matchSelectedCity) {
    checkMatch();
  }
};

const checkMatch = () => {
  const isMatch = matchSelectedPhoto.dataset.city === matchSelectedCity.dataset.city;
  if (isMatch) {
    matchSelectedPhoto.classList.add("matched");
    matchSelectedCity.classList.add("matched");
    matchScore += 1;
    updateMatchScore();
    if (matchScore === CONFIG.games.match.pairs.length) {
      markGameComplete("match");
    }
    resetMatchSelection();
    return;
  }

  [matchSelectedPhoto, matchSelectedCity].forEach((card) => {
    card.classList.add("shake");
    setTimeout(() => card.classList.remove("shake"), 300);
  });
  setTimeout(resetMatchSelection, 320);
};

const resetMatchSelection = () => {
  if (matchSelectedPhoto) matchSelectedPhoto.classList.remove("selected");
  if (matchSelectedCity) matchSelectedCity.classList.remove("selected");
  matchSelectedPhoto = null;
  matchSelectedCity = null;
};

const updateMatchScore = () => {
  elements.matchScore.textContent = `${matchScore} / ${CONFIG.games.match.pairs.length}`;
};

const openPhotoModal = (src, caption) => {
  elements.photoModalImage.src = src;
  elements.photoModalCaption.textContent = caption || "";
  elements.photoModal.classList.add("active");
  elements.photoModal.setAttribute("aria-hidden", "false");
};

const closePhotoModal = () => {
  elements.photoModal.classList.remove("active");
  elements.photoModal.setAttribute("aria-hidden", "true");
};

const initMeterGame = () => {
  state.meterValue = 0;
  state.meterLastClick = Date.now();
  updateMeter();
  clearInterval(state.meterInterval);
  state.meterInterval = setInterval(tickMeter, 120);
};

const tickMeter = () => {
  const now = Date.now();
  if (now - state.meterLastClick > CONFIG.games.meter.decayDelayMs) {
    state.meterValue = Math.max(
      0,
      state.meterValue - CONFIG.games.meter.decayPerSecond * 0.12
    );
    updateMeter();
  }
};

const updateMeter = () => {
  const value = Math.min(CONFIG.games.meter.goalPercent, state.meterValue);
  elements.meterFill.style.width = `${value}%`;
  elements.meterScore.textContent = `${Math.round(value)}%`;
};

const handleMeterClick = () => {
  state.meterValue = Math.min(
    CONFIG.games.meter.goalPercent,
    state.meterValue + CONFIG.games.meter.fillPerClick
  );
  state.meterLastClick = Date.now();
  updateMeter();
  if (state.meterValue >= CONFIG.games.meter.goalPercent) {
    markGameComplete("meter");
    clearInterval(state.meterInterval);
  }
};

const showWinBanner = (gameId) => {
  const banner = document.querySelector(`.game-win[data-win="${gameId}"]`);
  if (!banner) return;
  banner.textContent =
    CONFIG.winMessages?.[gameId] ||
    banner.textContent ||
    "You win!";
  banner.classList.add("active");
};

const launchCelebration = () => {
  const container = elements.celebration;
  if (!container) return;
  container.innerHTML = "";

  const burstCount = 64;
  const createBurst = (delay) => {
    for (let i = 0; i < burstCount; i += 1) {
      const piece = document.createElement("span");
      const isHeart = i % 5 === 0;
      piece.className = `confetti${isHeart ? " heart" : ""}`;
      piece.style.left = `${Math.random() * 90 + 5}%`;
      piece.style.animationDelay = `${delay + Math.random() * 0.4}s`;
      piece.style.animationDuration = `${2.4 + Math.random() * 1.2}s`;
      piece.style.transform = `scale(${0.7 + Math.random() * 0.6})`;
      piece.style.background = isHeart ? "#ff7bb7" : `hsl(${320 + Math.random() * 60}, 85%, 70%)`;
      if (isHeart) piece.textContent = "❤";
      container.appendChild(piece);
    }
  };

  createBurst(0);
  createBurst(0.4);

  setTimeout(() => {
    container.innerHTML = "";
  }, 3200);
};

const smoothScrollTo = (element) => {
  if (!element) return;
  element.scrollIntoView({ behavior: "smooth", block: "start" });
};

const wireEvents = () => {
  elements.noBtn.addEventListener("click", rotateNoMessage);
  elements.yesBtn.addEventListener("click", async () => {
    showStage("yes");
    await sendEmailNotification();
  });
  elements.startGamesBtn.addEventListener("click", () => {
    showStage("games");
    smoothScrollTo(stages.games);
  });

  gameStartButtons.forEach((btn) => {
    btn.addEventListener("click", () => openGame(btn.dataset.game));
  });

  gameCloseButtons.forEach((btn) => {
    btn.addEventListener("click", () => closeAllGames());
  });

  elements.meterBtn.addEventListener("click", handleMeterClick);
  elements.photoModalClose.addEventListener("click", closePhotoModal);
  elements.photoModal.addEventListener("click", (event) => {
    if (event.target === elements.photoModal) closePhotoModal();
  });
  window.addEventListener("keydown", (event) => {
    if (event.key === "Escape") closePhotoModal();
  });
};

applyConfig();
initMusic();
wireEvents();
