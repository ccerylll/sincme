// Constants
const API_URL = 'http://localhost:8080/api';

const moodEmojis = {
  "TENANG": "😊",
  "BAHAGIA": "😄",
  "CEMAS": "😟",
  "SEDIH": "😢",
  "FOKUS": "🎯"
};

// Utility Functions
function getAuthToken() {
  const token = localStorage.getItem('token');
  if (!token) {
    window.location.href = 'login.html';
    return null;
  }
  return token.startsWith('Bearer ') ? token : `Bearer ${token}`;
}

function showAlert(type, message) {
  alert(message); // You can replace this with a better UI notification
}

function updateProfileLabel() {
  const name = localStorage.getItem("name");
  const profileLabel = document.getElementById("profileSidebarLabel");
  if (profileLabel) {
    if (name && name.trim() !== "") {
      if(name.length > 15) {
        profileLabel.textContent = name.substring(0, 15) + '...';
      } else {
        profileLabel.textContent = name;
      }
    } else {
      profileLabel.textContent = "Profile";
    }
  }
}

// API Functions
async function fetchProfile() {
  try {
    const response = await fetch(`${API_URL}/profiles/me`, {
      method: 'GET',
      headers: {
        'Authorization': getAuthToken(),
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to fetch profile');
    }

    const profile = await response.json();
    console.log('Fetched profile:', profile); // Debug log
    return profile;
  } catch (error) {
    console.error('Error fetching profile:', error);
    showAlert('error', error.message || 'Failed to load profile');
    return null;
  }
}

async function updateProfile(profileData) {
  try {
    // Convert status string to proper enum format
    const status = profileData.status.toUpperCase();
    
    // Format data according to ProfileDTO structure
    const formattedData = {
      name: profileData.name,
      bio: profileData.bio || "",
      status: status,
      email: profileData.email
    };

    console.log('Sending update:', formattedData); // Debug log

    const response = await fetch(`${API_URL}/profiles/update`, {
      method: 'PUT',
      headers: {
        'Authorization': getAuthToken(),
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(formattedData)
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to update profile');
    }

    const updatedProfile = await response.json();
    console.log('Update response:', updatedProfile); // Debug log
    return updatedProfile;
  } catch (error) {
    console.error('Error updating profile:', error);
    throw error;
  }
}

async function uploadAvatar(file) {
  try {
    const formData = new FormData();
    formData.append('file', file);

    const response = await fetch(`${API_URL}/profiles/avatar`, {
      method: 'POST',
      headers: {
        'Authorization': getAuthToken()
      },
      body: formData
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to upload avatar');
    }

    return await response.json();
  } catch (error) {
    console.error('Error uploading avatar:', error);
    throw error;
  }
}

// Event Handlers
document.addEventListener("DOMContentLoaded", async () => {
  try {
    // Update mood select options
    const moodSelect = document.getElementById("mood");
    moodSelect.innerHTML = Object.keys(moodEmojis).map(mood => 
      `<option value="${mood}">${mood.charAt(0) + mood.slice(1).toLowerCase()}</option>`
    ).join('');

    const profile = await fetchProfile();
    
    if (profile) {
      // Set form values
      document.getElementById("name").value = profile.name || "";
      document.getElementById("email").value = profile.email || "";
      document.getElementById("bio").value = profile.bio || "";
      document.getElementById("mood").value = profile.status || "TENANG";

      // Set display values
      document.getElementById("displayName").textContent = profile.name || "User";
      document.getElementById("displayEmail").textContent = profile.email || "user@email.com";
      document.getElementById("moodStatus").textContent = 
        `"Saat ini kamu merasa: ${moodEmojis[profile.status] || ''} ${profile.status ? profile.status.toLowerCase() : 'Tenang'}"`;

      // Set avatar
      if (profile.profilePhotoUrl) {
        document.getElementById("avatarPreview").innerHTML = 
          `<img src="${profile.profilePhotoUrl}" class="w-full h-full object-cover rounded-full" alt="Avatar">`;
      } else {
        document.getElementById("avatarPreview").textContent = 
          (profile.name || "A").charAt(0).toUpperCase();
      }

      // Set last updated
      if (profile.updatedAt) {
        const lastUpdate = new Date(profile.updatedAt).toLocaleString("id-ID");
        document.getElementById("lastUpdated").textContent = `Terakhir diperbarui: ${lastUpdate}`;
      }

      // Store in localStorage for sidebar
      localStorage.setItem("name", profile.name);
      updateProfileLabel();
    }

    // Set random fun fact
    const facts = [
      "Kamu hebat, jangan menyerah ya!",
      "Istirahat juga bagian dari produktivitas.",
      "Senyuman kecil bisa bikin hari lebih baik 😊",
      "Hari yang buruk bukan berarti hidupmu buruk.",
      "Kamu lebih kuat dari yang kamu pikirkan!"
    ];
    document.getElementById("randomFact").textContent = 
      facts[Math.floor(Math.random() * facts.length)];

  } catch (error) {
    console.error('Error during initialization:', error);
    showAlert('error', 'Failed to load profile data');
  }
});

// Form Controls
document.getElementById("editBtn").addEventListener("click", () => {
  document.getElementById("profileForm").classList.toggle("hidden");
});

document.getElementById("cancelBtn").addEventListener("click", () => {
  document.getElementById("profileForm").classList.add("hidden");
});

// Avatar Upload Handler
document.getElementById("avatarInput").addEventListener("change", async function() {
  const file = this.files[0];
  if (!file) return;

  try {
    const result = await uploadAvatar(file);
    if (result.profilePhotoUrl) {
      document.getElementById("avatarPreview").innerHTML = 
        `<img src="${result.profilePhotoUrl}" class="w-full h-full object-cover rounded-full" alt="Avatar">`;
      showAlert('success', 'Avatar updated successfully');
    }
  } catch (error) {
    showAlert('error', 'Failed to upload avatar. Please try again.');
  }
});

// Form Submission Handler
document.getElementById("profileForm").addEventListener("submit", async function(e) {
  e.preventDefault();
  
  const submitButton = this.querySelector('button[type="submit"]');
  const originalText = submitButton.textContent;
  
  try {
    submitButton.textContent = 'Menyimpan...';
    submitButton.disabled = true;

    const name = document.getElementById("name").value.trim();
    const email = document.getElementById("email").value.trim();
    const bio = document.getElementById("bio").value.trim();
    const mood = document.getElementById("mood").value;

    if (!name || !email || !mood) {
      throw new Error("Nama, Email, dan Mood harus diisi!");
    }

    const profileData = {
      name,
      email,
      bio,
      status: mood
    };

    console.log('Submitting profile data:', profileData); // Debug log

    const updatedProfile = await updateProfile(profileData);
    
    if (updatedProfile) {
      // Update display
      document.getElementById("displayName").textContent = updatedProfile.name;
      document.getElementById("displayEmail").textContent = updatedProfile.email;
      document.getElementById("moodStatus").textContent = 
        `"Saat ini kamu merasa: ${moodEmojis[updatedProfile.status] || ''} ${updatedProfile.status.toLowerCase()}"`;

      // Update localStorage for sidebar
      localStorage.setItem("name", updatedProfile.name);
      updateProfileLabel();

      // Update last modified
      const now = new Date().toLocaleString("id-ID");
      document.getElementById("lastUpdated").textContent = `Terakhir diperbarui: ${now}`;

      // Hide form and show success message
      document.getElementById("profileForm").classList.add("hidden");
      showAlert('success', 'Profile berhasil diperbarui!');
    }
  } catch (error) {
    console.error('Error:', error);
    showAlert('error', error.message || 'Gagal memperbarui profile. Silakan coba lagi.');
  } finally {
    submitButton.textContent = originalText;
    submitButton.disabled = false;
  }
});

// Storage Event Handler
window.addEventListener("storage", function(e) {
  if (e.key === "name") {
    updateProfileLabel();
  }
});

// Draft Saving
["name", "email", "bio", "mood"].forEach((field) => {
  const input = document.getElementById(field);
  input.addEventListener("input", () => {
    localStorage.setItem(`draft_${field}`, input.value);
  });
});