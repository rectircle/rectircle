const body = document.body;
const cta = document.getElementById("scroll-cta");
const homeLink = document.getElementById("home-link");
const heroSection = document.getElementById("hero");
const messageSection = document.getElementById("message");
const tagline = document.querySelector(".tagline");

let unlocked = false;
let currentSection = "hero";
const SCROLL_DURATION = 900;

const preventScrollKeys = (event) => {
  const keys = ["ArrowDown", "ArrowUp", "PageDown", "PageUp", "Home", "End", " "];
  if (!unlocked && keys.includes(event.key)) {
    event.preventDefault();
  }
};

const preventScroll = (event) => {
  if (!unlocked) {
    event.preventDefault();
  }
};

const lockScroll = () => {
  unlocked = false;
  body.classList.remove("unlocked");
  document.addEventListener("wheel", preventScroll, { passive: false });
  document.addEventListener("touchmove", preventScroll, { passive: false });
  document.addEventListener("keydown", preventScrollKeys);
};

const unlockScroll = () => {
  unlocked = true;
  body.classList.add("unlocked");
  document.removeEventListener("wheel", preventScroll, { passive: false });
  document.removeEventListener("touchmove", preventScroll, { passive: false });
  document.removeEventListener("keydown", preventScrollKeys);
};

const switchState = (state) => {
  body.classList.toggle("state-hero", state === "hero");
  body.classList.toggle("state-message", state === "message");
  currentSection = state;
};

const scrollToSection = (section) => {
  if (section === currentSection) return;
  unlockScroll();
  if (section === "message") {
    messageSection.scrollIntoView({ behavior: "smooth" });
    switchState("message");
  } else {
    heroSection.scrollIntoView({ behavior: "smooth" });
    switchState("hero");
  }
  window.setTimeout(() => {
    lockScroll();
  }, SCROLL_DURATION);
};

const initStateFromScroll = () => {
  const atMessage =
    window.location.hash === "#message" ||
    window.scrollY >= messageSection.offsetTop - 2;

  if (atMessage) {
    switchState("message");
    unlockScroll();
  } else {
    switchState("hero");
    lockScroll();
  }
};

if (tagline) {
  const text = tagline.textContent.trim();
  tagline.setAttribute("aria-label", text);
  tagline.textContent = "";

  let letterIndex = 1;
  const words = text.split(" ");
  words.forEach((word, wordIndex) => {
    const wordSpan = document.createElement("span");
    wordSpan.classList.add("word");

    [...word].forEach((char) => {
      const span = document.createElement("span");
      span.classList.add("letter", `d${letterIndex}`);
      span.textContent = char;
      wordSpan.appendChild(span);
      letterIndex += 1;
    });

    tagline.appendChild(wordSpan);
    if (wordIndex < words.length - 1) {
      tagline.appendChild(document.createTextNode(" "));
    }
  });
}

if (cta) {
  cta.addEventListener("click", () => scrollToSection("message"));
}

if (homeLink) {
  homeLink.addEventListener("click", () => scrollToSection("hero"));
}

initStateFromScroll();
