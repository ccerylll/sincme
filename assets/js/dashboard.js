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

  if (profileLabel) {
    if (name && name.trim() !== "") {
      profileLabel.textContent = name;
    } else {
      profileLabel.textContent = "Profile";
    }
  }
});

// Function to update the profile label in the sidebar
document.addEventListener("DOMContentLoaded", () => {
  const name = localStorage.getItem("name");
  const profileLabel = document.getElementById("profileSidebarLabel");

  if (profileLabel) {
    if (name && name.trim() !== "") {
      if (name.length > 15) {
        profileLabel.textContent = name.substring(0, 15) + '...';
      } else {
        profileLabel.textContent = name;
      }
    } else {
      profileLabel.textContent = "Profile";
    }
  }
});

// Update greeting name in dashboard welcome section
document.addEventListener("DOMContentLoaded", () => {
  const name = localStorage.getItem("name");
  const greetingName = document.getElementById("dashboardGreetingName");
  if (greetingName) {
    if (name && name.trim() !== "") {
      greetingName.textContent = name.length > 25 ? name.substring(0, 25) + '...' : name;
    } else {
      greetingName.textContent = "User";
    }
  }
});

// Render recent journals in dashboard
function renderRecentJournals() {
  const container = document.getElementById("recentJournals");
  if (!container) return;

  container.innerHTML = ""; // Selalu bersihkan isi

  const journals = JSON.parse(localStorage.getItem("journals") || "[]");

  if (journals.length === 0) {
    container.innerHTML = `
      <div class="text-center text-[#758b96] py-6">Belum ada jurnal. Yuk mulai menulis jurnal pertamamu!</div>
    `;
    return;
  }

  // Urutkan dari terbaru berdasarkan createdAt (atau date jika tidak ada)
  const sorted = [...journals].sort((a, b) => {
    const aTime = a.createdAt ? new Date(a.createdAt).getTime() : new Date(a.date).getTime();
    const bTime = b.createdAt ? new Date(b.createdAt).getTime() : new Date(b.date).getTime();
    return bTime - aTime;
  });

  sorted.slice(0, 2).forEach(journal => {
    // Format tanggal
    const today = new Date();
    const journalDate = new Date(journal.date);
    let dateLabel = journal.date;
    const formatDate = d => d.toISOString().slice(0, 10);
    if (formatDate(journalDate) === formatDate(today)) {
      dateLabel = "Hari ini";
    } else {
      const yesterday = new Date(today);
      yesterday.setDate(today.getDate() - 1);
      if (formatDate(journalDate) === formatDate(yesterday)) {
        dateLabel = "Kemarin";
      } else {
        dateLabel = journalDate.toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" });
      }
    }

    // Tag
    let tagsHtml = "";
    if (journal.tags && journal.tags.length > 0) {
      tagsHtml = `<div class="flex mt-2">` +
        journal.tags.map(tag =>
          `<span class="bg-[#E6F2F2] text-xs px-2 py-1 rounded-full mr-2 text-[#333446]">#${tag}</span>`
        ).join("") +
        `</div>`;
    }

    container.innerHTML += `
      <div class="border-b border-[#E6F2F2] pb-4">
        <div class="flex justify-between items-start mb-1">
          <h4 class="font-medium text-[#333446]">${journal.title || "(Tanpa Judul)"}</h4>
          <span class="text-xs text-[#758b96]">${dateLabel}</span>
        </div>
        <p class="text-sm text-[#758b96] line-clamp-2">${journal.content ? journal.content.substring(0, 120) : ""}${journal.content && journal.content.length > 120 ? "..." : ""}</p>
        ${tagsHtml}
      </div>
    `;
  });
}

document.addEventListener("DOMContentLoaded", () => {
  renderRecentJournals();
});

// Update recent journals if localStorage changes (from other tab or after save)
window.addEventListener("storage", function(e) {
  if (e.key === "journals") {
    renderRecentJournals();
  }
});