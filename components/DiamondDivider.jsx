export default function DiamondDivider({ className = "" }) {
  return (
    <div
      aria-hidden="true"
      className={`flex items-center justify-center gap-3 ${className}`}
    >
      <span className="h-px w-14 bg-ink/20" />
      <span className="text-gold text-xs">◆</span>
      <span className="h-px w-14 bg-ink/20" />
    </div>
  );
}
