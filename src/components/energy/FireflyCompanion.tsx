export type FireflyState = "welcome" | "energised" | "steady" | "resting";

export function fireflyStateFor(entry: {
  sleep: number;
  energy: number;
  stress: number;
} | null): FireflyState {
  if (!entry) return "steady";
  if (entry.sleep <= 2 || entry.stress >= 4) return "resting";
  if (entry.energy >= 4 && entry.stress <= 2) return "energised";
  return "steady";
}

type Props = {
  state: FireflyState;
  className?: string;
};

export function FireflyCompanion({ state, className }: Props) {
  return (
    <span className={`firefly-float inline-block ${className ?? ""}`} aria-hidden="true">
      {state === "welcome" && <Welcome />}
      {state === "energised" && <Energised />}
      {state === "steady" && <Steady />}
      {state === "resting" && <Resting />}
    </span>
  );
}

const svgProps = {
  viewBox: "0 0 120 120",
  className: "h-full w-full",
} as const;

function Welcome() {
  return (
    <svg {...svgProps}>
      <defs>
        <radialGradient id="glowHome" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#ffdb8a" stopOpacity="0.85" />
          <stop offset="100%" stopColor="#ffdb8a" stopOpacity="0" />
        </radialGradient>
      </defs>
      <circle cx="78" cy="66" r="34" fill="url(#glowHome)" />
      <ellipse cx="50" cy="28" rx="14" ry="20" fill="#f7f0e3" opacity="0.9" transform="rotate(-32 50 28)" />
      <ellipse cx="72" cy="32" rx="15" ry="22" fill="#fdf7ec" opacity="0.95" transform="rotate(22 72 32)" />
      <path d="M60 30 C40 40 34 60 44 76 C52 88 68 90 78 80 C90 68 88 46 74 34 C70 30 64 28 60 30 Z" fill="#3d3a33" />
      <circle cx="60" cy="70" r="9" fill="#ffcf5c" />
      <circle cx="52" cy="52" r="4.5" fill="#fff" />
      <circle cx="66" cy="52" r="4.5" fill="#fff" />
      <circle cx="52" cy="53" r="2.3" fill="#232019" />
      <circle cx="66" cy="53" r="2.3" fill="#232019" />
      <path d="M49 61 Q59 70 69 61" stroke="#232019" strokeWidth="2.1" fill="none" strokeLinecap="round" />
      <path d="M50 32 Q42 22 34 20" stroke="#3d3a33" strokeWidth="2" fill="none" strokeLinecap="round" />
      <path d="M68 32 Q77 21 85 20" stroke="#3d3a33" strokeWidth="2" fill="none" strokeLinecap="round" />
      <path d="M92 40 l3 -6 l3 6 l6 3 l-6 3 l-3 6 l-3 -6 l-6 -3 Z" fill="#ffd77a" />
      <path d="M22 78 l2 -4 l2 4 l4 2 l-4 2 l-2 4 l-2 -4 l-4 -2 Z" fill="#ffd77a" opacity="0.8" />
    </svg>
  );
}

function Energised() {
  return (
    <svg {...svgProps}>
      <defs>
        <radialGradient id="glowGreen" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#8be07a" stopOpacity="0.9" />
          <stop offset="100%" stopColor="#8be07a" stopOpacity="0" />
        </radialGradient>
      </defs>
      <circle cx="78" cy="64" r="36" fill="url(#glowGreen)" />
      <ellipse cx="49" cy="26" rx="14" ry="21" fill="#eef7e8" opacity="0.9" transform="rotate(-35 49 26)" />
      <ellipse cx="73" cy="30" rx="15" ry="23" fill="#f6fbf1" opacity="0.95" transform="rotate(28 73 30)" />
      <path d="M60 28 C38 38 32 60 43 76 C52 89 69 91 79 80 C92 67 90 44 75 32 C71 28 64 26 60 28 Z" fill="#3d3a33" />
      <circle cx="60" cy="69" r="10" fill="#7ed957" />
      <circle cx="51" cy="50" r="5" fill="#fff" />
      <circle cx="66" cy="50" r="5" fill="#fff" />
      <circle cx="51" cy="51" r="2.6" fill="#1e2b19" />
      <circle cx="66" cy="51" r="2.6" fill="#1e2b19" />
      <path d="M48 60 Q59 70 70 60" stroke="#1e2b19" strokeWidth="2.2" fill="none" strokeLinecap="round" />
      <path d="M49 30 Q41 18 32 15" stroke="#3d3a33" strokeWidth="2" fill="none" strokeLinecap="round" />
      <path d="M69 30 Q79 19 88 17" stroke="#3d3a33" strokeWidth="2" fill="none" strokeLinecap="round" />
    </svg>
  );
}

function Steady() {
  return (
    <svg {...svgProps}>
      <defs>
        <radialGradient id="glowFlat" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#d8cdb0" stopOpacity="0.55" />
          <stop offset="100%" stopColor="#d8cdb0" stopOpacity="0" />
        </radialGradient>
      </defs>
      <circle cx="72" cy="64" r="26" fill="url(#glowFlat)" />
      <ellipse cx="50" cy="34" rx="12" ry="17" fill="#f2efe6" opacity="0.75" transform="rotate(-14 50 34)" />
      <ellipse cx="66" cy="36" rx="12" ry="18" fill="#f6f3ea" opacity="0.8" transform="rotate(10 66 36)" />
      <path d="M58 34 C42 42 38 58 46 72 C53 82 66 84 74 76 C84 66 82 48 70 38 C66 34 61 32 58 34 Z" fill="#3d3a33" />
      <circle cx="58" cy="68" r="7.5" fill="#cdbf95" />
      <circle cx="51" cy="54" r="4.2" fill="#fff" />
      <circle cx="64" cy="54" r="4.2" fill="#fff" />
      <circle cx="51" cy="55" r="2.1" fill="#2b2820" />
      <circle cx="64" cy="55" r="2.1" fill="#2b2820" />
      <line x1="52" y1="63" x2="63" y2="63" stroke="#2b2820" strokeWidth="2" strokeLinecap="round" />
      <path d="M50 36 Q45 27 40 24" stroke="#3d3a33" strokeWidth="1.8" fill="none" strokeLinecap="round" />
      <path d="M66 36 Q72 27 78 24" stroke="#3d3a33" strokeWidth="1.8" fill="none" strokeLinecap="round" />
    </svg>
  );
}

function Resting() {
  return (
    <svg {...svgProps}>
      <defs>
        <radialGradient id="glowRed" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#f28671" stopOpacity="0.55" />
          <stop offset="100%" stopColor="#f28671" stopOpacity="0" />
        </radialGradient>
      </defs>
      <circle cx="60" cy="78" r="18" fill="url(#glowRed)" />
      <path d="M40 76 C36 60 46 46 62 46 C78 46 86 62 80 78 C76 88 64 92 52 88 C46 86 42 82 40 76 Z" fill="#3d3a33" />
      <circle cx="62" cy="79" r="6.5" fill="#e8695a" opacity="0.9" />
      <path d="M49 62 Q53 58 57 62" stroke="#211d18" strokeWidth="1.8" fill="none" strokeLinecap="round" />
      <path d="M64 62 Q68 58 72 62" stroke="#211d18" strokeWidth="1.8" fill="none" strokeLinecap="round" />
      <ellipse cx="51" cy="52" rx="7" ry="9" fill="#f2ece0" opacity="0.55" transform="rotate(-30 51 52)" />
      <ellipse cx="70" cy="53" rx="7" ry="10" fill="#f6f1e6" opacity="0.6" transform="rotate(25 70 53)" />
    </svg>
  );
}
