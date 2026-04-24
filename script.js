const photos = [
  {
    src: "IMG-20240724-WA0015.jpg",
    alt: "Group photo on a football ground",
    title: "Electrical Batch Football Day",
    text: "A bright turf-side frame featuring the IEM Electrical batch in a relaxed, confident sports-day moment.",
  },
  {
    src: "IMG-20250508-WA0022.jpg",
    alt: "Large uniform group photo",
    title: "Electrical Uniform Circle",
    text: "A close portrait-style group photo that gives the B.Tech Electrical Engineering batch a classic class-memory feel.",
  },
  {
    src: "IMG-20250508-WA0089.jpg",
    alt: "Another large uniform group portrait",
    title: "Campus Crowd",
    text: "A taller campus composition that captures the scale, energy, and presence of the 2022-2026 Electrical batch.",
  },
  {
    src: "IMG-20251128-WA0026.jpg",
    alt: "Group photo on a basketball court",
    title: "Court Lineup",
    text: "A more casual lineup that brings out the friendly team spirit and everyday bond within the IEM batch.",
  },
  {
    src: "IMG-20260402-WA0021.jpg",
    alt: "Group photo during a celebration",
    title: "Festival Night",
    text: "An evening celebration shot with traditional outfits, awards, and a richer festive side of the Electrical journey.",
  },
  {
    src: "IMG-20260406-WA0022.jpg",
    alt: "Official large group portrait",
    title: "Official Batch Portrait",
    text: "The closing full-crew portrait for the IEM B.Tech Electrical Engineering batch of 2022-2026.",
  },
];

const lightbox = document.querySelector(".lightbox");
const lightboxImage = document.getElementById("lightbox-image");
const lightboxTitle = document.getElementById("lightbox-title");
const lightboxText = document.getElementById("lightbox-text");
const lightboxCounter = document.getElementById("lightbox-counter");
const openButtons = document.querySelectorAll("[data-modal-index]");
const closeButtons = document.querySelectorAll("[data-close]");
const stepButtons = document.querySelectorAll("[data-step]");
const revealItems = document.querySelectorAll(".reveal");
const backgroundAudio = document.getElementById("background-audio");
const audioToggleButton = document.getElementById("audio-toggle");
const audioMuteButton = document.getElementById("audio-mute");
const audioHint = document.getElementById("audio-hint");
const musicDock = document.querySelector(".music-dock");
const musicDockToggle = document.getElementById("music-dock-toggle");
const mobileMusicDockQuery = window.matchMedia("(max-width: 560px)");

let activeIndex = 0;
let audioStarted = false;

function renderLightbox(index) {
  const total = photos.length;
  activeIndex = (index + total) % total;
  const photo = photos[activeIndex];

  lightboxImage.src = photo.src;
  lightboxImage.alt = photo.alt;
  lightboxTitle.textContent = photo.title;
  lightboxText.textContent = photo.text;
  lightboxCounter.textContent = `${String(activeIndex + 1).padStart(2, "0")} / ${String(total).padStart(2, "0")}`;
}

function openLightbox(index) {
  renderLightbox(index);
  lightbox.classList.add("is-open");
  lightbox.setAttribute("aria-hidden", "false");
  document.body.classList.add("modal-open");
}

function closeLightbox() {
  lightbox.classList.remove("is-open");
  lightbox.setAttribute("aria-hidden", "true");
  document.body.classList.remove("modal-open");
}

function updateAudioUI() {
  const isPlaying = !backgroundAudio.paused;
  const isMuted = backgroundAudio.muted;

  musicDock.dataset.audioState = isPlaying ? "playing" : "paused";
  audioToggleButton.textContent = isPlaying ? "Turn Off" : "Play";
  audioToggleButton.setAttribute("aria-pressed", String(isPlaying));
  audioMuteButton.textContent = isMuted ? "Unmute" : "Mute";
  audioMuteButton.setAttribute("aria-pressed", String(isMuted));
}

async function playBackgroundAudio(triggeredByUser = false) {
  try {
    await backgroundAudio.play();
    audioStarted = true;
    audioHint.textContent = triggeredByUser
      ? "Background music is now playing."
      : "Background music is playing automatically.";
  } catch (error) {
    audioHint.textContent = "Your browser blocked autoplay. Tap Play once to start the music.";
  }

  updateAudioUI();
}

function pauseBackgroundAudio() {
  backgroundAudio.pause();
  audioHint.textContent = "Background music is turned off.";
  updateAudioUI();
}

function setMusicDockExpanded(expanded) {
  musicDock.dataset.expanded = String(expanded);
  musicDockToggle.setAttribute("aria-expanded", String(expanded));
}

function syncMusicDockLayout() {
  if (mobileMusicDockQuery.matches) {
    setMusicDockExpanded(false);
    return;
  }

  setMusicDockExpanded(true);
}

openButtons.forEach((button) => {
  button.addEventListener("click", () => {
    openLightbox(Number(button.dataset.modalIndex));
  });
});

closeButtons.forEach((button) => {
  button.addEventListener("click", closeLightbox);
});

stepButtons.forEach((button) => {
  button.addEventListener("click", () => {
    renderLightbox(activeIndex + Number(button.dataset.step));
  });
});

audioToggleButton.addEventListener("click", async () => {
  if (backgroundAudio.paused) {
    await playBackgroundAudio(true);
    return;
  }

  pauseBackgroundAudio();
});

audioMuteButton.addEventListener("click", () => {
  backgroundAudio.muted = !backgroundAudio.muted;
  audioHint.textContent = backgroundAudio.muted
    ? "Background music is muted."
    : "Background music sound is back on.";
  updateAudioUI();
});

musicDockToggle.addEventListener("click", () => {
  setMusicDockExpanded(musicDock.dataset.expanded !== "true");
});

["play", "pause", "volumechange"].forEach((eventName) => {
  backgroundAudio.addEventListener(eventName, updateAudioUI);
});

document.addEventListener("keydown", (event) => {
  if (!lightbox.classList.contains("is-open")) {
    if (event.key === " " && document.activeElement === document.body) {
      event.preventDefault();

      if (backgroundAudio.paused) {
        playBackgroundAudio(true);
      } else {
        pauseBackgroundAudio();
      }
    }

    return;
  }

  if (event.key === "Escape") {
    closeLightbox();
  }

  if (event.key === "ArrowRight") {
    renderLightbox(activeIndex + 1);
  }

  if (event.key === "ArrowLeft") {
    renderLightbox(activeIndex - 1);
  }
});

document.addEventListener("click", (event) => {
  if (!mobileMusicDockQuery.matches || musicDock.dataset.expanded !== "true") {
    return;
  }

  if (musicDock.contains(event.target)) {
    return;
  }

  setMusicDockExpanded(false);
});

const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) {
        return;
      }

      entry.target.classList.add("is-visible");
      revealObserver.unobserve(entry.target);
    });
  },
  {
    threshold: 0.16,
  }
);

revealItems.forEach((item) => revealObserver.observe(item));

backgroundAudio.volume = 0.28;
syncMusicDockLayout();
updateAudioUI();
playBackgroundAudio();

function tryStartAudioFromInteraction() {
  if (audioStarted || !backgroundAudio.paused) {
    return;
  }

  playBackgroundAudio(true);
}

["pointerdown", "keydown", "touchstart"].forEach((eventName) => {
  document.addEventListener(eventName, tryStartAudioFromInteraction, {
    once: true,
  });
});

mobileMusicDockQuery.addEventListener("change", syncMusicDockLayout);
