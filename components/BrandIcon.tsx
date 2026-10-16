interface Props { name: string; color: string }
export default function BrandIcon({ name, color }: Props) {
  const adobe = name === "After Effects" || name === "Premiere Pro";
  return <span aria-hidden="true" style={{ color, boxShadow: `0 0 24px ${color}26` }} className="flex h-[56px] w-[56px] shrink-0 items-center justify-center rounded-lg border border-current bg-bg p-2">
    <svg viewBox="0 0 40 40" className="h-full w-full" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      {adobe ? name === "After Effects" ? <path d="m3 30 7-21 7 21M6 23h8m9 0h12c0-10-13-10-13 0s9 10 13 5" /> : <path d="M5 30V10h7c10 0 10 12 0 12H5m20 8V17m0 6c0-5 5-7 9-5" /> : name === "Figma" ? <><path fill="#F24E1E" stroke="none" d="M10 3h10v12H10a6 6 0 0 1 0-12" /><path fill="#FF7262" stroke="none" d="M20 3h7a6 6 0 0 1 0 12h-7" /><path fill="#A259FF" stroke="none" d="M10 15h10v12H10a6 6 0 0 1 0-12" /><circle cx="26" cy="21" r="6" fill="#1ABCFE" stroke="none" /><path fill="#0ACF83" stroke="none" d="M10 27h10v6a6 6 0 1 1-10-6" /></> : name === "Canva" ? <path d="M29 11C19 0 5 17 11 29c5 10 19 2 21-6M25 9l-4 8" /> : name === "CapCut" ? <path d="m5 10 30 20H5v-5l30-15v20M5 10h24M5 6v8m30 12v8" /> : name === "Claude" ? <>{Array.from({length:12},(_,i)=><path key={i} d="M20 4v11" transform={`rotate(${i*30} 20 20)`} />)}</> : <>{Array.from({length:6},(_,i)=><path key={i} d="M20 9c-2-8-14-5-14 3v12l14 8 10-6V15l-10-6-10 6v11" transform={`rotate(${i*60} 20 20)`} strokeWidth="1.6" />)}</>}
    </svg>
  </span>;
}
