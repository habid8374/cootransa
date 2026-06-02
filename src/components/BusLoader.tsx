export default function BusLoader() {
  return (
    <div className="w-full h-full flex flex-col items-center justify-center gap-5">
      <div
        className="w-16 h-16 rounded-2xl flex items-center justify-center text-3xl"
        style={{
          background: 'linear-gradient(135deg,#16a34a,#22c55e)',
          boxShadow: '0 8px 32px rgba(34,197,94,0.4)',
          animation: 'busLoaderPulse 1.2s ease-in-out infinite',
        }}
      >
        🚌
      </div>
      <div className="flex items-center gap-1.5">
        {[0, 150, 300].map((d) => (
          <span
            key={d}
            className="w-1.5 h-1.5 rounded-full bg-green-400"
            style={{ animation: `busLoaderBounce 0.9s ease-in-out infinite ${d}ms` }}
          />
        ))}
      </div>
      <style>{`
        @keyframes busLoaderPulse {
          0%,100%{transform:scale(1);opacity:1}
          50%{transform:scale(1.08);opacity:0.85}
        }
        @keyframes busLoaderBounce {
          0%,100%{transform:translateY(0);opacity:0.4}
          50%{transform:translateY(-7px);opacity:1}
        }
      `}</style>
    </div>
  )
}
