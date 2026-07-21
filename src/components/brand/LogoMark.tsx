import Image from "next/image";

/** Trimmed asset dimensions (westbal-mark-*.png). */
const MARK_WIDTH = 184;
const MARK_HEIGHT = 145;

type Props = {
  /** Light mark (white) for dark backgrounds; dark mark for light backgrounds */
  variant?: "light" | "dark";
  className?: string;
  /** Display height in px; width follows mark aspect ratio */
  size?: number;
  priority?: boolean;
};

export function LogoMark({
  variant = "dark",
  className = "",
  size = 40,
  priority = false,
}: Props) {
  const src =
    variant === "light"
      ? "/brand/westbal-mark-light.png"
      : "/brand/westbal-mark-dark.png";

  const height = size;
  const width = Math.round((MARK_WIDTH / MARK_HEIGHT) * height);

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
