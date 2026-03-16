const STORAGE_KEY = "grace-os-v1";
const WORKER_URL = "https://grace-chat-worker.getrightandconquer.workers.dev";

function defaultState() {
  return {
    theme: "dark",
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
    history: []
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
      history: Array.isArray(parsed.history) ? parsed.history : []
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

function applyTheme() {
  document.body.classList.toggle("light-mode", state.theme === "light");
  const btn = document.getElementById("themeToggle");
  if (btn) btn.textContent = state.theme === "light" ? "Dark Mode" : "Light Mode";
}

function toggleTheme() {
  state.theme = state.theme === "dark" ? "light" : "dark";
  saveState();
  applyTheme();
}

function initSharedUI(activePage) {
  const nav = document.querySelectorAll(".nav a");
  nav.forEach((link) => {
    if (link.dataset.page === activePage) link.classList.add("active");
  });

  const themeBtn = document.getElementById("themeToggle");
  if (themeBtn) themeBtn.addEventListener("click", toggleTheme);

  applyTheme();
}

function saveProfileFromForm() {
  const name = document.getElementById("profileName")?.value.trim() || "";
  const goal = document.getElementById("profileGoal")?.value.trim() || "";
  const block = document.getElementById("profileBlock")?.value.trim() || "";

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
      <p class="small" style="margin-top:14px;">Built for future AI-powered workflows inside the G.R.A.C.E. life operating system.</p>
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
  if (saveBtn) {
    saveBtn.addEventListener("click", () => {
      const note = document.getElementById("guideNote").value.trim();
      if (!note) return;

      state.guideNotes.unshift({
        chapter: currentId,
        note,
        date: new Date().toISOString()
      });
      state.guideNotes = state.guideNotes.slice(0, 50);
      saveState();
      document.getElementById("guideNote").value = "";
      showStatus("Reflection saved.");
    });
  }

  const addJournalBtn = document.getElementById("addToJournalBtn");
  if (addJournalBtn) {
    addJournalBtn.addEventListener("click", () => {
      const note = document.getElementById("guideNote").value.trim();
      if (!note) return;

      state.journal.unshift({
        type: "guide-reflection",
        title: `Guide Reflection: ${currentId}`,
        text: note,
        date: new Date().toISOString()
      });
      state.journal = state.journal.slice(0, 100);
      saveState();
      document.getElementById("guideNote").value = "";
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
  if (saveBtn) {
    saveBtn.addEventListener("click", () => {
      const title = document.getElementById("journalTitle").value.trim() || "Journal Entry";
      const text = document.getElementById("journalText").value.trim();

      if (!text) return;

      state.journal.unshift({
        title,
        text,
        date: new Date().toISOString(),
        type: "journal"
      });
      state.journal = state.journal.slice(0, 100);
      saveState();

      document.getElementById("journalTitle").value = "";
      document.getElementById("journalText").value = "";
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
      system: `You are G.R.A.C.E. — a direct, supportive, peer-style AI coach inside a life operating system. Keep things grounded, warm, honest, and actionable. Never act like therapy. End with one clear next step.`,
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

  const chat = [];

  function addBubble(role, text) {
    const div = document.createElement("div");
    div.className = `mini-card`;
    div.style.marginBottom = "12px";
    div.innerHTML = `<strong>${role === "user" ? "You" : "G.R.A.C.E."}</strong><p style="margin-bottom:0;">${escapeHtml(text)}</p>`;
    messagesWrap.appendChild(div);
    messagesWrap.scrollTop = messagesWrap.scrollHeight;
  }

  addBubble("assistant", "Alright. Talk to me. What is going on right now?");

  sendBtn.addEventListener("click", async () => {
    const text = input.value.trim();
    if (!text) return;

    chat.push({ role: "user", content: text });
    addBubble("user", text);
    input.value = "";
    sendBtn.disabled = true;
    sendBtn.textContent = "Thinking...";

    try {
      const reply = await askGrace(chat);
      chat.push({ role: "assistant", content: reply });
      addBubble("assistant", reply);
    } catch {
      const fallback = "Okay. I hear you. You do not need to solve everything right now. Name the one area that feels heaviest: emotions, money, routines, work, or relationships.";
      addBubble("assistant", fallback);
    } finally {
      sendBtn.disabled = false;
      sendBtn.textContent = "Send";
    }
  });
}
