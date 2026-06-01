interface BrandProps {
  /** Tailwind height class for the circular icon, e.g. 'h-10' */
  iconClass?: string
  /** Tailwind text size class for COOTRANSA, e.g. 'text-2xl' */
  textClass?: string
  /** Show the tagline under the name */
  tagline?: boolean
  /** Tailwind text size for tagline */
  taglineClass?: string
}

export default function Brand({
  iconClass = 'h-10',
  textClass = 'text-2xl',
  tagline = false,
  taglineClass = 'text-[10px]',
}: BrandProps) {
  return (
    <div className="flex items-center gap-3">
      <img
        src="/favicon.png"
        alt="COOTRANSA"
        className={`${iconClass} w-auto object-contain drop-shadow-lg`}
      />
      <div className="flex flex-col leading-none">
        <span
          className={`${textClass} font-black font-display tracking-tight bg-gradient-to-b from-green-400 via-green-500 to-green-700 bg-clip-text text-transparent`}
        >
          COOTRANSA
        </span>
        {tagline && (
          <span className={`${taglineClass} font-bold uppercase tracking-[0.18em] text-zinc-200 mt-1.5`}>
            Pioneros en el transporte<br/>y en el progreso de Sabanalarga
          </span>
        )}
      </div>
    </div>
  )
}
