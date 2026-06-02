import { useEffect, useState } from 'react'
import { supabase, type Horario } from '../../lib/supabase'
import { Plus, Trash2, Save, MapPin } from 'lucide-react'

const EMPTY: Omit<Horario, 'id'> = { estacion: '', primera_salida: '', ultima_salida: '', frecuencia: '' }

export default function AdminHorarios() {
  const [rows, setRows]       = useState<Horario[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving]   = useState(false)
  const [saved, setSaved]     = useState(false)

  const load = async () => {
    setLoading(true)
    const { data } = await supabase.from('horarios').select('*').order('estacion')
    setRows(data ?? [])
    setLoading(false)
  }

  useEffect(() => { load() }, [])

  const update = (i: number, key: keyof Horario, val: string) =>
    setRows(r => r.map((row, idx) => idx === i ? { ...row, [key]: val } : row))

  const addRow = () => setRows(r => [...r, { ...EMPTY }])

  const deleteRow = async (i: number) => {
    const row = rows[i]
    if (row.id) await supabase.from('horarios').delete().eq('id', row.id)
    setRows(r => r.filter((_, idx) => idx !== i))
  }

  const handleSave = async () => {
    setSaving(true)
    for (const row of rows) {
      const { id, ...data } = row
      if (id) { await supabase.from('horarios').update(data).eq('id', id) }
      else { await supabase.from('horarios').insert(data) }
    }
    setSaving(false); setSaved(true); setTimeout(() => setSaved(false), 2500); load()
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div><h1 className="text-xl font-bold text-gray-900">Horarios</h1><p className="text-sm text-gray-500 mt-0.5">Gestiona los horarios por estación</p></div>
        <div className="flex gap-2">
          <button onClick={addRow} className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold text-gray-700 border border-gray-200 bg-white hover:bg-gray-50 transition"><Plus size={15}/> Nueva estación</button>
          <button onClick={handleSave} disabled={saving} className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold text-white transition disabled:opacity-60" style={{ background: 'linear-gradient(135deg,#16a34a,#22c55e)' }}><Save size={15}/> {saving ? 'Guardando...' : saved ? '¡Guardado!' : 'Guardar cambios'}</button>
        </div>
      </div>
      {loading ? <div className="text-center py-16 text-sm text-gray-400">Cargando...</div> : (
        <div className="space-y-3">
          {rows.length === 0 && <div className="bg-white rounded-xl border border-gray-100 py-12 text-center"><p className="text-sm text-gray-400">No hay horarios. Agrega la primera estación.</p></div>}
          {rows.map((row, i) => (
            <div key={i} className="bg-white rounded-xl border border-gray-100 shadow-sm p-4 group">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2 flex-1"><MapPin size={14} className="text-green-500 shrink-0"/><input value={row.estacion} onChange={e => update(i,'estacion',e.target.value)} placeholder="Nombre de la estación" className="text-sm font-bold text-gray-900 bg-transparent outline-none focus:bg-green-50 px-2 py-1 rounded transition w-full"/></div>
                <button onClick={() => deleteRow(i)} className="p-1.5 rounded-lg text-gray-200 hover:text-red-500 hover:bg-red-50 transition opacity-0 group-hover:opacity-100"><Trash2 size={14}/></button>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {([['primera_salida','Primera salida','05:00 a.m.'],['ultima_salida','Última salida','07:00 p.m.'],['frecuencia','Frecuencia','Cada 30 min']] as const).map(([key, label, ph]) => (
                  <div key={key}><label className="block text-[10px] font-semibold text-gray-400 uppercase tracking-widest mb-1">{label}</label><input value={row[key] as string} onChange={e => update(i, key as keyof Horario, e.target.value)} placeholder={ph} className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-800 outline-none focus:border-green-500 focus:ring-2 focus:ring-green-100 transition"/></div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
