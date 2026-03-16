const STORAGE_KEY = "grace-os-v1";
const WORKER_URL = "https://grace-chat-worker.getrightandconquer.workers.dev";

function defaultState() {
  return {
    profile: {
      name: "",
      goal: "",
      block: ""
    },
    scores: {
      emotional: 5,
      financial: 5,
      occupational: 5,
      social: 5,
      intellectual: 5,
      spiritual: 5,
      physical: 5,
      environmental: 5
    },
    journal: [],
    guideNotes: [],
    history: [],
    coachChat: []
  };
}

function loadState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return defaultState();
    const parsed = JSON.parse(raw);
    return {
      ...defaultState(),
      ...parsed,
      profile: { ...defaultState().profile, ...(parsed.profile || {}) },
      scores: { ...defaultState().scores, ...(parsed.scores || {}) },
      journal: Array.isArray(parsed.journal) ? parsed.journal : [],
      guideNotes: Array.isArray(parsed.guideNotes) ? parsed.guideNotes : [],
      history: Array.isArray(parsed.history) ? parsed.history : [],
      coachChat: Array.isArray(parsed.coachChat) ? parsed.coachChat : []
    };
  } catch {
    return defaultState();
  }
}

let state = loadState();

function saveState() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

function escapeHtml(str) {
  return String(str)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function averageScore() {
  const values = Object.values(state.scores).map(Number);
  return (values.reduce((sum, n) => sum + n, 0) / values.length).toFixed(1);
}

function bestDimension() {
  return [...GRACE_DIMENSIONS].sort((a, b) => state.scores[b.id] - state.scores[a.id])[0];
}

function lowestDimension() {
  return [...GRACE_DIMENSIONS].sort((a, b) => state.scores[a.id] - state.scores[b.id])[0];
}

function showStatus(message) {
  const el = document.getElementById("statusMessage");
  if (!el) return;
  el.textContent = message;
  el.classList.remove("hidden");
  clearTimeout(showStatus._timer);
  showStatus._timer = setTimeout(() => el.classList.add("hidden"), 2500);
}

function initSharedUI(activePage) {
  const nav = document.querySelectorAll(".nav a");
  nav.forEach((link) => {
    if (link.dataset.page === activePage) {
      link.classList.add("active");
    }
  });
}

function saveProfileFromForm() {
  const name = document.getElementById("profileName")?.value.trim() || "";
  const goal = document.getElementById("profileGoal")?.value.trim() || "";
  const block = document.getElementById("profileBlock")?.value.trim() || "";

  if (!name && !goal && !block) {
    showStatus("Add at least one detail before saving.");
    return;
  }

  state.profile = { name, goal, block };
  saveState();
  showStatus("Profile saved.");
}

function renderDashboard() {
  const avgEl = document.getElementById("avgScore");
  const bestEl = document.getElementById("bestDimension");
  const lowEl = document.getElementById("lowestDimension");
  const goalEl = document.getElementById("goalText");
  const grid = document.getElementById("dimensionGrid");

  if (avgEl) avgEl.textContent = `${averageScore()}/10`;
  if (bestEl) bestEl.textContent = bestDimension().name;
  if (lowEl) lowEl.textContent = lowestDimension().name;
  if (goalEl) goalEl.textContent = state.profile.goal || "Not set";

  if (!grid) return;

  grid.innerHTML = GRACE_DIMENSIONS.map((dimension) => {
    const score = Number(state.scores[dimension.id]);
    return `
      <div class="dimension-card">
        <div class="action-row" style="justify-content:space-between; align-items:flex-start;">
          <div>
            <div class="tag">${escapeHtml(dimension.name)}</div>
            <h3>${escapeHtml(dimension.name)}</h3>
            <div class="small">${escapeHtml(dimension.sub)}</div>
          </div>
          <div class="dimension-score">${score}/10</div>
        </div>

        <div class="progress-track">
          <div class="progress-fill" style="width:${score * 10}%; background:${dimension.color};"></div>
        </div>

        <p>${escapeHtml(dimension.intro)}</p>

        <label class="field">
          <span>Rate this area</span>
          <input class="range" type="range" min="1" max="10" value="${score}" data-score-id="${dimension.id}" />
        </label>

        <div class="tag-row">
          ${dimension.tools.map((tool) => `<span class="tag">${escapeHtml(tool)}</span>`).join("")}
        </div>
      </div>
    `;
  }).join("");

  document.querySelectorAll("[data-score-id]").forEach((input) => {
    input.addEventListener("input", (e) => {
      state.scores[e.target.dataset.scoreId] = Number(e.target.value);
      state.history.push({
        date: new Date().toISOString(),
        scores: { ...state.scores }
      });
      state.history = state.history.slice(-30);
      saveState();
      renderDashboard();
    });
  });
}

function renderTools() {
  const wrap = document.getElementById("toolSections");
  if (!wrap) return;

  wrap.innerHTML = TOOL_SECTIONS.map((section) => `
    <div class="tool-card">
      <h3>${escapeHtml(section.title)}</h3>
      <div class="tag-row">
        ${section.items.map((item) => `<span class="tag">${escapeHtml(item)}</span>`).join("")}
      </div>
      <p class="small" style="margin-top:14px;">Built for future support tools, guided reflection, planning help, and growth inside G.R.A.C.E.</p>
    </div>
  `).join("");
}

function renderMemberships() {
  const wrap = document.getElementById("membershipGrid");
  if (!wrap) return;

  wrap.innerHTML = MEMBERSHIP_LEVELS.map((level) => `
    <div class="membership-card">
      <div class="member-badge">${escapeHtml(level.name)}</div>
      <h3>${escapeHtml(level.name)}</h3>
      <div class="metric">${escapeHtml(level.price)}</div>
      <p>${escapeHtml(level.desc)}</p>
      <ul>
        ${level.items.map((item) => `<li>${escapeHtml(item)}</li>`).join("")}
      </ul>
      <div class="btn-row" style="margin-top:16px;">
        <button class="btn btn-primary">Choose ${escapeHtml(level.name)}</button>
      </div>
    </div>
  `).join("");
}

function renderLibrary() {
  const wrap = document.getElementById("libraryGrid");
  if (!wrap) return;

  wrap.innerHTML = `
    <div class="reader-card">
      <div class="member-badge">Featured Guide</div>
      <h3>Get Right And Conquer Everything</h3>
      <p>A Guide to Balance, Growth, and Purpose</p>
      <p class="small">Reader-style experience with reflections, notes, and future premium access.</p>
      <div class="btn-row">
        <a class="btn btn-primary" href="guide.html">Open Reader</a>
      </div>
    </div>

    <div class="reader-card">
      <div class="member-badge">Journal</div>
      <h3>The Key to Happiness</h3>
      <p>A digital reflection and planning space connected to your wellness journey.</p>
      <div class="btn-row">
        <a class="btn btn-primary" href="journal.html">Open Journal</a>
      </div>
    </div>
  `;
}

function renderGuideReader() {
  const list = document.getElementById("chapterList");
  const title = document.getElementById("readerTitle");
  const text = document.getElementById("readerText");
  const promptTitle = document.getElementById("promptTitle");

  if (!list || !title || !text || !promptTitle) return;

  let currentId = localStorage.getItem("grace-current-chapter") || GUIDE_CHAPTERS[0].id;

  function paint() {
    list.innerHTML = GUIDE_CHAPTERS.map((chapter) => `
      <button class="chapter-btn ${chapter.id === currentId ? "active" : ""}" data-chapter-id="${chapter.id}">
        ${escapeHtml(chapter.title)}
      </button>
    `).join("");

    const chapter = GUIDE_CHAPTERS.find((c) => c.id === currentId) || GUIDE_CHAPTERS[0];
    title.textContent = chapter.title;
    text.textContent = chapter.text;
    promptTitle.textContent = `Reflection for ${chapter.title}`;

    document.querySelectorAll("[data-chapter-id]").forEach((btn) => {
      btn.addEventListener("click", () => {
        currentId = btn.dataset.chapterId;
        localStorage.setItem("grace-current-chapter", currentId);
        paint();
      });
    });
  }

  paint();

  const saveBtn = document.getElementById("saveGuideNoteBtn");
  if (saveBtn && !saveBtn.dataset.bound) {
    saveBtn.dataset.bound = "true";
    saveBtn.addEventListener("click", () => {
      const noteInput = document.getElementById("guideNote");
      const note = noteInput?.value.trim() || "";
      if (!note) return;

      state.guideNotes.unshift({
        chapter: currentId,
        note,
        date: new Date().toISOString()
      });
      state.guideNotes = state.guideNotes.slice(-50);
      saveState();

      if (noteInput) noteInput.value = "";
      showStatus("Reflection saved.");
    });
  }

  const addJournalBtn = document.getElementById("addToJournalBtn");
  if (addJournalBtn && !addJournalBtn.dataset.bound) {
    addJournalBtn.dataset.bound = "true";
    addJournalBtn.addEventListener("click", () => {
      const noteInput = document.getElementById("guideNote");
      const note = noteInput?.value.trim() || "";
      if (!note) return;

      state.journal.unshift({
        type: "guide-reflection",
        title: `Guide Reflection: ${currentId}`,
        text: note,
        date: new Date().toISOString()
      });
      state.journal = state.journal.slice(-100);
      saveState();

      if (noteInput) noteInput.value = "";
      showStatus("Added to journal.");
    });
  }
}

function renderJournal() {
  const list = document.getElementById("journalEntries");
  if (!list) return;

  list.innerHTML = state.journal.length
    ? state.journal.map((entry) => `
        <div class="mini-card">
          <h3>${escapeHtml(entry.title || "Journal Entry")}</h3>
          <div class="small">${new Date(entry.date).toLocaleString()}</div>
          <p>${escapeHtml(entry.text)}</p>
        </div>
      `).join("")
    : `<div class="mini-card"><h3>No entries yet</h3><p>Start with a daily reflection, weekly reset, or guide note.</p></div>`;

  const saveBtn = document.getElementById("saveJournalBtn");
  if (saveBtn && !saveBtn.dataset.bound) {
    saveBtn.dataset.bound = "true";
    saveBtn.addEventListener("click", () => {
      const titleInput = document.getElementById("journalTitle");
      const textInput = document.getElementById("journalText");
      const title = titleInput?.value.trim() || "Journal Entry";
      const text = textInput?.value.trim() || "";

      if (!text) return;

      state.journal.unshift({
        title,
        text,
        date: new Date().toISOString(),
        type: "journal"
      });
      state.journal = state.journal.slice(-100);
      saveState();

      if (titleInput) titleInput.value = "";
      if (textInput) textInput.value = "";
      renderJournal();
      showStatus("Journal entry saved.");
    });
  }
}

async function askGrace(messages) {
  const response = await fetch(WORKER_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      system: `You are G.R.A.C.E. — a direct, supportive, peer-style guide. Keep things grounded, warm, clear, and actionable. Do not act like therapy, crisis care, or medical advice. Help people slow things down, sort through what matters, and focus on one doable next move.`,
      messages
    })
  });

  if (!response.ok) throw new Error("Worker request failed");
  const data = await response.json();
  return data.reply || "Let’s slow it down and start with one thing that matters most right now.";
}

function initAICoach() {
  const sendBtn = document.getElementById("sendCoachBtn");
  const input = document.getElementById("coachInput");
  const messagesWrap = document.getElementById("coachMessages");
  if (!sendBtn || !input || !messagesWrap) return;

  function addBubble(role, text, save = true) {
    const div = document.createElement("div");
    div.className = "mini-card";
    div.style.marginBottom = "12px";
    div.innerHTML = `<strong>${role === "user" ? "You" : "G.R.A.C.E."}</strong><p style="margin-bottom:0;">${escapeHtml(text)}</p>`;
    messagesWrap.appendChild(div);
    messagesWrap.scrollTop = messagesWrap.scrollHeight;

    if (save) {
      state.coachChat.push({ role, content: text });
      state.coachChat = state.coachChat.slice(-30);
      saveState();
    }
  }

  messagesWrap.innerHTML = "";

  if (state.coachChat.length) {
    state.coachChat.forEach((msg) => {
      addBubble(msg.role, msg.content, false);
    });
  } else {
    addBubble("assistant", "Alright. Talk to me. What is going on right now?", false);
  }

  if (!sendBtn.dataset.bound) {
    sendBtn.dataset.bound = "true";

    sendBtn.addEventListener("click", async () => {
      const text = input.value.trim();
      if (!text) return;

      addBubble("user", text);
      input.value = "";
      sendBtn.disabled = true;
      sendBtn.textContent = "Thinking...";

      try {
        const reply = await askGrace(state.coachChat);
        addBubble("assistant", reply);
      } catch {
        const fallback = "Okay. I hear you. You do not need to figure everything out right now. Let’s slow it down. What feels heaviest at this moment: emotions, money, routines, work, or relationships?";
        addBubble("assistant", fallback);
      } finally {
        sendBtn.disabled = false;
        sendBtn.textContent = "Send";
      }
    });
  }

  if (!input.dataset.bound) {
    input.dataset.bound = "true";

    input.addEventListener("keydown", (event) => {
      if (event.key === "Enter" && !event.shiftKey) {
        event.preventDefault();
        sendBtn.click();
      }
    });
  }
}

document.addEventListener("DOMContentLoaded", () => {
  if (document.getElementById("saveProfileBtn")) {
    document.getElementById("saveProfileBtn").addEventListener("click", saveProfileFromForm);
  }

  const currentFile = window.location.pathname.split("/").pop() || "index.html";
  const currentPageMap = {
    "index.html": "home",
    "dashboard.html": "dashboard",
    "tools.html": "tools",
    "journal.html": "journal",
    "library.html": "library",
    "games.html": "games",
    "events.html": "events",
    "membership.html": "membership",
    "guide.html": "library"
  };

  initSharedUI(currentPageMap[currentFile] || "home");

  if (document.getElementById("dimensionGrid")) renderDashboard();
  if (document.getElementById("toolSections")) renderTools();
  if (document.getElementById("membershipGrid")) renderMemberships();
  if (document.getElementById("libraryGrid")) renderLibrary();
  if (document.getElementById("chapterList")) renderGuideReader();
  if (document.getElementById("journalEntries")) renderJournal();
  if (document.getElementById("coachMessages")) initAICoach();
});
