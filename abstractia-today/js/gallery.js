// ABSTRACTIA — Gallery
// Loads works from Supabase, renders grid, handles filters + modal

const PALETTE_MAP = {
  waves: [
    ['#FF8C69','#FFB347','#98D1B0','#2E6B5E'],
    ['#FF6B9D','#C44D8A','#8B4FBF','#4A2580'],
    ['#64B5F6','#4FC3F7','#80DEEA','#1A5276'],
  ],
  lines: [
    ['#F5C6A0','#E8956D','#9B4F20','#3D1A0A'],
    ['#C8E6C9','#81C784','#388E3C','#1B5E20'],
    ['#EDE7F6','#B39DDB','#7E57C2','#311B92'],
  ],
  partner: [
    ['#FF2D78','#FFB830','#9B5DE5','#050508'],
  ]
};

let allWorks = [];
let activeAnimations = [];

function getCardPalette(work) {
  const type = work.series_type || 'waves';
  const pals = PALETTE_MAP[type] || PALETTE_MAP.waves;
  return pals[work.number % pals.length];
}

function drawWave(canvas, work, t) {
  if (!canvas.offsetWidth) return;
  const ctx = canvas.getContext('2d');
  const W = canvas.width = canvas.offsetWidth;
  const H = canvas.height = canvas.offsetHeight;
  const pal = getCardPalette(work);
  const type = work.series_type || 'waves';

  ctx.fillStyle = '#050508';
  ctx.fillRect(0, 0, W, H);

  const count = type === 'lines' ? 10 : 6;
  for (let i = 0; i < count; i++) {
    const prog = i / count;
    ctx.beginPath();
    ctx.strokeStyle = pal[i % pal.length];
    ctx.lineWidth = type === 'lines' ? 1 : 2.5;
    ctx.globalAlpha = 0.55 + prog * 0.4;

    if (type === 'waves') {
      const y = H * 0.2 + prog * H * 0.6;
      const amp = 12 + prog * 20;
      const freq = 0.012 + prog * 0.006;
      ctx.moveTo(0, y);
      for (let x = 0; x <= W; x += 2) {
        ctx.lineTo(x, y + Math.sin(x * freq + t + i * 0.8) * amp);
      }
    } else {
      const y = H * 0.1 + prog * H * 0.8;
      const amp = 3 + prog * 6;
      const freq = 0.03 + prog * 0.01;
      ctx.moveTo(0, y);
      for (let x = 0; x <= W; x++) {
        ctx.lineTo(x, y + Math.sin(x * freq + t * 0.7 + i) * amp);
      }
    }
    ctx.stroke();
  }
  ctx.globalAlpha = 1;
}

function renderGallery(works) {
  const grid = document.getElementById('galleryGrid');
  if (!grid) return;

  // Cancel old animations
  activeAnimations.forEach(id => cancelAnimationFrame(id));
  activeAnimations = [];

  if (!works.length) {
    grid.innerHTML = '<div class="gallery-empty">No works found.</div>';
    return;
  }

  grid.innerHTML = '';

  works.forEach((work, idx) => {
    const card = document.createElement('div');
    card.className = 'work-card';
    card.dataset.edition = work.edition_type;
    card.dataset.type = work.series_type;

    const cvs = document.createElement('canvas');
    cvs.style.cssText = 'width:100%;height:100%;display:block;position:absolute;inset:0;';

    const badgeClass = {
      unique: 'badge-unique',
      tiny: 'badge-tiny',
      limited: 'badge-limited',
      monthly: 'badge-monthly',
      partner: 'badge-partner'
    }[work.edition_type] || 'badge-limited';

    const badgeLabel = {
      unique: 'Unique 1/1',
      tiny: 'Tiny Ed. ≤5',
      limited: 'Limited 420',
      monthly: 'Monthly',
      partner: 'Partner'
    }[work.edition_type] || work.edition_type;

    card.innerHTML = `
      <div class="work-card-info">
        <p class="work-numeral">${work.numeral} · ${work.number}</p>
        <p class="work-title">${work.number} ${work.title}</p>
        <div class="work-meta-row">
          <span class="edition-badge ${badgeClass}">${badgeLabel}</span>
          <span class="work-action">View ↗</span>
        </div>
      </div>
    `;
    card.prepend(cvs);
    card.addEventListener('click', () => openModal(work));
    grid.appendChild(card);

    let t = idx * 2;
    function anim() {
      drawWave(cvs, work, t);
      t += 0.018;
      const id = requestAnimationFrame(anim);
      activeAnimations.push(id);
    }
    anim();
  });

  const count = document.getElementById('workCount');
  if (count) count.textContent = `${works.length} works`;
}

function filterWorks(filter, btn) {
  document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
  if (btn) btn.classList.add('active');

  const filtered = filter === 'all'
    ? allWorks
    : allWorks.filter(w => w.edition_type === filter || w.series_type === filter);

  renderGallery(filtered);
}

function openModal(work) {
  const modal = document.getElementById('modal');
  if (!modal) return;

  document.getElementById('modalNumeral').textContent = `${work.numeral} · ${work.number}`;
  document.getElementById('modalTitle').textContent = work.title;

  const edLabel = {
    unique: 'Unique — 1 of 1',
    tiny: 'Tiny Edition — 5 only',
    limited: 'Limited Edition — 420',
    monthly: 'Monthly Edition',
    partner: 'Partner Installation'
  }[work.edition_type] || work.edition_type;

  document.getElementById('modalSubtitle').textContent =
    `${work.number} ABSTRACTIA ${work.numeral} ${work.title} · ${edLabel}`;
  document.getElementById('modalBody').textContent =
    work.description || 'A living work from the ABSTRACTIA series by Maxximillian.';

  // States chips
  const statesEl = document.getElementById('modalStates');
  const states = work.states || ['waves', 'lines'];
  statesEl.innerHTML = states.map((s, i) =>
    `<button class="state-chip${i===0?' active':''}" onclick="this.parentNode.querySelectorAll('.state-chip').forEach(c=>c.classList.remove('active'));this.classList.add('active')">${s}</button>`
  ).join('');

  // Collect + video links
  const collectBtn = document.getElementById('modalCollect');
  const videoBtn = document.getElementById('modalVideo');
  if (work.collect_url) {
    collectBtn.href = work.collect_url;
    collectBtn.style.display = '';
  } else {
    collectBtn.style.display = 'none';
  }
  if (work.demo_video_url) {
    videoBtn.href = work.demo_video_url;
    videoBtn.style.display = '';
  } else {
    videoBtn.style.display = 'none';
  }

  modal.classList.add('open');

  // Animate modal canvas
  const cvs = document.getElementById('modalCanvas');
  let t = 0;
  function anim() {
    if (!modal.classList.contains('open')) return;
    drawWave(cvs, work, t);
    t += 0.015;
    requestAnimationFrame(anim);
  }
  anim();
}

function closeModal() {
  const modal = document.getElementById('modal');
  if (modal) modal.classList.remove('open');
}

// Load works from Supabase
async function loadWorks() {
  const grid = document.getElementById('galleryGrid');
  if (!grid) return;

  try {
    const { data, error } = await window.sb
      .from('works')
      .select('*')
      .eq('published', true)
      .order('number', { ascending: true });

    if (error) throw error;

    allWorks = data || [];
    renderGallery(allWorks);
  } catch (err) {
    console.error('Failed to load works:', err);
    // Fallback to sample works if Supabase unavailable
    allWorks = SAMPLE_WORKS;
    renderGallery(allWorks);
  }
}

// Sample works fallback (shown if Supabase is unreachable)
const SAMPLE_WORKS = [
  { number:1,  numeral:'I',      title:'GENESIS',   edition_type:'unique',  series_type:'waves',  description:'The first work. 1 of 1. Where it all began.', states:['waves','lines'] },
  { number:10, numeral:'X',      title:'AQUA',      edition_type:'limited', series_type:'waves',  description:'Cool aqua tones. Responsive to cursor and time of day.', states:['waves','lines','companion'] },
  { number:80, numeral:'LXXX',   title:'SUNSET',    edition_type:'limited', series_type:'waves',  description:'Real-time palette from dawn to dusk. The art knows what time it is.', states:['waves','lines','companion','easter_egg'] },
  { number:95, numeral:'XCV',    title:'PM LINES',  edition_type:'tiny',    series_type:'lines',  description:'Skelevaggio Loves Abstractia. Afternoon lines state.', states:['lines','waves'] },
];

document.addEventListener('supabase-ready', loadWorks);
