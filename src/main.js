import { CATEGORIES } from './game/catalog.js';
import { SortGame, formatNumber } from './game/engine.js';
import { renderScene } from './game/renderer.js';

const root = document.querySelector('#app');
root.innerHTML = `
  <div class="app-shell">
    <header class="topbar">
      <a class="brand" href="#top" aria-label="Detektif Sampah beranda">
        <span class="brand-symbol"><svg viewBox="0 0 48 48" aria-hidden="true"><path d="M10 28c0-12 12-19 27-18-1 14-8 27-21 25-7-1-10-7-6-13 3-4 7-6 12-7-6 4-9 9-8 14 7 0 13-4 18-12-5 5-11 7-18 7" fill="currentColor"/><path d="M14 35c-2 4-4 7-7 9" stroke="currentColor" stroke-width="3" stroke-linecap="round" fill="none"/></svg></span>
        <span class="brand-copy"><strong>ECO<span>QUEST</span></strong><small>MEDIA BELAJAR INTERAKTIF</small></span>
      </a>
      <div class="top-actions">
        <span class="touch-pill"><span class="touch-dots">●●●</span> MULTI-TOUCH PID</span>
        <button class="icon-button" id="sound-toggle" type="button" aria-label="Matikan suara" title="Suara aktif"><span id="sound-icon">♫</span></button>
        <button class="icon-button" id="fullscreen-toggle" type="button" aria-label="Layar penuh" title="Layar penuh">⛶</button>
        <button class="materials-button" id="lesson-toggle" type="button">Materi</button>
        <button class="help-button" id="help-toggle" type="button">Panduan <span>↗</span></button>
      </div>
    </header>

    <main id="top" class="main-content">
      <section class="hero-row">
        <div class="hero-copy">
          <div class="eyebrow"><span class="eyebrow-dot"></span> MISI LINGKUNGAN • LEVEL SMP/MTs</div>
          <h1>Detektif Sampah<span class="title-dot">.</span></h1>
          <p>Dari masalah jadi berkah. Tangkap hujan sampah, kenali jenisnya, dan selamatkan lingkungan sekolah!</p>
        </div>
        <div class="hero-sticker" aria-hidden="true"><span class="sticker-sun">✦</span><span class="sticker-leaf">🌱</span><strong>1.000</strong><small>OBJEK MISI</small></div>
      </section>

      <section class="stats-grid" aria-label="Statistik permainan">
        <article class="stat-card stat-green"><span class="stat-icon">♻</span><div><small>TERPILAH</small><strong id="stat-sorted">0 <em>/ 1.000</em></strong></div><span class="stat-spark">↗</span></article>
        <article class="stat-card stat-blue"><span class="stat-icon">✦</span><div><small>SKOR MISI</small><strong id="stat-score">0</strong></div><span class="stat-spark">+10</span></article>
        <article class="stat-card stat-purple"><span class="stat-icon">◎</span><div><small>AKURASI</small><strong id="stat-accuracy">100%</strong></div><span class="stat-spark">%</span></article>
        <article class="stat-card stat-orange"><span class="stat-icon">⚡</span><div><small>STREAK TERBAIK</small><strong id="stat-streak">0 <em>kali</em></strong></div><span class="stat-spark">★</span></article>
      </section>

      <section class="workspace">
        <div class="scene-card">
          <div class="scene-topline">
            <div class="scene-name"><span class="live-indicator"></span><div><strong>AREA MISI PILAH</strong><small>HALAMAN SEKOLAH • ZONA SORTIR</small></div></div>
            <div class="scene-actions"><span id="wave-label" class="wave-chip">GELOMBANG 0 / 56</span><button id="pause-toggle" class="pause-button" type="button" disabled>Ⅱ Jeda</button></div>
          </div>
          <div class="canvas-wrap"><canvas id="game-canvas" aria-label="Area permainan memilah sampah. Seret objek ke tempat sampah yang sesuai."></canvas><div class="canvas-hint" id="canvas-hint">SENTUH & SERET OBJEK KE TONG YANG TEPAT</div></div>
          <div class="scene-foot">
            <div class="progress-block"><div class="progress-meta"><span>PROGRES MISI</span><strong id="progress-percent">0%</strong></div><div class="progress-track"><span id="progress-fill"></span></div></div>
            <div class="remaining-chip"><span>TERSISA</span><strong id="remaining-count">1.000</strong></div>
          </div>
        </div>

        <aside class="side-column">
          <section class="side-card mission-card">
            <div class="card-heading"><div><span class="mini-overline">TARGET HARI INI</span><h2>Misi Pahlawan Bumi</h2></div><span class="mission-medal">🏅</span></div>
            <p class="mission-text">Pilah setiap benda ke wadah yang tepat. Perhatikan bentuk dan bahan sebelum menjatuhkannya!</p>
            <div class="mission-progress"><div><span>Objek berhasil</span><strong id="side-progress">0 / 1.000</strong></div><div class="mini-track"><span id="side-progress-fill"></span></div></div>
            <div class="mini-stat-row"><div><small>BENAR</small><strong id="side-correct">0</strong></div><div><small>DITOLAK</small><strong id="side-wrong">0</strong></div><div><small>GELOMBANG</small><strong id="side-wave">0</strong></div></div>
          </section>
          <section class="side-card bins-card">
            <div class="card-heading"><div><span class="mini-overline">KENALI WARNA WADAH</span><h2>3 Zona Pemilahan</h2></div><span class="bin-emoji">🗑️</span></div>
            <div class="bin-legend legend-green"><span class="legend-icon">♻</span><div><strong>Hijau • Organik</strong><small>Sisa makanan, kulit buah, daun</small></div><span class="legend-arrow">→</span></div>
            <div class="bin-legend legend-yellow"><span class="legend-icon">♻</span><div><strong>Kuning • Anorganik</strong><small>Botol, kaleng, bungkus makanan</small></div><span class="legend-arrow">→</span></div>
            <div class="bin-legend legend-red"><span class="legend-icon">⚠</span><div><strong>Merah • B3</strong><small>Baterai, pecahan kaca, masker*</small></div><span class="legend-arrow">→</span></div>
            <small class="source-note">*Contoh kelompok dalam materi pembelajaran.</small>
          </section>
          <section class="tip-card"><span class="tip-icon">💡</span><div><strong>Tips Detektif</strong><p id="tip-text">Amati bahan dan asal benda. Jangan hanya menebak dari warnanya!</p></div></section>
        </aside>
      </section>

      <section class="learning-strip">
        <div class="learning-intro"><span class="learning-icon">🌎</span><div><strong>Pilah hari ini, selamatkan esok!</strong><small>Ingat jurus 1R + 3R saat beraktivitas.</small></div></div>
        <div class="r-list"><span><b>1R</b> Refuse</span><span><b>3R</b> Reduce • Reuse • Recycle</span></div>
        <div class="touch-note"><span>☝☝</span> Bisa dimainkan bersama dengan beberapa jari</div>
      </section>
      <footer class="footer"><span>© ECOQUEST • MEDIA PEMBELAJARAN LINGKUNGAN</span><span>Belajar memilah • Beraksi nyata • Bumi terjaga</span></footer>
    </main>

    <div class="modal-layer" id="start-modal" role="dialog" aria-modal="true" aria-labelledby="welcome-title">
      <div class="modal-card welcome-card">
        <div class="modal-art"><div class="art-sun"></div><div class="art-planet">🌍</div><span class="art-leaf leaf-one">🍃</span><span class="art-leaf leaf-two">🌿</span><span class="art-star star-one">✦</span><span class="art-star star-two">✧</span></div>
        <div class="modal-content"><div class="eyebrow"><span class="eyebrow-dot"></span> PETUALANGAN EDUKASI</div><h2 id="welcome-title">Siap jadi <span>Detektif Sampah?</span></h2><p class="modal-lead">Hujan sampah akan turun! Kenali setiap objek dan selamatkan halaman sekolah dengan memilahnya secara tepat.</p>
          <div class="setup-grid"><label>JUMLAH OBJEK<select id="total-select"><option value="100">100 objek • Pemanasan</option><option value="250">250 objek • Tantangan</option><option value="500">500 objek • Ahli Pilah</option><option value="1000" selected>1.000 objek • Misi Besar</option></select></label><label>KECEPATAN HUJAN<select id="speed-select"><option value="slow">Santai</option><option value="normal" selected>Normal</option><option value="fast">Cepat</option></select></label></div>
          <div class="setup-note"><span>☝️</span><span>Mendukung sentuhan beberapa jari pada layar PID. Bisa juga dimainkan dengan mouse.</span></div>
          <button class="primary-button" id="start-button" type="button">MULAI MISI <span>→</span></button>
          <small class="fine-print">Komposisi latihan: 40% organik • 50% anorganik • 10% B3</small>
        </div>
      </div>
    </div>

    <div class="modal-layer hidden" id="pause-modal" role="dialog" aria-modal="true" aria-labelledby="pause-title">
      <div class="modal-card compact-modal"><div class="pause-graphic">Ⅱ</div><h2 id="pause-title">Misi dijeda</h2><p>Istirahat sejenak. Sampah menunggu untuk dipilah!</p><button class="primary-button" id="resume-button" type="button">LANJUTKAN MISI <span>→</span></button><button class="text-button" id="restart-from-pause" type="button">Ulangi dari awal</button></div>
    </div>

    <div class="modal-layer hidden" id="result-modal" role="dialog" aria-modal="true" aria-labelledby="result-title">
      <div class="modal-card result-card"><div class="result-confetti">✦ ✧ ✦ ✧ ✦</div><div class="result-medal">🏆</div><div class="eyebrow">MISI SELESAI</div><h2 id="result-title">Pahlawan Bumi!</h2><p class="result-lead">Semua objek berhasil kamu pilah. Aksi kecilmu berarti besar bagi lingkungan.</p><div class="result-stats"><div><small>SKOR AKHIR</small><strong id="result-score">0</strong></div><div><small>AKURASI</small><strong id="result-accuracy">100%</strong></div><div><small>STREAK</small><strong id="result-streak">0</strong></div></div><div class="result-message" id="result-message">Kamu hebat! Terus biasakan memilah sampah.</div><button class="primary-button" id="play-again-button" type="button">MAIN LAGI <span>↻</span></button><button class="text-button" id="close-result-button" type="button">Lihat area permainan</button></div>
    </div>

    <div class="modal-layer hidden" id="help-modal" role="dialog" aria-modal="true" aria-labelledby="help-title">
      <div class="modal-card help-card"><button class="modal-close" id="close-help" aria-label="Tutup panduan">×</button><div class="eyebrow">CARA BERMAIN</div><h2 id="help-title">Jadi Detektif yang Cermat!</h2><div class="help-steps"><div><b>01</b><span><strong>Amati objek</strong><small>Perhatikan gambar dan nama sampah yang turun.</small></span></div><div><b>02</b><span><strong>Tarik dan lepaskan</strong><small>Sentuh objek, geser ke wadah, lalu lepaskan. Beberapa objek bisa digerakkan dengan beberapa jari.</small></span></div><div><b>03</b><span><strong>Perhatikan alarm</strong><small>Wadah menyala terang jika benar. Jika salah, wadah berkedip merah dan objek ditolak.</small></span></div><div><b>04</b><span><strong>Selesaikan semua gelombang</strong><small>Kumpulkan skor dan jaga akurasi setinggi mungkin.</small></span></div></div><div class="key-help"><span>1</span> Organik <span>2</span> Anorganik <span>3</span> B3 <small>Pilih objek lalu tekan angka pada keyboard.</small></div><button class="primary-button" id="close-help-button" type="button">MENGERTI <span>✓</span></button></div>
    </div>

    <div class="modal-layer hidden" id="lesson-modal" role="dialog" aria-modal="true" aria-labelledby="lesson-title">
      <div class="modal-card lesson-card"><button class="modal-close" id="close-lesson" aria-label="Tutup materi">×</button>
        <div class="eyebrow">BEKAL DETEKTIF • MATERI PEMBELAJARAN</div><h2 id="lesson-title">Detektif Sampah: Dari Masalah Jadi Berkah</h2>
        <p class="lesson-intro">Baca ringkasan materi, lalu buktikan pemahamanmu saat menjalankan misi pemilahan.</p>
        <div class="lesson-grid">
          <section class="lesson-box lesson-wide"><span class="lesson-label">01 • MENGENAL SAMPAH</span><h3>Apa itu sampah?</h3><p>Sisa kegiatan sehari-hari manusia atau proses alam yang berbentuk padat dan sudah tidak dipakai lagi. Sampah yang dipilah dapat menjadi sumber daya berharga.</p><div class="lesson-fact"><strong>0,7 kg</strong><span>Perkiraan sampah per siswa per hari sebagaimana dicantumkan dalam materi presentasi.</span></div></section>
          <section class="lesson-box"><span class="lesson-label">02 • JENIS SAMPAH</span><h3>Tiga kelompok latihan</h3><div class="lesson-type type-green"><b>HIJAU • ORGANIK</b><small>Sisa nasi, kulit buah, daun kering, tisu.</small></div><div class="lesson-type type-yellow"><b>KUNING • ANORGANIK</b><small>Botol plastik, kaleng, bungkus makanan.</small></div><div class="lesson-type type-red"><b>MERAH • B3</b><small>Baterai bekas, pecahan kaca, masker (sesuai contoh pada materi).</small></div></section>
          <section class="lesson-box"><span class="lesson-label">03 • LAMA TERURAI</span><h3>Berapa lama sampah menghilang?</h3><div class="decompose-row"><span>Kulit pisang & daun</span><b>2–6 minggu</b></div><div class="decompose-row"><span>Tisu & kardus</span><b>2–5 bulan</b></div><div class="decompose-row"><span>Kaleng minuman</span><b>80–200 tahun</b></div><div class="decompose-row"><span>Botol plastik & kresek</span><b>450–1.000 tahun</b></div><small class="lesson-source">Rentang waktu mengikuti tabel di materi pembelajaran.</small></section>
          <section class="lesson-box"><span class="lesson-label">04 • DAMPAK LINGKUNGAN</span><h3>Bahaya sampah</h3><ul><li><b>Banjir kota:</b> sampah menyumbat selokan dan sungai.</li><li><b>Pencemaran tanah:</b> air lindi dapat mencemari tanah dan air.</li><li><b>Pemanasan global:</b> pembusukan sampah organik dapat menghasilkan metana.</li><li><b>Kesehatan:</b> sampah dapat menjadi tempat berkembangnya organisme pembawa penyakit.</li><li><b>Asap berbahaya:</b> membakar plastik bukan cara aman mengelola sampah.</li></ul></section>
          <section class="lesson-box"><span class="lesson-label">05 • JADI BERKAH</span><h3>Manfaat sampah terpilah</h3><div class="benefit-list"><div><span>🌱</span><p><b>Pupuk kompos</b><small>Sisa dapur membantu menyuburkan tanaman.</small></p></div><div><span>🍊</span><p><b>Eco-enzyme</b><small>Kulit buah dapat diolah menjadi cairan serbaguna.</small></p></div><div><span>🏦</span><p><b>Bank sampah</b><small>Botol dan kardus dapat disalurkan untuk didaur ulang.</small></p></div><div><span>🎒</span><p><b>Karya kriya</b><small>Bahan kemasan dapat dimanfaatkan menjadi kerajinan.</small></p></div></div></section>
          <section class="lesson-box lesson-wide"><span class="lesson-label">06 • JURUS 1R + 3R</span><h3>Aksi kecil yang bisa dilakukan</h3><div class="four-r"><div><b>1R</b><strong>Refuse</strong><small>Tolak sedotan dan kantong sekali pakai.</small></div><div><b>3R</b><strong>Reduce</strong><small>Kurangi sampah dan habiskan makanan secukupnya.</small></div><div><b>3R</b><strong>Reuse</strong><small>Gunakan tumbler dan kotak makan ulang.</small></div><div><b>3R</b><strong>Recycle</strong><small>Pilah bahan agar bisa didaur ulang.</small></div></div></section>
          <section class="lesson-box lesson-wide myth-box"><span class="lesson-label">07 • MITOS VS FAKTA</span><div class="myth-grid"><div><span>MITOS</span><b>“Membakar plastik bikin sampah aman.”</b><small>Keliru. Asap pembakaran plastik dapat mengandung zat berbahaya.</small></div><div><span>FAKTA</span><b>“Sisa nasi yang membusuk dapat menghasilkan gas metana.”</b><small>Benar. Karena itu sisa makanan perlu dikelola dengan baik.</small></div></div></section>
        </div>
        <button class="primary-button lesson-done" id="close-lesson-button" type="button">LANJUTKAN MISI <span>→</span></button>
      </div>
    </div>

    <div class="toast" id="toast" role="status" aria-live="polite"><span class="toast-symbol" id="toast-symbol">✓</span><span id="toast-text">Siap memilah!</span></div>
  </div>
`;

const $ = (selector) => document.querySelector(selector);
const canvas = $('#game-canvas');
const ctx = canvas.getContext('2d', { alpha: false });
const toast = $('#toast');
let toastTimer = null;
let dpr = Math.min(window.devicePixelRatio || 1, 2);
let canvasWidth = 1000;
let canvasHeight = 600;
let audioContext = null;
let soundEnabled = true;
let lastSnapshot = null;
let resumeAfterInfo = false;

function playTone(type) {
  if (!soundEnabled) return;
  try {
    const AudioCtx = window.AudioContext || window.webkitAudioContext;
    if (!AudioCtx) return;
    if (!audioContext) audioContext = new AudioCtx();
    if (audioContext.state === 'suspended') audioContext.resume();
    const now = audioContext.currentTime;
    const notes = type === 'correct' ? [660, 880] : type === 'finish' ? [523, 659, 784, 1046] : [185, 125];
    notes.forEach((frequency, index) => {
      const oscillator = audioContext.createOscillator();
      const gain = audioContext.createGain();
      oscillator.type = type === 'wrong' ? 'square' : 'sine';
      oscillator.frequency.setValueAtTime(frequency, now + index * (type === 'finish' ? .12 : .07));
      gain.gain.setValueAtTime(.0001, now + index * .07);
      gain.gain.exponentialRampToValueAtTime(type === 'wrong' ? .075 : .085, now + index * .07 + .015);
      gain.gain.exponentialRampToValueAtTime(.0001, now + index * .07 + (type === 'finish' ? .17 : .13));
      oscillator.connect(gain); gain.connect(audioContext.destination);
      oscillator.start(now + index * (type === 'finish' ? .12 : .07));
      oscillator.stop(now + index * (type === 'finish' ? .12 : .07) + .19);
    });
  } catch (error) {
    // Audio is optional; the visual feedback remains available on devices without Web Audio.
  }
}

function showToast(message, type = 'success') {
  clearTimeout(toastTimer);
  $('#toast-text').textContent = message;
  $('#toast-symbol').textContent = type === 'wrong' ? '!' : type === 'info' ? 'i' : '✓';
  toast.className = `toast show toast-${type}`;
  toastTimer = setTimeout(() => { toast.className = 'toast'; }, 2300);
}

function updateUI(snapshot) {
  lastSnapshot = snapshot;
  const totalLabel = formatNumber(snapshot.total);
  $('#stat-sorted').innerHTML = `${formatNumber(snapshot.sorted)} <em>/ ${totalLabel}</em>`;
  $('#stat-score').textContent = formatNumber(snapshot.score);
  $('#stat-accuracy').textContent = `${snapshot.accuracy}%`;
  $('#stat-streak').innerHTML = `${formatNumber(snapshot.bestStreak)} <em>kali</em>`;
  $('#wave-label').textContent = `GELOMBANG ${snapshot.wave} / ${snapshot.totalWaves}`;
  $('#progress-percent').textContent = `${Math.round((snapshot.sorted / snapshot.total) * 100)}%`;
  $('#progress-fill').style.width = `${(snapshot.sorted / snapshot.total) * 100}%`;
  $('#remaining-count').textContent = formatNumber(snapshot.remaining);
  $('#side-progress').textContent = `${formatNumber(snapshot.sorted)} / ${totalLabel}`;
  $('#side-progress-fill').style.width = `${(snapshot.sorted / snapshot.total) * 100}%`;
  $('#side-correct').textContent = formatNumber(snapshot.correct);
  $('#side-wrong').textContent = formatNumber(snapshot.wrong);
  $('#side-wave').textContent = snapshot.wave;
  $('#pause-toggle').disabled = !['running', 'paused'].includes(snapshot.status);
  $('#pause-toggle').textContent = snapshot.status === 'paused' ? '▶ Lanjut' : 'Ⅱ Jeda';
  $('#canvas-hint').textContent = snapshot.status === 'paused' ? 'MISI DIJEDA' : snapshot.status === 'running' ? 'SENTUH & SERET OBJEK KE TONG YANG TEPAT' : 'SIAP UNTUK MEMULAI MISI';
  $('#canvas-hint').classList.toggle('hint-paused', snapshot.status === 'paused');
}

const game = new SortGame({
  onChange: updateUI,
  onSound: playTone,
  onMessage: (message) => {
    if (message.type === 'correct') showToast(message.text, 'success');
    else if (message.type === 'wrong') {
      const category = CATEGORIES[message.correctCategory];
      showToast(`${message.text} Coba ke wadah ${category.binLabel}.`, 'wrong');
      $('#tip-text').textContent = `${message.item.name}: ${message.item.hint}`;
    } else if (message.type === 'select') {
      $('#tip-text').textContent = `${message.item.name}: ${message.item.hint}`;
    } else if (message.type === 'wave') showToast(message.text, 'info');
    else if (message.type === 'start') showToast(message.text, 'info');
    else if (message.type === 'complete') showResults();
  }
});

function resizeCanvas() {
  const rect = canvas.getBoundingClientRect();
  if (rect.width < 10 || rect.height < 10) return;
  dpr = Math.min(window.devicePixelRatio || 1, 2);
  canvasWidth = rect.width;
  canvasHeight = rect.height;
  canvas.width = Math.round(canvasWidth * dpr);
  canvas.height = Math.round(canvasHeight * dpr);
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  game.setViewport(canvasWidth, canvasHeight);
}

const resizeObserver = new ResizeObserver(resizeCanvas);
resizeObserver.observe(canvas);
window.addEventListener('orientationchange', () => setTimeout(resizeCanvas, 180));
window.addEventListener('resize', resizeCanvas);

function canvasPoint(event) {
  const rect = canvas.getBoundingClientRect();
  return { x: event.clientX - rect.left, y: event.clientY - rect.top };
}

canvas.addEventListener('pointerdown', (event) => {
  if (game.status !== 'running') return;
  event.preventDefault();
  const point = canvasPoint(event);
  const result = game.pointerDown(event.pointerId, point.x, point.y);
  if (result?.type === 'item') {
    try { canvas.setPointerCapture(event.pointerId); } catch (_) {}
  }
});
canvas.addEventListener('pointermove', (event) => {
  if (!game.pointerDrags.has(event.pointerId)) return;
  event.preventDefault();
  const point = canvasPoint(event);
  game.pointerMove(event.pointerId, point.x, point.y);
});
canvas.addEventListener('pointerup', (event) => {
  if (!game.pointerDrags.has(event.pointerId)) return;
  const point = canvasPoint(event);
  game.pointerUp(event.pointerId, point.x, point.y);
  try { canvas.releasePointerCapture(event.pointerId); } catch (_) {}
});
canvas.addEventListener('pointercancel', (event) => game.pointerCancel(event.pointerId));
canvas.addEventListener('contextmenu', (event) => event.preventDefault());

function animationLoop(now) {
  game.update(now);
  renderScene(ctx, game, canvasWidth, canvasHeight, now);
  requestAnimationFrame(animationLoop);
}
requestAnimationFrame(animationLoop);

function startGame() {
  const total = Number($('#total-select').value);
  const speed = $('#speed-select').value;
  soundEnabled = $('#sound-toggle').dataset.enabled !== 'false';
  game.config.sound = soundEnabled;
  game.start({ total, speed, sound: soundEnabled });
  $('#start-modal').classList.add('hidden');
  $('#pause-modal').classList.add('hidden');
  $('#result-modal').classList.add('hidden');
  $('#pause-toggle').disabled = false;
  resizeCanvas();
}

function showResults() {
  if (!lastSnapshot) return;
  $('#result-score').textContent = formatNumber(lastSnapshot.score);
  $('#result-accuracy').textContent = `${lastSnapshot.accuracy}%`;
  $('#result-streak').textContent = formatNumber(lastSnapshot.bestStreak);
  const message = lastSnapshot.accuracy >= 95 ? 'Luar biasa! Kamu sangat cermat memilah sampah.' : lastSnapshot.accuracy >= 80 ? 'Bagus! Terus berlatih agar semakin teliti.' : 'Terus belajar! Setiap kesalahan adalah kesempatan untuk memahami jenis sampah.';
  $('#result-message').textContent = message;
  $('#result-modal').classList.remove('hidden');
}

$('#start-button').addEventListener('click', startGame);
$('#play-again-button').addEventListener('click', () => {
  $('#result-modal').classList.add('hidden');
  startGame();
});
$('#close-result-button').addEventListener('click', () => $('#result-modal').classList.add('hidden'));
$('#pause-toggle').addEventListener('click', () => {
  if (game.status === 'running') {
    game.pause(); $('#pause-modal').classList.remove('hidden');
  } else if (game.status === 'paused') {
    game.resume(); $('#pause-modal').classList.add('hidden');
  }
});
$('#resume-button').addEventListener('click', () => { game.resume(); $('#pause-modal').classList.add('hidden'); });
$('#restart-from-pause').addEventListener('click', () => { $('#pause-modal').classList.add('hidden'); startGame(); });

function toggleModal(selector, show) { $(selector).classList.toggle('hidden', !show); }
function openInfoModal(selector) {
  resumeAfterInfo = game.status === 'running';
  if (resumeAfterInfo) game.pause();
  toggleModal(selector, true);
}
function closeInfoModal(selector) {
  toggleModal(selector, false);
  if (resumeAfterInfo && game.status === 'paused') game.resume();
  resumeAfterInfo = false;
}
$('#help-toggle').addEventListener('click', () => openInfoModal('#help-modal'));
$('#lesson-toggle').addEventListener('click', () => openInfoModal('#lesson-modal'));
$('#close-lesson').addEventListener('click', () => closeInfoModal('#lesson-modal'));
$('#close-lesson-button').addEventListener('click', () => closeInfoModal('#lesson-modal'));
$('#lesson-modal').addEventListener('click', (event) => { if (event.target.id === 'lesson-modal') closeInfoModal('#lesson-modal'); });
$('#close-help').addEventListener('click', () => closeInfoModal('#help-modal'));
$('#close-help-button').addEventListener('click', () => closeInfoModal('#help-modal'));
$('#help-modal').addEventListener('click', (event) => { if (event.target.id === 'help-modal') closeInfoModal('#help-modal'); });

$('#sound-toggle').addEventListener('click', () => {
  soundEnabled = !soundEnabled;
  $('#sound-toggle').dataset.enabled = String(soundEnabled);
  $('#sound-icon').textContent = soundEnabled ? '♫' : '♪̸';
  $('#sound-toggle').title = soundEnabled ? 'Suara aktif' : 'Suara nonaktif';
  $('#sound-toggle').setAttribute('aria-label', soundEnabled ? 'Matikan suara' : 'Nyalakan suara');
  game.config.sound = soundEnabled;
  showToast(soundEnabled ? 'Suara diaktifkan.' : 'Suara dimatikan.', 'info');
});

$('#fullscreen-toggle').addEventListener('click', async () => {
  try {
    if (!document.fullscreenElement) await document.documentElement.requestFullscreen();
    else await document.exitFullscreen();
  } catch (error) { showToast('Mode layar penuh tidak tersedia di perangkat ini.', 'wrong'); }
});

window.addEventListener('keydown', (event) => {
  if (event.key === 'Escape') {
    if (!$('#help-modal').classList.contains('hidden')) closeInfoModal('#help-modal');
    else if (!$('#lesson-modal').classList.contains('hidden')) closeInfoModal('#lesson-modal');
    else if (game.status === 'running') { game.pause(); $('#pause-modal').classList.remove('hidden'); }
  }
  if (['1', '2', '3'].includes(event.key) && game.status === 'running') {
    const category = { '1': 'organic', '2': 'inorganic', '3': 'b3' }[event.key];
    game.sortSelected(category);
  }
});

// Initial state: draw bins and initialize all counters before the first round.
resizeCanvas();
updateUI(game.snapshot());
