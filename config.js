const CONFIG = {
  valentineName: "Ashley",
  photoPath: "assets/photo.jpg",
  heroMessage: "A tiny adventure wrapped in a lot of love.",
  questionText: "Will you be my Valentine?",
  questionSubtitle: "There are cute challenges waiting after this.",
  yesTitle: "Yay!",
  yesMessage: "You just unlocked a few tiny games. Beat them all to reveal your gift.",
  noMessages: ["Are you sure?", "Pretty please?", "Try again?", "Why Not, Noob, Noobs, NOOOOOOOBBS, Press Yes"],
  winMessages: {
    hearts: "You did it! Hearts collected.",
    match: "Perfect matches! So cute.",
    meter: "Love level maxed!"
  },
  theme: {
    background: "#fff0f6",
    surface: "#ffffff",
    accent: "#ff5f9e",
    accentSoft: "#ffd1e4",
    dark: "#35162b",
    text: "#2a1220"
  },
  email: {
    enabled: false,
    serviceId: "YOUR_SERVICE_ID",
    templateId: "YOUR_TEMPLATE_ID",
    publicKey: "YOUR_PUBLIC_KEY",
    toEmail: "you@example.com"
  },
  music: {
    enabled: true,
    autoplay: true,
    musicUrl: "https://res.cloudinary.com/dztiqwydw/video/upload/v1770438541/Beach_House_-_Space_Song_Filtered_Instrumental_kc3lzu.mp3",
    startText: "🎵 Play Music",
    stopText: "🔇 Stop Music",
    volume: 0.6
  },
  games: {
    hearts: {
      goal: 10,
      spawnIntervalMs: 300,
      heartLifespanMs: 2000
    },
    match: {
      pairs: [
        { photo: "assets/pair-1.jpg", city: "1", caption: "Marry Chysler" },
        { photo: "assets/pair-2.jpg", city: "1", caption: "Exersai" },
        { photo: "assets/pair-3.jpg", city: "1", caption: "Derp" }
      ]
    },
    meter: {
      goalPercent: 100,
      fillPerClick: 3,
      decayPerSecond: 15,
      decayDelayMs: 6
    }
  },
  final: {
    title: "You did it!",
    message: "Your gift is waiting for you.",
    image: "assets/gift.jpg",
    subtext: "You won a dinner date with me! 8.30PM at 1 Hill Street",
    emojis: "💌✨💖"
  }
};
