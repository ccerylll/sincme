/* ========= 1.  GLOBALS & STORAGE HELPERS  ============================ */
let weeklyMoodChart, moodDistChart;
let currentWeekOffset = 0; // 0 = minggu ini, -1 = minggu lalu, dst

function loadJSON (key, fallback) {
  try { return JSON.parse(localStorage.getItem(key)) ?? fallback; }
  catch (_){ return fallback; }
}
function saveJSON (key, val) {
  localStorage.setItem(key, JSON.stringify(val));
}

/* ========= 2.  ENTRY CRUD  ========================================== */
async function addMoodEntry(moodVal, noteText) {
  const token = localStorage.getItem("token");
  if (!token) {
    alert("Kamu belum login.");
    return;
  }

  const today = new Date();
  const moodDate = today.toISOString().slice(0, 10); // YYYY-MM-DD

  try {
    const response = await fetch("http://localhost:8080/api/mood", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      },
      body: JSON.stringify({
        moodDate: moodDate,
        moodValue: moodVal,
        note: noteText.trim()
      })
    });

    if (response.status === 409) {
      alert("Mood hari ini sudah disimpan sebelumnya.");
      return;
    } else if (!response.ok) {
      alert("Gagal menyimpan mood. Silakan coba lagi.");
      throw new Error("Gagal simpan mood");
    }

    const result = await response.json();
    console.log("Mood tersimpan:", result);
  } catch (error) {
    console.error("Gagal simpan mood:", error);
  }
}

/* ========= 3.  DERIVED DATA  ======================================== */
async function getWeeklySeries(weekOffset = 0) {
  const token = localStorage.getItem("token");
  if (!token) return { labels: [], data: [] };

  const today = new Date();
  const day = today.getDay(); // 0 = Minggu, 1 = Senin, ...
  const monday = new Date(today);
  monday.setDate(today.getDate() - ((day + 6) % 7) + (weekOffset * 7));
  const sunday = new Date(monday);
  sunday.setDate(monday.getDate() + 6);

  const startDate = monday.toISOString().slice(0, 10);
  const endDate = sunday.toISOString().slice(0, 10);

  try {
    const response = await fetch(`http://localhost:8080/api/mood/weekly?startDate=${startDate}&endDate=${endDate}`, {
      headers: {
        "Authorization": `Bearer ${token}`
      }
    });

    if (!response.ok) throw new Error("Gagal ambil data weekly");

    const moods = await response.json(); // array of mood

    const data = [];
    const labels = [];

    for (let i = 0; i < 7; i++) {
      const d = new Date(monday);
      d.setDate(monday.getDate() + i);

      const dateStr = d.toISOString().slice(0, 10);
      const dayLabel = d.toLocaleDateString('id-ID', { weekday: 'short' });
      labels.push(dayLabel);

      const found = moods.find(e => e.moodDate === dateStr);
      data.push(found ? found.moodValue : null);
    }

    return { labels, data };

  } catch (error) {
    console.error("Weekly mood error:", error);
    return { labels: [], data: [] };
  }
}

async function getDistributionCounts() {
  const token = localStorage.getItem("token");
  if (!token) return [0, 0, 0, 0, 0];

  const today = new Date();
  const month = today.getMonth() + 1; // 0-indexed
  const year = today.getFullYear();

  try {
    const res = await fetch(`http://localhost:8080/api/mood/monthly-distribution?month=${month}&year=${year}`, {
      headers: {
        "Authorization": `Bearer ${token}`
      }
    });

    if (!res.ok) throw new Error("Gagal ambil distribusi mood");

    const result = await res.json(); // object with moodValue as keys

    // Index: [Sangat Baik, Baik, Netral, Buruk, Sangat Buruk] → mood 5..1
    const counts = [0, 0, 0, 0, 0];
    for (let i = 1; i <= 5; i++) {
      const moodCount = result[i.toString()] || 0;
      counts[5 - i] = moodCount; // mapping mood 5 → index 0, mood 1 → index 4
    }

    return counts;

  } catch (err) {
    console.error("Distribusi mood gagal:", err);
    return [0, 0, 0, 0, 0];
  }
}


/* ========= 4.  RENDER CHARTS  ======================================= */
async function initMoodCharts() {
  const { labels, data } = await getWeeklySeries(currentWeekOffset);
  const distData = await getDistributionCounts(); // nanti kita refactor juga ini

  const weeklyCtx = document.getElementById('weeklyMoodChart');
  const distCtx = document.getElementById('moodDistributionChart');


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

// Fungsi untuk menampilkan rentang minggu berjalan (Senin-Minggu)
function setWeeklyRangeLabel(weekOffset = 0) {
  const rangeSpan = document.getElementById('weeklyRange');
  if (!rangeSpan) return;

  const today = new Date();
  const day = today.getDay();
  const monday = new Date(today);
  monday.setDate(today.getDate() - ((day + 6) % 7) + (weekOffset * 7));
  const sunday = new Date(monday);
  sunday.setDate(monday.getDate() + 6);

  // Format tanggal
  const options = { day: '2-digit', month: 'short' };
  const startStr = monday.toLocaleDateString('id-ID', options);
  const endStr = sunday.toLocaleDateString('id-ID', options);

  // Jika bulan sama, tampilkan hanya tanggal saja di awal
  if (monday.getMonth() === sunday.getMonth()) {
    rangeSpan.textContent = `${monday.getDate()}-${sunday.getDate()} ${endStr.split(' ')[1]}`;
  } else {
    rangeSpan.textContent = `${startStr} - ${endStr}`;
  }
}

/* ========= 5.  MOOD HISTORY LIST  (table version)  ================== */
async function renderMoodHistory() {
  const tbody = document.getElementById('moodHistoryBody');
  if (!tbody) return;

  const token = localStorage.getItem("token");
  if (!token) {
    tbody.innerHTML = '<tr><td colspan="4">Kamu belum login.</td></tr>';
    return;
  }

  try {
    const res = await fetch("http://localhost:8080/api/mood/history", {
      headers: {
        "Authorization": `Bearer ${token}`
      }
    });

    if (!res.ok) throw new Error("Gagal ambil mood history");

    const entries = await res.json(); // List<Mood>

    const emoji = ['😭','😞','😐','😊','😁'];   // mood 1 → 5
    const label = ['Sangat Buruk','Buruk','Netral','Baik','Sangat Baik'];

    const rowsHtml = entries.map(e => {
      const d = new Date(e.moodDate);
      const dateNice = d.toLocaleDateString('id-ID', { day:'2-digit', month:'short', year:'numeric' });
      const i = e.moodValue - 1;
      const note = e.note || '';

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
    }).join('');

    tbody.innerHTML = rowsHtml || '<tr><td colspan="4" class="py-3 text-sm text-gray-500">Belum ada data</td></tr>';

  } catch (err) {
    console.error("Mood history error:", err);
    tbody.innerHTML = '<tr><td colspan="4" class="py-3 text-sm text-red-500">Gagal memuat data</td></tr>';
  }
}


/* ========= 6.  INITIALISATION  ======================================= */
document.addEventListener('DOMContentLoaded', () => {
  const moodRadios  = document.querySelectorAll('input[name="todayMood"]');
  const saveBtn     = document.getElementById('saveMoodBtn');

  /* --- enable Save only when a mood picked --- */
  moodRadios.forEach(r => r.addEventListener('change', () => { saveBtn.disabled = false; }));

  /* --- Save handler: add entry → refresh UI --- */
 saveBtn.addEventListener('click', async () => {
  const sel      = document.querySelector('input[name="todayMood"]:checked');
  const noteText = document.getElementById('moodNote').value;

  if (!sel) { alert('Silakan pilih mood kamu hari ini'); return; }

  await addMoodEntry(+sel.value, noteText);  // <== tambahkan `await`

  await initMoodCharts();            // redraw both charts
  await renderMoodHistory();         // refresh list
  setWeeklyRangeLabel();             // update label minggu

  // Reset form
  sel.checked = false;
  document.getElementById('moodNote').value = '';
  saveBtn.disabled = true;
});


  // Tombol prev/next minggu (gunakan selector yang pasti)
  const prevWeekBtn = document.querySelector('.fa-chevron-left')?.closest('button');
  const nextWeekBtn = document.querySelector('.fa-chevron-right')?.closest('button');

  if (prevWeekBtn) {
    prevWeekBtn.addEventListener('click', () => {
      currentWeekOffset--;
      setWeeklyRangeLabel(currentWeekOffset);
      initMoodCharts();
    });
  }
  if (nextWeekBtn) {
    nextWeekBtn.addEventListener('click', () => {
      if (currentWeekOffset < 0) {
        currentWeekOffset++;
        setWeeklyRangeLabel(currentWeekOffset);
        initMoodCharts();
      }
    });
  }

  /* --- first paint --- */
  initMoodCharts();
  renderMoodHistory();
  setWeeklyRangeLabel(currentWeekOffset);
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