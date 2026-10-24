import React, { useState } from 'react';
import { ArrowLeftRight, Check, X, Sparkles, AlertCircle } from 'lucide-react';

interface ComparisonPoint {
  dimension: string;
  before: string;
  after: string;
  impact: string;
  category: 'critical' | 'high' | 'medium';
}

const COMPARISON_DATA: ComparisonPoint[] = [
  {
    dimension: 'Selección de Talles',
    before: 'Inexistente. El botón "Agregar +" suma el producto sin consultar talle.',
    after: 'Chips de talle táctiles en la tarjeta + selector dentro del carrito antes de pedir.',
    impact: 'Elimina las consultas manuales "¿En qué talle querías?" en el 100% de los pedidos.',
    category: 'critical',
  },
  {
    dimension: 'Mensaje de WhatsApp',
    before: 'Solo lista de prendas y total, sin formato de entrega ni datos del comprador.',
    after: 'Mensaje estructurado con nombre, talles detallados, método de entrega y medio de pago.',
    impact: 'La orden llega lista para empaquetar y cobrar, sin pérdidas de tiempo.',
    category: 'critical',
  },
  {
    dimension: 'Gestión de Fotos Google Drive',
    before: 'Usa `drive.google.com/thumbnail` sin `onError` fallback (riesgo de fotos rotas por rate-limit).',
    after: 'Manejador de error inteligente con placeholders agradables por categoría y lazy loading.',
    impact: 'Garantiza que la tienda jamás se vea descuidada con recuadros rotos.',
    category: 'critical',
  },
  {
    dimension: 'Persistencia del Carrito',
    before: 'Solo memoria `useState`. Si el cliente sale a WhatsApp o recarga, se vacía.',
    after: 'Guardado automático en `localStorage`. El carrito permanece intacto por días.',
    impact: 'Recupera hasta un 15% de ventas perdidas por navegación interrumpida en móviles.',
    category: 'high',
  },
  {
    dimension: 'Filtro por Talle de los Niños',
    before: 'Solo filtra por categoría o búsqueda por texto libre.',
    after: 'Filtro rápido de talles (0-3m, 3T, 6T, 8T) para ver solo lo que le entra a su hijo.',
    impact: 'Permite a los padres encontrar en 5 segundos exactamente la ropa del tamaño de su nene.',
    category: 'high',
  },
  {
    dimension: 'Incentivo de Pago Transferencia',
    before: 'El carrito suma siempre el precio de lista. El descuento contado queda poco visible.',
    after: 'Toggle interactivo con cálculo en tiempo real: "¡Ahorrás $X pagando por Transferencia!".',
    impact: 'Aumenta el cobro por transferencia directa y mejora la liquidez inmediata.',
    category: 'high',
  },
  {
    dimension: 'Multi-talles por Prenda',
    before: 'La clave del carrito es solo el ID del producto. No podías pedir una remera en talle 4 y talle 6.',
    after: 'Clave compuesta `productId_size`. Podés pedir la misma remera en talles distintos para hermanos.',
    impact: 'Habilita pedidos combinados para familias con varios hijos.',
    category: 'high',
  },
  {
    dimension: 'Feedback Visual (Toasts)',
    before: 'Solo cambia un número discreto en la esquina superior.',
    after: 'Notificación Toast animada confirmando qué prenda y talle se agregó, con botón de acceso.',
    impact: 'Elimina clics duplicados por incertidumbre.',
    category: 'medium',
  },
  {
    dimension: 'Tiempo de Carga y Skeletons',
    before: 'Muestra texto plano "Cargando productos..." provocando salto visual (CLS).',
    after: 'Tarjetas Skeleton con efecto shimmer mientras se conecta al Google Sheet.',
    impact: 'Mayor percepción de velocidad y mejor puntuación en Google Search Console.',
    category: 'medium',
  },
  {
    dimension: 'Viralidad Familiar',
    before: 'Sin opción de compartir productos individuales.',
    after: 'Botón de compartir prenda directa por WhatsApp con fotos y link preparado.',
    impact: 'Facilita la consulta entre padres, parejas y abuelas antes de comprar.',
    category: 'medium',
  },
];

export const BeforeAfterComparison: React.FC<{ onSwitchToDemo: () => void }> = ({
  onSwitchToDemo,
}) => {
  const [filter, setFilter] = useState<'all' | 'critical' | 'high'>('all');

  const filtered = COMPARISON_DATA.filter((item) => {
    if (filter === 'critical') return item.category === 'critical';
    if (filter === 'high') return item.category === 'critical' || item.category === 'high';
    return true;
  });

  return (
    <div className="max-w-6xl mx-auto py-6 px-4 sm:px-6 space-y-6">
      {/* Intro */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200/90 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="space-y-2 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sky-100 text-sky-900 text-xs font-bold">
            <ArrowLeftRight className="w-3.5 h-3.5 text-sky-600" />
            Tabla Comparativa de Rendimiento
          </div>
          <h2 className="text-2xl font-bold font-brand text-stone-900">
            Tu Catálogo Actual vs. Versión Optimizada
          </h2>
          <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
            Comparativa punto por punto de las decisiones de diseño, lógica en React y flujo comercial con WhatsApp, y el porqué cada una repercute directamente en tus ventas.
          </p>
        </div>

        <button
          onClick={onSwitchToDemo}
          className="shrink-0 flex items-center gap-2 px-4 py-3 rounded-2xl bg-amber-500 hover:bg-amber-600 text-white text-xs font-bold transition-all shadow-md shadow-amber-200"
        >
          <Sparkles className="w-4 h-4" />
          Probar en la Demo en Vivo
        </button>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 bg-stone-100 p-1 rounded-xl w-fit text-xs font-bold">
        <button
          onClick={() => setFilter('all')}
          className={`px-3 py-1.5 rounded-lg transition-colors ${
            filter === 'all' ? 'bg-white text-stone-900 shadow-2xs' : 'text-stone-600'
          }`}
        >
          Ver los 10 Puntos
        </button>
        <button
          onClick={() => setFilter('critical')}
          className={`px-3 py-1.5 rounded-lg transition-colors ${
            filter === 'critical' ? 'bg-rose-500 text-white shadow-2xs' : 'text-rose-700'
          }`}
        >
          Solo Críticos (3)
        </button>
        <button
          onClick={() => setFilter('high')}
          className={`px-3 py-1.5 rounded-lg transition-colors ${
            filter === 'high' ? 'bg-amber-500 text-white shadow-2xs' : 'text-amber-800'
          }`}
        >
          Críticos y Alto Impacto (7)
        </button>
      </div>

      {/* Comparison Cards / Table */}
      <div className="space-y-4">
        {filtered.map((item, idx) => (
          <div
            key={idx}
            className="bg-white rounded-2xl border border-stone-200 p-5 shadow-xs grid grid-cols-1 md:grid-cols-12 gap-4 items-center"
          >
            {/* Dimension title */}
            <div className="md:col-span-3 space-y-1">
              <span className="text-[10px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded-md bg-stone-100 text-stone-700">
                Punto #{idx + 1}
              </span>
              <h3 className="font-bold text-stone-900 text-sm">{item.dimension}</h3>
            </div>

            {/* Current State (Before) */}
            <div className="md:col-span-4 bg-rose-50/60 border border-rose-200/80 p-3.5 rounded-xl space-y-1">
              <div className="flex items-center gap-1.5 text-xs font-bold text-rose-800">
                <X className="w-3.5 h-3.5 text-rose-600 shrink-0" />
                <span>Cómo está hoy en tu web</span>
              </div>
              <p className="text-xs text-stone-600 leading-snug">{item.before}</p>
            </div>

            {/* Proposed State (After) */}
            <div className="md:col-span-5 bg-emerald-50/70 border border-emerald-200/80 p-3.5 rounded-xl space-y-1">
              <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-900">
                <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                <span>Solución propuesta</span>
              </div>
              <p className="text-xs text-stone-800 leading-snug font-medium">{item.after}</p>
              <div className="pt-2 mt-2 border-t border-emerald-200/50 text-[11px] text-emerald-800 font-semibold flex items-center gap-1">
                <span>🎯</span>
                <span>{item.impact}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
