// ABSTRACTIA — Hero Wave Canvas
// Time-of-day palette shifts automatically

(function() {
  const cvs = document.getElementById('waveCanvas');
  if (!cvs) return;
  const ctx = cvs.getContext('2d');
  let t = 0;

  const hour = new Date().getHours();
  let colors;
  if (hour >= 5 && hour < 10) {
    colors = ['#FF8C69','#FFB347','#FFA07A','#FF6347','#98D1B0','#5BA08A'];
  } else if (hour >= 10 && hour < 17) {
    colors = ['#64B5F6','#4FC3F7','#80DEEA','#26C6DA','#FF8C69','#FFB347'];
  } else if (hour >= 17 && hour < 20) {
    colors = ['#FF6B35','#F7C948','#E84855','#FF2D78','#9B5DE5','#845EC2'];
  } else {
    colors = ['#9B5DE5','#845EC2','#534AB7','#FF2D78','#C8A2C8','#7F77DD'];
  }

  function resize() {
    cvs.width = cvs.offsetWidth;
    cvs.height = cvs.offsetHeight;
  }
  resize();
  window.addEventListener('resize', resize);

  function draw() {
    const W = cvs.width, H = cvs.height;
    ctx.fillStyle = '#050508';
    ctx.fillRect(0, 0, W, H);

    for (let i = 0; i < 14; i++) {
      const prog = i / 14;
      ctx.beginPath();
      ctx.strokeStyle = colors[i % colors.length];
      ctx.lineWidth = 1.5 + prog * 1.5;
      ctx.globalAlpha = 0.25 + prog * 0.35;

      const y = H * 0.1 + prog * H * 0.8;
      const amp = 15 + prog * 40 + Math.sin(t * 0.3 + i) * 8;
      const freq = 0.006 + prog * 0.004;

      ctx.moveTo(0, y);
      for (let x = 0; x <= W; x += 3) {
        const yw = y
          + Math.sin(x * freq + t * (0.4 + prog * 0.3) + i * 1.1) * amp
          + Math.sin(x * freq * 2.1 + t * 0.2 + i) * (amp * 0.3);
        ctx.lineTo(x, yw);
      }
      ctx.stroke();
    }
    ctx.globalAlpha = 1;
    t += 0.012;
    requestAnimationFrame(draw);
  }
  draw();

  // Featured wave canvas
  const feat = document.getElementById('featuredWave');
  if (feat) {
    const fctx = feat.getContext('2d');
    const fpal = ['#FF8C69','#FFB347','#E8956D','#FF6347','#FFA07A'];
    let ft = 0;

    function fresize() { feat.width = feat.offsetWidth; feat.height = feat.offsetHeight; }
    fresize();
    window.addEventListener('resize', fresize);

    function fdraw() {
      const W = feat.width, H = feat.height;
      fctx.fillStyle = '#050508';
      fctx.fillRect(0, 0, W, H);
      for (let i = 0; i < 8; i++) {
        const prog = i / 8;
        fctx.beginPath();
        fctx.strokeStyle = fpal[i % fpal.length];
        fctx.lineWidth = 2;
        fctx.globalAlpha = 0.4 + prog * 0.4;
        const y = H * 0.15 + prog * H * 0.7;
        const amp = 10 + prog * 25;
        fctx.moveTo(0, y);
        for (let x = 0; x <= W; x += 2) {
          fctx.lineTo(x, y + Math.sin(x * 0.01 + ft + i * 0.9) * amp);
        }
        fctx.stroke();
      }
      fctx.globalAlpha = 1;
      ft += 0.015;
      requestAnimationFrame(fdraw);
    }
    fdraw();
  }

  // Nav scroll effect
  const nav = document.getElementById('nav');
  if (nav) {
    window.addEventListener('scroll', () => {
      nav.classList.toggle('scrolled', window.scrollY > 80);
    });
  }
})();
