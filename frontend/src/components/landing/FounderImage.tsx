"use client";

interface FounderImageProps {
  src: string;
  alt: string;
  initials: string;
}

export default function FounderImage({ src, alt, initials }: FounderImageProps) {
  return (
    <>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={src}
        alt={alt}
        style={{ width: "100%", display: "block", borderRadius: "16px" }}
        onError={(e) => {
          (e.target as HTMLImageElement).style.display = "none";
          const fallback = (e.target as HTMLImageElement).nextElementSibling as HTMLElement;
          if (fallback) fallback.style.display = "flex";
        }}
      />
      <div className="founder-avatar-fallback" style={{ display: "none" }}>
        {initials}
      </div>
    </>
  );
}
