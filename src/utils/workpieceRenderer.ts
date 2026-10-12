import { SamplePartDef } from '../data/manufacturingSectors';

/**
 * Generates an SVG string representation of an industrial workpiece
 * with optional defect features calibrated to 0-1000 coordinate space.
 */
export function generateWorkpieceSvg(part: SamplePartDef, showDefect: boolean): string {
  const hasDefect = part.hasDefect && showDefect;

  if (part.visualType === 'cylinder_bore') {
    return `
      <svg viewBox="0 0 1000 1000" xmlns="http://www.w3.org/2000/svg" width="100%" height="100%">
        <defs>
          <radialGradient id="metalGrad" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stop-color="#334155" />
            <stop offset="60%" stop-color="#1e293b" />
            <stop offset="90%" stop-color="#0f172a" />
            <stop offset="100%" stop-color="#020617" />
          </radialGradient>
          <linearGradient id="chamferGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stop-color="#94a3b8" />
            <stop offset="50%" stop-color="#475569" />
            <stop offset="100%" stop-color="#1e293b" />
          </linearGradient>
          <pattern id="machiningMarks" width="20" height="20" patternUnits="userSpaceOnUse">
            <circle cx="10" cy="10" r="8" fill="none" stroke="#475569" stroke-width="0.5" stroke-opacity="0.3" />
          </pattern>
        </defs>

        <!-- Outer Cast Block Base -->
        <rect x="100" y="100" width="800" height="800" rx="40" fill="url(#metalGrad)" stroke="#64748b" stroke-width="6" />
        <rect x="100" y="100" width="800" height="800" rx="40" fill="url(#machiningMarks)" />

        <!-- Fixture Bolt Holes -->
        <circle cx="200" cy="200" r="35" fill="#090d16" stroke="#475569" stroke-width="4" />
        <circle cx="800" cy="200" r="35" fill="#090d16" stroke="#475569" stroke-width="4" />
        <circle cx="200" cy="800" r="35" fill="#090d16" stroke="#475569" stroke-width="4" />
        <circle cx="800" cy="800" r="35" fill="#090d16" stroke="#475569" stroke-width="4" />

        <!-- Main Machined Bore Ring Outer Flange -->
        <circle cx="500" cy="500" r="320" fill="#1e293b" stroke="url(#chamferGrad)" stroke-width="14" />
        <!-- Bore Honing Pattern Rings -->
        <circle cx="500" cy="500" r="280" fill="none" stroke="#64748b" stroke-width="2" stroke-dasharray="8 4" stroke-opacity="0.7" />
        <circle cx="500" cy="500" r="240" fill="none" stroke="#64748b" stroke-width="2" stroke-dasharray="12 6" stroke-opacity="0.5" />
        <!-- Inner Bore Chamber -->
        <circle cx="500" cy="500" r="200" fill="#020617" stroke="#94a3b8" stroke-width="8" />

        <!-- Precision Calibrated Laser Crosshair Scale -->
        <line x1="160" y1="500" x2="840" y2="500" stroke="#38bdf8" stroke-width="1" stroke-dasharray="4 8" stroke-opacity="0.4" />
        <line x1="500" y1="160" x2="500" y2="840" stroke="#38bdf8" stroke-width="1" stroke-dasharray="4 8" stroke-opacity="0.4" />

        <!-- Laser Part Serial Stamping -->
        <text x="500" y="740" fill="#94a3b8" font-family="monospace" font-size="20" font-weight="600" text-anchor="middle" letter-spacing="4">
          ${part.serialNumber} · TOL ${part.nominalSpecs.slice(0, 24)}
        </text>

        ${
          hasDefect
            ? `
          <!-- DEFECT ARTIFACT: Jagged Radial Surface Crack -->
          <g id="defect-crack">
            <path d="M 390 330 Q 420 370 410 410 T 450 460 T 490 510 T 540 520" 
                  fill="none" stroke="#ef4444" stroke-width="6" stroke-linecap="round" filter="drop-shadow(0 0 6px rgba(239,68,68,0.8))" />
            <path d="M 410 410 Q 440 430 460 410" fill="none" stroke="#ef4444" stroke-width="3" stroke-linecap="round" />
            <circle cx="490" cy="510" r="4" fill="#fca5a5" />
          </g>
        `
            : ''
        }
      </svg>
    `;
  }

  if (part.visualType === 'gear_wheel') {
    return `
      <svg viewBox="0 0 1000 1000" xmlns="http://www.w3.org/2000/svg" width="100%" height="100%">
        <defs>
          <radialGradient id="gearMetal" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stop-color="#475569" />
            <stop offset="70%" stop-color="#1e293b" />
            <stop offset="100%" stop-color="#0f172a" />
          </radialGradient>
        </defs>

        <rect x="0" y="0" width="1000" height="1000" fill="#090d16" />

        <!-- Gear Blank Body -->
        <circle cx="500" cy="500" r="380" fill="url(#gearMetal)" stroke="#94a3b8" stroke-width="8" />

        <!-- Involute Gear Teeth Array (16 Radial Blocks) -->
        ${Array.from({ length: 16 })
          .map((_, i) => {
            const angle = (i * 360) / 16;
            const isDefectiveTooth = hasDefect && i === 3;
            return `
            <g transform="rotate(${angle} 500 500)">
              <path d="M 470 100 L 530 100 L 520 180 L 480 180 Z" 
                    fill="${isDefectiveTooth ? '#7f1d1d' : '#334155'}" 
                    stroke="${isDefectiveTooth ? '#ef4444' : '#94a3b8'}" 
                    stroke-width="${isDefectiveTooth ? '4' : '3'}" />
              ${
                isDefectiveTooth
                  ? `
                <!-- Tooth Chip / Fracture artifact -->
                <polygon points="500,100 535,115 515,140 495,110" fill="#ef4444" stroke="#f87171" stroke-width="3" />
                <path d="M 485 125 L 525 150" stroke="#fca5a5" stroke-width="3" />
              `
                  : ''
              }
            </g>
          `;
          })
          .join('')}

        <!-- Gear Web Recess -->
        <circle cx="500" cy="500" r="280" fill="#0f172a" stroke="#475569" stroke-width="6" />
        
        <!-- Gear Lightening Holes -->
        <circle cx="380" cy="500" r="45" fill="#090d16" stroke="#64748b" stroke-width="3" />
        <circle cx="620" cy="500" r="45" fill="#090d16" stroke="#64748b" stroke-width="3" />
        <circle cx="500" cy="380" r="45" fill="#090d16" stroke="#64748b" stroke-width="3" />
        <circle cx="500" cy="620" r="45" fill="#090d16" stroke="#64748b" stroke-width="3" />

        <!-- Central Splined Shaft Hub & Keyway -->
        <circle cx="500" cy="500" r="140" fill="#1e293b" stroke="#cbd5e1" stroke-width="8" />
        <circle cx="500" cy="500" r="80" fill="#020617" stroke="#64748b" stroke-width="4" />
        <!-- Keyway slot -->
        <rect x="485" y="405" width="30" height="40" fill="#020617" />

        <text x="500" y="730" fill="#94a3b8" font-family="monospace" font-size="20" font-weight="600" text-anchor="middle">
          ${part.serialNumber} · MODULE 2.5
        </text>
      </svg>
    `;
  }

  if (part.visualType === 'pcb_smt') {
    return `
      <svg viewBox="0 0 1000 1000" xmlns="http://www.w3.org/2000/svg" width="100%" height="100%">
        <!-- Solder Mask Background -->
        <rect x="80" y="80" width="840" height="840" rx="16" fill="#064e3b" stroke="#10b981" stroke-width="4" stroke-opacity="0.6" />

        <!-- Mounting Holes & Gold Ground Rings -->
        <circle cx="150" cy="150" r="30" fill="#022c22" stroke="#eab308" stroke-width="6" />
        <circle cx="850" cy="150" r="30" fill="#022c22" stroke="#eab308" stroke-width="6" />
        <circle cx="150" cy="850" r="30" fill="#022c22" stroke="#eab308" stroke-width="6" />
        <circle cx="850" cy="850" r="30" fill="#022c22" stroke="#eab308" stroke-width="6" />

        <!-- Copper Signal Traces -->
        <path d="M 220 220 L 380 220 L 420 260 L 420 340" fill="none" stroke="#047857" stroke-width="4" />
        <path d="M 220 250 L 360 250 L 400 290 L 400 340" fill="none" stroke="#047857" stroke-width="4" />
        <path d="M 580 340 L 580 260 L 640 200 L 780 200" fill="none" stroke="#047857" stroke-width="4" />
        <path d="M 600 340 L 600 280 L 660 220 L 780 220" fill="none" stroke="#047857" stroke-width="4" />
        <path d="M 500 580 L 500 760 L 620 760" fill="none" stroke="#047857" stroke-width="5" />

        <!-- Central MCU / QFP-64 IC Body -->
        <rect x="360" y="340" width="280" height="280" rx="10" fill="#0f172a" stroke="#334155" stroke-width="4" />
        <circle cx="390" cy="370" r="10" fill="#475569" /> <!-- Pin 1 dot -->
        <text x="500" y="470" fill="#e2e8f0" font-family="monospace" font-size="20" font-weight="700" text-anchor="middle">
          ARM-CORTEX M7
        </text>
        <text x="500" y="500" fill="#94a3b8" font-family="monospace" font-size="14" text-anchor="middle">
          STM32H743IIT6
        </text>

        <!-- QFP Leads / Pins Top & Bottom -->
        ${Array.from({ length: 12 })
          .map((_, i) => {
            const x = 390 + i * 19;
            return `
            <rect x="${x}" y="310" width="8" height="28" fill="#e2e8f0" rx="1" />
            <rect x="${x}" y="622" width="8" height="28" fill="#e2e8f0" rx="1" />
          `;
          })
          .join('')}

        <!-- QFP Leads Left & Right -->
        ${Array.from({ length: 12 })
          .map((_, i) => {
            const y = 370 + i * 19;
            const isSolderBridgeLocation = hasDefect && (i === 3 || i === 4);
            return `
            <rect x="330" y="${y}" width="28" height="8" fill="${isSolderBridgeLocation ? '#fca5a5' : '#e2e8f0'}" rx="1" />
            <rect x="642" y="${y}" width="28" height="8" fill="#e2e8f0" rx="1" />
          `;
          })
          .join('')}

        ${
          hasDefect
            ? `
          <!-- DEFECT ARTIFACT 1: Solder Spurious Bridge across Pin 18-19 -->
          <g id="defect-solder-bridge">
            <ellipse cx="344" cy="437" rx="16" ry="14" fill="#ef4444" opacity="0.9" filter="drop-shadow(0 0 8px #ef4444)" />
            <circle cx="344" cy="437" r="8" fill="#ffffff" />
          </g>

          <!-- DEFECT ARTIFACT 2: SMD 0603 Capacitor Tombstone -->
          <g id="defect-tombstone" transform="translate(640, 640)">
            <!-- Landing pads -->
            <rect x="0" y="20" width="24" height="30" fill="#ca8a04" />
            <rect x="50" y="20" width="24" height="30" fill="#ca8a04" />
            <!-- Lifted capacitor body -->
            <g transform="rotate(-40 20 30)">
              <rect x="10" y="20" width="54" height="24" rx="2" fill="#b45309" stroke="#ef4444" stroke-width="3" />
              <rect x="10" y="20" width="12" height="24" fill="#e2e8f0" />
              <rect x="52" y="20" width="12" height="24" fill="#e2e8f0" />
            </g>
          </g>
        `
            : `
          <!-- Nominal Passive Component C14 -->
          <g transform="translate(650, 650)">
            <rect x="0" y="0" width="18" height="24" fill="#ca8a04" />
            <rect x="42" y="0" width="18" height="24" fill="#ca8a04" />
            <rect x="8" y="0" width="44" height="24" rx="2" fill="#78350f" />
            <rect x="8" y="0" width="10" height="24" fill="#cbd5e1" />
            <rect x="42" y="0" width="10" height="24" fill="#cbd5e1" />
          </g>
        `
        }

        <!-- Silkscreen Markings -->
        <text x="200" y="760" fill="#f8fafc" font-family="monospace" font-size="16" font-weight="600">
          BOARD REV: 4.2 · ${part.serialNumber}
        </text>
      </svg>
    `;
  }

  if (part.visualType === 'blister_foil') {
    return `
      <svg viewBox="0 0 1000 1000" xmlns="http://www.w3.org/2000/svg" width="100%" height="100%">
        <defs>
          <linearGradient id="foilSheen" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stop-color="#94a3b8" />
            <stop offset="25%" stop-color="#cbd5e1" />
            <stop offset="50%" stop-color="#e2e8f0" />
            <stop offset="75%" stop-color="#94a3b8" />
            <stop offset="100%" stop-color="#64748b" />
          </linearGradient>
          <pattern id="knurlPips" width="12" height="12" patternUnits="userSpaceOnUse">
            <rect x="2" y="2" width="4" height="4" fill="#475569" opacity="0.3" />
          </pattern>
        </defs>

        <rect x="0" y="0" width="1000" height="1000" fill="#090d16" />

        <!-- 10-Pocket Blister Card -->
        <rect x="120" y="100" width="760" height="800" rx="24" fill="url(#foilSheen)" stroke="#cbd5e1" stroke-width="6" />
        <rect x="120" y="100" width="760" height="800" rx="24" fill="url(#knurlPips)" />

        <!-- Heat Seal Waffle Margin Grid -->
        <rect x="140" y="120" width="720" height="760" rx="16" fill="none" stroke="#64748b" stroke-width="4" stroke-dasharray="4 4" />

        <!-- 10 Capsule Cavity Pockets (2 columns x 5 rows) -->
        ${Array.from({ length: 10 })
          .map((_, idx) => {
            const col = idx % 2;
            const row = Math.floor(idx / 2);
            const cx = 320 + col * 360;
            const cy = 200 + row * 140;
            const isPuncturedPocket = hasDefect && idx === 2;

            return `
            <g>
              <!-- Pocket Dome Drop-shadow & cavity -->
              <rect x="${cx - 90}" y="${cy - 40}" width="180" height="80" rx="40" 
                    fill="#334155" stroke="${isPuncturedPocket ? '#ef4444' : '#64748b'}" stroke-width="4" />
              <!-- Capsule inside pocket -->
              <rect x="${cx - 70}" y="${cy - 25}" width="140" height="50" rx="25" fill="#f8fafc" />
              <rect x="${cx}" y="${cy - 25}" width="70" height="50" rx="25" fill="#3b82f6" />

              ${
                isPuncturedPocket
                  ? `
                <!-- DEFECT ARTIFACT: Foil Puncture / Tear -->
                <circle cx="${cx - 20}" cy="${cy - 20}" r="16" fill="#ef4444" filter="drop-shadow(0 0 8px #ef4444)" />
                <path d="M ${cx - 35} ${cy - 25} L ${cx - 5} ${cy - 10} L ${cx - 15} ${cy - 35} Z" fill="#090d16" stroke="#fca5a5" stroke-width="2" />
                <path d="M ${cx - 40} ${cy - 10} L ${cx} ${cy - 40}" stroke="#ef4444" stroke-width="3" />
              `
                  : ''
              }
            </g>
          `;
          })
          .join('')}

        <!-- Lot Stamping & Expiration -->
        <text x="500" y="860" fill="#0f172a" font-family="monospace" font-size="20" font-weight="700" text-anchor="middle">
          LOT ${part.serialNumber} · EXP 08/2028
        </text>
      </svg>
    `;
  }

  // Default: Flange Bracket
  return `
    <svg viewBox="0 0 1000 1000" xmlns="http://www.w3.org/2000/svg" width="100%" height="100%">
      <rect x="150" y="200" width="700" height="600" rx="30" fill="#1e293b" stroke="#64748b" stroke-width="8" />
      <circle cx="300" cy="500" r="70" fill="#090d16" stroke="#94a3b8" stroke-width="6" />
      <circle cx="700" cy="500" r="70" fill="#090d16" stroke="#94a3b8" stroke-width="6" />
      <rect x="420" y="320" width="160" height="360" rx="20" fill="#0f172a" stroke="#475569" stroke-width="4" />
      <text x="500" y="750" fill="#94a3b8" font-family="monospace" font-size="22" font-weight="600" text-anchor="middle">
        ${part.serialNumber} · STAMP PASS
      </text>
    </svg>
  `;
}

/**
 * Converts SVG markup into a high-res base64 image data URL using browser canvas
 */
export async function svgToImageDataUrl(svgString: string, width = 800, height = 800): Promise<string> {
  return new Promise((resolve, reject) => {
    try {
      const img = new Image();
      const blob = new Blob([svgString], { type: 'image/svg+xml;charset=utf-8' });
      const url = URL.createObjectURL(blob);

      img.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          URL.revokeObjectURL(url);
          resolve(`data:image/svg+xml;base64,${btoa(svgString)}`);
          return;
        }

        ctx.drawImage(img, 0, 0, width, height);
        URL.revokeObjectURL(url);
        resolve(canvas.toDataURL('image/jpeg', 0.92));
      };

      img.onerror = () => {
        URL.revokeObjectURL(url);
        // Fallback to data url directly
        resolve(`data:image/svg+xml;base64,${btoa(unescape(encodeURIComponent(svgString)))}`);
      };

      img.src = url;
    } catch {
      resolve(`data:image/svg+xml;base64,${btoa(unescape(encodeURIComponent(svgString)))}`);
    }
  });
}
