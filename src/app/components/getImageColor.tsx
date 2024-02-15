import Color from "color-thief-react";

export default function getImageColor(image: string) {
  return (
    <Color src={image} crossOrigin="anonymous" format="rgbString">
      {({ data, loading }) => {
        return data;
      }}
    </Color>
  );
}
