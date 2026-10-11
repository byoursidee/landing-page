export default function StaticWorld({ chapter, portrait }) {
  return <div className="static-world" aria-hidden="true"><svg viewBox={portrait ? "700 80 540 1160" : "0 0 1440 900"} preserveAspectRatio="xMidYMid slice">
    <defs><radialGradient id="light"><stop stopColor="#faf4e4" /><stop offset="1" stopColor="#dddcca" /></radialGradient><linearGradient id="sage"><stop stopColor="#3b634b" /><stop offset="1" stopColor="#91aa83" /></linearGradient></defs>
    <path fill="url(#light)" d="M0 0h1440v900H0z" />
    <g stroke="#a8b29a" strokeOpacity=".45" fill="none">{Array.from({ length: 15 }, (_, i) => <path key={i} d={`M${i * 150 - 300} 900L780 400M0 ${600 + i * i * 3}H1440`} />)}{[0, 1, 2, 3, 4].map(i => <path key={i} d={`M${80 + i * 110} 850V${60 + i * 65}H${1390 - i * 75}V850`} />)}</g>
    <ellipse cx="980" cy="170" rx="280" ry="60" fill="none" stroke="#b5b79e" strokeWidth="3" />
    <ellipse cx="970" cy="700" rx="210" ry="48" fill="#d1d4be" stroke="#9cad8e" />
    {chapter === 0 ? <g>
      <g fill="url(#sage)"><circle cx="865" cy="360" r="34" /><circle cx="1080" cy="360" r="34" /><path d="M833 414Q865 390 896 414L904 673Q865 694 826 673Z" /><path d="M1049 414Q1080 390 1112 414L1120 673Q1080 694 1040 673Z" /></g>
      <path d="M877 458Q922 542 974 489Q1026 542 1068 458" stroke="#65896b" strokeWidth="25" fill="none" strokeLinecap="round" /><circle cx="974" cy="455" r="32" fill="#c5a576" />
    </g> : chapter === 1 ? <g>
      <g stroke="#b79c70" strokeWidth="6" fill="none">{[0, 1, 2, 3].map(i => <path key={i} d={`M870 ${350 + i * 50}H810L785 ${335 + i * 60}H745M1070 ${350 + i * 50}H1130L1155 ${335 + i * 60}H1195M${895 + i * 50} 315V250M${895 + i * 50} 555V635`} />)}</g>
      <rect x="850" y="315" width="240" height="240" rx="18" fill="url(#sage)" /><path d="M925 390L883 435L925 480M1015 390L1057 435L1015 480M990 377L950 493" fill="none" stroke="#e7d9b8" strokeWidth="8" />
    </g> : <g>
      <path d="M745 650Q970 400 1195 650M745 605Q970 355 1195 605" stroke="#b59b70" strokeWidth="12" fill="none" />
      <g fill="url(#sage)"><circle cx="790" cy="447" r="25" /><path d="M767 487Q790 470 813 487L820 602H760Z" /><circle cx="1150" cy="447" r="25" /><path d="M1127 487Q1150 470 1173 487L1180 602H1120Z" /></g>
    </g>}
  </svg></div>
}
