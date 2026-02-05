const CONFIG = {
  valentineName: "Ashley",
  photoPath: "assets/photo.jpg",
  heroMessage: "A tiny adventure wrapped in a lot of love.",
  questionText: "Will you be my Valentine?",
  questionSubtitle: "There are cute challenges waiting after this.",
  yesTitle: "Yay!",
  yesMessage: "You just unlocked a few tiny games. Beat them all to reveal your gift.",
  noMessages: ["Are you sure?", "Pretty please?", "Try again?", "Noob",  "Press Yes",  "Too slow", "Not Fast Enough"],
  winMessages: {
    hearts: "Why so slow.",
    match: "Could be faster.",
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
    enabled: true,
    serviceId: "YOUR_SERVICE_ID",
    templateId: "YOUR_TEMPLATE_ID",
    publicKey: "YOUR_PUBLIC_KEY",
    toEmail: "you@example.com"
  },
  music: {
    enabled: true,
    autoplay: true,
    musicUrl: "https://res.cloudinary.com/dncywqfpb/video/upload/v1738399057/music_qrhjvy.mp3",
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
        { photo: "assets/pair-1.jpg", city: "Paris", caption: "Our first trip" },
        { photo: "assets/pair-2.jpg", city: "Kyoto", caption: "Cherry blossoms" },
        { photo: "assets/pair-3.jpg", city: "Lisbon", caption: "Pastel de nata" }
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
    subtext: "You won a dinner date with me on 14th Feb 8.30pm,! And we gonna go Moga at 1 Hill St, Pullman ;) ",
    emojis: "💌✨💖"
  }
};
