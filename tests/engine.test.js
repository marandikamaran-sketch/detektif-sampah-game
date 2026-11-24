import test from 'node:test';
import assert from 'node:assert/strict';
import { createManifest, getAccuracy, getWastePositions, SortGame } from '../src/game/engine.js';

test('manifest 1.000 objek punya jumlah dan proporsi latihan yang tepat', () => {
  const { manifest, composition } = createManifest(1000);
  assert.equal(manifest.length, 1000);
  assert.equal(composition.organic, 400);
  assert.equal(composition.inorganic, 500);
  assert.equal(composition.b3, 100);
  assert.equal(new Set(manifest.map((item) => item.instanceId)).size, 1000);
});

test('akurasi dihitung dari percobaan benar dan salah', () => {
  assert.equal(getAccuracy(0, 0), 100);
  assert.equal(getAccuracy(8, 2), 80);
  assert.equal(getAccuracy(1, 2), 33);
});

test('posisi gelombang selalu berada di area canvas', () => {
  const items = Array.from({ length: 12 }, (_, index) => ({ index }));
  const points = getWastePositions(items, 380, 620);
  assert.equal(points.length, 12);
  for (const point of points) {
    assert.ok(point.x >= 0 && point.x <= 380);
    assert.ok(point.y >= 0 && point.y < 500);
  }
});

test('drop benar diterima, drop salah ditolak tanpa mengurangi sisa objek', () => {
  const game = new SortGame();
  game.setViewport(1000, 640);
  game.start({ total: 30, speed: 'normal' });
  for (const item of game.items) {
    item.falling = false;
    item.x = item.homeX;
    item.y = item.homeY;
  }

  const wrongItem = game.items[0];
  const wrongCategory = wrongItem.category === 'organic' ? 'inorganic' : 'organic';
  const wrongBin = game.bins.find((bin) => bin.id === wrongCategory);
  const beforeWrong = game.snapshot();
  game.pointerDown(1, wrongItem.x, wrongItem.y);
  game.pointerMove(1, wrongBin.cx, wrongBin.cy);
  game.pointerUp(1, wrongBin.cx, wrongBin.cy);
  const afterWrong = game.snapshot();
  assert.equal(afterWrong.wrong, beforeWrong.wrong + 1);
  assert.equal(afterWrong.sorted, beforeWrong.sorted);
  assert.equal(afterWrong.remaining, beforeWrong.remaining);

  const rightItem = game.items.find((item) => item.instanceId !== wrongItem.instanceId);
  const rightBin = game.bins.find((bin) => bin.id === rightItem.category);
  game.pointerDown(2, rightItem.x, rightItem.y);
  game.pointerMove(2, rightBin.cx, rightBin.cy);
  game.pointerUp(2, rightBin.cx, rightBin.cy);
  const afterRight = game.snapshot();
  assert.equal(afterRight.correct, 1);
  assert.equal(afterRight.sorted, 1);
  assert.equal(afterRight.remaining, 29);
  assert.ok(afterRight.score >= 10);
});

test('dua pointer dapat menarik dua objek yang berbeda', () => {
  const game = new SortGame();
  game.setViewport(1000, 640);
  game.start({ total: 30 });
  game.items.forEach((item) => { item.falling = false; item.x = item.homeX; item.y = item.homeY; });
  const first = game.items[0];
  const second = game.items[1];
  assert.notEqual(first.instanceId, second.instanceId);
  game.pointerDown(11, first.x, first.y);
  game.pointerDown(22, second.x, second.y);
  assert.equal(game.pointerDrags.size, 2);
  const firstBin = game.bins.find((bin) => bin.id === first.category);
  const secondBin = game.bins.find((bin) => bin.id === second.category);
  game.pointerMove(11, firstBin.cx, firstBin.cy);
  game.pointerMove(22, secondBin.cx, secondBin.cy);
  game.pointerUp(11, firstBin.cx, firstBin.cy);
  game.pointerUp(22, secondBin.cx, secondBin.cy);
  assert.equal(game.snapshot().correct, 2);
  assert.equal(game.pointerDrags.size, 0);
});
