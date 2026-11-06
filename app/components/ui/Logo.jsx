export default function Logo({ leaf = "#1F5932", className = "w-8 h-10" }) {
  return (
    <svg className={className} viewBox="0 0 100 110" fill="none" aria-hidden="true">
      <path d="M50 102C26 78 18 46 30 22C18 42 18 75 50 102Z" fill={leaf} />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M52 8C73 8 90 25 90 46C90 61 80 74 67 79C62 84 57 90 51 96C56 80 61 69 62 59C68 56 72 50 72 43C72 33 64 25 54 25C49 25 45 27 42 30C39 24 44 8 52 8ZM54 34C59 34 63 38 63 43C63 48 59 52 54 52C49 52 45 48 45 43C45 38 49 34 54 34Z"
        fill="#FF4B93"
      />
    </svg>
  );
}
