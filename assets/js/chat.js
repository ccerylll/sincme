document.addEventListener('DOMContentLoaded', function() {
            // Set focus to input when page loads
            document.getElementById('messageInput').focus();
        });
        
        function sendMessage() {
            const input = document.getElementById('messageInput');
            const message = input.value.trim();
            
            if (message) {
                // Add user message to chat
                addMessageToChat(message, 'user');
                input.value = '';
                
                // Simulate bot thinking
                showTypingIndicator();
                
                // Simulate bot response after delay
                setTimeout(() => {
                    removeTypingIndicator();
                    generateBotResponse(message);
                }, 1000 + Math.random() * 1000);
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
        
        function generateBotResponse(userMessage) {
            const lowerCaseMessage = userMessage.toLowerCase();
            let response = '';
            
            if (lowerCaseMessage.includes('halo') || lowerCaseMessage.includes('hai') || 
                lowerCaseMessage.includes('hi')) {
                response = "Halo juga! Senang bisa berbicara dengan Anda. Ada yang bisa saya bantu hari ini? 😊";
            } 
            else if (lowerCaseMessage.includes('terima kasih') || lowerCaseMessage.includes('makasih')) {
                response = "Sama-sama! Saya selalu siap membantu Anda kapan pun. 😊";
            }
            else if (lowerCaseMessage.includes('cemas') || lowerCaseMessage.includes('gelisah') || 
                     lowerCaseMessage.includes('khawatir')) {
                response = "Saya mengerti perasaan cemas bisa sangat tidak nyaman. Coba tarik napas dalam-dalam selama 4 detik, tahan selama 4 detik, lalu hembuskan selama 6 detik. Ulangi beberapa kali. Ini dapat membantu menenangkan sistem saraf Anda. 💆‍♀️";
            }
            else if (lowerCaseMessage.includes('sedih') || lowerCaseMessage.includes('murung') || 
                     lowerCaseMessage.includes('down') || lowerCaseMessage.includes('depresi')) {
                response = "Saya turut prihatin mendengar Anda merasa sedih. Ingatlah bahwa perasaan ini bersifat sementara. Mungkin Anda bisa mencoba menuliskan perasaan Anda di jurnal atau mendengarkan musik yang menenangkan. 🎵";
            }
            else if (lowerCaseMessage.includes('stres') || lowerCaseMessage.includes('tekanan')) {
                response = "Stres adalah reaksi normal, tetapi penting untuk mengelolanya. Coba teknik 5-4-3-2-1: sebutkan 5 hal yang bisa Anda lihat, 4 yang bisa Anda sentuh, 3 yang bisa Anda dengar, 2 yang bisa Anda cium, dan 1 yang bisa Anda rasakan. Ini bisa membantu membawa Anda kembali ke saat ini. 🌿";
            }
            else if (lowerCaseMessage.includes('relaksasi') || lowerCaseMessage.includes('santai') || 
                     lowerCaseMessage.includes('tenang')) {
                response = "Coba teknik relaksasi otot progresif: tegangkan dan kendurkan setiap kelompok otot mulai dari kaki hingga kepala. Atau coba meditasi singkat 5 menit: fokus pada napas dan biarkan pikiran datang dan pergi tanpa menghakimi. 🧘‍♀️";
            }
            else if (lowerCaseMessage.includes('tidur') || lowerCaseMessage.includes('insomnia')) {
                response = "Masalah tidur sering terkait dengan stres. Coba buat rutinitas tidur yang konsisten, hindari layar 1 jam sebelum tidur, dan ciptakan lingkungan yang tenang. Teh chamomile juga bisa membantu. 😴";
            }
            else if (lowerCaseMessage.includes('motivasi') || lowerCaseMessage.includes('semangat')) {
                response = "Ingatlah bahwa setiap hari adalah kesempatan baru. Anda lebih kuat dari yang Anda kira. Jangan mengukur kemajuan Anda dengan standar orang lain. Setiap langkah kecil itu penting! 💪";
            }
            else {
                // Default responses
                const defaultResponses = [
                    "Saya mengerti. Bisa Anda ceritakan lebih banyak tentang perasaan Anda?",
                    "Terima kasih telah berbagi. Apa yang sedang Anda pikirkan saat ini?",
                    "Saya di sini untuk mendengarkan. Apakah ada hal spesifik yang ingin Anda bicarakan?",
                    "Setiap perasaan itu valid. Jika Anda nyaman berbagi, saya siap mendengarkan.",
                    "Saya mungkin tidak memiliki semua jawaban, tapi saya bisa membantu Anda menemukan sumber daya yang berguna."
                ];
                response = defaultResponses[Math.floor(Math.random() * defaultResponses.length)];
            }
            
            addMessageToChat(response, 'bot');
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

