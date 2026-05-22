"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

interface BrandLogoProps {
  href?: string;
  size?: number;
  showWordmark?: boolean;
  className?: string;
}

/**
 * Logo: ưu tiên /images/1.png nếu Boss đặt file vào public/images/.
 * Fallback SVG — object-contain, không scale crop (tránh vỡ tỉ lệ).
 */
export function BrandLogo({
  href = "/",
  size = 40,
  showWordmark = true,
  className = "",
}: BrandLogoProps) {
  const [useSvg, setUseSvg] = useState(false);

  const inner = (
    <div className={`flex items-center gap-3 ${className}`}>
      <div
        className="relative flex-shrink-0 rounded-xl overflow-hidden bg-gradient-to-br from-hawkeye-navy-mid via-hawkeye-navy to-hawkeye-obsidian border border-hawkeye-glow/15 shadow-[0_0_16px_rgba(94,184,217,0.12)] flex items-center justify-center"
        style={{ width: size, height: size }}
      >
        {!useSvg ? (
          <Image
            src="/images/1.png"
            alt="HawkEye"
            width={size}
            height={size}
            className="object-contain w-full h-full p-0.5"
            priority
            onError={() => setUseSvg(true)}
          />
        ) : (
          <Image
            src="/hawkeye-logo.svg"
            alt="HawkEye"
            width={Math.round(size * 0.88)}
            height={Math.round(size * 0.88)}
            className="object-contain"
            priority
          />
        )}
      </div>
      {showWordmark && (
        <span className="font-semibold text-lg tracking-tight bg-gradient-to-r from-zinc-100 via-hawkeye-glow-bright to-zinc-400 bg-clip-text text-transparent">
          HawkEye
        </span>
      )}
    </div>
  );

  if (href) {
    return (
      <Link href={href} className="hover:opacity-90 transition-opacity">
        {inner}
      </Link>
    );
  }
  return inner;
}
