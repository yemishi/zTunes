"use client";

const rgbToHex = (r: number, g: number, b: number): string => {
  return (
    "#" +
    [r, g, b]
      .map((x) => {
        const hex = x.toString(16);
        return hex.length === 1 ? "0" + hex : hex;
      })
      .join("")
  );
};

const rgbToHsl = (r: number, g: number, b: number): [number, number, number] => {
  r /= 255;
  g /= 255;
  b /= 255;

  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h = 0,
    s = 0,
    l = (max + min) / 2;

  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r:
        h = (g - b) / d + (g < b ? 6 : 0);
        break;
      case g:
        h = (b - r) / d + 2;
        break;
      case b:
        h = (r - g) / d + 4;
        break;
    }
    h /= 6;
  }

  return [h, s, l];
};

const isLight = (hexColor: string): boolean => {
  const r = parseInt(hexColor.slice(1, 3), 16);
  const g = parseInt(hexColor.slice(3, 5), 16);
  const b = parseInt(hexColor.slice(5, 7), 16);

  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;

  return luminance > 0.5;
};

const getVibrantColor = async (img: string): Promise<{ color: string; isLight: boolean }> => {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.crossOrigin = "Anonymous";
    image.src = img;

    image.onload = () => {
      const canvas = document.createElement("canvas");
      const maxDimension = 100;
      const scale = Math.min(maxDimension / image.width, maxDimension / image.height);

      canvas.width = Math.ceil(image.width * scale);
      canvas.height = Math.ceil(image.height * scale);

      const ctx = canvas.getContext("2d");
      if (!ctx) {
        reject("Failed to get canvas context");
        return;
      }

      ctx.drawImage(image, 0, 0, canvas.width, canvas.height);
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const { data } = imageData;

      const colorScores: Record<string, { count: number; vibrancy: number }> = {};

      for (let i = 0; i < data.length; i += 4) {
        const r = data[i];
        const g = data[i + 1];
        const b = data[i + 2];
        const a = data[i + 3];

        if (a < 128) continue;
        if (r < 30 && g < 30 && b < 30) continue;
        const hex = rgbToHex(r, g, b);
        const [h, s, l] = rgbToHsl(r, g, b);

        const vibrancy = Math.pow(s, 1.2) * 50 + (1 - Math.abs(0.5 - l)) * 100;

        if (!colorScores[hex]) {
          colorScores[hex] = { count: 1, vibrancy };
        } else {
          colorScores[hex].count++;
          colorScores[hex].vibrancy = Math.max(colorScores[hex].vibrancy, vibrancy);
        }
      }

      const scoredColors = Object.entries(colorScores)
        .map(([hex, { count, vibrancy }]) => ({
          hex,
          score: count * 0.7 + vibrancy * 0.3,
        }))
        .sort((a, b) => b.score - a.score);

      const mostVibrant = scoredColors[0]?.hex || "#000000";

      resolve({
        color: mostVibrant,
        isLight: isLight(mostVibrant),
      });
    };

    image.onerror = () => reject("Image failed to load");
  });
};
export default getVibrantColor;
