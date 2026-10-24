import React, { useState } from 'react';
import { Product } from '../types';
import { CATEGORY_ICONS, getProductSizesConfig } from '../services/catalogService';
import { ZoomIn, Share2, Plus, Check, CreditCard, Banknote } from 'lucide-react';

export type PriceDisplayOption =
  | 'img1-pill'
  | 'img2-classic'
  | 'img2-cash-focus'
  | 'img1-badge-transfer'
  | 'simple-minimal'
  | 'simple-card'
  | 'simple-retail'
  | 'simple-pill';

interface ProductCardProps {
  product: Product;
  onAddToCart: (product: Product, size: string) => void;
  onOpenQuickView: (product: Product) => void;
  onShare: (product: Product) => void;
  priceOption?: PriceDisplayOption;
  displayMode?: 'transferencia' | 'cuotas';
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  onAddToCart,
  onOpenQuickView,
  onShare,
  priceOption = 'img1-pill',
  displayMode = 'transferencia',
}) => {
  const { allSizes, availableSizes } = getProductSizesConfig(product);
  const [selectedSize, setSelectedSize] = useState<string>(availableSizes[0] || 'Único');
  const [activePhotoIdx, setActivePhotoIdx] = useState<number>(0);
  const [imageError, setImageError] = useState<boolean>(false);
  const [justAdded, setJustAdded] = useState<boolean>(false);

  const images = product.imagenes.length > 0 ? product.imagenes : [product.imagenPrincipal];
  const currentImage = images[activePhotoIdx] || product.imagenPrincipal;

  const handleAdd = () => {
    onAddToCart(product, selectedSize);
    setJustAdded(true);
    setTimeout(() => setJustAdded(false), 1200);
  };

  const formatPrice = (val: number) =>
    val.toLocaleString('es-AR', {
      style: 'currency',
      currency: 'ARS',
      maximumFractionDigits: 0,
    });

  const discountAmount = Math.max(0, product.precioLista - product.precioTransferencia);
  const discountPercent = product.precioLista > 0 ? Math.round((discountAmount / product.precioLista) * 100) : 0;
  const savings = discountAmount;

  // Resolve active option according to user preference (Image 1 capture & Image 2 style)
  const resolveSimpleOption = (opt: PriceDisplayOption): 'img1-pill' | 'img2-classic' | 'img2-cash-focus' | 'img1-badge-transfer' => {
    if (opt === 'img1-pill' || opt === 'simple-pill') return 'img1-pill';
    if (opt === 'img2-classic' || opt === 'simple-minimal') return 'img2-classic';
    if (opt === 'img2-cash-focus' || opt === 'simple-card') return 'img2-cash-focus';
    if (opt === 'img1-badge-transfer' || opt === 'simple-retail') return 'img1-badge-transfer';
    return 'img1-pill';
  };
  const activeOption = resolveSimpleOption(priceOption);

  return (
    <article className="group bg-white rounded-3xl border border-[#fed7aa] hover:border-[#ff6b6b] hover:shadow-xl transition-all duration-300 flex flex-col justify-between overflow-hidden relative">
      {/* BIG PHOTO CONTAINER (User requested much bigger photos!) */}
      <div
        onClick={() => onOpenQuickView(product)}
        className="relative aspect-[1/1] w-full bg-[#fdfaf5] overflow-hidden cursor-zoom-in group"
      >
        {/* Category Pill with Original Pastel Colors */}
        <div className="absolute top-3 left-3 z-10 flex items-center gap-1.5">
          <span className="px-3 py-1 rounded-full bg-white/95 backdrop-blur-xs text-[11px] font-extrabold text-[#2b2d42] shadow-sm flex items-center gap-1 border border-[#fed7aa]">
            <span>{CATEGORY_ICONS[product.categoria] || '✨'}</span>
            <span>{product.categoria}</span>
          </span>
          {product.codigo && (
            <span className="px-2 py-0.8 rounded-lg bg-[#2b2d42]/85 text-[10px] font-bold text-white tracking-wider">
              {product.codigo}
            </span>
          )}
        </div>

        {/* Lupa / Quick Zoom button like original app */}
        <div className="absolute bottom-3 right-3 z-10 flex items-center gap-1.5">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onOpenQuickView(product);
            }}
            title="Ver foto más grande"
            className="w-9 h-9 rounded-full bg-white/95 hover:bg-white text-[#2b2d42] hover:text-[#ff6b6b] flex items-center justify-center shadow-md transition-all hover:scale-110"
          >
            <ZoomIn className="w-4 h-4" />
          </button>
        </div>

        {/* Product Image */}
        <div className="w-full h-full flex items-center justify-center overflow-hidden">
          {currentImage && !imageError ? (
            <img
              src={currentImage}
              alt={product.nombre}
              onError={() => setImageError(true)}
              loading="lazy"
              className="w-full h-full object-cover object-center group-hover:scale-108 transition-transform duration-500"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-[#ffe5ec] via-[#fff3c4] to-[#d8f3ff] flex flex-col items-center justify-center p-6 text-center">
              <span className="text-5xl mb-2">{CATEGORY_ICONS[product.categoria] || '🧸'}</span>
              <span className="text-xs font-black text-[#2b2d42] font-brand">Dos Solcitos</span>
              <span className="text-[10px] text-[#2b2d42]/60">Foto de Google Drive</span>
            </div>
          )}
        </div>

        {/* Dots indicator for multi-photo items */}
        {images.length > 1 && (
          <div className="absolute bottom-3 left-3 flex gap-1 z-10 bg-black/20 backdrop-blur-xs px-2 py-1 rounded-full">
            {images.map((_, idx) => (
              <button
                key={idx}
                onClick={(e) => {
                  e.stopPropagation();
                  setActivePhotoIdx(idx);
                }}
                className={`w-2 h-2 rounded-full transition-all ${
                  activePhotoIdx === idx ? 'bg-[#ffb703] scale-125' : 'bg-white/80'
                }`}
              />
            ))}
          </div>
        )}
      </div>

      {/* Product Details with Original Pastel Palette */}
      <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between space-y-3.5 bg-white">
        <div>
          <h3
            onClick={() => onOpenQuickView(product)}
            className="font-bold font-brand text-base text-[#2b2d42] group-hover:text-[#ff6b6b] transition-colors line-clamp-2 cursor-pointer leading-snug"
          >
            {product.nombre}
          </h3>

          {product.descripcion && (
            <p className="text-xs text-[#2b2d42]/60 line-clamp-1 mt-1">{product.descripcion}</p>
          )}

          {/* SIZES SELECTOR CON TALLAS DISPONIBLES Y NO SELECCIONABLES (SIN STOCK) */}
          <div className="mt-3">
            <div className="flex items-center justify-between text-[11px] mb-1.5">
              <span className="font-extrabold text-[#2b2d42]">Elegí el talle:</span>
              <span className="text-[10px] text-[#15803d] font-extrabold bg-[#dcfce7] border border-[#86efac] px-2 py-0.5 rounded-full flex items-center gap-1">
                <span>✓</span> Talle {selectedSize}
              </span>
            </div>

            <div className="flex flex-wrap gap-1.5 items-center">
              {allSizes.map((size) => {
                const isAvailable = availableSizes.includes(size);
                const isSelected = selectedSize === size;

                if (isAvailable) {
                  return (
                    <button
                      key={size}
                      type="button"
                      onClick={() => setSelectedSize(size)}
                      title={`Talle ${size} disponible - Clic para elegir`}
                      className={`px-3 py-1 rounded-xl text-xs font-black transition-all cursor-pointer ${
                        isSelected
                          ? 'bg-[#2b2d42] text-white shadow-sm scale-105 ring-2 ring-[#ffb703]'
                          : 'bg-[#fffaf0] text-[#2b2d42] hover:bg-[#ffe5ec] hover:border-[#ff6b6b] border border-[#fed7aa]'
                      }`}
                    >
                      {size}
                    </button>
                  );
                }

                // Talle sin stock: aparece en el listado pero NO se puede seleccionar
                return (
                  <button
                    key={size}
                    type="button"
                    disabled
                    aria-disabled="true"
                    title={`Talle ${size} (Sin stock actualmente)`}
                    className="px-2.5 py-1 rounded-xl text-xs font-bold text-stone-400 bg-stone-100/80 border border-dashed border-stone-300 opacity-45 cursor-not-allowed line-through select-none relative"
                  >
                    {size}
                  </button>
                );
              })}
            </div>

            <div className="flex items-center justify-between text-[10px] text-[#2b2d42]/55 mt-1.5 px-0.5">
              <span className="flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-[#25d366]"></span>
                Disponibles
              </span>
              <span className="flex items-center gap-1 text-stone-400">
                <span className="line-through">Tachado</span> = Sin stock
              </span>
            </div>
          </div>
        </div>

        {/* Pricing block - Exact match to user's image_7b972a5e.png */}
        <div className="pt-2 mb-2">
          {/* Precio Efectivo grande */}
          <div>
            <span className="text-3xl sm:text-[34px] font-black text-[#16a34a] font-brand tracking-tight block leading-none">
              {formatPrice(product.precioTransferencia)}
            </span>
            <span className="text-xs font-bold text-stone-600 mt-1.5 block">
              Efectivo / Transferencia
            </span>
          </div>

          {/* Línea divisoria y pie con Lista y 3 Cuotas */}
          <div className="flex items-center justify-between text-xs pt-2 mt-2 border-t border-stone-100">
            <span className="text-stone-400 font-medium">
              Lista: {formatPrice(product.precioLista)}
            </span>
            <span className="text-[#0284c7] font-black text-sm sm:text-base tracking-tight">
              3 cuotas de {formatPrice(product.cuotas3)}
            </span>
          </div>
        </div>

          {/* Button Add to Cart with Original --rosa: #ff6b6b */}
          <button
            onClick={handleAdd}
            className={`w-full py-3 px-4 rounded-2xl text-xs font-black flex items-center justify-center gap-1.5 transition-all shadow-md active:scale-98 ${
              justAdded
                ? 'bg-[#25d366] text-white'
                : 'bg-[#ff6b6b] hover:bg-[#ff4f4f] text-white shadow-[#ff6b6b]/30'
            }`}
          >
            {justAdded ? (
              <>
                <Check className="w-4 h-4" />
                ¡Agregado al pedido! ({selectedSize})
              </>
            ) : (
              <>
                <Plus className="w-4 h-4" />
                Agregar al pedido · Talle {selectedSize}
              </>
            )}
          </button>
        </div>
      </article>
    );
  };
