import Image from "next/image";

export default function Logo({ className = "w-8 h-10" }) {
  return (
    <div className={`relative shrink-0 ${className}`}>
      <Image
        src="/sakupuan-logo.svg"
        alt="Saku Puan Logo"
        fill
        sizes="(max-width: 768px) 100vw, 33vw"
        className="object-contain"
        priority
      />
    </div>
  );
}