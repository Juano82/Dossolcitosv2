import React from 'react';
import { Sparkles, ClipboardCheck, ArrowLeftRight, Code2, ExternalLink, RefreshCw, Eye, EyeOff } from 'lucide-react';

interface HeaderNavProps {
  activeTab: 'audit' | 'demo' | 'compare' | 'code';
  setActiveTab: (tab: 'audit' | 'demo' | 'compare' | 'code') => void;
  cartCount: number;
  openCart: () => void;
  isLiveSync: boolean;
  onRefreshSheet: () => void;
  isSyncing: boolean;
  totalProductsCount: number;
  isCleanStoreView: boolean;
  onToggleCleanView: () => void;
}

export const HeaderNav: React.FC<HeaderNavProps> = ({
  activeTab,
  setActiveTab,
  cartCount,
  openCart,
  isLiveSync,
  onRefreshSheet,
  isSyncing,
  totalProductsCount,
  isCleanStoreView,
  onToggleCleanView,
}) => {
  // If in clean store view: Render only the official clean store header (Logo + Cart + toggle pill)
  if (isCleanStoreView) {
    return (
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-[#fed7aa] shadow-xs px-4 sm:px-8 py-2.5">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          {/* Logo on the left */}
          <div className="flex items-center gap-3">
            <img
              src="/logo.png"
              alt="Dos Solcitos Indumentaria"
              className="h-16 sm:h-20 w-auto object-contain cursor-pointer"
              style={{ mixBlendMode: 'multiply' }}
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            />
          </div>

          {/* Right: Cart Button + Discrete Audit Mode button */}
          <div className="flex items-center gap-3">
            <button
              onClick={onToggleCleanView}
              title="Volver al panel de auditoría y código"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold bg-[#fffaf0] hover:bg-[#ffe5ec] text-[#2b2d42] border border-[#fed7aa] transition-colors"
            >
              <EyeOff className="w-3.5 h-3.5 text-[#ff6b6b]" />
              <span className="hidden md:inline">Ver Auditoría & Código</span>
            </button>

            <button
              onClick={openCart}
              className="flex items-center gap-2 px-5 py-2.5 rounded-full text-xs font-black bg-[#ffb703] text-[#2b2d42] hover:bg-amber-400 transition-all shadow-md active:scale-95 border border-[#fde68a]"
            >
              <span className="text-base">🛒</span>
              <span className="font-bold">Pedido</span>
              <span className="bg-[#2b2d42] text-white px-2.5 py-0.5 rounded-full text-xs font-black leading-none">
                {cartCount}
              </span>
            </button>
          </div>
        </div>
      </header>
    );
  }

  // Normal view with Developer & Audit Tabs
  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-amber-100 shadow-xs">
      {/* Top Banner Notice */}
      <div className="bg-gradient-to-r from-amber-500 via-rose-400 to-amber-500 text-white text-xs py-1.5 px-4 font-medium text-center flex items-center justify-center gap-2">
        <span className="inline-block animate-pulse">☀️</span>
        <span>
          Devolución técnica y propuesta de mejora para{' '}
          <strong className="underline underline-offset-2">Dos Solcitos (catalogo-react-xi.vercel.app)</strong>
        </span>
        <a
          href="https://catalogo-react-xi.vercel.app/"
          target="_blank"
          rel="noopener noreferrer"
          className="ml-2 inline-flex items-center gap-1 bg-white/20 hover:bg-white/30 px-2 py-0.5 rounded text-[11px] font-bold transition-colors"
        >
          Visitar tu sitio original <ExternalLink className="w-3 h-3" />
        </a>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex flex-wrap items-center justify-between gap-3">
        {/* Brand Identity */}
        <div className="flex items-center gap-3">
          <a
            href="#"
            onClick={(e) => {
              e.preventDefault();
              setActiveTab('demo');
            }}
            className="flex items-center gap-2 group"
          >
            <img
              src="/logo.png"
              alt="Dos Solcitos Indumentaria"
              className="h-16 sm:h-20 w-auto object-contain transition-transform group-hover:scale-105"
              style={{ mixBlendMode: 'multiply' }}
            />
          </a>
        </div>

        {/* Navigation Tabs */}
        <nav className="flex items-center gap-1 bg-stone-100/80 p-1 rounded-xl border border-stone-200/60 overflow-x-auto max-w-full">
          <button
            onClick={() => setActiveTab('demo')}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all whitespace-nowrap relative ${
              activeTab === 'demo'
                ? 'bg-[#ffb703] text-[#2b2d42] shadow-xs'
                : 'text-stone-600 hover:text-stone-900 hover:bg-stone-200/50'
            }`}
          >
            <Sparkles className="w-4 h-4 text-[#ff6b6b]" />
            Catálogo Tienda
            <span className="text-[10px] font-extrabold uppercase px-1.5 py-0.2 rounded-full bg-[#ff6b6b] text-white animate-pulse ml-0.5">
              En Vivo
            </span>
          </button>

          <button
            onClick={() => setActiveTab('audit')}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all whitespace-nowrap ${
              activeTab === 'audit'
                ? 'bg-white text-stone-900 shadow-xs'
                : 'text-stone-600 hover:text-stone-900 hover:bg-stone-200/50'
            }`}
          >
            <ClipboardCheck className="w-4 h-4 text-rose-500" />
            Auditoría & Diagnóstico
          </button>

          <button
            onClick={() => setActiveTab('compare')}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all whitespace-nowrap ${
              activeTab === 'compare'
                ? 'bg-white text-stone-900 shadow-xs'
                : 'text-stone-600 hover:text-stone-900 hover:bg-stone-200/50'
            }`}
          >
            <ArrowLeftRight className="w-4 h-4 text-sky-500" />
            Antes vs Después
          </button>

          <button
            onClick={() => setActiveTab('code')}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all whitespace-nowrap ${
              activeTab === 'code'
                ? 'bg-white text-stone-900 shadow-xs'
                : 'text-stone-600 hover:text-stone-900 hover:bg-stone-200/50'
            }`}
          >
            <Code2 className="w-4 h-4 text-emerald-600" />
            Soluciones en Código
          </button>
        </nav>

        {/* Live sync, Clean View Switcher & Cart status */}
        <div className="flex items-center gap-2">
          {/* Switch to 100% Clean Store View */}
          <button
            onClick={onToggleCleanView}
            title="Ver la tienda en pantalla completa limpia sin barras técnicas"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold bg-[#ffe5ec] hover:bg-[#ffb4c8] text-[#2b2d42] border border-[#ff6b6b]/30 transition-colors"
          >
            <Eye className="w-3.5 h-3.5 text-[#ff6b6b]" />
            <span className="hidden sm:inline">Vista Tienda Limpia</span>
          </button>

          <button
            onClick={onRefreshSheet}
            disabled={isSyncing}
            title="Recargar datos del Google Sheet oficial"
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-200 transition-colors"
          >
            <RefreshCw className={`w-3.5 h-3.5 text-amber-600 ${isSyncing ? 'animate-spin' : ''}`} />
            <span className="hidden sm:inline">
              {isSyncing ? 'Sincronizando...' : isLiveSync ? 'Google Sheet' : 'Modo Respaldo'}
            </span>
          </button>

          {activeTab === 'demo' && (
            <button
              onClick={openCart}
              className="flex items-center gap-2 px-4 py-2 rounded-full text-xs font-black bg-[#ffb703] text-[#2b2d42] hover:bg-amber-400 transition-all shadow-sm active:scale-95 border border-[#fde68a]"
            >
              <span className="text-sm">🛒</span>
              <span className="hidden sm:inline font-bold">Pedido</span>
              <span className="bg-[#2b2d42] text-white px-2 py-0.5 rounded-full text-[11px] font-black leading-none">
                {cartCount}
              </span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
};
