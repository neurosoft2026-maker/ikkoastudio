import Image from "next/image";

type LogoProps = {
  className?: string;
  priority?: boolean;
};

export default function Logo({ className = "", priority = false }: LogoProps) {
  return (
    <Image
      src="/img/ikkoablanco.jpg"
      alt="IkKOA STUDIO"
      width={320}
      height={280}
      priority={priority}
      className={`w-auto max-w-full object-contain mix-blend-multiply ${className}`}
    />
  );
}
