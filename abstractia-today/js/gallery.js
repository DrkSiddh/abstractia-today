// ABSTRACTIA — Gallery
// Live iframe artwork in every card — no thumbnails needed
// Click card → modal with full interactive work + fullscreen

let allWorks = [];

const BADGE = {
  unique:  { cls: 'badge-unique',  label: 'Unique 1/1' },
  tiny:    { cls: 'badge-tiny',    label: 'Tiny Ed. ≤5' },
  limited: { cls: 'badge-limited', label: 'Limited 420' },
  open:    { cls: 'badge-open',    label: 'Open Edition' },
  monthly: { cls: 'badge-monthly', label: 'Monthly' },
  partner: { cls: 'badge-partner', label: 'Partner' },
  custom:  { cls: 'badge-custom',  label: 'Edition' },
};

const ED_LABEL = {
  unique:  'Unique — 1 of 1',
  tiny:    'Tiny Edition — 5 only',
  limited: 'Limited Edition — 420',
  open:    'Open Edition',
  monthly: 'Monthly Edition',
  partner: 'Partner Installation',
  custom:  'Edition',
};

function getWorkUrl(work) {
  if (work.html_github_url) return work.html_github_url;
  if (work.slug) return `/works/${work.slug}.html`;
  return null;
}

function renderGallery(works) {
  const grid = document.getElementById('galleryGrid');
  if (!grid) return;
  if (!works.length) { grid.innerHTML = '<div class="gallery-empty">No works found.</div>'; return; }
  grid.innerHTML = '';

  works.forEach(work => {
    const card = document.createElement('div');
    card.className = 'work-card';
    card.dataset.edition = work.edition_type;
    card.dataset.type = work.series_type;
    const badge = BADGE[work.edition_type] || BADGE.custom;
    const workUrl = getWorkUrl(work);

    card.innerHTML = `
      ${workUrl
        ? `<iframe src="${workUrl}" class="work-iframe" scrolling="no" frameborder="0" tabindex="-1"></iframe>`
        : `<canvas class="work-canvas-placeholder" style="width:100%;height:100%;position:absolute;inset:0;display:block;"></canvas>`
      }
      <div class="work-card-overlay">
        <div class="work-card-info">
          <p class="work-numeral">${work.numeral} · ${work.number}</p>
          <p class="work-title">${work.number} ${work.title}</p>
          <div class="work-meta-row">
            <span class="edition-badge ${badge.cls}">${badge.label}</span>
            <span class="work-action">View full work ↗</span>
          </div>
        </div>
      </div>
    `;

    card.addEventListener('click', () => openModal(work));
    grid.appendChild(card);
    if (!workUrl) animateFallback(card.querySelector('.work-canvas-placeholder'), work);
  });

  const count = document.getElementById('workCount');
  if (count) count.textContent = `${works.length} works`;
}

function animateFallback(canvas, work) {
  if (!canvas) return;
  const pal = work.series_type === 'lines'
    ? ['#F5C6A0','#E8956D','#C8E6C9','#81C784','#EDE7F6','#B39DDB']
    : ['#FF8C69','#FFB347','#64B5F6','#4FC3F7','#FF6B9D','#98D1B0'];
  let t = (work.number || 1) * 1.5;
  function draw() {
    if (!canvas.offsetWidth) { requestAnimationFrame(draw); return; }
    const ctx = canvas.getContext('2d');
    const W = canvas.width = canvas.offsetWidth;
    const H = canvas.height = canvas.offsetHeight;
    ctx.fillStyle = '#050508';
    ctx.fillRect(0, 0, W, H);
    for (let i = 0; i < 7; i++) {
      const prog = i / 7;
      ctx.beginPath();
      ctx.strokeStyle = pal[i % pal.length];
      ctx.lineWidth = 2;
      ctx.globalAlpha = 0.4 + prog * 0.5;
      const y = H * 0.15 + prog * H * 0.7;
      const amp = 10 + prog * 22;
      ctx.moveTo(0, y);
      for (let x = 0; x <= W; x += 2) ctx.lineTo(x, y + Math.sin(x * 0.01 + t + i * 0.9) * amp);
      ctx.stroke();
    }
    ctx.globalAlpha = 1;
    t += 0.016;
    requestAnimationFrame(draw);
  }
  draw();
}

function filterWorks(filter, btn) {
  document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
  if (btn) btn.classList.add('active');
  const filtered = filter === 'all' ? allWorks : allWorks.filter(w => w.edition_type === filter || w.series_type === filter);
  renderGallery(filtered);
}

function openModal(work) {
  const modal = document.getElementById('modal');
  if (!modal) return;
  const workUrl = getWorkUrl(work);

  document.getElementById('modalNumeral').textContent = `${work.numeral} · ${work.number}`;
  document.getElementById('modalTitle').textContent = work.title;
  document.getElementById('modalSubtitle').textContent = `${work.number} ABSTRACTIA ${work.numeral} ${work.title} · ${ED_LABEL[work.edition_type] || 'Edition'}`;
  document.getElementById('modalBody').textContent = work.description || 'A living work from the ABSTRACTIA series by Maxximillian.';

  // Live artwork in modal
  const artWrap = document.getElementById('modalArtWrap');
  if (workUrl) {
    artWrap.innerHTML = `<iframe src="${workUrl}" class="modal-iframe" scrolling="no" frameborder="0"></iframe>`;
  } else {
    artWrap.innerHTML = `<canvas style="width:100%;height:100%;position:absolute;inset:0;"></canvas>`;
    animateFallback(artWrap.querySelector('canvas'), work);
  }

  // Fullscreen opens work in new tab
  const fsBtn = document.getElementById('modalFullscreen');
  if (fsBtn) fsBtn.onclick = () => workUrl ? window.open(workUrl, '_blank') : null;

  // States
  const states = Array.isArray(work.states) ? work.states : ['waves','lines'];
  document.getElementById('modalStates').innerHTML = states.map((s,i) =>
    `<button class="state-chip${i===0?' active':''}" onclick="document.querySelectorAll('.state-chip').forEach(c=>c.classList.remove('active'));this.classList.add('active')">${s}</button>`
  ).join('');

  // Buttons
  const cb = document.getElementById('modalCollect');
  const vb = document.getElementById('modalVideo');
  if (work.collect_url) { cb.href = work.collect_url; cb.style.display = ''; } else cb.style.display = 'none';
  if (work.demo_video_url) { vb.href = work.demo_video_url; vb.style.display = ''; } else vb.style.display = 'none';

  modal.classList.add('open');
  document.body.style.overflow = 'hidden';
}

function closeModal() {
  const modal = document.getElementById('modal');
  if (!modal) return;
  modal.classList.remove('open');
  const wrap = document.getElementById('modalArtWrap');
  if (wrap) wrap.innerHTML = '';
  document.body.style.overflow = '';
}

async function loadWorks() {
  try {
    const { data, error } = await window.sb.from('works').select('*').eq('published', true).order('number', { ascending: true });
    if (error) throw error;
    allWorks = data && data.length ? data : SAMPLE_WORKS;
    renderGallery(allWorks);
  } catch (err) {
    allWorks = SAMPLE_WORKS;
    renderGallery(allWorks);
  }
}

const SAMPLE_WORKS = [
  { number:1,  numeral:'I',    title:'GENESIS',  edition_type:'unique',  series_type:'waves', description:'The first work. 1 of 1.', states:['waves','lines'], html_github_url:null, slug:'i-genesis' },
  { number:3,  numeral:'III',  title:'SPECTRUM', edition_type:'limited', series_type:'waves', description:'Full spectrum. Shifts with time of day.', states:['waves','lines','gm_palette','pm_palette'], html_github_url:null, slug:'iii-spectrum' },
  { number:10, numeral:'X',    title:'AQUA',     edition_type:'limited', series_type:'waves', description:'Cool aqua tones. Responsive to cursor.', states:['waves','lines','companion'], html_github_url:null, slug:'x-aqua' },
  { number:80, numeral:'LXXX', title:'SUNSET',   edition_type:'limited', series_type:'waves', description:'Real-time palette from dawn to dusk.', states:['waves','lines','easter_egg'], html_github_url:null, slug:'lxxx-sunset' },
  { number:95, numeral:'XCV',  title:'PM LINES', edition_type:'tiny',    series_type:'lines', description:'Skelevaggio Loves Abstractia.', states:['lines','waves'], html_github_url:null, slug:'xcv-pm-lines' },
];

document.addEventListener('supabase-ready', loadWorks);
