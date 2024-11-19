import Vibrant from "node-vibrant";

export default async function getVibrantColor(img: string, lowOpacity?: true) {
    try {
        const palette = await Vibrant.from(img).getPalette();
        const isLowOpacity = lowOpacity ? 0.6 : 1;
        return {
            default: `rgb(${palette.DarkMuted?.rgb.join(",")},${isLowOpacity})`,
            light: `rgb(${palette.LightVibrant?.rgb.join(",")},${isLowOpacity})`,
            dark: `rgb(${palette.DarkVibrant?.rgb.join(",")},${lowOpacity ? 0.6 : ""
                })`,
            mutedDark: `rgb(${palette.DarkMuted?.rgb.join(",")},${isLowOpacity})`,
            mutedLight: `rgb(${palette.LightMuted?.rgb.join(",")},${isLowOpacity})`,
            muted: `rgb(${palette.Muted?.rgb.join(",")},${isLowOpacity})`,
        };
    } catch (error) {
        return null;
    }
};