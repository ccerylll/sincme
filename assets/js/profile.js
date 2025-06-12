const moodEmojis = {
  "Tenang": "😊",
  "Bahagia": "😄",
  "Cemas": "😟",
  "Sedih": "😢",
  "Fokus": "🎯"
};

const moodLevels = {
  "Tenang": 40,
  "Bahagia": 100,
  "Cemas": 25,
  "Sedih": 10,
  "Fokus": 75
};

// Fungsi untuk update label profil sidebar
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

// Load data dari localStorage ke form dan tampilan
document.addEventListener("DOMContentLoaded", () => {
  const name = localStorage.getItem("name") || "";
  const email = localStorage.getItem("email") || "";
  const bio = localStorage.getItem("bio") || "";
  const mood = localStorage.getItem("mood") || "Tenang";
  const avatar = localStorage.getItem("avatar") || "";

  // Set ke form
  document.getElementById("name").value = name;
  document.getElementById("email").value = email;
  document.getElementById("bio").value = bio;
  document.getElementById("mood").value = mood;

  // Set ke tampilan
  document.getElementById("displayName").textContent = name || "Andini";
  document.getElementById("displayEmail").textContent = email || "andini@email.com";
  document.getElementById("moodStatus").textContent = `“Saat ini kamu merasa: ${moodEmojis[mood] || ''} ${mood}”`;

  updateProfileLabel(); // Sidebar label

  if (avatar) {
    document.getElementById("avatarPreview").innerHTML = `<img src="${avatar}" class="w-full h-full object-cover rounded-full" alt="Avatar">`;
  } else {
    document.getElementById("avatarPreview").textContent = (name || "A").charAt(0).toUpperCase();
  }

  // Tampilkan waktu terakhir update
  const lastUpdate = localStorage.getItem("lastUpdated");
  document.getElementById("lastUpdated").textContent = lastUpdate ? `Terakhir diperbarui: ${lastUpdate}` : "Belum pernah diperbarui";

  // Fun fact
  const facts = [
    "Kamu hebat, jangan menyerah ya!",
    "Istirahat juga bagian dari produktivitas.",
    "Senyuman kecil bisa bikin hari lebih baik 😊",
    "Hari yang buruk bukan berarti hidupmu buruk.",
    "Kamu lebih kuat dari yang kamu pikirkan!"
  ];
  const randomIndex = Math.floor(Math.random() * facts.length);
  document.getElementById("randomFact").textContent = facts[randomIndex];
});


// Update label jika localStorage berubah (misal dari tab lain)
window.addEventListener("storage", function(e) {
  if (e.key === "name") {
    updateProfileLabel();
  }
});

// Toggle form edit
document.getElementById("editBtn").addEventListener("click", () => {
  document.getElementById("profileForm").classList.toggle("hidden");
});

// Cancel edit
document.getElementById("cancelBtn").addEventListener("click", () => {
  document.getElementById("profileForm").classList.add("hidden");
});

// Preview avatar dari input file
document.getElementById("avatarInput").addEventListener("change", function () {
  const file = this.files[0];
  const reader = new FileReader();
  reader.onload = function (e) {
    const dataUrl = e.target.result;
    localStorage.setItem("avatar", dataUrl);
    document.getElementById("avatarPreview").innerHTML = `<img src="${dataUrl}" class="w-full h-full object-cover rounded-full" alt="Avatar">`;
  };
  if (file) reader.readAsDataURL(file);
});

// Form submit: validasi dan simpan data
document.getElementById("profileForm").addEventListener("submit", function (e) {
  e.preventDefault();
  const name = document.getElementById("name").value.trim();
  const email = document.getElementById("email").value.trim();
  const bio = document.getElementById("bio").value.trim();
  const mood = document.getElementById("mood").value.trim();

  if (!name || !email || !bio || !mood) {
    alert("Semua kolom harus diisi!");
    return;
  }

  localStorage.setItem("name", name);
  localStorage.setItem("email", email);
  localStorage.setItem("bio", bio);
  localStorage.setItem("mood", mood);

  document.getElementById("displayName").textContent = name;
  document.getElementById("displayEmail").textContent = email;
  document.getElementById("moodStatus").textContent = `“Saat ini kamu merasa: ${moodEmojis[mood] || ''} ${mood}”`;

  // Update label "Profile" di sidebar
  updateProfileLabel(); // update sidebar label langsung setelah simpan

  // Update waktu terakhir diperbarui
  const now = new Date().toLocaleString("id-ID");
  localStorage.setItem("lastUpdated", now);
  document.getElementById("lastUpdated").textContent = `Terakhir diperbarui: ${now}`;

  document.getElementById("profileForm").classList.add("hidden");
});

// Simpan setiap input ke draft localStorage
["name", "email", "bio", "mood"].forEach((field) => {
  const input = document.getElementById(field);
  input.addEventListener("input", () => {
    localStorage.setItem(`draft_${field}`, input.value);
  });
});
