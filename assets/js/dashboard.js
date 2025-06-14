document.addEventListener("DOMContentLoaded", () => {
  // Quote
  const quoteText = "Tidak apa-apa untuk tidak baik-baik saja. Yang penting kamu jujur dengan dirimu sendiri dan mengambil langkah kecil untuk merawat diri.";
  const quoteAuthor = "- SincMe.id Team";

  const copyBtn = document.getElementById("copyQuote");
  const shareBtn = document.getElementById("shareQuote");

  if (copyBtn) {
    copyBtn.addEventListener("click", () => {
      navigator.clipboard.writeText(`"${quoteText}" ${quoteAuthor}`).then(() => {
        copyBtn.innerHTML = '<i class="fas fa-check text-green-500"></i>';
        setTimeout(() => {
          copyBtn.innerHTML = '<i class="far fa-copy"></i>';
        }, 1500);
      });
    });
  }

  if (shareBtn && navigator.share) {
    shareBtn.addEventListener("click", () => {
      navigator
        .share({
          title: "Quote Hari Ini dari SincMe.id",
          text: `"${quoteText}" ${quoteAuthor}`,
          url: window.location.href,
        })
        .catch((err) => console.error("Share gagal:", err));
    });
  } else if (shareBtn) {
    shareBtn.style.display = "none"; // sembunyikan kalau share API tidak tersedia
  }
});

// Update profile label in sidebar with user's name
document.addEventListener("DOMContentLoaded", () => {
  const name = localStorage.getItem("name");
  const profileLabel = document.getElementById("profileSidebarLabel");

  if (profileLabel) {v  
    if (name && name.trim() !== "") {
      profileLabel.textContent = name;
    } else {
      profileLabel.textContent = "Profile";
    }
  }

  updateProfileLabel();
});

// Function to update the profile label in the sidebar
document.addEventListener("DOMContentLoaded", () => {
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
  });