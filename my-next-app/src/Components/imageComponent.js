import Image from "next/image";

export default function ImageComponent({ src, alt, width, height }) {
  return (
    <Image
      src={src}
      alt={alt}
      width={width}
      height={height}
      priority // Helps with loading performance
    />
  );
}
