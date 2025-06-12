// Journal functionality (complementary to the inline script)
document.addEventListener('DOMContentLoaded', function() {
    function formatJournalDate(dateStr) {
        const date = new Date(dateStr);
        const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
        return date.toLocaleDateString('id-ID', options);
    }
    
    // Make this function available globally if needed
    window.formatJournalDate = formatJournalDate;
});

 // Journal Application
        document.addEventListener('DOMContentLoaded', function() {
            // Initialize journal app
            const journalApp = {
                currentDate: new Date(),
                currentMonth: new Date().getMonth(),
                currentYear: new Date().getFullYear(),
                selectedDate: null,
                selectedJournal: null,
                journals: JSON.parse(localStorage.getItem('journals')) || [],
                
                // Initialize the app
                init: function() {
                    this.renderCalendar();
                    this.renderJournals();
                    this.setupEventListeners();
                },
                
                // Render calendar
                renderCalendar: function() {
                    const monthNames = ["Januari", "Februari", "Maret", "April", "Mei", "Juni", 
                                       "Juli", "Agustus", "September", "Oktober", "November", "Desember"];
                    document.getElementById('currentMonthYear').textContent = 
                        `${monthNames[this.currentMonth]} ${this.currentYear}`;
                    
                    // Get first day of month and total days in month
                    const firstDay = new Date(this.currentYear, this.currentMonth, 1).getDay();
                    const daysInMonth = new Date(this.currentYear, this.currentMonth + 1, 0).getDate();
                    
                    // Adjust first day (Monday = 0)
                    const adjustedFirstDay = (firstDay + 6) % 7;
                    
                    // Clear calendar
                    const calendarDays = document.getElementById('calendarDays');
                    calendarDays.innerHTML = '';
                    
                    // Add empty cells for days before the first day of the month
                    for (let i = 0; i < adjustedFirstDay; i++) {
                        calendarDays.appendChild(document.createElement('div')).className = 'h-10';
                    }
                    
                    // Add days of the month
                    for (let i = 1; i <= daysInMonth; i++) {
                        const dayElement = document.createElement('div');
                        dayElement.className = 'h-10 flex items-center justify-center rounded-full hover:bg-[#F2F2F2] cursor-pointer calendar-day';
                        dayElement.textContent = i;
                        
                        // Check if this date has any journal entries
                        const dateStr = `${this.currentYear}-${String(this.currentMonth + 1).padStart(2, '0')}-${String(i).padStart(2, '0')}`;
                        const hasEntry = this.journals.some(journal => journal.date === dateStr);
                        
                        if (hasEntry) {
                            dayElement.classList.add('has-entry');
                        }
                        
                        // Highlight today
                        const today = new Date();
                        if (this.currentYear === today.getFullYear() && 
                            this.currentMonth === today.getMonth() && 
                            i === today.getDate()) {
                            dayElement.classList.add('bg-[#B8CFCE]', 'text-[#333446]', 'font-medium');
                        }
                        
                        // Add click event
                        dayElement.addEventListener('click', () => {
                            this.selectedDate = new Date(this.currentYear, this.currentMonth, i);
                            this.renderJournals();
                        });
                        
                        calendarDays.appendChild(dayElement);
                    }
                },
                
                // Render journal entries
                renderJournals: function() {
                    const journalEntries = document.getElementById('journalEntries');
                    const noEntriesMessage = document.getElementById('noEntriesMessage');
                    
                    // Filter journals based on selected date or show all
                    let filteredJournals = [];
                    if (this.selectedDate) {
                        const dateStr = this.formatDate(this.selectedDate);
                        filteredJournals = this.journals.filter(journal => journal.date === dateStr);
                    } else {
                        filteredJournals = [...this.journals].reverse(); // Show latest first
                    }
                    
                    // Clear existing entries
                    journalEntries.innerHTML = '';
                    
                    if (filteredJournals.length === 0) {
                        noEntriesMessage.classList.remove('hidden');
                        journalEntries.classList.add('hidden');
                    } else {
                        noEntriesMessage.classList.add('hidden');
                        journalEntries.classList.remove('hidden');
                        
                        filteredJournals.forEach(journal => {
                            const moodColors = {
                                1: 'text-red-500',
                                2: 'text-orange-500',
                                3: 'text-yellow-500',
                                4: 'text-green-500',
                                5: 'text-blue-500'
                            };
                            const moodTexts = {
                                1: 'Sangat Buruk',
                                2: 'Buruk',
                                3: 'Netral',
                                4: 'Baik',
                                5: 'Sangat Baik'
                            };
                            
                            const [year, month, day] = journal.date.split('-');
                            const entryDate = new Date(year, month - 1, day); // Lokal timezone, tanpa offset UTC

                            const today = new Date();
                            const yesterday = new Date(today);
                            yesterday.setDate(yesterday.getDate() - 1);
                            
                            let dateDisplay;
                            if (this.formatDate(entryDate) === this.formatDate(today)) {
                                dateDisplay = 'Hari ini';
                            } else if (this.formatDate(entryDate) === this.formatDate(yesterday)) {
                                dateDisplay = 'Kemarin';
                            } else {
                                const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
                                dateDisplay = entryDate.toLocaleDateString('id-ID', options);
                            }
                            
                            const journalElement = document.createElement('div');
                            journalElement.className = 'journal-entry bg-white rounded-xl p-6 shadow-sm';
                            journalElement.innerHTML = `
                                <div class="flex justify-between items-start mb-2">
                                    <h3 class="text-lg font-medium">${journal.title}</h3>
                                    <div class="flex space-x-2">
                                        <button class="edit-journal text-gray-400 hover:text-[#4A90E2]" data-id="${journal.id}">
                                            <i class="fas fa-edit"></i>
                                        </button>
                                        <button class="delete-journal text-gray-400 hover:text-red-500" data-id="${journal.id}">
                                            <i class="fas fa-trash"></i>
                                        </button>
                                    </div>
                                </div>
                                <div class="flex items-center text-sm text-gray-500 mb-3">
                                    <span>${dateDisplay}</span>
                                    <span class="mx-2">•</span>
                                    <span>Mood: <span class="font-medium ${moodColors[journal.mood]}">${moodTexts[journal.mood]}</span></span>
                                </div>
                                <p class="text-gray-700 mb-3">${journal.content}</p>
                                ${journal.tags.length > 0 ? `
                                <div class="flex flex-wrap gap-2 mb-3">
                                    ${journal.tags.map(tag => `
                                        <span class="bg-[#F2F2F2] text-xs px-2 py-1 rounded-full">#${tag}</span>
                                    `).join('')}
                                </div>
                                ` : ''}
                                <div class="flex justify-between items-center">
                                    <button class="bookmark-journal ${journal.bookmarked ? 'text-[#4A90E2]' : 'text-gray-400 hover:text-[#4A90E2]'}" data-id="${journal.id}">
                                        <i class="${journal.bookmarked ? 'fas' : 'far'} fa-bookmark"></i>
                                    </button>
                                </div>
                            `;
                            journalEntries.appendChild(journalElement);
                        });
                        
                        // Add event listeners to the buttons
                        this.addJournalEventListeners();
                    }
                },
                
                // Add event listeners to journal buttons
                addJournalEventListeners: function() {
                    document.querySelectorAll('.edit-journal').forEach(button => {
                        button.addEventListener('click', (e) => {
                            const journalId = button.getAttribute('data-id');

                            this.editJournal(journalId);
                        });
                    });
                    
                    document.querySelectorAll('.delete-journal').forEach(button => {
                        button.addEventListener('click', (e) => {
                            const journalId = button.getAttribute('data-id');

                            this.showDeleteModal(journalId);
                        });
                    });
                    
                    document.querySelectorAll('.bookmark-journal').forEach(button => {
                        button.addEventListener('click', (e) => {
                            const journalId = button.getAttribute('data-id');

                            this.toggleBookmark(journalId);
                        });
                    });
                },
                
                // Format date as YYYY-MM-DD
             formatDate: function(date) {
                const year = date.getFullYear();
                const month = String(date.getMonth() + 1).padStart(2, '0');
                const day = String(date.getDate()).padStart(2, '0');
                return `${year}-${month}-${day}`;
            },

                
                // Show new journal modal
                showNewJournalModal: function() {
                    document.getElementById('modalTitle').textContent = 'Journal Baru';
                    document.getElementById('journalForm').reset();
                    document.getElementById('journalId').value = '';
                    document.getElementById('journalDate').value = this.formatDate(new Date());
                    document.getElementById('journalModal').classList.remove('hidden');
                },
                
                // Show edit journal modal
                editJournal: function(journalId) {
                    const journal = this.journals.find(j => j.id === journalId);
                    if (journal) {
                        this.selectedJournal = journal;
                        document.getElementById('modalTitle').textContent = 'Edit Journal';
                        document.getElementById('journalId').value = journal.id
                        document.getElementById('journalDate').value = journal.date;
                        document.getElementById('journalTitle').value = journal.title;
                        document.getElementById('journalContent').value = journal.content;
                        document.querySelector(`input[name="mood"][value="${journal.mood}"]`).checked = true;
                        document.getElementById('journalTags').value = journal.tags.join(', ');
                        document.getElementById('journalModal').classList.remove('hidden');
                    }
                },
                
                // Show delete confirmation modal
                showDeleteModal: function(journalId) {
                    this.selectedJournal = this.journals.find(j => j.id === journalId);
                    document.getElementById('deleteModal').classList.remove('hidden');
                },
                
                // Save journal (create or update)
                saveJournal: function() {
                    const id = document.getElementById('journalId').value;
                    const date = document.getElementById('journalDate').value;
                    const title = document.getElementById('journalTitle').value.trim();
                    const content = document.getElementById('journalContent').value.trim();
                    const mood = document.querySelector('input[name="mood"]:checked')?.value;
                    const tags = document.getElementById('journalTags').value
                        .split(',')
                        .map(tag => tag.trim())
                        .filter(tag => tag.length > 0);
                    
                    // Validate
                    if (!date || !title || !content || !mood) {
                        alert('Harap isi semua field yang diperlukan');
                        return false;
                    }
                    
                    if (id) {
                        // Update existing journal
                        const index = this.journals.findIndex(j => j.id === id);
                        if (index !== -1) {
                            this.journals[index] = {
                                ...this.journals[index],
                                date,
                                title,
                                content,
                                mood: parseInt(mood),
                                tags
                            };
                        }
                    } else {
                        // Create new journal
                        const newJournal = {
                            id: Date.now().toString(),
                            date,
                            title,
                            content,
                            mood: parseInt(mood),
                            tags,
                            bookmarked: false,
                            createdAt: new Date().toISOString()
                        };
                        this.journals.push(newJournal);
                    }
                    
                    // Save to localStorage
                    localStorage.setItem('journals', JSON.stringify(this.journals));
                    
                    // Refresh UI
                    this.renderCalendar();
                    this.renderJournals();
                    this.closeModal();
                    
                    return true;
                },
                
                // Delete journal
                deleteJournal: function() {
                    this.journals = this.journals.filter(j => j.id !== this.selectedJournal.id);
                    localStorage.setItem('journals', JSON.stringify(this.journals));
                    this.renderCalendar();
                    this.renderJournals();
                    this.closeDeleteModal();
                },
                
                // Toggle bookmark
                toggleBookmark: function(journalId) {
                    const index = this.journals.findIndex(j => j.id === journalId);
                    if (index !== -1) {
                        this.journals[index].bookmarked = !this.journals[index].bookmarked;
                        localStorage.setItem('journals', JSON.stringify(this.journals));
                        this.renderJournals();
                    }
                },
                
                // Close modal
                closeModal: function() {
                    document.getElementById('journalModal').classList.add('hidden');
                    this.selectedJournal = null;
                },
                
                // Close delete modal
                closeDeleteModal: function() {
                    document.getElementById('deleteModal').classList.add('hidden');
                    this.selectedJournal = null;
                },
                
                // Change month
                changeMonth: function(delta) {
                    this.currentMonth += delta;
                    if (this.currentMonth > 11) {
                        this.currentMonth = 0;
                        this.currentYear++;
                    } else if (this.currentMonth < 0) {
                        this.currentMonth = 11;
                        this.currentYear--;
                    }
                    this.renderCalendar();
                },
                
                // Setup event listeners`   
                setupEventListeners: function() {
                    // New journal button
                    document.getElementById('newJournalBtn').addEventListener('click', () => this.showNewJournalModal());
                    document.getElementById('createFirstJournal').addEventListener('click', () => this.showNewJournalModal());
                    
                    // Modal buttons
                    document.getElementById('closeJournalModal').addEventListener('click', () => this.closeModal());
                    document.getElementById('cancelJournal').addEventListener('click', () => this.closeModal());

                    // Delete confirmation modal buttons
                    document.getElementById('confirmDelete').addEventListener('click', () => this.deleteJournal());
                    document.getElementById('cancelDelete').addEventListener('click', () => this.closeDeleteModal());
                    document.getElementById('closeDeleteModal').addEventListener('click', () => this.closeDeleteModal());
   
                    // Form submission
                    document.getElementById('journalForm').addEventListener('submit', (e) => {
                        e.preventDefault();
                        this.saveJournal();
                    });
                    
                    // Calendar navigation
                    document.getElementById('prevMonth').addEventListener('click', () => this.changeMonth(-1));
                    document.getElementById('nextMonth').addEventListener('click', () => this.changeMonth(1));
                    
                    // Mood selection
                    document.querySelectorAll('.mood-option').forEach(option => {
                        option.addEventListener('click', (e) => {
                            const radio = e.currentTarget.previousElementSibling;
                            radio.checked = true;
                            
                            // Update visual selection
                            document.querySelectorAll('.mood-option').forEach(opt => {
                                opt.classList.remove('ring-2', 'ring-current');
                            });
                            e.currentTarget.classList.add('ring-2', 'ring-current');
                        });
                    });
                }
            };
            
            // Initialize the app
            journalApp.init();
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
  
// Update label jika localStorage berubah (misal dari tab lain)
window.addEventListener("storage", function(e) {
    if (e.key === "name") {
        updateProfileLabel();
    }
});
