type RGB = {
    r: number;
    g: number;
    b: number;
};

const rgbToHex = (pixel: RGB): string => {
    const componentToHex = (c: number): string => {
        const hex = c.toString(16);
        return hex.length === 1 ? '0' + hex : hex;
    };

    return `#${componentToHex(pixel.r)}${componentToHex(pixel.g)}${componentToHex(pixel.b)}`.toUpperCase();
};

const getVibrantColor = async (img: string): Promise<string> => {
    return new Promise((resolve, reject) => {
        const image = new Image();
        image.crossOrigin = 'Anonymous';
        image.src = img;

        image.onload = () => {
            const canvas = document.createElement('canvas');
            canvas.width = image.width;
            canvas.height = image.height;
            const ctx = canvas.getContext('2d');
            ctx?.drawImage(image, 0, 0);

            const imageData = ctx?.getImageData(0, 0, canvas.width, canvas.height);

            if (imageData) {
                const rgbArray: RGB[] = [];
                for (let i = 0; i < imageData.data.length; i += 4) {
                    const rgb: RGB = {
                        r: imageData.data[i],
                        g: imageData.data[i + 1],
                        b: imageData.data[i + 2]
                    };
                    rgbArray.push(rgb);
                }

                const colorCount: Record<string, number> = {};
                rgbArray.forEach((pixel) => {
                    const hexColor = rgbToHex(pixel);
                    colorCount[hexColor] = (colorCount[hexColor] || 0) + 1;
                });

                const mostFrequentColor = Object.entries(colorCount).reduce(
                    (prev, curr) => (curr[1] > prev[1] ? curr : prev),
                    ['', 0]
                )[0];

                resolve(mostFrequentColor);
            } else {
                reject("rgb(0,0,0)");
            }
        };

        image.onerror = () => reject("Image failed to load.");

        return "rgb(0,0,0)"
    });
};

export default getVibrantColor;
