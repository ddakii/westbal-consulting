import Image from "next/image";

const SIZES = {
  mark: { w: 184, h: 145 },
  full: { w: 890, h: 146 },
} as const;

type Props = {
  /** Icon only, or full wordmark (W + text + flag) */
  layout?: keyof typeof SIZES;
  /** Light for dark backgrounds; dark for light backgrounds */
  variant?: "light" | "dark";
  className?: string;
  /** Display height in px */
  size?: number;
  priority?: boolean;
};

export function LogoMark({
  layout = "full",
  variant = "dark",
  className = "",
  size = 40,
  priority = false,
}: Props) {
  const tone = variant === "light" ? "light" : "dark";
  const base = layout === "full" ? "westbal-logo" : "westbal-mark";
  const src = `/brand/${base}-${tone}.png`;

  const dims = SIZES[layout];
  const height = size;
  const width = Math.round((dims.w / dims.h) * height);

  return (
    <Image
      src={src}
      alt="Westbal Consulting"
      width={width}
      height={height}
      priority={priority}
      className={`object-contain ${className}`}
    />
  );
}
