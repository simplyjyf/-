const navToggle = document.querySelector(".nav-toggle");
const siteNav = document.querySelector(".site-nav");

if (navToggle && siteNav) {
  navToggle.addEventListener("click", () => {
    const isOpen = siteNav.classList.toggle("open");
    navToggle.setAttribute("aria-expanded", String(isOpen));
  });
}

const tabButtons = document.querySelectorAll(".tab-button");
const lessonNotes = document.querySelectorAll(".lesson-note");

tabButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const targetId = button.dataset.note;
    tabButtons.forEach((item) => item.classList.remove("active"));
    lessonNotes.forEach((note) => note.classList.remove("active"));
    button.classList.add("active");
    document.getElementById(targetId)?.classList.add("active");
  });
});

const initialHash = window.location.hash.replace("#", "");
if (initialHash) {
  const hashButton = document.querySelector(`[data-note="${initialHash}"]`);
  const hashNote = document.getElementById(initialHash);
  if (hashButton && hashNote) {
    tabButtons.forEach((item) => item.classList.remove("active"));
    lessonNotes.forEach((note) => note.classList.remove("active"));
    hashButton.classList.add("active");
    hashNote.classList.add("active");
  }
}

const forumForm = document.getElementById("forum-form");
const forumInput = document.getElementById("forum-input");
const forumPreview = document.getElementById("forum-preview");

if (forumForm && forumInput && forumPreview) {
  forumForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const value = forumInput.value.trim();
    if (!value) {
      forumInput.focus();
      return;
    }
    forumPreview.hidden = false;
    forumPreview.querySelector("p").textContent = value;
    forumInput.value = "";
  });
}
