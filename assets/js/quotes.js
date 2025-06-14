// ========== Update Nama di Sidebar ==========
document.addEventListener("DOMContentLoaded", () => {
  const name = localStorage.getItem("name");
  const profileLabel = document.getElementById("profileSidebarLabel");

  if (profileLabel) {
    if (name && name.trim() !== "") {
      profileLabel.textContent = name.length > 15 ? name.substring(0, 15) + "..." : name;
    } else {
      profileLabel.textContent = "Profile";
    }
  }

  // Jalankan bagian quote setelah DOM siap
  loadFavorites();
  getDailyQuote();
  renderDailyQuote();
  renderFavorites();
});

// ========== Data Quotes ==========
const quotes = [
  {
    id: 1,
    text: "Jangan pernah meremehkan langkah kecil, karena itu tetap membawamu maju.",
    author: "SincMe.id Team"
  },
  {
    id: 2,
    text: "Hari ini adalah kesempatan untuk menjadi versi terbaik dirimu.",
    author: "Anonim"
  },
  {
    id: 3,
    text: "Kamu berharga, bahkan saat kamu merasa tidak.",
    author: "SincMe.id"
  },
  {
    id: 4,
    text: "Kesulitan hari ini adalah kekuatan besok.",
    author: "Seseorang Bijak"
  }
];

let favoriteQuotes = new Set();
let todayQuote = null;

// ========== LocalStorage Favorite ==========
function loadFavorites() {
  const storedFavorites = localStorage.getItem("favoriteQuotes");
  if (storedFavorites) {
    try {
      favoriteQuotes = new Set(JSON.parse(storedFavorites));
    } catch {
      favoriteQuotes = new Set();
    }
  }
}

function saveFavorites() {
  localStorage.setItem("favoriteQuotes", JSON.stringify([...favoriteQuotes]));
}

// ========== Random Quote Harian ==========
function getDailyQuote() {
  const todayKey = new Date().toISOString().split("T")[0];
  const stored = JSON.parse(localStorage.getItem("dailyQuote") || "{}");

  if (stored.date === todayKey) {
    todayQuote = quotes.find(q => q.id === stored.id);
  } else {
    const random = quotes[Math.floor(Math.random() * quotes.length)];
    todayQuote = random;
    localStorage.setItem("dailyQuote", JSON.stringify({ date: todayKey, id: random.id }));
  }
}

// ========== Render Quote Hari Ini ==========
function renderDailyQuote() {
  const container = document.getElementById("quote-of-day");
  container.innerHTML = "";

  const isFavorited = favoriteQuotes.has(todayQuote.id);

  const card = document.createElement("div");
  card.className = "bg-white rounded-lg p-6 shadow relative";

  card.innerHTML = `
    <div class="text-3xl text-gray-300 absolute top-2 left-2">“</div>
    <p class="italic text-gray-700 pl-6 pr-8">${todayQuote.text}</p>
    <div class="text-right text-sm text-gray-500 mt-2">- ${todayQuote.author}</div>
    <button 
      class="absolute top-2 right-2 text-xl transition-colors ${
        isFavorited ? "text-pink-500" : "text-gray-400 hover:text-pink-400"
      }" 
      onclick="toggleFavorite(${todayQuote.id})">
      <i class="fas fa-heart"></i>
    </button>
  `;
  container.appendChild(card);
}

// ========== Render Quote Favorit ==========
function renderFavorites() {
  const favContainer = document.getElementById("favorite-list");
  const noFavMsg = document.getElementById("no-fav-msg");

  favContainer.innerHTML = "";
  const favs = quotes.filter(q => favoriteQuotes.has(q.id));

  if (favs.length === 0) {
    noFavMsg.style.display = "block";
    return;
  }

  noFavMsg.style.display = "none";

  favs.forEach(quote => {
    const card = document.createElement("div");
    card.className = "bg-pink-50 rounded-lg p-4 shadow relative border border-pink-100";

    card.innerHTML = `
      <div class="text-3xl text-pink-300 absolute top-2 left-2">“</div>
      <p class="italic text-pink-800 pl-6 pr-6">${quote.text}</p>
      <div class="text-right text-sm text-pink-500 mt-2">- ${quote.author}</div>
      <button 
        class="absolute top-2 right-2 text-xl text-pink-500 hover:text-pink-600"
        onclick="toggleFavorite(${quote.id})">
        <i class="fas fa-heart"></i>
      </button>
    `;
    favContainer.appendChild(card);
  });
}

// ========== Toggle Favorite ==========
function toggleFavorite(id) {
  if (favoriteQuotes.has(id)) {
    favoriteQuotes.delete(id);
  } else {
    favoriteQuotes.add(id);
  }
  saveFavorites();
  renderDailyQuote();
  renderFavorites();
}
