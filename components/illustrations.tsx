import Svg, {
  Circle,
  Ellipse,
  Path,
  Rect,
  G,
  Defs,
  LinearGradient,
  Stop,
  Polygon,
  Line,
} from 'react-native-svg';

// ── Slide 1: Plant scanning / leaf with magnifier ─────────────────────────────
export function IllustrationScan({ size = 260 }: { size?: number }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 260 260">
      <Defs>
        <LinearGradient id="sky" x1="0" y1="0" x2="0" y2="1">
          <Stop offset="0" stopColor="#d1fae5" />
          <Stop offset="1" stopColor="#f0fdf4" />
        </LinearGradient>
        <LinearGradient id="leafGrad" x1="0" y1="0" x2="1" y2="1">
          <Stop offset="0" stopColor="#4ade80" />
          <Stop offset="1" stopColor="#15803d" />
        </LinearGradient>
      </Defs>

      {/* Background circle */}
      <Circle cx="130" cy="130" r="120" fill="url(#sky)" />

      {/* Soil mound */}
      <Ellipse cx="130" cy="195" rx="65" ry="18" fill="#a16207" opacity={0.25} />

      {/* Stem */}
      <Path d="M130 195 Q128 160 124 135" stroke="#15803d" strokeWidth="5" strokeLinecap="round" fill="none" />

      {/* Main leaf */}
      <Path
        d="M124 135 Q95 100 105 65 Q140 75 148 110 Q155 135 124 135Z"
        fill="url(#leafGrad)"
      />
      {/* Leaf vein */}
      <Path d="M124 135 Q120 105 109 75" stroke="#15803d" strokeWidth="1.5" strokeLinecap="round" fill="none" opacity={0.6} />
      <Path d="M116 110 Q108 106 105 100" stroke="#15803d" strokeWidth="1.2" fill="none" opacity={0.5} />
      <Path d="M120 96 Q112 90 111 83" stroke="#15803d" strokeWidth="1.2" fill="none" opacity={0.5} />

      {/* Second leaf */}
      <Path
        d="M128 150 Q155 120 172 130 Q165 158 140 158 Q128 158 128 150Z"
        fill="#22c55e"
        opacity={0.85}
      />

      {/* Magnifying glass body */}
      <Circle cx="168" cy="88" r="28" fill="white" stroke="#15803d" strokeWidth="3" opacity={0.95} />
      <Circle cx="168" cy="88" r="22" fill="#bbf7d0" opacity={0.5} />
      {/* Scan lines inside magnifier */}
      <Line x1="155" y1="82" x2="181" y2="82" stroke="#15803d" strokeWidth="2" strokeLinecap="round" opacity={0.6} />
      <Line x1="155" y1="88" x2="181" y2="88" stroke="#15803d" strokeWidth="2" strokeLinecap="round" opacity={0.6} />
      <Line x1="155" y1="94" x2="181" y2="94" stroke="#15803d" strokeWidth="2" strokeLinecap="round" opacity={0.6} />
      {/* Magnifier handle */}
      <Path d="M190 110 L205 128" stroke="#15803d" strokeWidth="5" strokeLinecap="round" />

      {/* Sparkles */}
      <Path d="M75 75 L77 68 L79 75 L86 77 L79 79 L77 86 L75 79 L68 77Z" fill="#fbbf24" opacity={0.8} />
      <Path d="M195 55 L196.5 50 L198 55 L203 56.5 L198 58 L196.5 63 L195 58 L190 56.5Z" fill="#fbbf24" opacity={0.6} />
      <Circle cx="90" cy="165" r="3" fill="#4ade80" opacity={0.5} />
      <Circle cx="175" cy="165" r="2" fill="#86efac" opacity={0.5} />
    </Svg>
  );
}

// ── Slide 2: AI / brain network with leaf ─────────────────────────────────────
export function IllustrationAI({ size = 260 }: { size?: number }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 260 260">
      <Defs>
        <LinearGradient id="aiBg" x1="0" y1="0" x2="1" y2="1">
          <Stop offset="0" stopColor="#f0fdf4" />
          <Stop offset="1" stopColor="#dcfce7" />
        </LinearGradient>
        <LinearGradient id="brain" x1="0" y1="0" x2="1" y2="1">
          <Stop offset="0" stopColor="#4ade80" />
          <Stop offset="1" stopColor="#166534" />
        </LinearGradient>
      </Defs>

      {/* Background */}
      <Circle cx="130" cy="130" r="120" fill="url(#aiBg)" />

      {/* Network connection lines */}
      <Line x1="90" y1="100" x2="130" y2="130" stroke="#86efac" strokeWidth="2" opacity={0.7} />
      <Line x1="170" y1="100" x2="130" y2="130" stroke="#86efac" strokeWidth="2" opacity={0.7} />
      <Line x1="80" y1="150" x2="130" y2="130" stroke="#86efac" strokeWidth="2" opacity={0.7} />
      <Line x1="180" y1="150" x2="130" y2="130" stroke="#86efac" strokeWidth="2" opacity={0.7} />
      <Line x1="105" y1="175" x2="130" y2="130" stroke="#86efac" strokeWidth="2" opacity={0.7} />
      <Line x1="155" y1="175" x2="130" y2="130" stroke="#86efac" strokeWidth="2" opacity={0.7} />
      <Line x1="90" y1="100" x2="170" y2="100" stroke="#86efac" strokeWidth="1.5" opacity={0.4} />
      <Line x1="80" y1="150" x2="105" y2="175" stroke="#86efac" strokeWidth="1.5" opacity={0.4} />
      <Line x1="180" y1="150" x2="155" y2="175" stroke="#86efac" strokeWidth="1.5" opacity={0.4} />

      {/* Outer network nodes */}
      <Circle cx="90" cy="100" r="10" fill="#22c55e" opacity={0.9} />
      <Circle cx="170" cy="100" r="10" fill="#22c55e" opacity={0.9} />
      <Circle cx="80" cy="150" r="10" fill="#22c55e" opacity={0.9} />
      <Circle cx="180" cy="150" r="10" fill="#22c55e" opacity={0.9} />
      <Circle cx="105" cy="175" r="10" fill="#22c55e" opacity={0.9} />
      <Circle cx="155" cy="175" r="10" fill="#22c55e" opacity={0.9} />

      {/* Center brain/chip */}
      <Rect x="108" y="108" width="44" height="44" rx="10" fill="url(#brain)" />
      <Rect x="116" y="116" width="28" height="28" rx="6" fill="white" opacity={0.2} />
      {/* Chip pins */}
      <Rect x="104" y="118" width="4" height="6" rx="2" fill="#15803d" />
      <Rect x="104" y="130" width="4" height="6" rx="2" fill="#15803d" />
      <Rect x="104" y="142" width="4" height="6" rx="2" fill="#15803d" />
      <Rect x="152" y="118" width="4" height="6" rx="2" fill="#15803d" />
      <Rect x="152" y="130" width="4" height="6" rx="2" fill="#15803d" />
      <Rect x="152" y="142" width="4" height="6" rx="2" fill="#15803d" />
      {/* Leaf icon on chip */}
      <Path d="M130 120 Q118 126 122 138 Q132 142 136 130 Q138 122 130 120Z" fill="white" opacity={0.9} />

      {/* Floating percentage badge */}
      <Rect x="155" y="68" width="50" height="26" rx="13" fill="#15803d" />
      <Rect x="157" y="70" width="46" height="22" rx="11" fill="#16a34a" />
      {/* "98%" text approximation with shapes */}
      <Circle cx="170" cy="81" r="5" fill="none" stroke="white" strokeWidth="2" />
      <Rect x="176" y="76" width="2" height="10" rx="1" fill="white" />
      <Path d="M179 81 L185 76 L185 81 L179 81" fill="white" />
      <Path d="M179 81 L185 81 L185 86 L179 86 L179 81" fill="white" opacity={0.7} />

      {/* Sparkles */}
      <Path d="M60 80 L62 73 L64 80 L71 82 L64 84 L62 91 L60 84 L53 82Z" fill="#fbbf24" opacity={0.7} />
      <Circle cx="200" cy="75" r="4" fill="#fbbf24" opacity={0.5} />
      <Circle cx="55" cy="175" r="3" fill="#4ade80" opacity={0.5} />
    </Svg>
  );
}

// ── Slide 3: Treatment / prescription notepad ─────────────────────────────────
export function IllustrationResult({ size = 260 }: { size?: number }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 260 260">
      <Defs>
        <LinearGradient id="resBg" x1="0" y1="0" x2="0" y2="1">
          <Stop offset="0" stopColor="#f0fdf4" />
          <Stop offset="1" stopColor="#dcfce7" />
        </LinearGradient>
      </Defs>

      {/* Background */}
      <Circle cx="130" cy="130" r="120" fill="url(#resBg)" />

      {/* Clipboard / card */}
      <Rect x="68" y="75" width="124" height="140" rx="12" fill="white" />
      <Rect x="68" y="75" width="124" height="140" rx="12" fill="none" stroke="#d1fae5" strokeWidth="2" />

      {/* Clipboard top clip */}
      <Rect x="108" y="68" width="44" height="20" rx="10" fill="#15803d" />
      <Rect x="116" y="72" width="28" height="12" rx="6" fill="#dcfce7" />

      {/* Header bar */}
      <Rect x="68" y="75" width="124" height="36" rx="12" fill="#15803d" />
      <Rect x="68" y="93" width="124" height="18" fill="#15803d" />

      {/* Header icon circle */}
      <Circle cx="92" cy="93" r="12" fill="#4ade80" opacity={0.4} />
      <Path d="M92 87 Q86 90 88 97 Q94 100 97 93 Q98 88 92 87Z" fill="white" opacity={0.9} />

      {/* Header text bars */}
      <Rect x="110" y="87" width="60" height="7" rx="3.5" fill="white" opacity={0.9} />
      <Rect x="110" y="98" width="40" height="5" rx="2.5" fill="#bbf7d0" opacity={0.8} />

      {/* Confidence row */}
      <Rect x="82" y="124" width="96" height="22" rx="6" fill="#f0fdf4" />
      <Rect x="90" y="130" width="55" height="10" rx="5" fill="#4ade80" />
      <Rect x="90" y="130" width="75" height="10" rx="5" fill="#d1fae5" />
      <Rect x="90" y="130" width="55" height="10" rx="5" fill="#22c55e" />
      <Rect x="152" y="128" width="18" height="14" rx="4" fill="#15803d" />

      {/* Divider */}
      <Line x1="82" y1="158" x2="178" y2="158" stroke="#d1fae5" strokeWidth="1.5" />

      {/* List rows */}
      {[168, 182, 196].map((y, i) => (
        <G key={i}>
          <Circle cx="90" cy={y + 4} r="4" fill={i === 0 ? '#4ade80' : '#86efac'} />
          <Rect x="100" y={y} width={i === 0 ? 62 : i === 1 ? 50 : 70} height="8" rx="4" fill="#d1fae5" />
        </G>
      ))}

      {/* Green checkmark badge bottom right */}
      <Circle cx="178" cy="198" r="18" fill="#15803d" />
      <Path d="M169 198 L175 205 L188 190" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" fill="none" />

      {/* Sparkles */}
      <Path d="M55 100 L57 93 L59 100 L66 102 L59 104 L57 111 L55 104 L48 102Z" fill="#fbbf24" opacity={0.7} />
      <Path d="M200 85 L201.5 80 L203 85 L208 86.5 L203 88 L201.5 93 L200 88 L195 86.5Z" fill="#fbbf24" opacity={0.5} />
      <Circle cx="62" cy="185" r="3" fill="#4ade80" opacity={0.5} />
    </Svg>
  );
}
