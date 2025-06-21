const API_URL = 'http://localhost:8080/api';

// Utility Functions
function getAuthToken() {
    const token = localStorage.getItem('token');
    if (!token) {
        window.location.href = 'login.html';
        return null;
    }
    return token.startsWith('Bearer ') ? token : `Bearer ${token}`;
}

// Event Listeners
document.addEventListener("DOMContentLoaded", async () => {
    console.log('Page loaded, initializing...');
    updateProfileLabel();
    await loadTodayQuote();
    await loadFavoriteQuotes();
});

// API Functions
async function fetchTodayQuote() {
    try {
        console.log('Fetching today quote...');
        const response = await fetch(`${API_URL}/quotes/today`, {
            headers: {
                'Authorization': getAuthToken(),
                'Content-Type': 'application/json'
            }
        });

        console.log('Response status:', response.status);
        if (!response.ok) {
            throw new Error('Failed to fetch daily quote');
        }
        
        const data = await response.json();
        console.log('Received quote data:', data);
        return data;
    } catch (error) {
        console.error('Error fetching quote:', error);
        return null;
    }
}

// UI Functions
function renderQuoteCard(quote, isFavorite = false) {
    console.log('Rendering quote:', quote);
    if (!quote || !quote.content) {
        console.error('Invalid quote data received');
        return null;
    }

    const card = document.createElement("div");
    card.className = isFavorite 
        ? "bg-pink-50 rounded-lg p-4 shadow relative border border-pink-100"
        : "bg-white rounded-lg p-6 shadow relative";

    card.dataset.quoteId = quote.id;

    card.innerHTML = `
        <div class="text-3xl ${isFavorite ? 'text-pink-300' : 'text-gray-300'} absolute top-2 left-2">"</div>
        <p class="italic ${isFavorite ? 'text-pink-800' : 'text-gray-700'} pl-6 pr-8">${quote.content}</p>
        <div class="text-right text-sm ${isFavorite ? 'text-pink-500' : 'text-gray-500'} mt-2">- ${quote.author}</div>
        <button 
            type="button"
            class="like-button absolute top-2 right-2 text-xl transition-colors ${
                quote.isLiked ? "text-pink-500" : "text-gray-400 hover:text-pink-400"
            }">
            <i class="fas fa-heart"></i>
        </button>
    `;

    const likeButton = card.querySelector('.like-button');
    likeButton.addEventListener('click', async (e) => {
        e.preventDefault();
        const quoteId = card.dataset.quoteId;
        console.log('Like button clicked for quote:', quoteId);
        if (quoteId) {
            await handleLikeToggle(Number(quoteId));
        }
    });

    return card;
}

// Display Functions
async function loadTodayQuote() {
    console.log('Loading today quote...');
    const quote = await fetchTodayQuote();
    console.log('Received quote:', quote);
    
    const container = document.getElementById("quote-of-day");
    if (!container) {
        console.error('Quote container not found');
        return;
    }

    container.innerHTML = '';
    
    if (quote && quote.content) {
        const card = renderQuoteCard(quote);
        if (card) {
            container.appendChild(card);
            console.log('Quote card rendered successfully');
        }
    } else {
        console.error('No valid quote data to display');
        container.innerHTML = '<p class="text-gray-500 text-center">Tidak dapat memuat quote hari ini.</p>';
    }
}

async function loadFavoriteQuotes() {
    try {
        const response = await fetch(`${API_URL}/quotes/favorites`, {
            headers: {
                'Authorization': getAuthToken(),
                'Content-Type': 'application/json'
            }
        });

        if (!response.ok) throw new Error('Failed to fetch favorites');
        
        const favorites = await response.json();
        console.log('Received favorites:', favorites);

        const favContainer = document.getElementById("favorite-list");
        const noFavMsg = document.getElementById("no-fav-msg");

        if (!favContainer || !noFavMsg) {
            console.error('Required DOM elements not found');
            return;
        }

        favContainer.innerHTML = '';

        if (!favorites || favorites.length === 0) {
            noFavMsg.style.display = "block";
            return;
        }

        noFavMsg.style.display = "none";
        favorites.forEach(quote => {
            const card = renderQuoteCard(quote, true);
            if (card) {
                favContainer.appendChild(card);
            }
        });
    } catch (error) {
        console.error('Error loading favorites:', error);
    }
}

async function handleLikeToggle(quoteId) {
    try {
        console.log('Toggling like for quote:', quoteId);
        const response = await fetch(`${API_URL}/quotes/${quoteId}/like`, {
            method: 'POST',
            headers: {
                'Authorization': getAuthToken(),
                'Content-Type': 'application/json'
            }
        });

        if (!response.ok) {
            throw new Error(`Failed to toggle like: ${response.status}`);
        }

        const updatedQuote = await response.json();
        console.log('Like toggled successfully:', updatedQuote);
        
        await loadTodayQuote();
        await loadFavoriteQuotes();
    } catch (error) {
        console.error('Error toggling like:', error);
    }
}

// Profile Label Update
function updateProfileLabel() {
    const name = localStorage.getItem("name");
    const profileLabel = document.getElementById("profileSidebarLabel");
    if (profileLabel) {
        if (name && name.trim() !== "") {
            profileLabel.textContent = name.length > 15 ? name.substring(0, 15) + "..." : name;
        } else {
            profileLabel.textContent = "Profile";
        }
    }
}