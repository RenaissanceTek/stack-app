// Generate simple PNG icons for the PWA: dark background with a white "S" glyph.
// No external deps — writes PNG bytes directly via zlib deflate and CRC32.

import fs from 'node:fs';
import path from 'node:path';
import zlib from 'node:zlib';

const outDir = path.resolve(process.cwd(), 'public/icons');
fs.mkdirSync(outDir, { recursive: true });

// CRC32
const crcTable = (() => {
  const t = new Uint32Array(256);
  for (let n = 0; n < 256; n++) {
    let c = n;
    for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
    t[n] = c >>> 0;
  }
  return t;
})();

function crc32(buf) {
  let c = 0xffffffff;
  for (let i = 0; i < buf.length; i++) c = crcTable[(c ^ buf[i]) & 0xff] ^ (c >>> 8);
  return (c ^ 0xffffffff) >>> 0;
}

function chunk(type, data) {
  const len = Buffer.alloc(4);
  len.writeUInt32BE(data.length, 0);
  const t = Buffer.from(type, 'ascii');
  const crc = Buffer.alloc(4);
  crc.writeUInt32BE(crc32(Buffer.concat([t, data])), 0);
  return Buffer.concat([len, t, data, crc]);
}

function makePng(size, pixels) {
  // pixels: RGBA Uint8Array of size*size*4
  const sig = Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]);
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(size, 0);
  ihdr.writeUInt32BE(size, 4);
  ihdr[8] = 8; // bit depth
  ihdr[9] = 6; // color type RGBA
  ihdr[10] = 0;
  ihdr[11] = 0;
  ihdr[12] = 0;

  // Filter byte 0 per scanline
  const stride = size * 4;
  const raw = Buffer.alloc((stride + 1) * size);
  for (let y = 0; y < size; y++) {
    raw[y * (stride + 1)] = 0;
    pixels.copy ? pixels.copy(raw, y * (stride + 1) + 1, y * stride, y * stride + stride) :
      raw.set(pixels.subarray(y * stride, y * stride + stride), y * (stride + 1) + 1);
  }
  const idat = zlib.deflateSync(raw);

  return Buffer.concat([
    sig,
    chunk('IHDR', ihdr),
    chunk('IDAT', idat),
    chunk('IEND', Buffer.alloc(0)),
  ]);
}

// Simple 5x7 font bitmap for the letter S
// 1 = white, 0 = transparent-over-bg
const S_GLYPH = [
  [0, 1, 1, 1, 0],
  [1, 0, 0, 0, 1],
  [1, 0, 0, 0, 0],
  [0, 1, 1, 1, 0],
  [0, 0, 0, 0, 1],
  [1, 0, 0, 0, 1],
  [0, 1, 1, 1, 0],
];

function renderIcon(size, { padding = 0 } = {}) {
  const pixels = Buffer.alloc(size * size * 4);
  // fill background
  const bgR = 0x0a, bgG = 0x0a, bgB = 0x0a;
  for (let i = 0; i < size * size; i++) {
    pixels[i * 4] = bgR;
    pixels[i * 4 + 1] = bgG;
    pixels[i * 4 + 2] = bgB;
    pixels[i * 4 + 3] = 0xff;
  }

  // Draw S glyph centered, upscaled
  const gw = 5;
  const gh = 7;
  const inner = size - padding * 2;
  const scale = Math.floor(Math.min(inner / gw, inner / gh) * 0.7);
  const drawW = gw * scale;
  const drawH = gh * scale;
  const startX = Math.floor((size - drawW) / 2);
  const startY = Math.floor((size - drawH) / 2);

  for (let gy = 0; gy < gh; gy++) {
    for (let gx = 0; gx < gw; gx++) {
      if (S_GLYPH[gy][gx] === 1) {
        for (let dy = 0; dy < scale; dy++) {
          for (let dx = 0; dx < scale; dx++) {
            const x = startX + gx * scale + dx;
            const y = startY + gy * scale + dy;
            if (x < 0 || y < 0 || x >= size || y >= size) continue;
            const idx = (y * size + x) * 4;
            pixels[idx] = 0xf5;
            pixels[idx + 1] = 0xf5;
            pixels[idx + 2] = 0xf5;
            pixels[idx + 3] = 0xff;
          }
        }
      }
    }
  }

  return makePng(size, pixels);
}

const files = [
  { name: 'icon-192.png', size: 192 },
  { name: 'icon-512.png', size: 512 },
  { name: 'icon-maskable.png', size: 512 }, // same design, full-bleed bg works as maskable
];

for (const f of files) {
  const png = renderIcon(f.size);
  const p = path.join(outDir, f.name);
  fs.writeFileSync(p, png);
  process.stdout.write(`wrote ${p} ${png.length} bytes\n`);
}
