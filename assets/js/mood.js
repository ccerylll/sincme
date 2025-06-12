document.addEventListener('DOMContentLoaded', function() {
    // Initialize mood charts
    initMoodCharts();
    
    // Mood selection functionality
    const moodRadios = document.querySelectorAll('input[name="todayMood"]');
    const saveMoodBtn = document.getElementById('saveMoodBtn');
    
    moodRadios.forEach(radio => {
        radio.addEventListener('change', function() {
            saveMoodBtn.disabled = false;
        });
    });
    
    
    // Save mood button click handler
    saveMoodBtn.addEventListener('click', function() {
        const selectedMood = document.querySelector('input[name="todayMood"]:checked');
        const moodNote = document.getElementById('moodNote').value;
        
        if (!selectedMood) {
            alert('Silakan pilih mood kamu hari ini');
            return;
        }
        
        // In a real app, you would save this to a database
        // For now, we'll just show a success message
        alert('Mood kamu hari ini berhasil disimpan!');
        
        if (document.querySelector('input[name="todayMood"]:checked')) {
            document.querySelector('input[name="todayMood"]:checked').checked = false;
        }
        document.getElementById('moodNote').value = '';
        saveMoodBtn.disabled = true;
        
        // Refresh the charts to show new data
        initMoodCharts();
    });
    
    // Modal functionality
    const moodInsightsModal = document.getElementById('moodInsightsModal');
    const closeModalBtn = document.getElementById('closeModalBtn');
    const mengertiMoodBtn = document.getElementById('mengertiMoodBtn');
    
    // In a real app, you might have a button to show insights
    // For demo purposes, we'll show it after 3 seconds
    setTimeout(() => {
        moodInsightsModal.classList.remove('hidden');
    }, 3000);
    
    closeModalBtn.addEventListener('click', function() {
        moodInsightsModal.classList.add('hidden');
    });

    mengertiMoodBtn.addEventListener('click', function() {
        moodInsightsModal.classList.add('hidden');
    });
        
    moodInsightsModal.addEventListener('click', function(e) {
        if (e.target === moodInsightsModal) {
            moodInsightsModal.classList.add('hidden');
        }
    });
});

// Store chart instances globally so we can update them
let weeklyMoodChart, moodDistChart;

function initMoodCharts() {
    // Destroy existing charts if they exist
    if (weeklyMoodChart) {
        weeklyMoodChart.destroy();
    }
    if (moodDistChart) {
        moodDistChart.destroy();
    }
    
    // Weekly Mood Chart
    const weeklyMoodCtx = document.getElementById('weeklyMoodChart');
    weeklyMoodChart = new Chart(weeklyMoodCtx, {
        type: 'line',
        data: {
            labels: ['Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab', 'Min'],
            datasets: [{
                label: 'Mood',
                data: [3, 4, 4.5, 3.5, 2, 3, 4],
                backgroundColor: 'rgba(74, 144, 226, 0.2)',
                borderColor: 'rgba(74, 144, 226, 1)',
                borderWidth: 2,
                tension: 0.4,
                fill: true,
                pointBackgroundColor: 'rgba(74, 144, 226, 1)',
                pointRadius: 5,
                pointHoverRadius: 7
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                y: {
                    beginAtZero: false,
                    min: 1,
                    max: 5,
                    ticks: {
                        stepSize: 1,
                        callback: function(value) {
                            const moods = ['', 'Sangat Buruk', 'Buruk', 'Netral', 'Baik', 'Sangat Baik'];
                            return moods[value];
                        }
                    }
                },
                x: {
                    grid: {
                        display: false
                    }
                }
            },
            plugins: {
                legend: {
                    display: false
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            const moods = ['', 'Sangat Buruk (1)', 'Buruk (2)', 'Netral (3)', 'Baik (4)', 'Sangat Baik (5)'];
                            return moods[Math.round(context.raw)];
                        }
                    }
                }
            }
        }
    });
    
    // Mood Distribution Chart
    const moodDistCtx = document.getElementById('moodDistributionChart');
    moodDistChart = new Chart(moodDistCtx, {
        type: 'doughnut',
        data: {
            labels: ['Sangat Baik', 'Baik', 'Netral', 'Buruk', 'Sangat Buruk'],
            datasets: [{
                data: [3, 8, 5, 2, 1],
                backgroundColor: [
                    'rgba(100, 200, 100, 0.7)',
                    'rgba(150, 200, 150, 0.7)',
                    'rgba(200, 200, 100, 0.7)',
                    'rgba(250, 150, 100, 0.7)',
                    'rgba(250, 100, 100, 0.7)'
                ],
                borderWidth: 0,
                hoverOffset: 10
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'right',
                    labels: {
                        boxWidth: 12,
                        padding: 20,
                        font: {
                            size: 12
                        }
                    }
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            const label = context.label || '';
                            const value = context.raw || 0;
                            const total = context.dataset.data.reduce((a, b) => a + b, 0);
                            const percentage = Math.round((value / total) * 100);
                            return `${label}: ${value} (${percentage}%)`;
                        }
                    }
                }
            },
            cutout: '70%'
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
