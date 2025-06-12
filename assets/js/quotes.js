// Quotes data
const quotes = [
    {
        text: "Tidak apa-apa untuk tidak baik-baik saja. Yang penting kamu jujur dengan dirimu sendiri.",
        author: "SafeSpace Team"
    },
    {
        text: "Kamu lebih kuat dari yang kamu kira. Percayalah pada proses dan teruslah melangkah, sekecil apa pun itu.",
        author: "SafeSpace Team"
    },
    {
        text: "Istirahat bukanlah tanda kelemahan, tapi bagian dari perawatan diri yang penting.",
        author: "SafeSpace Team"
    },
    {
        text: "Perasaanmu valid, apapun itu. Kamu berhak merasakannya tanpa perlu merasa bersalah.",
        author: "SafeSpace Team"
    },
    {
        text: "Langkah kecil tetap membawamu maju. Rayakan setiap kemajuan, sekecil apapun.",
        author: "SafeSpace Team"
    }
];

document.addEventListener("DOMContentLoaded", () => {
    const name = localStorage.getItem("name");
    const profileLabel = document.getElementById("profileSidebarLabel");

    if (profileLabel) {
      if (name && name.trim() !== "") {
        profileLabel.textContent = name;
      } else {
        profileLabel.textContent = "Profile";
      }
    }

    updateProfileLabel();
  });

// DOM Elements
const quotePopup = document.getElementById('quotePopup');
const popupQuoteText = document.getElementById('popupQuoteText');
const popupQuoteAuthor = document.getElementById('popupQuoteAuthor');
const closeQuotePopup = document.getElementById('closeQuotePopup');
const addToFavorites = document.getElementById('addToFavorites');
const dailyQuoteToggle = document.getElementById('dailyQuoteToggle');
const dailyQuoteText = document.getElementById('dailyQuoteText');
const dailyQuoteAuthor = document.getElementById('dailyQuoteAuthor');
const refreshQuote = document.getElementById('refreshQuote');
const saveFavorite = document.getElementById('saveFavorite');

// Show random quote
function showRandomQuote() {
    const randomIndex = Math.floor(Math.random() * quotes.length);
    const quote = quotes[randomIndex];
    
    popupQuoteText.textContent = quote.text;
    popupQuoteAuthor.textContent = `- ${quote.author}`;
    dailyQuoteText.textContent = quote.text;
    dailyQuoteAuthor.textContent = `- ${quote.author}`;
    
    return quote;
}

// Show popup with animation
function showQuotePopup() {
    quotePopup.classList.remove('translate-y-4', 'opacity-0', 'invisible');
    quotePopup.classList.add('translate-y-0', 'opacity-100', 'visible');
}

// Hide popup with animation
function hideQuotePopup() {
    quotePopup.classList.remove('translate-y-0', 'opacity-100', 'visible');
    quotePopup.classList.add('translate-y-4', 'opacity-0', 'invisible');
}

// Check if should show popup (once per day)
function shouldShowPopup() {
    const lastShown = localStorage.getItem('lastQuoteShown');
    if (!lastShown) return true;
    
    const lastDate = new Date(lastShown);
    const today = new Date();
    
    return lastDate.getDate() !== today.getDate() || 
           lastDate.getMonth() !== today.getMonth() || 
           lastDate.getFullYear() !== today.getFullYear();
}

// Event Listeners
closeQuotePopup.addEventListener('click', hideQuotePopup);
refreshQuote.addEventListener('click', showRandomQuote);
saveFavorite.addEventListener('click', function() {
    this.innerHTML = '<i class="fas fa-heart mr-1"></i><span class="text-sm">Tersimpan</span>';
    this.classList.add('text-[#4A90E2]');
});

addToFavorites.addEventListener('click', function() {
    this.innerHTML = '<i class="fas fa-heart mr-1"></i><span class="text-sm">Tersimpan</span>';
    this.classList.add('text-[#4A90E2]');
});

// Initialize
document.addEventListener('DOMContentLoaded', function() {
    showRandomQuote();
    
    // Show popup if enabled and not shown today
    if (dailyQuoteToggle.checked && shouldShowPopup()) {
        setTimeout(() => {
            showQuotePopup();
            localStorage.setItem('lastQuoteShown', new Date().toISOString());
        }, 3000);
    }
    
    // Save popup preference
    dailyQuoteToggle.addEventListener('change', function() {
        localStorage.setItem('dailyQuoteEnabled', this.checked);
    });
    
    // Load popup preference
    const isEnabled = localStorage.getItem('dailyQuoteEnabled') !== 'false';
    dailyQuoteToggle.checked = isEnabled;
});
function updateProfileLabel() {
  const name = localStorage.getItem("name");
  const profileLabel = document.getElementById("profileSidebarLabel");
  if (profileLabel) {
    if (name && name.trim() !== "") {
      if( name.length > 15) {
        profileLabel.textContent = name.substring(0, 15) + '...';
      } else {
      profileLabel.textContent = name;
      }
    } else {
      profileLabel.textContent = "Profile";
    }
  }
}

