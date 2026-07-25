/**
 * Casilla de autorización de tratamiento de datos personales (Habeas Data, Ley 1581 de 2012).
 * Reutilizable en el formulario de contacto, carnet y proveedores.
 * Es obligatoria: el formulario no se envía si no está marcada.
 */
export default function HabeasData({
  checked,
  onChange,
  className = '',
}: {
  checked: boolean
  onChange: (v: boolean) => void
  className?: string
}) {
  return (
    <label className={`flex items-start gap-2.5 cursor-pointer select-none ${className}`}>
      <input
        type="checkbox"
        checked={checked}
        onChange={e => onChange(e.target.checked)}
        required
        className="mt-0.5 h-4 w-4 shrink-0 rounded border-gray-300 text-green-600 focus:ring-green-500 accent-green-600 cursor-pointer"
      />
      <span className="text-[12px] leading-snug text-gray-500">
        Autorizo de manera libre, previa e informada el tratamiento de mis datos personales
        conforme a la{' '}
        <a
          href="/politicas/tratamiento-datos"
          target="_blank"
          rel="noopener noreferrer"
          className="text-green-600 font-medium hover:underline"
        >
          Política de Tratamiento de Datos Personales
        </a>{' '}
        de COOTRANSA (Ley 1581 de 2012). *
      </span>
    </label>
  )
}
