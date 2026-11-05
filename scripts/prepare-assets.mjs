import fs from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";
import QRCode from "qrcode";

const root = process.cwd();
const outDir = path.join(root, "public", "images");
const portraitSrc =
  process.env.PORTRAIT_PATH ??
  "C:\\Users\\jojip\\Downloads\\Warm Portrait in a Patterned Black Dress.png";

await fs.mkdir(outDir, { recursive: true });

/* ------------------------------------------------------------------ */
/*  Portrait — responsive WebP derivatives                             */
/* ------------------------------------------------------------------ */
const portrait = sharp(portraitSrc);
const meta = await portrait.metadata();
console.log("Source portrait:", meta.width, "x", meta.height);

await sharp(portraitSrc)
  .resize({ width: 1000, withoutEnlargement: true })
  .webp({ quality: 84 })
  .toFile(path.join(outDir, "portrait.webp"));

await sharp(portraitSrc)
  .resize({ width: 560, withoutEnlargement: true })
  .webp({ quality: 82 })
  .toFile(path.join(outDir, "portrait-sm.webp"));

/* ------------------------------------------------------------------ */
/*  Open Graph cover (image-only, no font dependencies)                */
/* ------------------------------------------------------------------ */
const W = 1200;
const H = 630;

const blurred = await sharp(portraitSrc)
  .resize(W, H, { fit: "cover", position: "attention" })
  .blur(34)
  .modulate({ brightness: 0.42, saturation: 0.85 })
  .toBuffer();

const circleMask = Buffer.from(
  `<svg width="420" height="420"><circle cx="210" cy="210" r="210" fill="#fff"/></svg>`,
);

const portraitCircle = await sharp(portraitSrc)
  .resize(420, 420, { fit: "cover", position: "top" })
  .composite([{ input: circleMask, blend: "dest-in" }])
  .png()
  .toBuffer();

const overlay = Buffer.from(`
<svg width="${W}" height="${H}" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="g" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0" stop-color="#071D20" stop-opacity="0.97"/>
      <stop offset="0.52" stop-color="#071D20" stop-opacity="0.86"/>
      <stop offset="1" stop-color="#071D20" stop-opacity="0.55"/>
    </linearGradient>
    <radialGradient id="glow" cx="0.5" cy="0.5" r="0.5">
      <stop offset="0" stop-color="#C6A66B" stop-opacity="0.45"/>
      <stop offset="1" stop-color="#C6A66B" stop-opacity="0"/>
    </radialGradient>
  </defs>
  <rect width="${W}" height="${H}" fill="url(#g)"/>
  <circle cx="890" cy="315" r="300" fill="url(#glow)"/>
  <circle cx="890" cy="315" r="216" fill="none" stroke="#C6A66B" stroke-width="2" stroke-opacity="0.9"/>
  <circle cx="890" cy="315" r="232" fill="none" stroke="#647653" stroke-width="10" stroke-opacity="0.55"/>
  <circle cx="890" cy="315" r="252" fill="none" stroke="#C6A66B" stroke-width="1" stroke-opacity="0.35"/>
  <g fill="#C6A66B" fill-opacity="0.5">
    <circle cx="120" cy="120" r="3"/><circle cx="210" cy="480" r="2"/>
    <circle cx="380" cy="90" r="2"/><circle cx="160" cy="560" r="2.5"/>
  </g>
</svg>`);

await sharp({
  create: { width: W, height: H, channels: 3, background: "#071D20" },
})
  .composite([
    { input: blurred, blend: "over" },
    { input: overlay, blend: "over" },
    { input: portraitCircle, left: 680, top: 105 },
  ])
  .jpeg({ quality: 88, mozjpeg: true })
  .toFile(path.join(outDir, "og-cover.jpg"));

/* ------------------------------------------------------------------ */
/*  LifeLink QR — a real, working code pointing at the live demo       */
/* ------------------------------------------------------------------ */
await QRCode.toFile(path.join(outDir, "lifelink-qr.svg"), "https://lifelink-qr-f98c6.web.app", {
  type: "svg",
  margin: 1,
  width: 480,
  errorCorrectionLevel: "M",
  color: { dark: "#0A0A0A", light: "#FFFFFF" },
});

console.log("Assets generated in public/images");
