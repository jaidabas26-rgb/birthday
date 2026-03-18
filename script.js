/*
  Script for animated birthday experience.
  Enforces the requirement that audio begins only after user interaction.
*/

const welcomeScreen = document.getElementById("welcomeScreen");
const mainContent = document.getElementById("mainContent");
const enterButton = document.getElementById("enterButton");
const backgroundMusic = document.getElementById("backgroundMusic");
const musicToggle = document.getElementById("musicToggle");
const openGiftButton = document.getElementById("openGiftButton");
const reasonsPopup = document.getElementById("reasonsPopup");
const closeReasonsPopup = document.getElementById("closeReasonsPopup");
const typingLine = document.getElementById("typingLine");
const surpriseButton = document.getElementById("surpriseButton");
const surprisePopup = document.getElementById("surprisePopup");
const closeSurprisePopup = document.getElementById("closeSurprisePopup");
const heartButton = document.getElementById("heartButton");
const heartMessage = document.getElementById("heartMessage");
const secretInput = document.getElementById("secretInput");
const secretButton = document.getElementById("secretButton");
const secretMessage = document.getElementById("secretMessage");

const reasons = [
  "Your smile 😭",
  "Your stupid cute anger",
  "The way you care for me",
  "You make my worst days better",
];

let musicPlaying = false;
let typingCancel = false;

function setVisibility(element, visible) {
  element.classList.toggle("hidden", !visible);
}

function fadeOut(element, duration = 500) {
  element.style.transition = `opacity ${duration}ms ease, transform ${duration}ms ease`;
  element.style.opacity = "0";
  element.style.transform = "scale(0.98)";
  return new Promise((resolve) => {
    window.setTimeout(() => {
      element.classList.add("hidden");
      element.style.removeProperty("opacity");
      element.style.removeProperty("transform");
      element.style.removeProperty("transition");
      resolve();
    }, duration);
  });
}

function fadeIn(element, duration = 500) {
  element.classList.remove("hidden");
  element.style.opacity = "0";
  element.style.transform = "scale(0.98)";
  element.style.transition = `opacity ${duration}ms ease, transform ${duration}ms ease`;
  requestAnimationFrame(() => {
    element.style.opacity = "1";
    element.style.transform = "scale(1)";
  });
  window.setTimeout(() => {
    element.style.removeProperty("opacity");
    element.style.removeProperty("transform");
    element.style.removeProperty("transition");
  }, duration);
}

function safePlayMusic() {
  if (!backgroundMusic) return;
  if (backgroundMusic.paused) {
    backgroundMusic.play().catch(() => {
      // Some browsers block autoplay; leaving audio paused is safe.
    });
  }
}

function toggleMusic() {
  if (!backgroundMusic) return;
  if (backgroundMusic.paused) {
    backgroundMusic.play().catch(() => {
      // ignore
    });
    musicPlaying = true;
    musicToggle.setAttribute("aria-label", "Pause music");
    musicToggle.querySelector(".music-icon").textContent = "⏸";
  } else {
    backgroundMusic.pause();
    musicPlaying = false;
    musicToggle.setAttribute("aria-label", "Play music");
    musicToggle.querySelector(".music-icon").textContent = "🎵";
  }
}

function showMainContent() {
  fadeOut(welcomeScreen, 650).then(() => {
    setVisibility(mainContent, true);
    fadeIn(mainContent, 500);
  });
  safePlayMusic();
  musicPlaying = true;
  musicToggle.setAttribute("aria-label", "Pause music");
  musicToggle.querySelector(".music-icon").textContent = "⏸";
}

function typeMessage(text, element, speed = 55) {
  return new Promise((resolve) => {
    typingCancel = false;
    element.textContent = "";
    let index = 0;

    function typeNext() {
      if (typingCancel) {
        element.textContent = text;
        resolve();
        return;
      }
      if (index < text.length) {
        element.textContent += text[index];
        index += 1;
        window.setTimeout(typeNext, speed);
      } else {
        resolve();
      }
    }

    typeNext();
  });
}

async function playReasonSequence() {
  typingCancel = false;
  typingLine.textContent = "";
  for (const item of reasons) {
    await typeMessage(item, typingLine, 52);
    await new Promise((resolve) => setTimeout(resolve, 850));
    if (typingCancel) break;
    typingLine.textContent = "";
  }
  typingLine.textContent = "";
}

function createElementWithClass(tag, className) {
  const el = document.createElement(tag);
  el.className = className;
  return el;
}

function handleHeartExplosion() {
  const count = 12;
  for (let i = 0; i < count; i += 1) {
    const heart = createElementWithClass("div", "animated-heart");
    const startX = window.innerWidth / 2 + (Math.random() - 0.5) * 180;
    const startY = window.innerHeight / 2 + (Math.random() - 0.5) * 80;
    heart.style.left = `${startX}px`;
    heart.style.top = `${startY}px`;
    heart.style.opacity = "0";

    document.body.appendChild(heart);

    const duration = 1200 + Math.random() * 500;
    const endX = startX + (Math.random() - 0.5) * 260;
    const endY = startY - (200 + Math.random() * 180);
    const rotate = (Math.random() - 0.5) * 360;

    requestAnimationFrame(() => {
      heart.style.transition = `transform ${duration}ms ease-out, opacity ${duration}ms ease-out`;
      heart.style.transform = `translate(${endX - startX}px, ${endY - startY}px) rotate(${rotate}deg) scale(1.15)`;
      heart.style.opacity = "1";
    });

    window.setTimeout(() => {
      heart.style.opacity = "0";
      heart.style.transform += " scale(0.8)";
    }, duration * 0.75);

    window.setTimeout(() => {
      heart.remove();
    }, duration + 220);
  }
}

function createRainEffect() {
  const count = 18;
  const duration = 1400;
  for (let i = 0; i < count; i += 1) {
    const drop = createElementWithClass("div", "rain-heart");
    const startX = Math.random() * window.innerWidth;
    const startY = -30;
    drop.style.left = `${startX}px`;
    drop.style.top = `${startY}px`;
    drop.style.opacity = "0";
    document.body.appendChild(drop);

    const endY = window.innerHeight + 40;
    const delay = Math.random() * 350;
    const rotate = (Math.random() - 0.5) * 90;

    window.setTimeout(() => {
      drop.style.transition = `transform ${duration}ms ease-out, opacity ${duration / 2}ms ease-out`;
      drop.style.transform = `translate(0, ${endY}px) rotate(${rotate}deg)`;
      drop.style.opacity = "1";
    }, delay);

    window.setTimeout(() => {
      drop.style.opacity = "0";
    }, delay + duration * 0.7);

    window.setTimeout(() => {
      drop.remove();
    }, delay + duration + 300);
  }
}

function createConfettiBurst() {
  const count = 26;
  const centerX = window.innerWidth / 2;
  const centerY = window.innerHeight / 2;

  for (let i = 0; i < count; i += 1) {
    const piece = createElementWithClass("div", "confetti-piece");
    piece.style.left = `${centerX}px`;
    piece.style.top = `${centerY}px`;
    piece.style.opacity = "0";
    document.body.appendChild(piece);

    const angle = (i / count) * Math.PI * 2;
    const distance = 160 + Math.random() * 160;
    const endX = centerX + Math.cos(angle) * distance;
    const endY = centerY + Math.sin(angle) * distance;
    const rotate = (Math.random() - 0.5) * 520;
    const duration = 900 + Math.random() * 380;

    requestAnimationFrame(() => {
      piece.style.transition = `transform ${duration}ms ease-out, opacity ${duration}ms ease-out`;
      piece.style.transform = `translate(${endX - centerX}px, ${endY - centerY}px) rotate(${rotate}deg)`;
      piece.style.opacity = "1";
    });

    window.setTimeout(() => {
      piece.style.opacity = "0";
    }, duration * 0.65);

    window.setTimeout(() => {
      piece.remove();
    }, duration + 220);
  }
}

function showPopup(popup) {
  setVisibility(popup, true);
  popup.querySelector(".popup-shell").focus?.();
}

function hidePopup(popup) {
  setVisibility(popup, false);
  typingCancel = true;
}

enterButton.addEventListener("click", () => {
  showMainContent();
});

musicToggle.addEventListener("click", () => {
  toggleMusic();
});

openGiftButton.addEventListener("click", () => {
  showPopup(reasonsPopup);
  playReasonSequence();
});

closeReasonsPopup.addEventListener("click", () => {
  hidePopup(reasonsPopup);
});

surpriseButton.addEventListener("click", () => {
  showPopup(surprisePopup);
  createRainEffect();
  createConfettiBurst();
});

closeSurprisePopup.addEventListener("click", () => {
  hidePopup(surprisePopup);
});

heartButton.addEventListener("click", () => {
  handleHeartExplosion();
  heartMessage.textContent = "I knew it 😌❤️";
  window.setTimeout(() => {
    heartMessage.textContent = "";
  }, 4200);
});

secretButton.addEventListener("click", () => {
  const value = secretInput.value.trim().toLowerCase();
  if (!value) {
    secretMessage.textContent = "Please enter the secret word...";
    secretMessage.style.color = "rgba(122, 35, 88, 0.9)";
    return;
  }

  if (value === "dizzii") {
    secretMessage.textContent = "Forever with you ❤️";
    secretMessage.style.color = "rgba(208, 60, 133, 0.95)";
  } else {
    secretMessage.textContent = "That doesn't quite feel right... try again 😊";
    secretMessage.style.color = "rgba(190, 32, 78, 0.85)";
  }
});

// This ensures the music icon reflects the real audio state if user interacts using native controls.
backgroundMusic.addEventListener("play", () => {
  musicPlaying = true;
  musicToggle.querySelector(".music-icon").textContent = "⏸";
  musicToggle.setAttribute("aria-label", "Pause music");
});

backgroundMusic.addEventListener("pause", () => {
  musicPlaying = false;
  musicToggle.querySelector(".music-icon").textContent = "🎵";
  musicToggle.setAttribute("aria-label", "Play music");
});

// Prevent overlay from trapping focus when hidden
window.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    if (!reasonsPopup.classList.contains("hidden")) {
      hidePopup(reasonsPopup);
    }
    if (!surprisePopup.classList.contains("hidden")) {
      hidePopup(surprisePopup);
    }
  }
});

// If music is blocked, just keep toggling state.
backgroundMusic.addEventListener("error", () => {
  // No action needed; the toggle stays available without crashing.
});

// Safety: prevent stuck main content if welcome screen is still visible.
window.addEventListener("load", () => {
  if (!welcomeScreen.classList.contains("hidden")) {
    mainContent.classList.add("hidden");
  }
});
