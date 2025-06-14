/* ========= 1.  GLOBALS & STORAGE HELPERS  ============================ */
let weeklyMoodChart, moodDistChart;
let moodEntries = loadJSON('moodEntries', []);       // [{date:'YYYY-MM-DD', mood:3, note:'…'}]

function loadJSON (key, fallback) {
  try { return JSON.parse(localStorage.getItem(key)) ?? fallback; }
  catch (_){ return fallback; }
}
function saveJSON (key, val) {
  localStorage.setItem(key, JSON.stringify(val));
}

/* ========= 2.  ENTRY CRUD  ========================================== */
function addMoodEntry (moodVal, noteText) {
  const today = new Date();
  const dateStr = today.toISOString().slice(0,10);   // YYYY-MM-DD

  /* Replace existing entry for today (one per day) */
  moodEntries = moodEntries.filter(e => e.date !== dateStr);
  moodEntries.push({ date: dateStr, mood: moodVal, note: noteText.trim() });
  saveJSON('moodEntries', moodEntries);
}

/* ========= 3.  DERIVED DATA  ======================================== */
function getWeeklySeries () {
  const data   = [];
  const labels = [];
  const today  = new Date();

  for (let i = 6; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(today.getDate() - i);

    const dayLabel = d.toLocaleDateString('id-ID', { weekday: 'short' }); // Sen, Sel, …
    labels.push(dayLabel);

    const dateKey  = d.toISOString().slice(0,10);
    const entryForDay = moodEntries.find(e => e.date === dateKey);
    data.push(entryForDay ? entryForDay.mood : null);                   // null = gap
  }
  return { labels, data };
}

function getDistributionCounts () {
  const counts = [0,0,0,0,0]; // [Sangat Baik … Sangat Buruk]
  moodEntries.forEach(e => { counts[5 - e.mood] += 1; });
  return counts;
}

/* ========= 4.  RENDER CHARTS  ======================================= */
function initMoodCharts () {
  const { labels, data } = getWeeklySeries();
  const distData         = getDistributionCounts();

  const weeklyCtx = document.getElementById('weeklyMoodChart');
  const distCtx   = document.getElementById('moodDistributionChart');

  /* ---- LINE (create or update) ---- */
  if (weeklyMoodChart) {
    weeklyMoodChart.data.labels             = labels;
    weeklyMoodChart.data.datasets[0].data   = data;
    weeklyMoodChart.update();
  } else {
    weeklyMoodChart = new Chart(weeklyCtx, {
      type : 'line',
      data : {
        labels,
        datasets: [{
          label              : 'Mood',
          data,
          borderColor        : 'rgba(74, 144, 226, 1)',
          backgroundColor    : 'rgba(74, 144, 226, 0.2)',
          tension            : 0.4,
          pointRadius        : 5,
          fill               : true
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          y: { min: 1, max: 5, ticks: { stepSize: 1 } },
          x: { grid: { display: false } }
        },
        plugins: { legend:{display:false} }
      }
    });
  }

  /* ---- DOUGHNUT (create or update) ---- */
  if (moodDistChart) {
    moodDistChart.data.datasets[0].data = distData;
    moodDistChart.update();
  } else {
    moodDistChart = new Chart(distCtx, {
      type : 'doughnut',
      data : {
        labels  : ['Sangat Baik','Baik','Netral','Buruk','Sangat Buruk'],
        datasets: [{
          data: distData,
          backgroundColor: [
            'rgba(100, 200, 100, 0.7)',
            'rgba(150, 200, 150, 0.7)',
            'rgba(200, 200, 100, 0.7)',
            'rgba(250, 150, 100, 0.7)',
            'rgba(250, 100, 100, 0.7)'
          ],
          borderWidth: 0
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        cutout: '70%',
        plugins: { legend: { position:'right' } }
      }
    });
  }
}

/* ========= 5.  MOOD HISTORY LIST  (table version)  ================== */
function renderMoodHistory () {
  const tbody = document.getElementById('moodHistoryBody');
  if (!tbody) return;                         // element not found – bail

  const emoji  = ['😭','😞','😐','😊','😁'];   // index 0 → mood 1
  const label  = ['Sangat Buruk','Buruk','Netral','Baik','Sangat Baik'];

  const rowsHtml = [...moodEntries]           // clone so we can sort
    .sort((a,b)=> b.date.localeCompare(a.date))   // newest first
    .map(e => {
      const d        = new Date(e.date);
      const dateNice = d.toLocaleDateString('id-ID',
                       { day:'2-digit', month:'short', year:'numeric' });
      const i        = e.mood - 1;            // 1-based → 0-based
      const note     = e.note || '';

      return `
        <tr>
          <td class="py-3 text-sm">${dateNice}</td>
          <td class="py-3">
            <div class="flex items-center">
              <span class="text-2xl mr-2">${emoji[i]}</span>
              <span>${label[i]}</span>
            </div>
          </td>
          <td class="py-3 text-sm text-gray-600">${note}</td>
          <td class="py-3 text-right"></td>
        </tr>`;
    })
    .join('');

  tbody.innerHTML = rowsHtml ||
    '<tr><td colspan="4" class="py-3 text-sm text-gray-500">Belum ada data</td></tr>';
}

/* ========= 6.  INITIALISATION  ======================================= */
document.addEventListener('DOMContentLoaded', () => {
  const moodRadios  = document.querySelectorAll('input[name="todayMood"]');
  const saveBtn     = document.getElementById('saveMoodBtn');

  /* --- enable Save only when a mood picked --- */
  moodRadios.forEach(r => r.addEventListener('change', () => { saveBtn.disabled = false; }));

  /* --- Save handler: add entry → refresh UI --- */
  saveBtn.addEventListener('click', () => {
    const sel      = document.querySelector('input[name="todayMood"]:checked');
    const noteText = document.getElementById('moodNote').value;

    if (!sel) { alert('Silakan pilih mood kamu hari ini'); return; }

    addMoodEntry(+sel.value, noteText);
    initMoodCharts();             // redraw both charts
    renderMoodHistory();          // refresh list

    alert('Mood kamu hari ini berhasil disimpan!');

    /* Reset form */
    sel.checked = false;
    document.getElementById('moodNote').value = '';
    saveBtn.disabled = true;
  });

  /* --- first paint --- */
  initMoodCharts();
  renderMoodHistory();
});

/* ========= 7.  YOUR EXISTING MODAL & PROFILE CODE  (unchanged) ======= */
/* … keep everything you already had for modal pop-ups and profile name … */
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