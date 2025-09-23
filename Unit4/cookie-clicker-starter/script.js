// ===== Game State =====
const state = {
  cookies: 0,
  clickCount: 0,
  cps: 0,
  upgrades: {
    grandma: {
      count: 0,
      cost: 100,
      cps: 1,
    },
  },
  achievements: [],
};

// ===== Achievements Config =====
const achievementsConfig = [
  // Click Achievements
  { id: "firstClick", name: "First Click 👆", desc: "Click the cookie once", type: "clicks", target: 1, reward: 10 },
  { id: "cookieNovice", name: "Cookie Novice 🍪", desc: "Reach 50 clicks", type: "clicks", target: 50, reward: 50 },
  { id: "cookieExpert", name: "Cookie Expert ⭐", desc: "Reach 500 clicks", type: "clicks", target: 500, reward: 500 },

  // Building Achievements
  { id: "grandmaHelper", name: "Grandma’s Helper 👵", desc: "Buy 1 grandma", type: "grandmas", target: 1, reward: 50 },
  { id: "grandmaArmy", name: "Grandma Army 👵👵", desc: "Own 10 grandmas", type: "grandmas", target: 10, reward: 500 },

  // Cookie Achievements
  { id: "sweetTart", name: "Sweet Tart 🍬", desc: "Collect 1,000 cookies", type: "cookies", target: 1000, reward: 100 },
  { id: "cookieMillionaire", name: "Cookie Millionaire 💰", desc: "Collect 1,000,000 cookies", type: "cookies", target: 1000000, reward: 10000 },

  // Production Achievements
  { id: "passiveIncome", name: "Passive Income 💸", desc: "Reach 10 cps", type: "cps", target: 10, reward: 500 },
  { id: "cookieFactory", name: "Cookie Factory 🏭", desc: "Reach 100 cps", type: "cps", target: 100, reward: 5000 },
];

// ===== DOM Elements =====
const cookieImage = document.getElementById("cookie-image");
const clickCountDisplay = document.getElementById("click-count");
const cpsDisplay = document.getElementById("cps");
const grandmaCountDisplay = document.getElementById("grandma-count");
const buyGrandmaBtn = document.getElementById("buy-grandma");
const achievementsPanel = document.getElementById("achievements-panel");
const achievementsList = document.getElementById("achievements-list");
const toggleAchievementsBtn = document.getElementById("toggle-achievements");
const popup = document.getElementById("achievement-popup");

// ===== Core Functions =====
function updateDisplay() {
  clickCountDisplay.textContent = state.cookies;
  cpsDisplay.textContent = state.cps.toFixed(1);
  grandmaCountDisplay.textContent = state.upgrades.grandma.count;
  buyGrandmaBtn.disabled = state.cookies < state.upgrades.grandma.cost;
  renderAchievements();
}

function addCookies(amount) {
  state.cookies += amount;
  updateDisplay();
  checkAchievements();
}

function buyGrandma() {
  const grandma = state.upgrades.grandma;
  if (state.cookies >= grandma.cost) {
    state.cookies -= grandma.cost;
    grandma.count++;
    state.cps = grandma.count * grandma.cps;
    updateDisplay();
    checkAchievements();
  }
}

// ===== Achievements =====
function checkAchievements() {
  achievementsConfig.forEach((ach) => {
    if (!state.achievements.includes(ach.id)) {
      let progress = 0;
      switch (ach.type) {
        case "clicks":
          progress = state.clickCount;
          break;
        case "cookies":
          progress = state.cookies;
          break;
        case "grandmas":
          progress = state.upgrades.grandma.count;
          break;
        case "cps":
          progress = state.cps;
          break;
      }

      if (progress >= ach.target) {
        unlockAchievement(ach);
      }
    }
  });
}

function unlockAchievement(ach) {
  state.achievements.push(ach.id);
  state.cookies += ach.reward;
  showPopup(`Achievement Unlocked: ${ach.name} (+${ach.reward} cookies!)`);
  updateDisplay();
}

function renderAchievements() {
  achievementsList.innerHTML = "";
  achievementsConfig.forEach((ach) => {
    const unlocked = state.achievements.includes(ach.id);
    let progress = 0;
    switch (ach.type) {
      case "clicks":
        progress = state.clickCount;
        break;
      case "cookies":
        progress = state.cookies;
        break;
      case "grandmas":
        progress = state.upgrades.grandma.count;
        break;
      case "cps":
        progress = state.cps;
        break;
    }
    const percent = Math.min(100, (progress / ach.target) * 100);

    const achievementEl = document.createElement("div");
    achievementEl.className = `p-3 border rounded ${unlocked ? "bg-green-100" : "bg-gray-50"}`;
    achievementEl.innerHTML = `
      <p class="font-semibold">${ach.name}</p>
      <p class="text-sm text-gray-600">${ach.desc}</p>
      <div class="w-full bg-gray-200 rounded h-3 mt-1">
        <div class="bg-blue-500 h-3 rounded" style="width:${percent}%;"></div>
      </div>
      <p class="text-xs mt-1">${Math.min(progress, ach.target)} / ${ach.target}</p>
    `;
    achievementsList.appendChild(achievementEl);
  });
}

function showPopup(message) {
  popup.textContent = message;
  popup.classList.remove("hidden");
  setTimeout(() => popup.classList.add("hidden"), 3000);
}

// ===== Event Listeners =====
cookieImage.addEventListener("click", () => {
  state.clickCount++;
  addCookies(1);
});

buyGrandmaBtn.addEventListener("click", buyGrandma);

toggleAchievementsBtn.addEventListener("click", () => {
  achievementsPanel.classList.toggle("hidden");
});

// ===== Passive Income Loop =====
setInterval(() => {
  if (state.cps > 0) {
    addCookies(state.cps);
  }
}, 1000);

// ===== Initial Render =====
updateDisplay();
