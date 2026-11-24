import { CATEGORIES } from './catalog.js';
import { getBinRects } from './engine.js';

const TAU = Math.PI * 2;

function roundedRect(ctx, x, y, w, h, r, fill, stroke = null, lineWidth = 1) {
  const radius = Math.min(r, w / 2, h / 2);
  ctx.beginPath();
  ctx.moveTo(x + radius, y);
  ctx.arcTo(x + w, y, x + w, y + h, radius);
  ctx.arcTo(x + w, y + h, x, y + h, radius);
  ctx.arcTo(x, y + h, x, y, radius);
  ctx.arcTo(x, y, x + w, y, radius);
  ctx.closePath();
  if (fill) { ctx.fillStyle = fill; ctx.fill(); }
  if (stroke) { ctx.strokeStyle = stroke; ctx.lineWidth = lineWidth; ctx.stroke(); }
}

function path(ctx, points, fill, stroke = null, width = 1) {
  ctx.beginPath();
  points.forEach(([x, y], index) => index === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y));
  ctx.closePath();
  if (fill) { ctx.fillStyle = fill; ctx.fill(); }
  if (stroke) { ctx.strokeStyle = stroke; ctx.lineWidth = width; ctx.stroke(); }
}

function drawCloud(ctx, x, y, scale = 1) {
  ctx.save(); ctx.translate(x, y); ctx.scale(scale, scale);
  ctx.fillStyle = 'rgba(255,255,255,.8)';
  ctx.beginPath(); ctx.arc(0, 12, 16, 0, TAU); ctx.arc(20, 4, 22, 0, TAU); ctx.arc(43, 14, 16, 0, TAU); ctx.arc(23, 18, 20, 0, TAU); ctx.fill();
  ctx.restore();
}

function drawTree(ctx, x, y, scale = 1) {
  ctx.save(); ctx.translate(x, y); ctx.scale(scale, scale);
  roundedRect(ctx, -7, 10, 14, 48, 6, '#9b6845');
  ctx.fillStyle = '#39a96b';
  [[-20, 0, 25], [8, -12, 28], [27, 7, 23], [-2, 17, 28]].forEach(([cx, cy, r]) => { ctx.beginPath(); ctx.arc(cx, cy, r, 0, TAU); ctx.fill(); });
  ctx.fillStyle = 'rgba(255,255,255,.17)'; ctx.beginPath(); ctx.arc(-12, -9, 10, 0, TAU); ctx.fill();
  ctx.restore();
}

function drawBackground(ctx, w, h, now) {
  const sky = ctx.createLinearGradient(0, 0, 0, h);
  sky.addColorStop(0, '#dff3ff'); sky.addColorStop(.54, '#eef9ff'); sky.addColorStop(1, '#d9efd9');
  ctx.fillStyle = sky; ctx.fillRect(0, 0, w, h);
  ctx.fillStyle = 'rgba(255,220,107,.8)'; ctx.beginPath(); ctx.arc(w - 72, 72, 35, 0, TAU); ctx.fill();
  drawCloud(ctx, w * .17, 68, .76); drawCloud(ctx, w * .69, 108, .62);
  // School building in the distance
  const buildingY = h * .36;
  roundedRect(ctx, w * .36, buildingY - 78, w * .29, 116, 10, '#f6d6a5', '#d7b67f', 2);
  path(ctx, [[w * .33, buildingY - 78], [w * .505, buildingY - 130], [w * .68, buildingY - 78]], '#e97858', '#bd573f', 2);
  roundedRect(ctx, w * .445, buildingY - 36, w * .12, 74, 7, '#8bc9df', '#609ab3', 2);
  for (let i = 0; i < 3; i += 1) {
    roundedRect(ctx, w * .375 + i * w * .075, buildingY - 58, w * .05, 28, 4, '#a8d9e8', '#7faebe', 1);
  }
  ctx.fillStyle = '#fff8de'; ctx.font = `900 ${Math.max(10, Math.min(14, w / 70))}px Nunito, sans-serif`; ctx.textAlign = 'center';
  ctx.fillText('SEKOLAH HIJAU', w * .505, buildingY - 92);
  // distant green hills
  ctx.fillStyle = '#a8dcb4'; ctx.beginPath(); ctx.moveTo(0, h * .57); ctx.quadraticCurveTo(w * .2, h * .42, w * .43, h * .58); ctx.quadraticCurveTo(w * .7, h * .43, w, h * .56); ctx.lineTo(w, h); ctx.lineTo(0, h); ctx.fill();
  drawTree(ctx, w * .12, h * .54, .9); drawTree(ctx, w * .88, h * .54, .84);
  // ground / sorting plaza
  const groundY = h * .70;
  const grass = ctx.createLinearGradient(0, groundY, 0, h);
  grass.addColorStop(0, '#8bcc83'); grass.addColorStop(.22, '#6cbd78'); grass.addColorStop(1, '#48a66b');
  ctx.fillStyle = grass; ctx.fillRect(0, groundY, w, h - groundY);
  ctx.fillStyle = 'rgba(255,255,255,.18)';
  for (let i = 0; i < 18; i += 1) {
    const x = (i * 97 + 13) % Math.max(1, w); const y = groundY + 10 + ((i * 31) % Math.max(1, h - groundY - 12));
    ctx.beginPath(); ctx.ellipse(x, y, 3, 1.5, -.5, 0, TAU); ctx.fill();
  }
  // Stage tray for incoming waste
  roundedRect(ctx, 18, 76, w - 36, Math.max(175, groundY - 92), 22, 'rgba(255,255,255,.40)', 'rgba(255,255,255,.76)', 1.5);
  ctx.save(); ctx.setLineDash([6, 7]); roundedRect(ctx, 27, 85, w - 54, Math.max(157, groundY - 110), 18, null, 'rgba(66,147,157,.28)', 1); ctx.restore();
  ctx.fillStyle = 'rgba(46,113,121,.66)'; ctx.font = `800 ${Math.max(9, Math.min(12, w / 82))}px Nunito, sans-serif`; ctx.textAlign = 'left';
  ctx.fillText('AREA HUJAN SAMPAH  •  SERET OBJEK KE TONG YANG TEPAT', 36, 65);
  // wind swirls, moving subtly
  const sway = Math.sin(now / 900) * 3;
  ctx.strokeStyle = 'rgba(72,145,164,.22)'; ctx.lineWidth = 2;
  for (let i = 0; i < 3; i += 1) {
    ctx.beginPath(); ctx.arc(w * .78 + sway + i * 12, h * .43 + i * 9, 8 + i * 3, Math.PI * .1, Math.PI * 1.3); ctx.stroke();
  }
}

function drawLeaf(ctx, x, y, s) {
  ctx.save(); ctx.translate(x, y); ctx.scale(s, s); ctx.rotate(-.35);
  ctx.fillStyle = '#36995b'; ctx.beginPath(); ctx.moveTo(-23, 7); ctx.bezierCurveTo(-22, -18, 6, -27, 25, -15); ctx.bezierCurveTo(15, 10, -4, 25, -23, 7); ctx.fill();
  ctx.strokeStyle = '#c8ef9d'; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(-22, 8); ctx.quadraticCurveTo(0, 0, 22, -14); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(-5, 3); ctx.lineTo(-5, -8); ctx.moveTo(7, -5); ctx.lineTo(8, -15); ctx.stroke();
  ctx.restore();
}

function drawWasteObject(ctx, kind, x, y, scale = 1) {
  ctx.save(); ctx.translate(x, y); ctx.scale(scale, scale);
  ctx.lineJoin = 'round'; ctx.lineCap = 'round';
  switch (kind) {
    case 'banana': {
      ctx.fillStyle = '#edc83f'; ctx.strokeStyle = '#b88a21'; ctx.lineWidth = 2;
      ctx.beginPath(); ctx.moveTo(-19, -16); ctx.bezierCurveTo(-23, 1, -6, 20, 16, 12); ctx.bezierCurveTo(26, 8, 28, 0, 23, -4); ctx.bezierCurveTo(18, 8, 0, 8, -6, -6); ctx.bezierCurveTo(-10, -15, -13, -20, -19, -16); ctx.fill(); ctx.stroke();
      ctx.fillStyle = '#77502b'; roundedRect(ctx, -21, -19, 7, 5, 2, '#77502b'); roundedRect(ctx, 19, -7, 7, 5, 2, '#77502b');
      ctx.strokeStyle = '#fff0a2'; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(-12, -10); ctx.quadraticCurveTo(-3, 7, 12, 7); ctx.stroke(); break;
    }
    case 'leaf': drawLeaf(ctx, 0, 0, 1.05); break;
    case 'rice': {
      ctx.fillStyle = '#dce8ef'; ctx.beginPath(); ctx.ellipse(0, 7, 25, 12, 0, 0, TAU); ctx.fill();
      ctx.fillStyle = '#fff'; ctx.beginPath(); ctx.ellipse(0, 1, 21, 10, 0, 0, TAU); ctx.fill();
      ctx.fillStyle = '#e9d9a4';
      for (let i = 0; i < 17; i += 1) { const a = i * 2.4; ctx.beginPath(); ctx.ellipse(Math.cos(a) * (7 + (i % 3) * 3), Math.sin(a) * 5, 2.4, 1.5, a, 0, TAU); ctx.fill(); }
      ctx.fillStyle = '#62aa5b'; ctx.beginPath(); ctx.arc(-7, -3, 3, 0, TAU); ctx.fill(); break;
    }
    case 'orange': {
      const g = ctx.createRadialGradient(-7, -9, 3, 0, 0, 24); g.addColorStop(0, '#ffd46c'); g.addColorStop(1, '#e97820');
      ctx.fillStyle = g; ctx.beginPath(); ctx.arc(0, 0, 20, 0, TAU); ctx.fill();
      ctx.fillStyle = '#4b9a50'; ctx.beginPath(); ctx.ellipse(8, -19, 7, 3.5, -.5, 0, TAU); ctx.fill();
      ctx.strokeStyle = '#ffedb0'; ctx.lineWidth = 1.4; ctx.beginPath(); ctx.arc(0, 0, 13, .2, 2.6); ctx.stroke(); break;
    }
    case 'apple': {
      const g = ctx.createLinearGradient(-18, -20, 16, 22); g.addColorStop(0, '#ff766b'); g.addColorStop(1, '#b82035');
      ctx.fillStyle = g; ctx.beginPath(); ctx.moveTo(0, -10); ctx.bezierCurveTo(-24, -29, -28, 4, -12, 18); ctx.quadraticCurveTo(0, 27, 12, 17); ctx.bezierCurveTo(29, -5, 22, -26, 0, -10); ctx.fill();
      ctx.strokeStyle = '#6b3c2b'; ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(0, -12); ctx.lineTo(4, -23); ctx.stroke();
      ctx.fillStyle = '#57a55b'; ctx.beginPath(); ctx.ellipse(10, -20, 7, 3, -.4, 0, TAU); ctx.fill(); break;
    }
    case 'tissue': {
      ctx.save(); ctx.rotate(-.12); const g = ctx.createLinearGradient(-20, -18, 20, 20); g.addColorStop(0, '#fff'); g.addColorStop(1, '#d5dfe5');
      roundedRect(ctx, -21, -16, 42, 34, 8, g, '#b7c7d0', 1.5);
      ctx.strokeStyle = '#b8c6ce'; ctx.lineWidth = 1.5; ctx.beginPath(); ctx.moveTo(-12, -9); ctx.quadraticCurveTo(0, 0, -7, 10); ctx.moveTo(3, -12); ctx.quadraticCurveTo(15, -3, 8, 9); ctx.stroke(); ctx.restore(); break;
    }
    case 'bottle': {
      const body = ctx.createLinearGradient(-15, 0, 15, 0); body.addColorStop(0, 'rgba(54,156,203,.55)'); body.addColorStop(.35, 'rgba(223,250,255,.9)'); body.addColorStop(1, 'rgba(36,137,194,.63)');
      roundedRect(ctx, -15, -12, 30, 34, 7, body, '#3286ad', 2);
      roundedRect(ctx, -8, -23, 16, 13, 4, '#93d8ed', '#3286ad', 1.5); roundedRect(ctx, -8, -29, 16, 7, 2, '#167dad');
      ctx.fillStyle = 'rgba(255,255,255,.7)'; roundedRect(ctx, -10, -7, 4, 22, 2, 'rgba(255,255,255,.72)');
      roundedRect(ctx, -11, 3, 22, 9, 3, '#4cb6a2'); break;
    }
    case 'can': {
      const g = ctx.createLinearGradient(-20, 0, 20, 0); g.addColorStop(0, '#8798a3'); g.addColorStop(.25, '#f3f6f7'); g.addColorStop(.58, '#b9c7ce'); g.addColorStop(1, '#778b95');
      roundedRect(ctx, -17, -21, 34, 43, 7, g, '#72858e', 1.5);
      ctx.fillStyle = '#e94f52'; ctx.fillRect(-16, -8, 32, 16);
      ctx.fillStyle = '#fff'; ctx.font = '900 9px Nunito'; ctx.textAlign = 'center'; ctx.fillText('FRESH', 0, 3);
      ctx.strokeStyle = '#667982'; ctx.lineWidth = 2; ctx.beginPath(); ctx.ellipse(0, -19, 15, 3, 0, 0, TAU); ctx.stroke(); ctx.beginPath(); ctx.ellipse(0, 20, 15, 3, 0, 0, TAU); ctx.stroke();
      ctx.fillStyle = '#d7e1e4'; ctx.beginPath(); ctx.ellipse(2, -19, 5, 1.5, -.1, 0, TAU); ctx.fill(); break;
    }
    case 'wrapper': {
      const g = ctx.createLinearGradient(-25, -10, 25, 10); g.addColorStop(0, '#ffcf54'); g.addColorStop(.5, '#f18b24'); g.addColorStop(1, '#dc572c');
      path(ctx, [[-22, -14], [-14, -19], [14, -17], [23, -12], [20, 14], [11, 19], [-16, 17], [-23, 11]], g, '#b95327', 1.5);
      ctx.strokeStyle = '#ffed9c'; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(-12, -6); ctx.lineTo(12, -6); ctx.moveTo(-9, 2); ctx.lineTo(9, 2); ctx.stroke();
      ctx.fillStyle = '#fff5d5'; ctx.font = '900 8px Nunito'; ctx.textAlign = 'center'; ctx.fillText('SNACK', 0, 11); break;
    }
    case 'bag': {
      ctx.fillStyle = 'rgba(110,191,225,.6)'; ctx.strokeStyle = '#4c9fc5'; ctx.lineWidth = 2;
      ctx.beginPath(); ctx.moveTo(-15, -15); ctx.lineTo(-22, 18); ctx.quadraticCurveTo(0, 25, 22, 18); ctx.lineTo(15, -15); ctx.lineTo(7, -18); ctx.lineTo(6, -9); ctx.lineTo(-6, -9); ctx.lineTo(-7, -18); ctx.closePath(); ctx.fill(); ctx.stroke();
      ctx.strokeStyle = 'rgba(255,255,255,.8)'; ctx.beginPath(); ctx.moveTo(-9, -5); ctx.lineTo(-12, 12); ctx.moveTo(4, -3); ctx.lineTo(8, 15); ctx.stroke(); break;
    }
    case 'cup': {
      path(ctx, [[-18, -18], [18, -18], [13, 22], [-13, 22]], 'rgba(239,250,255,.86)', '#4b91b2', 2);
      ctx.fillStyle = '#63c4ad'; ctx.fillRect(-14, 0, 28, 9); ctx.strokeStyle = '#76c0d6'; ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(-3, -18); ctx.lineTo(-3, -29); ctx.stroke();
      ctx.fillStyle = 'rgba(255,255,255,.8)'; ctx.beginPath(); ctx.ellipse(0, -18, 18, 4, 0, 0, TAU); ctx.fill(); break;
    }
    case 'carton': {
      path(ctx, [[-17, -17], [8, -22], [19, -14], [18, 20], [-17, 18]], '#e7f1ee', '#739c91', 2);
      path(ctx, [[-17, -17], [8, -22], [7, -11], [-17, -7]], '#c9e1dc', '#739c91', 1);
      ctx.fillStyle = '#3b9d75'; ctx.fillRect(-15, 1, 31, 9); ctx.fillStyle = '#fff'; ctx.font = '900 8px Nunito'; ctx.textAlign = 'center'; ctx.fillText('JUICE', 0, 8); break;
    }
    case 'battery': {
      const g = ctx.createLinearGradient(-14, 0, 14, 0); g.addColorStop(0, '#253b43'); g.addColorStop(.5, '#56717b'); g.addColorStop(1, '#172a31');
      roundedRect(ctx, -13, -20, 26, 42, 6, g, '#172b31', 2); roundedRect(ctx, -6, -25, 12, 6, 2, '#c7d2d5', '#72858e', 1);
      ctx.fillStyle = '#e7c64c'; ctx.font = '900 10px Nunito'; ctx.textAlign = 'center'; ctx.fillText('AA', 0, 4);
      ctx.fillStyle = '#e35a4f'; ctx.beginPath(); ctx.arc(0, -9, 4, 0, TAU); ctx.fill(); break;
    }
    case 'glass': {
      ctx.shadowColor = 'rgba(31,91,126,.2)'; ctx.shadowBlur = 5;
      path(ctx, [[-23, 18], [-13, -20], [-2, 1]], 'rgba(155,220,239,.9)', '#4c9bb8', 2);
      path(ctx, [[-4, 20], [2, -24], [17, 12]], 'rgba(191,235,248,.9)', '#4c9bb8', 2);
      path(ctx, [[5, 19], [18, -12], [24, 17]], 'rgba(126,203,228,.84)', '#4c9bb8', 2);
      ctx.strokeStyle = 'rgba(255,255,255,.9)'; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(-12, -12); ctx.lineTo(-5, 0); ctx.moveTo(5, -15); ctx.lineTo(10, 5); ctx.stroke(); break;
    }
    case 'mask': {
      ctx.strokeStyle = '#68a9bd'; ctx.lineWidth = 3; ctx.beginPath(); ctx.ellipse(-19, 0, 9, 15, 0, -Math.PI / 2, Math.PI / 2); ctx.ellipse(19, 0, 9, 15, 0, Math.PI / 2, Math.PI * 1.5); ctx.stroke();
      const g = ctx.createLinearGradient(0, -18, 0, 18); g.addColorStop(0, '#e4f8ff'); g.addColorStop(1, '#8bcde0');
      roundedRect(ctx, -19, -17, 38, 34, 8, g, '#5b9eb5', 1.5);
      ctx.strokeStyle = '#6eafc3'; ctx.lineWidth = 1.2; for (let yy = -9; yy <= 9; yy += 6) { ctx.beginPath(); ctx.moveTo(-15, yy); ctx.lineTo(15, yy); ctx.stroke(); } break;
    }
    default: roundedRect(ctx, -17, -17, 34, 34, 8, '#b7d9c4');
  }
  ctx.restore();
}

function drawWaste(ctx, item, now, isSelected, isDragging) {
  const isSmall = item.scale < .8;
  const radius = isSmall ? 27 : 30;
  const pulse = isSelected ? 1 + Math.sin(now / 100) * .045 : 1;
  ctx.save(); ctx.translate(item.x, item.y); ctx.rotate(item.rotation + Math.sin(now / 600 + item.wobble) * (isDragging ? 0 : .025)); ctx.scale(pulse, pulse);
  ctx.shadowColor = isDragging ? 'rgba(25,70,80,.30)' : 'rgba(34,79,87,.17)'; ctx.shadowBlur = isDragging ? 18 : 9; ctx.shadowOffsetY = isDragging ? 9 : 4;
  ctx.fillStyle = '#fff'; ctx.beginPath(); ctx.arc(0, 0, radius, 0, TAU); ctx.fill();
  ctx.shadowColor = 'transparent'; ctx.strokeStyle = isSelected ? '#147b9a' : 'rgba(89,141,151,.25)'; ctx.lineWidth = isSelected ? 3 : 1.4; ctx.stroke();
  drawWasteObject(ctx, item.kind, 0, -2, isSmall ? .8 : .9);
  // Small category-neutral label pill
  ctx.font = `800 ${Math.max(8, Math.min(10, radius / 2.8))}px Nunito, sans-serif`;
  const label = item.name;
  const maxW = 108; const labelW = Math.min(maxW, ctx.measureText(label).width + 14);
  roundedRect(ctx, -labelW / 2, radius - 5, labelW, 15, 7, 'rgba(255,255,255,.96)', 'rgba(73,119,127,.18)', 1);
  ctx.fillStyle = '#31545d'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
  let show = label; while (ctx.measureText(show).width > labelW - 8 && show.length > 5) show = `${show.slice(0, -2)}…`;
  ctx.fillText(show, 0, radius + 2.5);
  if (isSelected || isDragging) {
    ctx.strokeStyle = '#18a6ae'; ctx.lineWidth = 2.5; ctx.setLineDash([4, 4]); ctx.beginPath(); ctx.arc(0, 0, radius + 8, 0, TAU); ctx.stroke();
  }
  ctx.restore();
}

function drawBin(ctx, bin, now, effect, narrow) {
  const category = CATEGORIES[bin.id];
  const { x, y, w, h } = bin;
  const isSuccess = effect?.type === 'success';
  const isError = effect?.type === 'error';
  const elapsed = effect ? now - effect.startedAt : 0;
  const pulse = effect ? .5 + .5 * Math.sin(elapsed / (isError ? 55 : 75)) : 0;
  const activeColor = isError ? '#ff343f' : category.color;
  ctx.save();
  if (isSuccess) { ctx.shadowColor = `rgba(255,255,255,${.5 + pulse * .5})`; ctx.shadowBlur = 25 + pulse * 15; }
  if (isError) { ctx.shadowColor = `rgba(255,30,45,${.45 + pulse * .5})`; ctx.shadowBlur = 18 + pulse * 18; }
  // drop shadow
  ctx.fillStyle = 'rgba(34,84,59,.17)'; ctx.beginPath(); ctx.ellipse(x + w / 2, y + h - 1, w * .45, 9, 0, 0, TAU); ctx.fill();
  // Body
  const bodyX = x + w * .08; const bodyY = y + 20; const bodyW = w * .84; const bodyH = h - 28;
  const bodyGradient = ctx.createLinearGradient(bodyX, bodyY, bodyX + bodyW, bodyY + bodyH);
  if (isError) { bodyGradient.addColorStop(0, '#ff777b'); bodyGradient.addColorStop(1, '#d92834'); }
  else { bodyGradient.addColorStop(0, category.color); bodyGradient.addColorStop(.46, category.color); bodyGradient.addColorStop(1, category.dark); }
  path(ctx, [[bodyX + 8, bodyY], [bodyX + bodyW - 8, bodyY], [bodyX + bodyW - 17, bodyY + bodyH], [bodyX + 17, bodyY + bodyH]], bodyGradient, isSuccess ? '#fff' : 'rgba(42,87,73,.34)', isSuccess ? 4 : 1.4);
  // Lid and rim
  roundedRect(ctx, x + 2, y + 8, w - 4, 20, 7, isError ? '#ad202b' : category.dark, isSuccess ? '#fff' : 'rgba(255,255,255,.42)', isSuccess ? 3 : 1);
  roundedRect(ctx, x + w * .34, y + 2, w * .32, 8, 4, isError ? '#9c1f2c' : category.dark);
  // Mouth opening
  roundedRect(ctx, x + w * .17, y + 26, w * .66, 18, 8, 'rgba(21,48,46,.56)', 'rgba(255,255,255,.28)', 1);
  // Front label plate
  const plateY = y + (narrow ? 49 : 53);
  roundedRect(ctx, x + w * .13, plateY, w * .74, h * .42, 10, 'rgba(255,255,255,.93)', 'rgba(255,255,255,.5)', 1);
  const iconY = plateY + (narrow ? 17 : 20);
  ctx.fillStyle = category.dark; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
  ctx.font = `900 ${narrow ? 15 : 20}px Nunito, sans-serif`;
  const glyph = bin.id === 'organic' ? '✿' : bin.id === 'inorganic' ? '♻' : '⚠';
  ctx.fillText(isError ? '!' : glyph, x + w / 2, iconY);
  ctx.font = `1000 ${narrow ? 10 : 13}px Nunito, sans-serif`;
  ctx.fillText(isError ? 'DITOLAK' : category.binLabel, x + w / 2, plateY + (narrow ? 36 : 44));
  ctx.font = `900 ${narrow ? 8 : 10}px Nunito, sans-serif`; ctx.fillStyle = category.dark;
  const subtitle = bin.id === 'organic' ? 'MUDAH TERURAI' : bin.id === 'inorganic' ? 'GUNA ULANG / DAUR' : 'PENANGANAN KHUSUS';
  ctx.fillText(isError ? 'SALAH TEMPAT' : subtitle, x + w / 2, plateY + (narrow ? 48 : 59));
  if (isSuccess) {
    ctx.globalAlpha = .24 + pulse * .26; roundedRect(ctx, bodyX - 3, bodyY - 3, bodyW + 6, bodyH + 5, 16, '#fff');
    ctx.globalAlpha = 1;
    ctx.fillStyle = '#fff'; ctx.font = `1000 ${narrow ? 9 : 12}px Nunito`; ctx.fillText('✓ TEPAT!', x + w / 2, y - 4);
  }
  if (isError) {
    ctx.globalAlpha = .25 + pulse * .18; roundedRect(ctx, x - 3, y - 5, w + 6, h + 9, 16, '#ff1f2d'); ctx.globalAlpha = 1;
    ctx.fillStyle = '#fff'; ctx.font = `1000 ${narrow ? 10 : 13}px Nunito`; ctx.fillText('✕ DITOLAK!', x + w / 2, y - 5);
  }
  ctx.restore();
}

function drawParticles(ctx, particles, now) {
  for (const p of particles) {
    const progress = (now - p.startedAt) / p.duration;
    const alpha = 1 - progress;
    ctx.globalAlpha = alpha; ctx.fillStyle = p.color;
    ctx.beginPath(); ctx.arc(p.x + p.vx * progress * 26, p.y + (p.vy * progress + progress * progress * 3) * 26, p.size * (1 - progress * .4), 0, TAU); ctx.fill();
  }
  ctx.globalAlpha = 1;
}

export function renderScene(ctx, game, width, height, now) {
  ctx.clearRect(0, 0, width, height);
  drawBackground(ctx, width, height, now);
  const narrow = width < 560;
  const bins = game.bins.length ? game.bins : getBinRects(width, height);
  for (const item of game.items) {
    const isDragging = item.dragOwner !== null;
    const selected = game.selectedId === item.instanceId;
    drawWaste(ctx, item, now, selected, isDragging);
  }
  drawParticles(ctx, game.particles, now);
  bins.forEach((bin) => drawBin(ctx, bin, now, game.binEffects[bin.id], narrow));
}
