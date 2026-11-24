import { WASTE_ITEMS, CATEGORIES, DEFAULT_DISTRIBUTION } from './catalog.js';

export const WAVE_SIZE = 18;
export const GAME_DEFAULTS = { total: 1000, speed: 'normal', sound: true };

export function shuffle(list) {
  const result = [...list];
  for (let i = result.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

export function createManifest(total, distribution = DEFAULT_DISTRIBUTION) {
  const organicCount = Math.round((total * distribution.organic) / 100);
  const inorganicCount = Math.round((total * distribution.inorganic) / 100);
  const b3Count = Math.max(0, total - organicCount - inorganicCount);
  const buckets = { organic: organicCount, inorganic: inorganicCount, b3: b3Count };
  const manifest = [];
  let serial = 0;
  for (const category of Object.keys(buckets)) {
    const options = WASTE_ITEMS.filter((item) => item.category === category);
    for (let i = 0; i < buckets[category]; i += 1) {
      const picked = options[Math.floor(Math.random() * options.length)];
      manifest.push({ ...picked, instanceId: `waste-${serial++}-${picked.id}` });
    }
  }
  return { manifest: shuffle(manifest), composition: buckets };
}

export function formatNumber(value) {
  return new Intl.NumberFormat('id-ID').format(value);
}

export function getAccuracy(correct, wrong) {
  const total = correct + wrong;
  return total === 0 ? 100 : Math.round((correct / total) * 100);
}

export function getBinRects(width, height) {
  const isNarrow = width < 560;
  const gap = isNarrow ? 8 : 20;
  const margin = isNarrow ? 12 : Math.max(24, width * 0.045);
  const binWidth = Math.min(isNarrow ? (width - margin * 2 - gap * 2) / 3 : 220, (width - margin * 2 - gap * 2) / 3);
  const binHeight = isNarrow ? 122 : 156;
  const totalWidth = binWidth * 3 + gap * 2;
  const startX = (width - totalWidth) / 2;
  const top = height - binHeight - (isNarrow ? 14 : 20);
  const ids = ['organic', 'inorganic', 'b3'];
  return ids.map((id, index) => ({
    id,
    x: startX + index * (binWidth + gap),
    y: top,
    w: binWidth,
    h: binHeight,
    cx: startX + index * (binWidth + gap) + binWidth / 2,
    cy: top + binHeight / 2
  }));
}

export function getWastePositions(items, width, height) {
  const narrow = width < 560;
  const cols = Math.max(3, Math.min(narrow ? 4 : 7, Math.floor((width - (narrow ? 24 : 80)) / (narrow ? 78 : 96))));
  const rows = Math.ceil(items.length / cols);
  const xPad = narrow ? 28 : 52;
  const usableWidth = width - xPad * 2;
  const topY = narrow ? 102 : 108;
  const binTop = getBinRects(width, height)[0].y;
  const availableHeight = Math.max(125, binTop - topY - (narrow ? 38 : 48));
  const rowGap = rows <= 1 ? 0 : Math.min(narrow ? 82 : 92, availableHeight / (rows - 1));
  const colGap = cols <= 1 ? 0 : usableWidth / (cols - 1);
  return items.map((_, index) => ({
    x: xPad + (index % cols) * colGap,
    y: topY + Math.floor(index / cols) * rowGap
  }));
}

export class SortGame {
  constructor({ onChange = () => {}, onMessage = () => {}, onSound = () => {} } = {}) {
    this.onChange = onChange;
    this.onMessage = onMessage;
    this.onSound = onSound;
    this.status = 'idle';
    this.config = { ...GAME_DEFAULTS };
    this.manifest = [];
    this.items = [];
    this.pointerDrags = new Map();
    this.selectedId = null;
    this.bins = [];
    this.composition = { ...DEFAULT_DISTRIBUTION };
    this.wave = 0;
    this.sorted = 0;
    this.correct = 0;
    this.wrong = 0;
    this.score = 0;
    this.streak = 0;
    this.bestStreak = 0;
    this.binEffects = { organic: null, inorganic: null, b3: null };
    this.particles = [];
    this.lastWaveAt = 0;
    this.rainTimer = null;
    this.totalWaves = 0;
    this.lastEvent = null;
  }

  start(config = {}) {
    this.stopTimers();
    this.config = { ...GAME_DEFAULTS, ...config };
    const { manifest, composition } = createManifest(this.config.total);
    this.manifest = manifest;
    this.composition = composition;
    this.items = [];
    this.pointerDrags.clear();
    this.selectedId = null;
    this.wave = 0;
    this.sorted = 0;
    this.correct = 0;
    this.wrong = 0;
    this.score = 0;
    this.streak = 0;
    this.bestStreak = 0;
    this.waveSize = (this.width || 1000) < 560 ? 12 : WAVE_SIZE;
    this.totalWaves = Math.ceil(this.config.total / this.waveSize);
    this.status = 'running';
    this.spawnWave();
    this.emit();
    this.onMessage({ type: 'start', text: 'Misi dimulai! Seret sampah ke tempat yang tepat.' });
  }

  stopTimers() {
    if (this.rainTimer) clearTimeout(this.rainTimer);
    this.rainTimer = null;
  }

  pause() {
    if (this.status !== 'running') return;
    this.status = 'paused';
    for (const [pointerId, drag] of this.pointerDrags.entries()) {
      const item = this.items.find((entry) => entry.instanceId === drag.itemId);
      if (item) { item.dragOwner = null; this.returnItem(item); }
      this.pointerDrags.delete(pointerId);
    }
    this.selectedId = null;
    this.emit();
    this.onMessage({ type: 'pause', text: 'Permainan dijeda.' });
  }

  resume() {
    if (this.status !== 'paused') return;
    this.status = 'running';
    this.emit();
    this.onMessage({ type: 'resume', text: 'Lanjutkan misi!' });
  }

  spawnWave() {
    if (this.manifest.length === 0) {
      this.complete();
      return;
    }
    this.wave += 1;
    const batch = this.manifest.splice(0, this.waveSize || WAVE_SIZE);
    const now = performance.now();
    const speedFactor = this.config.speed === 'fast' ? 0.48 : this.config.speed === 'slow' ? 1.15 : 0.75;
    const positions = getWastePositions(batch, this.width || 1100, this.height || 620);
    batch.forEach((item, index) => {
      const target = positions[index];
      const dropStartX = target.x + (Math.random() - 0.5) * 36;
      const dropStartY = -65 - index * (this.config.speed === 'fast' ? 9 : 17);
      this.items.push({
        ...item,
        x: dropStartX,
        y: dropStartY,
        dropStartX,
        dropStartY,
        homeX: target.x,
        homeY: target.y,
        targetX: target.x,
        targetY: target.y,
        bornAt: now + index * (this.config.speed === 'fast' ? 22 : this.config.speed === 'slow' ? 85 : 48),
        fallDuration: 500 * speedFactor + Math.random() * 180,
        falling: true,
        dragOwner: null,
        returning: null,
        scale: 0.76 + Math.random() * 0.14,
        rotation: (Math.random() - 0.5) * 0.28,
        wobble: Math.random() * Math.PI * 2
      });
    });
    this.emit();
    this.onMessage({ type: 'wave', text: `Gelombang ${this.wave} turun! Pilah ${batch.length} objek.` });
  }

  setViewport(width, height) {
    this.width = width;
    this.height = height;
    this.bins = getBinRects(width, height);
    if (this.items.length > 0) {
      const free = this.items.filter((item) => item.dragOwner === null);
      const positions = getWastePositions(free, width, height);
      free.forEach((item, index) => {
        item.homeX = positions[index].x;
        item.homeY = positions[index].y;
        if (!item.returning && !item.falling) {
          item.x = item.homeX;
          item.y = item.homeY;
        }
      });
    }
  }

  update(now) {
    if (this.status !== 'running') return;
    for (const item of this.items) {
      if (item.dragOwner !== null) continue;
      if (item.falling) {
        const progress = Math.max(0, Math.min(1, (now - item.bornAt) / item.fallDuration));
        const ease = 1 - Math.pow(1 - progress, 3);
        // Interpolate from a fixed spawn point so each object follows a smooth falling arc.
        item.x = item.dropStartX + (item.targetX - item.dropStartX) * ease;
        item.y = item.dropStartY + (item.targetY - item.dropStartY) * ease;
        if (progress >= 1) {
          item.falling = false;
          item.x = item.homeX;
          item.y = item.homeY;
        }
      }
      if (item.returning) {
        const { fromX, fromY, startedAt, duration } = item.returning;
        const progress = Math.max(0, Math.min(1, (now - startedAt) / duration));
        const ease = 1 - Math.pow(1 - progress, 3);
        item.x = fromX + (item.homeX - fromX) * ease;
        item.y = fromY + (item.homeY - fromY) * ease;
        if (progress >= 1) item.returning = null;
      }
    }
    for (const [id, fx] of Object.entries(this.binEffects)) {
      if (fx && now - fx.startedAt > fx.duration) this.binEffects[id] = null;
    }
    this.particles = this.particles.filter((particle) => now - particle.startedAt < particle.duration);
    if (this.items.length === 0 && this.manifest.length > 0 && !this.rainTimer) {
      this.rainTimer = setTimeout(() => {
        this.rainTimer = null;
        if (this.status === 'running') this.spawnWave();
      }, 540);
    }
  }

  getBinAt(x, y) {
    return this.bins.find((bin) => x >= bin.x - 6 && x <= bin.x + bin.w + 6 && y >= bin.y - 18 && y <= bin.y + bin.h + 8) || null;
  }

  getItemAt(x, y) {
    for (let i = this.items.length - 1; i >= 0; i -= 1) {
      const item = this.items[i];
      if (item.falling || item.dragOwner !== null || item.returning) continue;
      const radius = this.width < 560 ? 32 : 39;
      if (Math.hypot(item.x - x, item.y - y) <= radius) return item;
    }
    return null;
  }

  pointerDown(pointerId, x, y) {
    if (this.status !== 'running') return null;
    const bin = this.getBinAt(x, y);
    if (bin && this.selectedId) {
      const selected = this.items.find((item) => item.instanceId === this.selectedId);
      if (selected) this.trySort(selected, bin);
      return { type: 'bin', bin };
    }
    const item = this.getItemAt(x, y);
    if (!item) return null;
    this.selectedId = item.instanceId;
    item.dragOwner = pointerId;
    this.pointerDrags.set(pointerId, {
      itemId: item.instanceId,
      offsetX: item.x - x,
      offsetY: item.y - y,
      startX: x,
      startY: y,
      moved: false
    });
    this.emit();
    return { type: 'item', item };
  }

  pointerMove(pointerId, x, y) {
    const drag = this.pointerDrags.get(pointerId);
    if (!drag) return;
    const item = this.items.find((entry) => entry.instanceId === drag.itemId);
    if (!item) return;
    if (Math.hypot(x - drag.startX, y - drag.startY) > 5) drag.moved = true;
    item.x = Math.max(30, Math.min((this.width || 1000) - 30, x + drag.offsetX));
    item.y = Math.max(50, Math.min((this.height || 600) - 35, y + drag.offsetY));
  }

  pointerUp(pointerId, x, y) {
    const drag = this.pointerDrags.get(pointerId);
    if (!drag) return;
    this.pointerDrags.delete(pointerId);
    const item = this.items.find((entry) => entry.instanceId === drag.itemId);
    if (!item) return;
    item.dragOwner = null;
    const bin = this.getBinAt(x, y);
    if (bin) {
      this.trySort(item, bin);
    } else if (!drag.moved) {
      this.selectedId = item.instanceId;
      this.onMessage({ type: 'select', item, text: `${item.name} dipilih. Tarik ke tempat sampah yang sesuai.` });
      this.emit();
    } else {
      this.returnItem(item);
    }
  }

  pointerCancel(pointerId) {
    const drag = this.pointerDrags.get(pointerId);
    if (!drag) return;
    this.pointerDrags.delete(pointerId);
    const item = this.items.find((entry) => entry.instanceId === drag.itemId);
    if (item) {
      item.dragOwner = null;
      this.returnItem(item);
      if (this.selectedId === item.instanceId) this.selectedId = null;
    }
  }

  sortSelected(category) {
    if (!this.selectedId || this.status !== 'running') return;
    const item = this.items.find((entry) => entry.instanceId === this.selectedId);
    const bin = this.bins.find((entry) => entry.id === category);
    if (item && bin) this.trySort(item, bin);
  }

  returnItem(item) {
    item.returning = { fromX: item.x, fromY: item.y, startedAt: performance.now(), duration: 280 };
  }

  trySort(item, bin) {
    if (item.category === bin.id) {
      this.items = this.items.filter((entry) => entry.instanceId !== item.instanceId);
      this.selectedId = null;
      this.sorted += 1;
      this.correct += 1;
      this.score += 10 + Math.min(10, Math.floor(this.streak / 4) * 2);
      this.streak += 1;
      this.bestStreak = Math.max(this.bestStreak, this.streak);
      this.binEffects[bin.id] = { type: 'success', startedAt: performance.now(), duration: 680 };
      this.emitParticles(bin.cx, bin.y + 15, CATEGORIES[bin.id].color);
      this.onSound('correct');
      this.onMessage({ type: 'correct', text: `Tepat! ${item.name} masuk ${CATEGORIES[bin.id].name}.`, item, category: bin.id });
      this.emit();
      if (this.sorted >= this.config.total) this.complete();
    } else {
      this.wrong += 1;
      this.streak = 0;
      this.binEffects[bin.id] = { type: 'error', startedAt: performance.now(), duration: 760 };
      this.selectedId = null;
      this.returnItem(item);
      this.onSound('wrong');
      this.onMessage({ type: 'wrong', text: `Ditolak! ${item.name} bukan untuk tempat sampah ${CATEGORIES[bin.id].name}.`, item, correctCategory: item.category, bin: bin.id });
      this.emit();
    }
  }

  emitParticles(x, y, color) {
    const now = performance.now();
    for (let i = 0; i < 14; i += 1) {
      const angle = Math.random() * Math.PI * 2;
      const speed = 1.2 + Math.random() * 3.4;
      this.particles.push({ x, y, vx: Math.cos(angle) * speed, vy: Math.sin(angle) * speed - 1.4, color, startedAt: now, duration: 620, size: 2 + Math.random() * 4 });
    }
  }

  complete() {
    this.stopTimers();
    this.status = 'completed';
    this.items = [];
    this.pointerDrags.clear();
    this.selectedId = null;
    this.emit();
    this.onSound('finish');
    this.onMessage({ type: 'complete', text: 'Hebat! Semua sampah berhasil dipilah.' });
  }

  emit() {
    this.onChange(this.snapshot());
  }

  snapshot() {
    return {
      status: this.status,
      total: this.config.total,
      sorted: this.sorted,
      remaining: this.config.total - this.sorted,
      correct: this.correct,
      wrong: this.wrong,
      score: this.score,
      streak: this.streak,
      bestStreak: this.bestStreak,
      accuracy: getAccuracy(this.correct, this.wrong),
      wave: this.wave,
      totalWaves: this.totalWaves,
      composition: { ...this.composition },
      selectedId: this.selectedId,
      sound: this.config.sound
    };
  }
}
