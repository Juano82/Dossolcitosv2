import React, { useState, useMemo } from 'react';
import { Product } from '../types';
import { ProductCard } from './ProductCard';
import { ProductQuickViewModal } from './ProductQuickViewModal';
import { CATEGORY_ICONS } from '../services/catalogService';
import {
  CreditCard,
  Banknote,
  Truck,
} from 'lucide-react';

interface RedesignedCatalogDemoProps {
  products: Product[];
  isLoading: boolean;
  onAddToCart: (product: Product, size: string) => void;
  onOpenCart: () => void;
  cartCount: number;
  cartTotal: number;
}

export const RedesignedCatalogDemo: React.FC<RedesignedCatalogDemoProps> = ({
  products,
  isLoading,
  onAddToCart,
  onOpenCart,
  cartCount,
  cartTotal,
}) => {
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('Todos');
  const [selectedSizeFilter, setSelectedSizeFilter] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'default' | 'price-asc' | 'price-desc'>('default');
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);

  // Extract all categories
  const categories = useMemo(() => {
    const set = new Set<string>();
    products.forEach((p) => {
      if (p.categoria) set.add(p.categoria);
    });
    return ['Todos', ...Array.from(set)];
  }, [products]);

  // Extract all unique sizes across catalog
  const availableSizes = useMemo(() => {
    const sizeSet = new Set<string>();
    products.forEach((p) => {
      p.talles.forEach((s) => {
        if (s && s !== 'Único') sizeSet.add(s);
      });
    });
    return Array.from(sizeSet).sort();
  }, [products]);

  // Filtering
  const filteredProducts = useMemo(() => {
    let result = products.filter((p) => {
      if (selectedCategory !== 'Todos' && p.categoria !== selectedCategory) {
        return false;
      }

      if (selectedSizeFilter !== 'all') {
        if (!p.talles.includes(selectedSizeFilter)) return false;
      }

      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase().trim();
        const matchesName = p.nombre.toLowerCase().includes(query);
        const matchesCode = p.codigo.toLowerCase().includes(query);
        const matchesDesc = p.descripcion?.toLowerCase().includes(query) ?? false;
        const matchesSize = p.talles.some((s) => s.toLowerCase().includes(query));
        if (!matchesName && !matchesCode && !matchesDesc && !matchesSize) {
          return false;
        }
      }

      return true;
    });

    if (sortBy === 'price-asc') {
      result = [...result].sort((a, b) => a.precioTransferencia - b.precioTransferencia);
    } else if (sortBy === 'price-desc') {
      result = [...result].sort((a, b) => b.precioTransferencia - a.precioTransferencia);
    }

    return result;
  }, [products, selectedCategory, selectedSizeFilter, searchQuery, sortBy]);

  const handleShareProduct = (product: Product) => {
    const shareText = `¡Mirá esta prenda para los peques en Dos Solcitos!\n${product.nombre} (Talles: ${product.talles.join(', ')})\n$${product.precioTransferencia.toLocaleString('es-AR')} en efectivo/transferencia.\nhttps://catalogo-react-xi.vercel.app/`;
    if (navigator.share) {
      navigator.share({
        title: product.nombre,
        text: shareText,
        url: 'https://catalogo-react-xi.vercel.app/',
      }).catch(() => {});
    } else {
      window.open(`https://wa.me/?text=${encodeURIComponent(shareText)}`, '_blank');
    }
  };

  return (
    <div className="space-y-6 pb-12">
      {/* HERO BANNER CON EL ESTILO ORIGINAL EXACTO (FULL-WIDTH, SIN CAJA FLOTANTE, GRADIENTE ORIGINAL) */}
      <section
        className="w-full text-center py-12 sm:py-16 px-4 sm:px-6 shadow-xs border-b border-[#fed7aa]/50"
        style={{ background: 'linear-gradient(135deg, #ffe5ec, #fff3c4 50%, #d8f3ff)' }}
      >
        <div className="max-w-4xl mx-auto space-y-4">
          {/* Logo con fondo transparente integrado al degradé del encabezado */}
          <div className="flex justify-center mb-1">
            <img
              src="/logo.png"
              alt="Dos Solcitos Indumentaria"
              className="h-28 sm:h-36 md:h-44 w-auto object-contain transition-transform hover:scale-105 duration-300 select-none"
              style={{ mixBlendMode: 'multiply' }}
            />
          </div>

          {/* Título original con Baloo 2 y span en coral #ff6b6b */}
          <h1 className="text-3xl sm:text-5xl md:text-6xl font-extrabold font-brand tracking-tight text-[#2b2d42] leading-[1.1]">
            Ropa para <span className="text-[#ff6b6b]">bebés, niños y niñas</span>
          </h1>

          {/* Subtítulo original */}
          <p className="text-sm sm:text-base md:text-lg text-[#2b2d42]/85 font-medium max-w-xl mx-auto">
            Elegí tus favoritos y hacé tu pedido por WhatsApp en un minuto.
          </p>

          {/* Buscador original centrado estilo píldora con sombra suave */}
          <div className="max-w-xl mx-auto relative pt-2">
            <div className="relative">
              <input
                type="search"
                placeholder="🔍 Buscar productos..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full py-3.5 sm:py-4 px-6 pr-12 rounded-full text-sm sm:text-base text-[#2b2d42] bg-white border-4 border-white shadow-xl focus:border-[#4cc9f0] focus:outline-none transition-all placeholder:text-[#2b2d42]/45 font-medium"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  aria-label="Limpiar búsqueda"
                  className="absolute right-4 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-stone-200 hover:bg-stone-300 text-stone-700 flex items-center justify-center text-xs font-bold transition-colors"
                >
                  ✕
                </button>
              )}
            </div>
          </div>

          {/* LAS 3 PÍLDORAS DE BENEFICIOS PEDIDAS POR EL USUARIO (3 Cuotas, Descuento Transferencia, Retiro y Envíos) */}
          <div className="flex flex-wrap items-center justify-center gap-2.5 sm:gap-3 pt-3 text-[#2b2d42] text-xs font-extrabold">
            <div className="flex items-center gap-1.5 bg-white/95 backdrop-blur-xs px-4 py-2 rounded-full shadow-xs border border-[#fed7aa] hover:scale-102 transition-transform">
              <CreditCard className="w-3.5 h-3.5 text-[#ffb703]" />
              <span>3 Cuotas</span>
            </div>
            <div className="flex items-center gap-1.5 bg-white/95 backdrop-blur-xs px-4 py-2 rounded-full shadow-xs border border-[#fed7aa] hover:scale-102 transition-transform">
              <Banknote className="w-3.5 h-3.5 text-[#25d366]" />
              <span>Descuento en Efectivo o Transferencia</span>
            </div>
            <div className="flex items-center gap-1.5 bg-white/95 backdrop-blur-xs px-4 py-2 rounded-full shadow-xs border border-[#fed7aa] hover:scale-102 transition-transform">
              <Truck className="w-3.5 h-3.5 text-[#4cc9f0]" />
              <span>Retiro en Glew & Envíos</span>
            </div>
          </div>
        </div>
      </section>

      {/* CONTROLES DEL CATÁLOGO: CHIPS DE CATEGORÍAS + FILTRO DE TALLE + MODO DE PRECIO */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 space-y-4">
        <div className="bg-white rounded-3xl border border-[#fed7aa] p-4 sm:p-5 shadow-xs space-y-4">
          {/* Row 1: Chips de Categorías originales (--cielo: #4cc9f0 en activo) y Selector de Precio */}
          <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4">
            {/* Categorías */}
            <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none flex-1">
              {categories.map((cat) => {
                const isSelected = selectedCategory === cat;
                return (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-black transition-all whitespace-nowrap shadow-xs ${
                      isSelected
                        ? 'bg-[#4cc9f0] text-white scale-105'
                        : 'bg-[#fffaf0] text-[#2b2d42] hover:bg-[#4cc9f0] hover:text-white border border-[#fed7aa]'
                    }`}
                  >
                    <span>{CATEGORY_ICONS[cat] || '✨'}</span>
                    <span>{cat}</span>
                  </button>
                );
              })}
            </div>

            {/* Badges fijos de medios de pago */}
            <div className="flex items-center gap-2 bg-[#fffaf0] px-3.5 py-2 rounded-2xl border border-[#fed7aa] shrink-0 self-start lg:self-auto shadow-2xs text-xs font-bold text-[#2b2d42]">
              <span className="flex items-center gap-1.5 text-[#15803d]">
                <Banknote className="w-3.5 h-3.5 text-[#25d366]" />
                <span>Descuento Transferencia</span>
              </span>
              <span className="text-stone-300">•</span>
              <span className="flex items-center gap-1.5 text-[#0284c7]">
                <CreditCard className="w-3.5 h-3.5 text-[#0284c7]" />
                <span>3 Cuotas</span>
              </span>
            </div>
          </div>

          {/* Row 2: Filtro de Talle de los Niños & Orden */}
          <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-[#fed7aa]/50 text-xs">
          <div className="flex items-center gap-2 overflow-x-auto max-w-full">
            <span className="font-extrabold text-[#2b2d42] whitespace-nowrap flex items-center gap-1">
              <span>📏</span> Talle de tu peque:
            </span>
            <div className="flex items-center gap-1.5">
              <button
                onClick={() => setSelectedSizeFilter('all')}
                className={`px-3 py-1 rounded-lg text-xs font-black transition-all ${
                  selectedSizeFilter === 'all'
                    ? 'bg-[#ffb703] text-[#2b2d42] shadow-xs'
                    : 'bg-[#fffaf0] text-[#2b2d42] hover:bg-[#ffe5ec] border border-[#fed7aa]'
                }`}
              >
                Todos
              </button>
              {availableSizes.map((size) => (
                <button
                  key={size}
                  onClick={() => setSelectedSizeFilter(size)}
                  className={`px-3 py-1 rounded-lg text-xs font-black transition-all ${
                    selectedSizeFilter === size
                      ? 'bg-[#ffb703] text-[#2b2d42] shadow-xs scale-105'
                      : 'bg-[#fffaf0] text-[#2b2d42] hover:bg-[#ffe5ec] border border-[#fed7aa]'
                  }`}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>

          {/* Sort selector */}
          <div className="flex items-center gap-1.5">
            <span className="text-[#2b2d42]/70 font-semibold">Ordenar:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="bg-[#fffaf0] border border-[#fed7aa] rounded-xl px-3 py-1 text-xs font-bold text-[#2b2d42] cursor-pointer"
            >
              <option value="default">Recomendados</option>
              <option value="price-asc">Menor precio</option>
              <option value="price-desc">Mayor precio</option>
            </select>
          </div>
        </div>
      </div>


      {/* GRILLA DE PRODUCTOS CON FOTOS GRANDES (User requested bigger photos: 3 columnas generosas en desktop, 2 en mobile) */}
      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="bg-white rounded-3xl p-5 border border-[#fed7aa] animate-pulse space-y-4">
              <div className="aspect-[1/1] bg-[#ffe5ec]/50 rounded-2xl" />
              <div className="h-5 bg-[#fed7aa]/50 rounded w-3/4" />
              <div className="h-4 bg-[#fed7aa]/30 rounded w-1/2" />
              <div className="h-10 bg-[#fed7aa]/40 rounded-2xl mt-4" />
            </div>
          ))}
        </div>
      ) : filteredProducts.length === 0 ? (
        <div className="bg-white rounded-3xl p-12 text-center border border-[#fed7aa] max-w-md mx-auto space-y-3">
          <span className="text-5xl block">🔍</span>
          <h3 className="text-xl font-bold font-brand text-[#2b2d42]">
            No encontramos productos con esos filtros
          </h3>
          <p className="text-xs text-stone-500">
            Probá limpiando el buscador o eligiendo otro talle.
          </p>
          <button
            onClick={() => {
              setSearchQuery('');
              setSelectedCategory('Todos');
              setSelectedSizeFilter('all');
            }}
            className="px-5 py-2.5 rounded-full bg-[#ffb703] text-[#2b2d42] text-xs font-extrabold hover:bg-amber-400 transition-colors shadow-xs"
          >
            Ver todos los productos
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-7">
          {filteredProducts.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onAddToCart={onAddToCart}
              onOpenQuickView={(p) => setQuickViewProduct(p)}
              onShare={handleShareProduct}
            />
          ))}
        </div>
      )}

      {/* Floating Action Button (FAB) con color verde original (#25d366) */}
      {cartCount > 0 && (
        <div className="fixed bottom-6 left-4 right-4 sm:left-auto sm:right-8 z-30">
          <button
            onClick={onOpenCart}
            className="w-full sm:w-auto px-6 py-4 rounded-full bg-[#25d366] hover:bg-[#20ba59] text-white font-extrabold text-sm flex items-center justify-between sm:justify-center gap-3 shadow-2xl shadow-[#25d366]/40 active:scale-95 transition-all"
          >
            <div className="flex items-center gap-2">
              <span className="text-lg">🛒</span>
              <span>Ver mi pedido</span>
              <span className="px-2 py-0.5 rounded-full bg-white text-[#25d366] text-xs font-black">
                {cartCount}
              </span>
            </div>
            <span className="font-black text-white sm:border-l sm:border-white/30 sm:pl-3">
              ${cartTotal.toLocaleString('es-AR')}
            </span>
          </button>
        </div>
      )}

      {/* Quick View Modal con fotos extra grandes */}
      {quickViewProduct && (
        <ProductQuickViewModal
          product={quickViewProduct}
          onClose={() => setQuickViewProduct(null)}
          onAddToCart={onAddToCart}
        />
      )}
      </div>
    </div>
  );
};
