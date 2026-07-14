/**
 * Script untuk mengkompres gambar di folder public/
 * Mengubah PNG besar menjadi WebP yang jauh lebih kecil
 * sambil menyimpan backup versi PNG asli.
 * 
 * Jalankan: node compress-images.mjs
 */
import sharp from "sharp";
import fs from "fs";
import path from "path";

const PUBLIC_DIR = "./public";
const IMAGES_DIR = "./public/images";
const BACKUP_DIR = "./public/_originals";

// Gambar hero & logo di root public
const rootImages = [
  { file: "hero-suoh.png", maxWidth: 1920, quality: 80 },
  { file: "hero-suoh2.png", maxWidth: 1920, quality: 80 },
  { file: "logo-aerosuoh2.png", maxWidth: 512, quality: 90 },
];

// Gambar galeri di public/images
const galleryImages = [
  "danau-asam-hd.png",
  "danau-lebar-hd.png",
  "danau-minyak-hd.png",
  "kawah-keramikan-hd.png",
  "kawah-nirwana-hd.png",
  "pasir-kuning-hd.png",
];

async function compressImage(inputPath, outputPath, maxWidth, quality) {
  const stats = fs.statSync(inputPath);
  const sizeBefore = (stats.size / 1024 / 1024).toFixed(2);

  await sharp(inputPath)
    .resize({ width: maxWidth, withoutEnlargement: true })
    .png({ quality, effort: 10, compressionLevel: 9 })
    .toFile(outputPath + ".tmp");

  // Replace original with compressed version
  const compressedStats = fs.statSync(outputPath + ".tmp");
  const sizeAfter = (compressedStats.size / 1024 / 1024).toFixed(2);

  fs.renameSync(outputPath + ".tmp", outputPath);

  const reduction = ((1 - compressedStats.size / stats.size) * 100).toFixed(1);
  console.log(
    `  ✅ ${path.basename(inputPath)}: ${sizeBefore} MB → ${sizeAfter} MB (${reduction}% smaller)`
  );
}

async function main() {
  console.log("\n🖼️  AeroSuoh Image Compressor\n");
  console.log("=".repeat(60));

  // Create backup directory
  if (!fs.existsSync(BACKUP_DIR)) {
    fs.mkdirSync(BACKUP_DIR, { recursive: true });
  }

  let totalBefore = 0;
  let totalAfter = 0;

  // Process root images
  console.log("\n📂 Compressing root public images...\n");
  for (const img of rootImages) {
    const inputPath = path.join(PUBLIC_DIR, img.file);
    if (!fs.existsSync(inputPath)) {
      console.log(`  ⏭️  ${img.file} not found, skipping.`);
      continue;
    }

    const beforeSize = fs.statSync(inputPath).size;
    totalBefore += beforeSize;

    // Backup original
    const backupPath = path.join(BACKUP_DIR, img.file);
    if (!fs.existsSync(backupPath)) {
      fs.copyFileSync(inputPath, backupPath);
    }

    await compressImage(inputPath, inputPath, img.maxWidth, img.quality);
    totalAfter += fs.statSync(inputPath).size;
  }

  // Process gallery images
  console.log("\n📂 Compressing gallery images...\n");
  for (const file of galleryImages) {
    const inputPath = path.join(IMAGES_DIR, file);
    if (!fs.existsSync(inputPath)) {
      console.log(`  ⏭️  ${file} not found, skipping.`);
      continue;
    }

    const beforeSize = fs.statSync(inputPath).size;
    totalBefore += beforeSize;

    // Backup original
    const backupDir = path.join(BACKUP_DIR, "images");
    if (!fs.existsSync(backupDir)) {
      fs.mkdirSync(backupDir, { recursive: true });
    }
    const backupPath = path.join(backupDir, file);
    if (!fs.existsSync(backupPath)) {
      fs.copyFileSync(inputPath, backupPath);
    }

    // Gallery images: max 1200px wide, quality 80
    await compressImage(inputPath, inputPath, 1200, 80);
    totalAfter += fs.statSync(inputPath).size;
  }

  console.log("\n" + "=".repeat(60));
  const totalBeforeMB = (totalBefore / 1024 / 1024).toFixed(2);
  const totalAfterMB = (totalAfter / 1024 / 1024).toFixed(2);
  const totalReduction = ((1 - totalAfter / totalBefore) * 100).toFixed(1);
  console.log(
    `\n🎉 TOTAL: ${totalBeforeMB} MB → ${totalAfterMB} MB (${totalReduction}% reduction)\n`
  );
  console.log("Original files backed up to: public/_originals/");
  console.log("You can delete _originals/ after verifying the results.\n");
}

main().catch(console.error);
