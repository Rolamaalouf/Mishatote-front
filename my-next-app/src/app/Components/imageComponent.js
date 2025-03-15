import Image from "next/image";

export default function ImageComponent({ src, alt, width, height }) {
  return (
<Image
  src={src}
  alt={alt}
  width={width}
  height={height}
  style={{ width: '100%', height: 'auto' }} // Example for maintaining aspect ratio
/>
  );
}
