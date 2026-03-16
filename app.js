const STORAGE_KEY = "grace-os-v1";
const WORKER_URL = "https://grace-chat-worker.getrightandconquer.workers.dev";

const GRACE_SYSTEM = `You are G.R.A.C.E. Get Right And Conquer Everything.

You were built by someone who has lived through real things. Depression, anxiety, loss, financial setbacks, relationship struggles. Not as theory. As lived experience. That is why you exist.

How you show up in every conversation:

When someone is overwhelmed, you slow things down first. You do not jump into advice. You let them talk. You listen. Then you respond.
You start simple. "Alright. Talk to me. What is going on right now?"
After they get it out you acknowledge it. "Okay. I hear you." Then you offer something real, not a speech.
You ground people. "Right now we are just talking. You are not alone in this moment."
You help them break things into smaller pieces. "We do not have to solve everything tonight. Let us focus on what is happening right now."
You remind people that what they are feeling is not permanent.
You ask targeted questions to understand what is really going on.
You never leave a conversation on a heavy or unresolved note.
You never give motivational speeches. You give presence, honesty, and help people get through the moment.

Your tone always:
Direct. Warm but honest. No sugarcoating. No fluff. No fake positivity.
Short sentences. Real words. Nothing performative.
You remind people who they are when they forget.
You keep things grounded and actionable.
You meet people where they are.
You always end with one clear next step or something that gives them a little strength to keep going.`;

const CHAT_SYSTEM_RESPONSES = [
  {
    match: ["stuck", "direction", "lost", "confused"],
    reply:
      "Okay. I hear you.\n\nWhen everything feels stuck, the first move is not to solve your whole life tonight. It is to get more honest about what feels most off.\n\nStart with this: what feels heaviest right now — money, emotions, structure, work, or relationships?\n\nNext step: pick one area and answer that in one sentence."
  },
  {
    match: ["overwhelmed", "burnout", "stress", "too much"],
    reply:
      "Okay. I hear you.\n\nWhen you are overwhelmed, the goal is not to push harder. It is to slow things down enough to see what is actually going on.\n\nRight now, name the 3 things taking up the most energy.\n\nNext step: write those 3 things down, then circle the one that cannot wait."
  },
  {
    match: ["decision", "decide", "choice"],
    reply:
      "Alright. Let us slow it down.\n\nMost hard decisions feel impossible when everything is mixed together. Usually there is the practical side, the emotional side, and the fear side.\n\nWhat decision are you trying to make, and what are the top 2 options?\n\nNext step: tell me the options first, not the whole story."
  },
  {
    match: ["money", "rent", "debt", "financial"],
    reply:
      "Okay. Money stress can make everything feel louder.\n\nDo not judge the situation right now. Just get clear on it. What matters most first is what is urgent, what is due, and what can wait.\n\nNext step: list your top 3 money pressures in order."
  },
  {
    match: ["anxiety", "depressed", "sad", "mental", "emotion"],
    reply:
      "Okay. I hear you.\n\nYou do not need to act like you are fine right now. Let us keep it simple.\n\nWhat feels strongest today — anxiety, sadness, numbness, anger, or exhaustion?\n\nNext step: name which one is leading today."
  }
];

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
    chatHistory: []
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
      chatHistory: Array.isArray(parsed.chatHistory) ? parsed.chatHistory : []
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

function generateGraceReply(text) {
  const lower = text.toLowerCase();

  for (const item of CHAT_SYSTEM_RESPONSES) {
    if (item.match.some((keyword) => lower.includes(keyword))) {
      return item.reply;
    }
  }

  return "Okay. I hear you.\n\nYou do not need to solve everything right now. Let us slow it down and get clearer.\n\nWhat feels most pressing at this moment — your emotions, your money, your routines, your work, or your relationships?\n\nNext step: answer with just one of those.";
}

function addChatMessage(role, text, saveToState = true) {
  const wrap = document.getElementById("chatMessages");
  if (!wrap) return;

  const bubble = document.createElement("div");
  bubble.className = "mini-card";
  bubble.style.marginBottom = "12px";
  bubble.innerHTML = `<strong>${role === "user" ? "You" : "G.R.A.C.E."}</strong><p style="margin-bottom:0; white-space:pre-wrap;">${escapeHtml(text)}</p>`;
  wrap.appendChild(bubble);
  wrap.scrollTop = wrap.scrollHeight;

  if (saveToState) {
    state.chatHistory.push({ role, text });
    state.chatHistory = state.chatHistory.slice(-20);
    saveState();
  }
}

function restoreChatHistory() {
  const wrap = document.getElementById("chatMessages");
  if (!wrap) return;

  wrap.innerHTML = "";

  if (!state.chatHistory.length) {
    addChatMessage("assistant", "Alright. Talk to me. What is going on right now?", false);
    return;
  }

  state.chatHistory.forEach((msg) => {
    addChatMessage(msg.role, msg.text, false);
  });
}

function buildWorkerMessages() {
  return state.chatHistory
    .filter((msg) => msg.role === "user" || msg.role === "assistant")
    .map((msg) => ({
      role: msg.role,
      content: msg.text
    }));
}

async function askGraceViaWorker() {
  const response = await fetch(WORKER_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      system: GRACE_SYSTEM,
      messages: buildWorkerMessages()
    })
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`Worker error ${response.status}: ${text}`);
  }

  const data = await response.json();

  if (!data || !data.reply) {
    throw new Error("Worker returned no reply");
  }

  return data.reply;
}

async function sendGraceMessage(prefillText = null) {
  const input = document.getElementById("chatInput");
  const btn = document.getElementById("sendChatBtn");
  const text = (prefillText ?? input.value).trim();
  if (!text || !btn) return;

  addChatMessage("user", text);
  if (input) input.value = "";
  btn.disabled = true;
  btn.textContent = "Sending...";

  try {
    const reply = await askGraceViaWorker();
    addChatMessage("assistant", reply);
  } catch (error) {
    console.error("Worker failed, using fallback reply:", error);
    const fallbackReply = generateGraceReply(text);
    addChatMessage("assistant", fallbackReply);
    showStatus("Cloud chat is not connected yet. Using local backup reply.");
  } finally {
    btn.disabled = false;
    btn.textContent = "Send";
  }
}

function initToolsChat() {
  const sendBtn = document.getElementById("sendChatBtn");
  const input = document.getElementById("chatInput");
  const messagesWrap = document.getElementById("chatMessages");
  if (!sendBtn || !input || !messagesWrap) return;

  restoreChatHistory();

  if (!sendBtn.dataset.bound) {
    sendBtn.dataset.bound = "true";
    sendBtn.addEventListener("click", () => sendGraceMessage());
  }

  if (!input.dataset.bound) {
    input.dataset.bound = "true";
    input.addEventListener("keydown", (event) => {
      if (event.key === "Enter" && !event.shiftKey) {
        event.preventDefault();
        sendGraceMessage();
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
  if (document.getElementById("chatMessages")) initToolsChat();
});
