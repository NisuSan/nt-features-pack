export function capitalize(word: string) {
  return word?.toLowerCase().split(' ').map(x => x.charAt(0).toUpperCase() + x.slice(1)).join(' ')
}

export function colorsToCss(colors: Record<string, string>, name: string) {
  return `[theme='${name}'] {\n` + Object.entries(colors).map(([key, value]) => `  --${key}: ${value};`).join('\n') + '\n}'
}

export function deltaE(colorA: [number, number, number, number?] | string, colorB: [number, number, number, number?] | string): number {
  const rgbaA = typeof colorA === 'string' ? hexToRgba(colorA)! : colorA;
  const rgbaB = typeof colorB === 'string' ? hexToRgba(colorB)! : colorB;

  const labA = rgb2lab(rgbaA.slice(0, 3) as [number, number, number]);
  const labB = rgb2lab(rgbaB.slice(0, 3) as [number, number, number]);

  const [L1, a1, b1] = labA;
  const [L2, a2, b2] = labB;

  const avgL = (L1 + L2) / 2;
  const c1 = Math.sqrt(a1 * a1 + b1 * b1);
  const c2 = Math.sqrt(a2 * a2 + b2 * b2);
  const avgC = (c1 + c2) / 2;

  const G = 0.5 * (1 - Math.sqrt(Math.pow(avgC, 7) / (Math.pow(avgC, 7) + Math.pow(25, 7))));
  const a1Prime = a1 * (1 + G);
  const a2Prime = a2 * (1 + G);

  const c1Prime = Math.sqrt(a1Prime * a1Prime + b1 * b1);
  const c2Prime = Math.sqrt(a2Prime * a2Prime + b2 * b2);
  const avgCPrime = (c1Prime + c2Prime) / 2;

  const h1Prime = Math.atan2(b1, a1Prime) * (180 / Math.PI) + (b1 < 0 ? 360 : 0);
  const h2Prime = Math.atan2(b2, a2Prime) * (180 / Math.PI) + (b2 < 0 ? 360 : 0);

  const deltaLPrime = L2 - L1;
  const deltaCPrime = c2Prime - c1Prime;
  let deltaHPrime = 0;
  if (c1Prime * c2Prime !== 0) {
    const deltaH = h2Prime - h1Prime;
    if (Math.abs(deltaH) <= 180) {
      deltaHPrime = deltaH;
    } else {
      deltaHPrime = deltaH > 180 ? deltaH - 360 : deltaH + 360;
    }
  }
  const deltaH = 2 * Math.sqrt(c1Prime * c2Prime) * Math.sin((deltaHPrime * Math.PI) / 360);

  const avgLPrime = (L1 + L2) / 2;
  const avgHPrime = Math.abs(h1Prime - h2Prime) > 180
    ? (h1Prime + h2Prime + 360) / 2
    : (h1Prime + h2Prime) / 2;

  const T =
    1 -
    0.17 * Math.cos(((avgHPrime - 30) * Math.PI) / 180) +
    0.24 * Math.cos((2 * avgHPrime * Math.PI) / 180) +
    0.32 * Math.cos(((3 * avgHPrime + 6) * Math.PI) / 180) -
    0.2 * Math.cos(((4 * avgHPrime - 63) * Math.PI) / 180);

  const SL = 1 + (0.015 * Math.pow(avgLPrime - 50, 2)) / Math.sqrt(20 + Math.pow(avgLPrime - 50, 2));
  const SC = 1 + 0.045 * avgCPrime;
  const SH = 1 + 0.015 * avgCPrime * T;

  const deltaTheta = 30 * Math.exp(-Math.pow((avgHPrime - 275) / 25, 2));
  const RC = 2 * Math.sqrt(Math.pow(avgCPrime, 7) / (Math.pow(avgCPrime, 7) + Math.pow(25, 7)));
  const RT = -RC * Math.sin((2 * deltaTheta * Math.PI) / 180);

  const kL = 1.0;
  const kC = 1.0;
  const kH = 1.0;

  const deltaE = Math.sqrt(
    Math.pow(deltaLPrime / (kL * SL), 2) +
      Math.pow(deltaCPrime / (kC * SC), 2) +
      Math.pow(deltaH / (kH * SH), 2) +
      RT * (deltaCPrime / (kC * SC)) * (deltaH / (kH * SH))
  );

  // Handle alpha channel difference
  const alphaDiff = Math.abs((rgbaA[3] ?? 1) - (rgbaB[3] ?? 1));

  // Factor in alpha difference (optional: adjust the weight as desired)
  return deltaE + alphaDiff * 100; // Adjust weighting as needed
}

function rgb2lab(rgb: [number, number, number]) {
  let r = rgb[0] / 255, g = rgb[1] / 255, b = rgb[2] / 255, x, y, z
  r = (r > 0.04045) ? Math.pow((r + 0.055) / 1.055, 2.4) : r / 12.92
  g = (g > 0.04045) ? Math.pow((g + 0.055) / 1.055, 2.4) : g / 12.92
  b = (b > 0.04045) ? Math.pow((b + 0.055) / 1.055, 2.4) : b / 12.92
  x = (r * 0.4124 + g * 0.3576 + b * 0.1805) / 0.95047
  y = (r * 0.2126 + g * 0.7152 + b * 0.0722) / 1.00000
  z = (r * 0.0193 + g * 0.1192 + b * 0.9505) / 1.08883
  x = (x > 0.008856) ? Math.pow(x, 1/3) : (7.787 * x) + 16/116
  y = (y > 0.008856) ? Math.pow(y, 1/3) : (7.787 * y) + 16/116
  z = (z > 0.008856) ? Math.pow(z, 1/3) : (7.787 * z) + 16/116
  return [(116 * y) - 16, 500 * (x - y), 200 * (y - z)]
}

function hexToRgba(hex: string): [number, number, number, number?] | null {
  const shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])([a-f\d])?$/i
  hex = hex.replace(shorthandRegex, (_, r, g, b, a) => r + r + g + g + b + b + (a ? a + a : ""))

  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})?$/i.exec(hex)
  return result
    ? [
        parseInt(result[1], 16),
        parseInt(result[2], 16),
        parseInt(result[3], 16),
        result[4] ? parseInt(result[4], 16) / 255 : undefined,
      ]
    : null
}
