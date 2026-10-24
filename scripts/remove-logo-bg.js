import fs from 'fs';
import { PNG } from 'pngjs';

const inputPath = 'public/logo.png';
const backupPath = 'public/logo-original.png';
const outputPath = 'public/logo.png';

if (!fs.existsSync(backupPath)) {
  fs.copyFileSync(inputPath, backupPath);
  console.log('Backed up original logo to', backupPath);
}

fs.createReadStream(backupPath)
  .pipe(new PNG({ filterType: 4 }))
  .on('parsed', function() {
    console.log(`Image dimensions: ${this.width}x${this.height}`);

    // Analyze corners to determine background color
    const corners = [
      0, // top-left
      (this.width - 1) * 4, // top-right
      ((this.height - 1) * this.width) * 4, // bottom-left
      ((this.height - 1) * this.width + (this.width - 1)) * 4 // bottom-right
    ];

    console.log('Sample corner colors:');
    corners.forEach((idx, i) => {
      console.log(`Corner ${i}: R=${this.data[idx]}, G=${this.data[idx+1]}, B=${this.data[idx+2]}, A=${this.data[idx+3]}`);
    });

    // Remove white/light background with smooth alpha feathering
    // For pure white (255,255,255), alpha -> 0
    // Threshold: anything with R>235, G>235, B>235 gets faded out
    for (let y = 0; y < this.height; y++) {
      for (let x = 0; x < this.width; x++) {
        const idx = (this.width * y + x) << 2;
        const r = this.data[idx];
        const g = this.data[idx + 1];
        const b = this.data[idx + 2];
        const a = this.data[idx + 3];

        if (a === 0) continue;

        // Calculate lightness / proximity to white
        const minVal = Math.min(r, g, b);
        const maxVal = Math.max(r, g, b);
        const isNearNeutral = (maxVal - minVal) < 15;

        if (r > 245 && g > 245 && b > 245) {
          // Pure / near-pure white background
          this.data[idx + 3] = 0;
        } else if (r > 220 && g > 220 && b > 220 && isNearNeutral) {
          // Antialiased border pixel - smooth alpha feathering
          const brightness = (r + g + b) / 3;
          // brightness 220 -> alpha ~255, brightness 245 -> alpha ~0
          const factor = Math.max(0, Math.min(1, (245 - brightness) / 25));
          this.data[idx + 3] = Math.round(a * factor);
        }
      }
    }

    this.pack()
      .pipe(fs.createWriteStream(outputPath))
      .on('finish', () => {
        console.log('Successfully saved transparent logo to', outputPath);
      });
  });
