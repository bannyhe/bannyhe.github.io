/** Fictional, decorative portraits; the adjacent heading identifies each role. */
export function PersonaAvatar({ role }: { role: "operator" | "administrator" }) {
  const operator = role === "operator";
  return <svg className="ai-persona-avatar" viewBox="0 0 96 96" fill="none" aria-hidden="true" focusable="false">
    <circle cx="48" cy="48" r="47" fill="var(--ai-avatar-bg)" />
    <circle cx="75" cy="23" r="5" fill="var(--ai-avatar-accent)" opacity=".65" />
    <path d="M17 36h8M21 32v8" stroke="var(--ai-avatar-accent)" strokeWidth="2" strokeLinecap="round" />
    {operator ? <>
      <path d="M16 83c4-14 15-21 32-21s28 7 32 21a46 46 0 0 1-64 0Z" fill="#1a4d7a" />
      <path d="m36 65 12 14 12-14-7-3H43Z" fill="#dceafb" />
      <path d="M41 54h14v13c-4 5-10 5-14 0Z" fill="#c88460" />
      <ellipse cx="30" cy="43" rx="5" ry="7" fill="#d99a73" />
      <ellipse cx="66" cy="43" rx="5" ry="7" fill="#d99a73" />
      <path d="M30 32c0-13 36-13 36 0v13c0 13-8 20-18 20s-18-7-18-20Z" fill="#e6ad87" />
      <path d="M29 41c-4-6-5-17 1-22 2-7 11-9 17-5 7-5 18-1 19 6 7 5 6 15 1 21l-3-13c-7 3-14 0-17-3-4 5-10 7-16 6Z" fill="#172e49" />
      <path d="M37 39h6m10 0h6" stroke="#533c35" strokeWidth="2" strokeLinecap="round" />
      <circle cx="40" cy="44" r="1.6" fill="#172e49" /><circle cx="56" cy="44" r="1.6" fill="#172e49" />
      <path d="m48 46-2 6h3m-7 5c3 3 8 3 11-1" stroke="#a65e48" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M25 42v-6c0-13 9-22 23-22s23 9 23 22v6" stroke="#6e9ac4" strokeWidth="3" strokeLinecap="round" />
      <rect x="23" y="37" width="7" height="15" rx="3.5" fill="#102f56" /><rect x="66" y="37" width="7" height="15" rx="3.5" fill="#102f56" />
      <path d="M70 49v5c0 4-5 6-12 6" stroke="#102f56" strokeWidth="2.5" strokeLinecap="round" />
      <rect x="53" y="57" width="8" height="5" rx="2.5" fill="#102f56" />
      <path d="M30 81v10m36-10v10" stroke="#6e9ac4" strokeWidth="2" strokeLinecap="round" />
    </> : <>
      <path d="M25 36c0-16 9-24 23-24s24 9 24 25l2 34H23Z" fill="#233a54" />
      <path d="M16 83c4-14 15-21 32-21s28 7 32 21a46 46 0 0 1-64 0Z" fill="#6e9ac4" />
      <path d="M40 64h16l6 29H34Z" fill="#e6effa" />
      <path d="M41 54h14v13c-4 5-10 5-14 0Z" fill="#d5977e" />
      <ellipse cx="30" cy="43" rx="4" ry="6" fill="#efbfa7" /><ellipse cx="66" cy="43" rx="4" ry="6" fill="#efbfa7" />
      <path d="M30 32c0-13 36-13 36 0v13c0 13-8 20-18 20s-18-7-18-20Z" fill="#f3c9b3" />
      <path d="M28 39c-3-19 12-27 23-23 12-2 20 10 17 25l-5-12c-9 2-15-2-19-5-4 7-9 10-16 11Z" fill="#233a54" />
      <path d="M38 37h5m10 0h5" stroke="#765347" strokeWidth="1.8" strokeLinecap="round" />
      <rect x="32" y="40" width="13" height="10" rx="4" fill="#dceafb" fillOpacity=".35" stroke="#102f56" strokeWidth="2" />
      <rect x="51" y="40" width="13" height="10" rx="4" fill="#dceafb" fillOpacity=".35" stroke="#102f56" strokeWidth="2" />
      <path d="M45 44h6m-23-2 4 1m32 0 4-1" stroke="#102f56" strokeWidth="2" strokeLinecap="round" />
      <circle cx="39" cy="45" r="1.5" fill="#172e49" /><circle cx="57" cy="45" r="1.5" fill="#172e49" />
      <path d="m48 47-1 6h2m-7 4c3 3 8 3 11-1" stroke="#b77361" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
      <path d="m36 66-7 9 10 4-4 13m25-26 7 9-10 4 4 13" stroke="#1a4d7a" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx="48" cy="81" r="1.5" fill="#6e9ac4" />
    </>}
  </svg>;
}
