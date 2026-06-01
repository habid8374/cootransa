import { Check } from 'lucide-react'
import type { Block } from '../content/about'

function Bullet({ text }: { text: string }) {
  const idx = text.indexOf(':')
  if (idx > 0 && idx < 28) {
    return (
      <span><strong className="text-green-400 font-semibold">{text.slice(0, idx)}:</strong>{text.slice(idx + 1)}</span>
    )
  }
  return <span>{text}</span>
}

export default function ContentRenderer({ blocks }: { blocks: Block[] }) {
  return (
    <div className="space-y-6">
      {blocks.map((block, bi) => {
        if (block.type === 'p') {
          return (
            <div key={bi} className="space-y-4">
              {block.items.map((t, i) => (
                <p key={i} className="text-zinc-300 text-base sm:text-lg leading-relaxed">{t}</p>
              ))}
            </div>
          )
        }
        if (block.type === 'check') {
          return (
            <ul key={bi} className="space-y-4">
              {block.items.map((t, i) => (
                <li key={i} className="flex gap-3 text-zinc-300 text-base leading-relaxed">
                  <Check size={20} className="text-green-400 flex-shrink-0 mt-1"/>
                  <span>{t}</span>
                </li>
              ))}
            </ul>
          )
        }
        if (block.type === 'dash') {
          return (
            <ul key={bi} className="flex flex-wrap gap-3 pl-8">
              {block.items.map((t, i) => (
                <li key={i} className="px-4 py-1.5 rounded-full bg-green-500/10 border border-green-500/20 text-green-300 text-sm font-medium">{t}</li>
              ))}
            </ul>
          )
        }
        // bullet
        return (
          <ul key={bi} className="space-y-4">
            {block.items.map((t, i) => (
              <li key={i} className="flex gap-3 text-zinc-300 text-base leading-relaxed">
                <span className="w-2 h-2 rounded-full bg-green-400 flex-shrink-0 mt-2.5"/>
                <Bullet text={t}/>
              </li>
            ))}
          </ul>
        )
      })}
    </div>
  )
}
