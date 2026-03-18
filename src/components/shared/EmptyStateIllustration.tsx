// Lightweight SVG illustrations for empty states — heritage-inspired, warm tones
// Each is ~1KB inline SVG, no external assets needed

export function FamilyTreeIllustration({ className = 'w-48 h-48' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Soft ground */}
      <ellipse cx="100" cy="175" rx="70" ry="8" fill="#E8F5EE" />
      {/* Trunk */}
      <path d="M95 175 C95 140, 90 120, 100 90" stroke="#8B6914" strokeWidth="6" strokeLinecap="round" fill="none" />
      <path d="M105 175 C105 140, 110 120, 100 90" stroke="#A07818" strokeWidth="4" strokeLinecap="round" fill="none" />
      {/* Branches */}
      <path d="M100 90 C85 75, 60 70, 50 55" stroke="#1B4332" strokeWidth="3" strokeLinecap="round" fill="none" />
      <path d="M100 90 C115 75, 140 70, 150 55" stroke="#1B4332" strokeWidth="3" strokeLinecap="round" fill="none" />
      <path d="M100 90 C100 70, 100 55, 100 40" stroke="#1B4332" strokeWidth="3" strokeLinecap="round" fill="none" />
      <path d="M80 100 C65 90, 45 95, 35 80" stroke="#2D8C5A" strokeWidth="2" strokeLinecap="round" fill="none" />
      <path d="M120 100 C135 90, 155 95, 165 80" stroke="#2D8C5A" strokeWidth="2" strokeLinecap="round" fill="none" />
      {/* Leaf clusters */}
      <circle cx="50" cy="50" r="14" fill="#55B682" opacity="0.7" />
      <circle cx="40" cy="58" r="10" fill="#2D8C5A" opacity="0.6" />
      <circle cx="100" cy="35" r="16" fill="#55B682" opacity="0.7" />
      <circle cx="90" cy="42" r="11" fill="#2D8C5A" opacity="0.6" />
      <circle cx="150" cy="50" r="14" fill="#55B682" opacity="0.7" />
      <circle cx="160" cy="58" r="10" fill="#2D8C5A" opacity="0.6" />
      <circle cx="35" cy="75" r="10" fill="#8ECFAB" opacity="0.5" />
      <circle cx="165" cy="75" r="10" fill="#8ECFAB" opacity="0.5" />
      {/* Gold accent dots (representing family members) */}
      <circle cx="50" cy="48" r="4" fill="#D4A017" />
      <circle cx="100" cy="33" r="4" fill="#D4A017" />
      <circle cx="150" cy="48" r="4" fill="#D4A017" />
      <circle cx="35" cy="73" r="3" fill="#D4A017" opacity="0.7" />
      <circle cx="165" cy="73" r="3" fill="#D4A017" opacity="0.7" />
      {/* Roots */}
      <path d="M92 175 C88 185, 75 188, 65 190" stroke="#A07818" strokeWidth="2" strokeLinecap="round" fill="none" opacity="0.4" />
      <path d="M108 175 C112 185, 125 188, 135 190" stroke="#A07818" strokeWidth="2" strokeLinecap="round" fill="none" opacity="0.4" />
    </svg>
  )
}

export function EmptyMembersIllustration({ className = 'w-40 h-40' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 160 160" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Background circle */}
      <circle cx="80" cy="80" r="60" fill="#E8F5EE" />
      {/* Central figure */}
      <circle cx="80" cy="58" r="14" fill="#C6E8D4" stroke="#1B4332" strokeWidth="2" />
      <path d="M60 95 C60 80, 72 72, 80 72 C88 72, 100 80, 100 95" fill="#C6E8D4" stroke="#1B4332" strokeWidth="2" />
      {/* Dashed circles for missing members */}
      <circle cx="45" cy="62" r="10" stroke="#8ECFAB" strokeWidth="1.5" strokeDasharray="3 3" fill="none" />
      <circle cx="115" cy="62" r="10" stroke="#8ECFAB" strokeWidth="1.5" strokeDasharray="3 3" fill="none" />
      {/* Plus icons */}
      <line x1="42" y1="62" x2="48" y2="62" stroke="#55B682" strokeWidth="1.5" strokeLinecap="round" />
      <line x1="45" y1="59" x2="45" y2="65" stroke="#55B682" strokeWidth="1.5" strokeLinecap="round" />
      <line x1="112" y1="62" x2="118" y2="62" stroke="#55B682" strokeWidth="1.5" strokeLinecap="round" />
      <line x1="115" y1="59" x2="115" y2="65" stroke="#55B682" strokeWidth="1.5" strokeLinecap="round" />
      {/* Connecting lines */}
      <line x1="55" y1="62" x2="66" y2="62" stroke="#8ECFAB" strokeWidth="1" strokeDasharray="2 2" />
      <line x1="94" y1="62" x2="105" y2="62" stroke="#8ECFAB" strokeWidth="1" strokeDasharray="2 2" />
      {/* Gold accent */}
      <circle cx="80" cy="56" r="2.5" fill="#D4A017" />
    </svg>
  )
}

export function NoBirthdaysIllustration({ className = 'w-32 h-32' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="60" cy="60" r="45" fill="#FDF8E8" />
      {/* Cake base */}
      <rect x="35" y="65" width="50" height="20" rx="4" fill="#FAEFC2" stroke="#D4A017" strokeWidth="1.5" />
      <rect x="40" y="55" width="40" height="12" rx="3" fill="#F5DC85" stroke="#D4A017" strokeWidth="1.5" />
      {/* Candles */}
      <rect x="52" y="42" width="3" height="14" rx="1.5" fill="#E8B520" />
      <rect x="62" y="45" width="3" height="11" rx="1.5" fill="#E8B520" />
      {/* Flames */}
      <ellipse cx="53.5" cy="40" rx="2.5" ry="4" fill="#F0C948" opacity="0.8" />
      <ellipse cx="63.5" cy="43" rx="2" ry="3.5" fill="#F0C948" opacity="0.8" />
      {/* Decoration dots */}
      <circle cx="45" cy="72" r="1.5" fill="#D4A017" opacity="0.5" />
      <circle cx="55" cy="72" r="1.5" fill="#D4A017" opacity="0.5" />
      <circle cx="65" cy="72" r="1.5" fill="#D4A017" opacity="0.5" />
      <circle cx="75" cy="72" r="1.5" fill="#D4A017" opacity="0.5" />
    </svg>
  )
}

export function EmptySearchIllustration({ className = 'w-40 h-40' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 160 160" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="80" cy="80" r="60" fill="#E8F5EE" />
      {/* Magnifying glass */}
      <circle cx="72" cy="68" r="22" stroke="#1B4332" strokeWidth="3" fill="#C6E8D4" opacity="0.5" />
      <line x1="88" y1="84" x2="108" y2="104" stroke="#1B4332" strokeWidth="4" strokeLinecap="round" />
      {/* Question mark */}
      <path d="M67 62 C67 56, 72 52, 77 52 C82 52, 86 56, 83 61 C81 64, 77 65, 77 69" stroke="#2D8C5A" strokeWidth="2.5" strokeLinecap="round" fill="none" />
      <circle cx="77" cy="74" r="1.5" fill="#2D8C5A" />
    </svg>
  )
}

export function OnboardingIllustration({ className = 'w-56 h-56' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 240 240" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Background */}
      <circle cx="120" cy="120" r="90" fill="#E8F5EE" />
      <circle cx="120" cy="120" r="70" fill="#C6E8D4" opacity="0.3" />
      {/* House shape — Kampung-inspired */}
      <path d="M120 55 L165 95 L165 155 L75 155 L75 95 Z" fill="white" stroke="#1B4332" strokeWidth="2.5" />
      {/* Roof */}
      <path d="M68 98 L120 50 L172 98" stroke="#1B4332" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" fill="#E8F5EE" />
      {/* Decorative roof peak (Malay-inspired) */}
      <path d="M120 50 L120 40" stroke="#D4A017" strokeWidth="2" strokeLinecap="round" />
      <path d="M116 42 L120 36 L124 42" stroke="#D4A017" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
      {/* Door */}
      <rect x="107" y="118" width="26" height="37" rx="3" fill="#C6E8D4" stroke="#1B4332" strokeWidth="1.5" />
      <circle cx="128" cy="137" r="2" fill="#D4A017" />
      {/* Window */}
      <rect x="84" y="105" width="16" height="16" rx="2" fill="#E8F5EE" stroke="#1B4332" strokeWidth="1.5" />
      <line x1="92" y1="105" x2="92" y2="121" stroke="#1B4332" strokeWidth="1" />
      <line x1="84" y1="113" x2="100" y2="113" stroke="#1B4332" strokeWidth="1" />
      {/* Family figures */}
      <circle cx="90" cy="170" r="6" fill="#55B682" />
      <circle cx="110" cy="168" r="7" fill="#1B4332" />
      <circle cx="130" cy="168" r="7" fill="#D4A017" />
      <circle cx="150" cy="170" r="6" fill="#55B682" />
      {/* Small tree */}
      <line x1="175" y1="155" x2="175" y2="135" stroke="#8B6914" strokeWidth="2" strokeLinecap="round" />
      <circle cx="175" cy="130" r="10" fill="#55B682" opacity="0.7" />
      <circle cx="170" cy="135" r="7" fill="#2D8C5A" opacity="0.6" />
      {/* Hearts */}
      <path d="M118 78 C118 75, 122 72, 125 75 C128 72, 132 75, 132 78 C132 83, 125 88, 125 88 C125 88, 118 83, 118 78Z" fill="#D4A017" opacity="0.6" />
    </svg>
  )
}
