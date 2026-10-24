import React, { useState } from 'react';
import {
  AlertTriangle,
  CheckCircle2,
  TrendingUp,
  Smartphone,
  Zap,
  ShoppingBag,
  ExternalLink,
  MessageCircle,
  HelpCircle,
  Sparkles,
  ArrowRight,
  Filter,
  DollarSign,
  Printer,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import { AUDIT_FINDINGS, AUDIT_METRICS } from '../data/auditReport';
import { FindingCategory, FindingSeverity } from '../types';

interface AuditViewProps {
  onSwitchToDemo: () => void;
}

export const AuditView: React.FC<AuditViewProps> = ({ onSwitchToDemo }) => {
  const [selectedSeverity, setSelectedSeverity] = useState<FindingSeverity | 'all'>('all');
  const [selectedCategory, setSelectedCategory] = useState<FindingCategory | 'all'>('all');
  const [expandedId, setExpandedId] = useState<string | null>('f-talles-cart');

  // ROI Calculator states
  const [monthlyVisits, setMonthlyVisits] = useState<number>(1200);
  const [ticketPrice, setTicketPrice] = useState<number>(22500);

  // Filter findings
  const filteredFindings = AUDIT_FINDINGS.filter((f) => {
    if (selectedSeverity !== 'all' && f.severity !== selectedSeverity) return false;
    if (selectedCategory !== 'all' && f.category !== selectedCategory) return false;
    return true;
  });

  // ROI Calculations
  // Baseline conversion rate without sizes/checkout: ~1.2%
  // Potential conversion rate with size picker + seamless WhatsApp order: ~2.4%
  const currentOrders = Math.round(monthlyVisits * 0.012);
  const projectedOrders = Math.round(monthlyVisits * 0.024);
  const gainedOrders = projectedOrders - currentOrders;
  const gainedRevenue = gainedOrders * ticketPrice;

  const toggleExpand = (id: string) => {
    setExpandedId(expandedId === id ? null : id);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-8 max-w-6xl mx-auto py-6 px-4 sm:px-6">
      {/* Hero Executive Summary */}
      <div className="bg-gradient-to-br from-white via-amber-50/50 to-orange-50/30 border border-amber-200/80 rounded-3xl p-6 sm:p-8 shadow-sm">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
          <div className="space-y-3 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-100 text-amber-900 text-xs font-bold">
              <span>🔍</span> Diagnóstico Completo de Arquitectura & Conversión
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold font-brand text-stone-900 tracking-tight">
              Análisis Exhaustivo de tu Catálogo en React
            </h2>
            <p className="text-sm text-stone-600 leading-relaxed">
              Analizamos a fondo el código fuente, la integración con Google Sheets, el flujo de compra hacia WhatsApp y la experiencia móvil de{' '}
              <strong className="text-stone-900">catalogo-react-xi.vercel.app</strong>. Tenés una base visual muy tierna y un buen stack técnico (React 19, Vercel, Vite), pero existen <strong>3 fricciones críticas</strong> que están haciendo que pierdas ventas todos los días.
            </p>
          </div>

          {/* Overall Score Badge */}
          <div className="flex flex-col items-center justify-center p-6 bg-white rounded-2xl border border-amber-200 shadow-md min-w-[200px] text-center">
            <span className="text-xs font-bold uppercase tracking-wider text-stone-400">Puntaje Global</span>
            <div className="flex items-baseline gap-1 my-1">
              <span className="text-5xl font-black text-amber-600 font-brand">{AUDIT_METRICS.overallScore}</span>
              <span className="text-lg font-bold text-stone-400">/100</span>
            </div>
            <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-800">
              Buen potencial con ajustes clave
            </span>
            <button
              onClick={onSwitchToDemo}
              className="mt-4 w-full flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-white text-xs font-bold transition-all shadow-xs"
            >
              <Sparkles className="w-3.5 h-3.5" />
              Ver Catálogo Mejorado
            </button>
          </div>
        </div>

        {/* 5 Pillar Scorebars */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 mt-8 pt-6 border-t border-amber-100">
          <div className="bg-white/80 p-3 rounded-xl border border-amber-100/80">
            <div className="flex items-center justify-between text-xs font-bold text-stone-600 mb-1">
              <span>Diseño & UX</span>
              <span className="text-stone-800">{AUDIT_METRICS.uxScore}%</span>
            </div>
            <div className="w-full bg-stone-100 h-2 rounded-full overflow-hidden">
              <div className="bg-sky-500 h-full rounded-full" style={{ width: `${AUDIT_METRICS.uxScore}%` }} />
            </div>
            <p className="text-[11px] text-stone-500 mt-1">Colores cálidos, tipografía Nunito agradable.</p>
          </div>

          <div className="bg-white/80 p-3 rounded-xl border border-amber-100/80">
            <div className="flex items-center justify-between text-xs font-bold text-stone-600 mb-1">
              <span>Conversión & WhatsApp</span>
              <span className="text-rose-600">{AUDIT_METRICS.conversionScore}%</span>
            </div>
            <div className="w-full bg-stone-100 h-2 rounded-full overflow-hidden">
              <div className="bg-rose-500 h-full rounded-full" style={{ width: `${AUDIT_METRICS.conversionScore}%` }} />
            </div>
            <p className="text-[11px] text-rose-600 font-semibold mt-1">Falta talle y datos de envío.</p>
          </div>

          <div className="bg-white/80 p-3 rounded-xl border border-amber-100/80">
            <div className="flex items-center justify-between text-xs font-bold text-stone-600 mb-1">
              <span>Fotos & Rendimiento</span>
              <span className="text-amber-600">{AUDIT_METRICS.performanceScore}%</span>
            </div>
            <div className="w-full bg-stone-100 h-2 rounded-full overflow-hidden">
              <div className="bg-amber-500 h-full rounded-full" style={{ width: `${AUDIT_METRICS.performanceScore}%` }} />
            </div>
            <p className="text-[11px] text-stone-500 mt-1">Riesgo por Google Drive rate-limits.</p>
          </div>

          <div className="bg-white/80 p-3 rounded-xl border border-amber-100/80">
            <div className="flex items-center justify-between text-xs font-bold text-stone-600 mb-1">
              <span>Experiencia Mobile</span>
              <span className="text-stone-800">{AUDIT_METRICS.mobileScore}%</span>
            </div>
            <div className="w-full bg-stone-100 h-2 rounded-full overflow-hidden">
              <div className="bg-emerald-500 h-full rounded-full" style={{ width: `${AUDIT_METRICS.mobileScore}%` }} />
            </div>
            <p className="text-[11px] text-stone-500 mt-1">Drawer y FAB cómodos en pulgar.</p>
          </div>

          <div className="bg-white/80 p-3 rounded-xl border border-amber-100/80 col-span-2 sm:col-span-1">
            <div className="flex items-center justify-between text-xs font-bold text-stone-600 mb-1">
              <span>Arquitectura Código</span>
              <span className="text-stone-800">{AUDIT_METRICS.codeQualityScore}%</span>
            </div>
            <div className="w-full bg-stone-100 h-2 rounded-full overflow-hidden">
              <div className="bg-indigo-500 h-full rounded-full" style={{ width: `${AUDIT_METRICS.codeQualityScore}%` }} />
            </div>
            <p className="text-[11px] text-stone-500 mt-1">Parser CSV ingenioso, falta cache.</p>
          </div>
        </div>
      </div>

      {/* Top 3 Prioridades Críticas (Atención Rápida) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-rose-50/70 border-2 border-rose-200 rounded-2xl p-5 flex flex-col justify-between">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="px-2.5 py-0.5 rounded-full bg-rose-200 text-rose-800 text-[11px] font-extrabold uppercase tracking-wide">
                Prioridad 1
              </span>
              <span className="text-rose-500 text-lg">⚠️</span>
            </div>
            <h3 className="font-bold text-stone-900 text-base leading-snug">
              Selección de Talles en el Carrito
            </h3>
            <p className="text-xs text-stone-600 leading-relaxed">
              El cliente compra ropa pero la orden llega sin talle a WhatsApp. Tenés que consultarles uno por uno. Agregando selector de talle obligatorio antes de sumar al pedido, eliminás la fricción de raíz.
            </p>
          </div>
          <button
            onClick={() => {
              setSelectedSeverity('critical');
              setExpandedId('f-talles-cart');
            }}
            className="mt-4 text-xs font-bold text-rose-700 hover:text-rose-900 flex items-center gap-1 group"
          >
            Ver diagnóstico técnico <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>

        <div className="bg-amber-50/70 border-2 border-amber-200 rounded-2xl p-5 flex flex-col justify-between">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="px-2.5 py-0.5 rounded-full bg-amber-200 text-amber-800 text-[11px] font-extrabold uppercase tracking-wide">
                Prioridad 2
              </span>
              <span className="text-amber-500 text-lg">💬</span>
            </div>
            <h3 className="font-bold text-stone-900 text-base leading-snug">
              Mini-Checkout en WhatsApp
            </h3>
            <p className="text-xs text-stone-600 leading-relaxed">
              El pedido actual no incluye: Nombre del cliente, Forma de entrega (Retiro vs Envío) ni Opción de pago (Transferencia con descuento vs Cuotas). Pedir estos 3 datos en la web acelera el cierre de venta.
            </p>
          </div>
          <button
            onClick={() => {
              setSelectedSeverity('critical');
              setExpandedId('f-whatsapp-message');
            }}
            className="mt-4 text-xs font-bold text-amber-800 hover:text-amber-950 flex items-center gap-1 group"
          >
            Ver formato de mensaje sugerido <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>

        <div className="bg-sky-50/70 border-2 border-sky-200 rounded-2xl p-5 flex flex-col justify-between">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="px-2.5 py-0.5 rounded-full bg-sky-200 text-sky-800 text-[11px] font-extrabold uppercase tracking-wide">
                Prioridad 3
              </span>
              <span className="text-sky-500 text-lg">🖼️</span>
            </div>
            <h3 className="font-bold text-stone-900 text-base leading-snug">
              Fallback de Fotos Google Drive
            </h3>
            <p className="text-xs text-stone-600 leading-relaxed">
              Google Drive suele limitar las imágenes con error 429 cuando hay visitas simultáneas. Agregar un manejador `onError` con placeholders de respaldo asegura que tu tienda nunca se vea con fotos rotas.
            </p>
          </div>
          <button
            onClick={() => {
              setSelectedSeverity('critical');
              setExpandedId('f-gdrive-images');
            }}
            className="mt-4 text-xs font-bold text-sky-800 hover:text-sky-950 flex items-center gap-1 group"
          >
            Ver código de solución <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      </div>

      {/* Interactive ROI Calculator */}
      <div className="bg-gradient-to-r from-stone-900 via-stone-800 to-stone-900 text-white rounded-3xl p-6 sm:p-8 shadow-lg">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-6">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-bold mb-2">
              <DollarSign className="w-3.5 h-3.5" /> Calculadora de Impacto Económico
            </div>
            <h3 className="text-xl sm:text-2xl font-bold font-brand text-amber-400">
              ¿Cuánto más podés facturar corrigiendo estos puntos?
            </h3>
            <p className="text-xs text-stone-300 max-w-xl">
              Al simplificar el talle y clarificar el ahorro por transferencia, la tasa de conversión promedio en tiendas de ropa de niños en WhatsApp se duplica (de ~1.2% a ~2.4%).
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 items-center bg-white/5 p-5 rounded-2xl border border-white/10">
          <div>
            <label className="text-xs font-semibold text-stone-300 block mb-1">
              Visitas estimadas por mes: <span className="text-amber-400 font-bold">{monthlyVisits.toLocaleString('es-AR')}</span>
            </label>
            <input
              type="range"
              min="200"
              max="10000"
              step="100"
              value={monthlyVisits}
              onChange={(e) => setMonthlyVisits(Number(e.target.value))}
              className="w-full accent-amber-400 cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-stone-400 mt-1">
              <span>200</span>
              <span>5.000</span>
              <span>10.000</span>
            </div>
          </div>

          <div>
            <label className="text-xs font-semibold text-stone-300 block mb-1">
              Ticket promedio por pedido: <span className="text-amber-400 font-bold">${ticketPrice.toLocaleString('es-AR')}</span>
            </label>
            <input
              type="range"
              min="10000"
              max="60000"
              step="1000"
              value={ticketPrice}
              onChange={(e) => setTicketPrice(Number(e.target.value))}
              className="w-full accent-amber-400 cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-stone-400 mt-1">
              <span>$10k</span>
              <span>$35k</span>
              <span>$60k</span>
            </div>
          </div>

          <div className="bg-white/10 p-4 rounded-xl border border-white/10 text-center">
            <span className="text-[11px] uppercase tracking-wider text-stone-400 font-bold">Pedidos Mensuales Ganados</span>
            <div className="text-3xl font-black text-emerald-400 font-brand my-0.5">
              +{gainedOrders} <span className="text-xs font-medium text-stone-300">ventas</span>
            </div>
            <p className="text-[11px] text-stone-300">
              De {currentOrders} a {projectedOrders} pedidos/mes
            </p>
          </div>

          <div className="bg-gradient-to-tr from-amber-500 to-rose-500 p-4 rounded-xl text-center shadow-md">
            <span className="text-[11px] uppercase tracking-wider text-white/90 font-bold">Facturación Extra Estimada</span>
            <div className="text-2xl sm:text-3xl font-black text-white font-brand my-0.5">
              +${gainedRevenue.toLocaleString('es-AR')}
            </div>
            <p className="text-[11px] text-white/90">por mes en tu bolsillo</p>
          </div>
        </div>
      </div>

      {/* Main Filterable Findings List */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-stone-200 pb-3">
          <div>
            <h3 className="text-lg font-bold font-brand text-stone-900">
              Detalle de Hallazgos y Soluciones Recomendadas ({filteredFindings.length})
            </h3>
            <p className="text-xs text-stone-500">
              Filtrá por severidad para enfocar tus esfuerzos de desarrollo
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {/* Severity Filter Pills */}
            <div className="flex items-center gap-1 bg-stone-100 p-1 rounded-xl text-xs">
              <button
                onClick={() => setSelectedSeverity('all')}
                className={`px-2.5 py-1 rounded-lg font-medium transition-colors ${
                  selectedSeverity === 'all' ? 'bg-white text-stone-900 shadow-xs' : 'text-stone-600'
                }`}
              >
                Todos
              </button>
              <button
                onClick={() => setSelectedSeverity('critical')}
                className={`px-2.5 py-1 rounded-lg font-bold transition-colors ${
                  selectedSeverity === 'critical'
                    ? 'bg-rose-500 text-white shadow-xs'
                    : 'text-rose-700 hover:bg-rose-100'
                }`}
              >
                🔴 Críticos (3)
              </button>
              <button
                onClick={() => setSelectedSeverity('high')}
                className={`px-2.5 py-1 rounded-lg font-bold transition-colors ${
                  selectedSeverity === 'high'
                    ? 'bg-amber-500 text-white shadow-xs'
                    : 'text-amber-800 hover:bg-amber-100'
                }`}
              >
                🟡 Medios (3)
              </button>
              <button
                onClick={() => setSelectedSeverity('quickwin')}
                className={`px-2.5 py-1 rounded-lg font-bold transition-colors ${
                  selectedSeverity === 'quickwin'
                    ? 'bg-emerald-600 text-white shadow-xs'
                    : 'text-emerald-800 hover:bg-emerald-100'
                }`}
              >
                🟢 Quick Wins (4)
              </button>
            </div>

            <button
              onClick={handlePrint}
              className="p-1.5 rounded-lg border border-stone-300 hover:bg-stone-100 text-stone-600 text-xs flex items-center gap-1"
              title="Imprimir o guardar como PDF"
            >
              <Printer className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Finding Cards Accordion */}
        <div className="space-y-3">
          {filteredFindings.map((finding) => {
            const isExpanded = expandedId === finding.id;

            const severityBadge = {
              critical: {
                label: 'Crítico · Bloqueante de Ventas',
                bg: 'bg-rose-100 text-rose-800 border-rose-200',
                border: 'border-rose-300',
              },
              high: {
                label: 'Alto Impacto · Oportunidad Clave',
                bg: 'bg-amber-100 text-amber-800 border-amber-200',
                border: 'border-amber-300',
              },
              medium: {
                label: 'Medio · Mejora de Arquitectura',
                bg: 'bg-sky-100 text-sky-800 border-sky-200',
                border: 'border-sky-300',
              },
              quickwin: {
                label: 'Quick Win · Fácil Implementación',
                bg: 'bg-emerald-100 text-emerald-800 border-emerald-200',
                border: 'border-emerald-300',
              },
            }[finding.severity];

            return (
              <div
                key={finding.id}
                className={`bg-white rounded-2xl border transition-all overflow-hidden ${
                  isExpanded ? `${severityBadge.border} shadow-sm ring-1 ring-amber-200/50` : 'border-stone-200 hover:border-stone-300'
                }`}
              >
                {/* Header clickable */}
                <button
                  onClick={() => toggleExpand(finding.id)}
                  className="w-full px-5 py-4 text-left flex items-start sm:items-center justify-between gap-4 hover:bg-stone-50/50 transition-colors"
                >
                  <div className="space-y-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className={`text-[10px] uppercase font-extrabold px-2 py-0.5 rounded-md border ${severityBadge.bg}`}>
                        {severityBadge.label}
                      </span>
                      {finding.tags.map((tag) => (
                        <span key={tag} className="text-[10px] text-stone-500 bg-stone-100 px-2 py-0.5 rounded">
                          #{tag}
                        </span>
                      ))}
                    </div>
                    <h4 className="text-base font-bold text-stone-900">{finding.title}</h4>
                    <p className="text-xs text-stone-500">{finding.subtitle}</p>
                  </div>

                  <div className="shrink-0 p-1 rounded-full text-stone-400 hover:text-stone-700 bg-stone-100">
                    {isExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                  </div>
                </button>

                {/* Expanded Details */}
                {isExpanded && (
                  <div className="px-5 pb-5 pt-2 border-t border-stone-100 space-y-4 text-xs">
                    <div>
                      <h5 className="font-bold text-stone-800 mb-1 flex items-center gap-1.5 text-xs">
                        <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
                        ¿Qué está pasando actualmente en tu sitio?
                      </h5>
                      <p className="text-stone-600 leading-relaxed bg-amber-50/40 p-3 rounded-xl border border-amber-100">
                        {finding.description}
                      </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <div>
                        <h5 className="font-bold text-rose-700 mb-1 text-[11px] uppercase tracking-wide">
                          Fragmento de código / Comportamiento actual
                        </h5>
                        <pre className="p-3 bg-stone-900 text-stone-200 rounded-xl font-mono text-[11px] overflow-x-auto whitespace-pre-wrap border border-stone-800">
                          {finding.currentCodeOrBehavior}
                        </pre>
                      </div>

                      <div>
                        <h5 className="font-bold text-emerald-700 mb-1 text-[11px] uppercase tracking-wide">
                          Solución recomendada
                        </h5>
                        <div className="p-3 bg-emerald-50 text-emerald-950 rounded-xl border border-emerald-200 leading-relaxed font-sans">
                          {finding.improvedSolution}
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 bg-stone-50 p-3 rounded-xl border border-stone-200/80">
                      <div className="flex items-center gap-2">
                        <TrendingUp className="w-4 h-4 text-emerald-600 shrink-0" />
                        <span className="text-stone-700">
                          <strong>Impacto Comercial:</strong> {finding.businessImpact}
                        </span>
                      </div>

                      <button
                        onClick={onSwitchToDemo}
                        className="inline-flex items-center gap-1 text-xs font-bold text-amber-700 hover:text-amber-900 hover:underline shrink-0"
                      >
                        <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                        Ver cómo lo resolvimos en la Demo en Vivo &rarr;
                      </button>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
