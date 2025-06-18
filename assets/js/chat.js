document.addEventListener('DOMContentLoaded', function() {
            // Set focus to input when page loads
            document.getElementById('messageInput').focus();
        });
        
        // Fungsi untuk menangani pengiriman pesan
        function sendMessage() {
        const input = document.getElementById('messageInput');
        const message = input.value.trim();

        if (message) {
            // Tampilkan pesan user ke UI
            addMessageToChat(message, 'user');
            input.value = '';

            // Tampilkan indikator bot sedang mengetik
            showTypingIndicator();

            // Kirim ke backend dan tunggu respons AI
            fetchChatbotResponse(message);
        }
    }

        // Fetch respons dari chatbot
        async function fetchChatbotResponse(message) {
        const token = localStorage.getItem("token");
        const url = `http://localhost:8080/api/chat/single`;

        if (!token) {
            removeTypingIndicator();
            addMessageToChat("Token tidak ditemukan. Silakan login.", 'bot');
            return;
        }

        try {
            const response = await fetch(url, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify({ message })
            });

            if (!response.ok) throw new Error("Respons dari server tidak berhasil");

            const data = await response.json();
            removeTypingIndicator();
            addMessageToChat(data.reply || "Maaf, saya tidak bisa memberikan jawaban saat ini.", 'bot');
        } catch (error) {
            console.error(error);
            removeTypingIndicator();
            addMessageToChat("Maaf, terjadi kesalahan saat menghubungi server.", 'bot');
        }
    }

        function sendSuggestedMessage(message) {
            document.getElementById('messageInput').value = message;
            sendMessage();
        }
        
        function getUserAvatarHtml() {
          const avatar = localStorage.getItem("avatar");
          const name = localStorage.getItem("name") || "A";
          if (avatar) {
            return `<img src="${avatar}" class="w-8 h-8 rounded-full object-cover" alt="Avatar">`;
          } else {
            return `<span class="text-sm font-medium">${name.charAt(0).toUpperCase()}</span>`;
          }
        }
        
        function addMessageToChat(message, sender) {
            const chatMessages = document.getElementById('chatMessages');
            const messageDiv = document.createElement('div');
            
            if (sender === 'user') {
                messageDiv.className = 'flex items-start justify-end space-x-2';
                messageDiv.innerHTML = `
                    <div class="message-bubble user-message">
                        <p>${message}</p>
                    </div>
                    <div class="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
                        ${getUserAvatarHtml()}
                    </div>
                `;
            } else if (sender === 'bot') {
                messageDiv.className = 'flex items-start space-x-2';
                messageDiv.innerHTML = `
                    <div class="w-8 h-8 rounded-full bg-[#E6F2F2] flex items-center justify-center flex-shrink-0">
                        <i class="fas fa-robot text-[#758b96] text-sm"></i>
                    </div>
                    <div class="message-bubble bot-message">
                        <p class="text-gray-800">${message}</p>
                    </div>
                `;
            }
            
            chatMessages.appendChild(messageDiv);
            chatMessages.scrollTop = chatMessages.scrollHeight;
        }
        
        function showTypingIndicator() {
            const chatMessages = document.getElementById('chatMessages');
            const typingDiv = document.createElement('div');
            typingDiv.className = 'flex items-start space-x-2';
            typingDiv.id = 'typingIndicator';
            typingDiv.innerHTML = `
                <div class="w-8 h-8 rounded-full bg-[#E6F2F2] flex items-center justify-center flex-shrink-0">
                    <i class="fas fa-robot text-[#758b96] text-sm"></i>
                </div>
                <div class="message-bubble bot-message typing-indicator">
                    <span></span>
                    <span></span>
                    <span></span>
                </div>
            `;
            
            chatMessages.appendChild(typingDiv);
            chatMessages.scrollTop = chatMessages.scrollHeight;
        }
        
        function removeTypingIndicator() {
            const typingIndicator = document.getElementById('typingIndicator');
            if (typingIndicator) {
                typingIndicator.remove();
            }
        }
        
        const bellBtn = document.querySelector('button i.fa-bell')?.parentElement;
        const popup = document.getElementById('notifPopup');
    
        if (bellBtn && popup) {
            bellBtn.addEventListener('click', () => {
                popup.classList.toggle('hidden');
            });
    
            // Close on outside click
            document.addEventListener('click', (e) => {
                if (!popup.contains(e.target) && !bellBtn.contains(e.target)) {
                    popup.classList.add('hidden');
                }
            });
        }
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

  document.addEventListener("DOMContentLoaded", () => {
    updateProfileLabel();
  });

  // Update label jika localStorage berubah (misal dari tab lain)
  window.addEventListener("storage", function(e) {
    if (e.key === "name") {
        updateProfileLabel();
    }
  });

