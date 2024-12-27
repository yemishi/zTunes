type RGB = { r: number; g: number; b: number };

const rgbToHex = (r: number, g: number, b: number): string => {
    const toHex = (c: number): string => c.toString(16).padStart(2, '0');
    return `#${toHex(r)}${toHex(g)}${toHex(b)}`.toUpperCase();
};

const getVibrantColor = async (img: string): Promise<string> => {
    return new Promise((resolve, reject) => {
        const image = new Image();
        image.crossOrigin = 'Anonymous';
        image.src = img;

        image.onload = () => {
            const canvas = document.createElement('canvas');
            const maxDimension = 100; // Downscale to a smaller dimension
            const scale = Math.min(maxDimension / image.width, maxDimension / image.height);

            canvas.width = Math.ceil(image.width * scale);
            canvas.height = Math.ceil(image.height * scale);

            const ctx = canvas.getContext('2d');
            if (!ctx) {
                reject('Failed to get canvas context');
                return;
            }

            ctx.drawImage(image, 0, 0, canvas.width, canvas.height);
            const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);

            const { data } = imageData;
            const colorCount: Record<string, number> = {};
            let mostFrequentColor = '';
            let maxCount = 0;

            for (let i = 0; i < data.length; i += 4) {
                const r = data[i];
                const g = data[i + 1];
                const b = data[i + 2];

                const hexColor = rgbToHex(r, g, b);
                colorCount[hexColor] = (colorCount[hexColor] || 0) + 1;

                if (colorCount[hexColor] > maxCount) {
                    maxCount = colorCount[hexColor];
                    mostFrequentColor = hexColor;
                }
            }

            resolve(mostFrequentColor);
        };

        image.onerror = () => reject('Image failed to load');
    });
};

export default getVibrantColor;
