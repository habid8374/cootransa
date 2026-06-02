import { useEffect, useState } from 'react'
import { supabase, type Tarifa } from '../../lib/supabase'
import { Plus, Trash2, Save } from 'lucide-react'

const EMPTY_ROW: Omit<Tarifa, 'id'> = { origen: '', destino: '', precio: '', tipo: 'Regular', activa: true }

export default function AdminTarifas() {
  const [rows, setRows]       = useState<Tarifa[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving]   = useState(false)
  const [saved, setSaved]     = useState(false)

  const load = async () => {
    setLoading(true)
    const { data } = await supabase.from('tarifas').select('*').order('origen')
    setRows(data ?? [])
    setLoading(false)
  }

  useEffect(() => { load() }, [])

  const update = (i: number, key: keyof Tarifa, val: string | boolean) =>
    setRows(r => r.map((row, idx) => idx === i ? { ...row, [key]: val } : row))

  const addRow = () => setRows(r => [...r, { ...EMPTY_ROW }])

  const deleteRow = async (i: number) => {
    const row = rows[i]
    if (row.id) await supabase.from('tarifas').delete().eq('id', row.id)
    setRows(r => r.filter((_, idx) => idx !== i))
  }

  const handleSave = async () => {
    setSaving(true)
    for (const row of rows) {
      const { id, ...data } = row
      if (id) { await supabase.from('tarifas').update(data).eq('id', id) }
      else { const { data: ins } = await supabase.from('tarifas').insert(data).select().single(); if (ins) row.id = ins.id }
    }
    setSaving(false); setSaved(true); setTimeout(() => setSaved(false), 2500); load()
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div><h1 className="text-xl font-bold text-gray-900">Tarifas</h1><p className="text-sm text-gray-500 mt-0.5">Haz clic en cualquier celda para editar</p></div>
        <button onClick={handleSave} disabled={saving} className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold text-white transition disabled:opacity-60" style={{ background: 'linear-gradient(135deg,#16a34a,#22c55e)' }}>
          <Save size={15} /> {saving ? 'Guardando...' : saved ? '¡Guardado!' : 'Guardar cambios'}
        </button>
      </div>
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
        <table className="w-full">
          <thead><tr className="bg-gray-50 border-b border-gray-100">
            <th className="text-left text-[11px] font-semibold text-gray-400 uppercase tracking-wide px-5 py-3">Origen</th>
            <th className="text-left text-[11px] font-semibold text-gray-400 uppercase tracking-wide px-5 py-3">Destino</th>
            <th className="text-left text-[11px] font-semibold text-gray-400 uppercase tracking-wide px-5 py-3">Tarifa</th>
            <th className="text-left text-[11px] font-semibold text-gray-400 uppercase tracking-wide px-5 py-3 hidden sm:table-cell">Tipo</th>
            <th className="text-left text-[11px] font-semibold text-gray-400 uppercase tracking-wide px-5 py-3 hidden sm:table-cell">Activa</th>
            <th className="px-5 py-3 w-10" />
          </tr></thead>
          <tbody>
            {loading ? <tr><td colSpan={6} className="px-5 py-10 text-center text-sm text-gray-400">Cargando...</td></tr>
            : rows.map((row, i) => (
              <tr key={i} className="border-b border-gray-50 last:border-0 hover:bg-gray-50/50 transition group">
                <td className="px-4 py-2"><input value={row.origen}  onChange={e => update(i,'origen',e.target.value)}  className="w-full text-sm text-gray-800 bg-transparent outline-none focus:bg-green-50 focus:px-2 rounded transition px-1 py-1.5"/></td>
                <td className="px-4 py-2"><input value={row.destino} onChange={e => update(i,'destino',e.target.value)} className="w-full text-sm text-gray-800 bg-transparent outline-none focus:bg-green-50 focus:px-2 rounded transition px-1 py-1.5"/></td>
                <td className="px-4 py-2"><input value={row.precio}  onChange={e => update(i,'precio',e.target.value)}  className="w-full text-sm text-gray-800 bg-transparent outline-none focus:bg-green-50 focus:px-2 rounded transition px-1 py-1.5"/></td>
                <td className="px-4 py-2 hidden sm:table-cell"><select value={row.tipo} onChange={e => update(i,'tipo',e.target.value)} className="text-sm text-gray-600 bg-transparent outline-none focus:bg-green-50 rounded transition py-1.5 px-1"><option>Regular</option><option>Estudiantil</option><option>Especial</option></select></td>
                <td className="px-4 py-2 hidden sm:table-cell"><button onClick={() => update(i,'activa',!row.activa)} className={`text-[11px] font-semibold px-2.5 py-1 rounded-full transition ${row.activa ? 'bg-green-50 text-green-700' : 'bg-gray-100 text-gray-500'}`}>{row.activa ? '● Activa' : '○ Inactiva'}</button></td>
                <td className="px-4 py-2"><button onClick={() => deleteRow(i)} className="p-1.5 rounded-lg text-gray-300 hover:text-red-500 hover:bg-red-50 transition opacity-0 group-hover:opacity-100"><Trash2 size={14}/></button></td>
              </tr>
            ))}
          </tbody>
        </table>
        <button onClick={addRow} className="flex items-center gap-2 w-full px-5 py-3 text-sm font-semibold text-green-600 hover:bg-green-50 transition border-t border-gray-50"><Plus size={15} /> Agregar fila</button>
      </div>
    </div>
  )
}
