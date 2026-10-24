import React, { useState, useEffect } from 'react';
import { Product } from '../types';
import { CATEGORY_ICONS, WHATSAPP_PHONE, BRAND_NAME, getProductSizesConfig } from '../services/catalogService';
import { PriceDisplayOption } from './ProductCard';
import { X, ChevronLeft, ChevronRight, ShoppingCart, MessageCircle, Share2, Check, Maximize2, Minimize2 } from 'lucide-react';

interface QuickViewProps {
  product: Product;
  onClose: () => void;
  onAddToCart: (product: Product, size: string) => void;
  priceOption?: PriceDisplayOption;
}

export const ProductQuickViewModal: React.FC<QuickViewProps> = ({
  product,
  onClose,
  onAddToCart,
  priceOption = 'img1-pill',
}) => {
  const { allSizes, availableSizes } = getProductSizesConfig(product);
  const [activePhotoIdx, setActivePhotoIdx] = useState<number>(0);
  const [selectedSize, setSelectedSize] = useState<string>(availableSizes[0] || 'Único');
  const [copiedLink, setCopiedLink] = useState<boolean>(false);
  const [isFullScreen, setIsFullScreen] = useState<boolean>(false);

  const images = product.imagenes.length > 0 ? product.imagenes : [product.imagenPrincipal];

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (isFullScreen) setIsFullScreen(false);
        else onClose();
      }
      if (e.key === 'ArrowRight') setActivePhotoIdx((prev) => (prev + 1) % images.length);
      if (e.key === 'ArrowLeft') setActivePhotoIdx((prev) => (prev - 1 + images.length) % images.length);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [images.length, onClose, isFullScreen]);

  const formatPrice = (val: number) =>
    val.toLocaleString('es-AR', {
      style: 'currency',
      currency: 'ARS',
      maximumFractionDigits: 0,
    });

  const discountAmount = Math.max(0, product.precioLista - product.precioTransferencia);
  const discountPercent = product.precioLista > 0 ? Math.round((discountAmount / product.precioLista) * 100) : 0;

  const resolveSimpleOption = (opt: PriceDisplayOption): 'img1-pill' | 'img2-classic' | 'img2-cash-focus' | 'img1-badge-transfer' => {
    if (opt === 'img1-pill' || opt === 'simple-pill') return 'img1-pill';
    if (opt === 'img2-classic' || opt === 'simple-minimal') return 'img2-classic';
    if (opt === 'img2-cash-focus' || opt === 'simple-card') return 'img2-cash-focus';
    if (opt === 'img1-badge-transfer' || opt === 'simple-retail') return 'img1-badge-transfer';
    return 'img1-pill';
  };
  const activeOption = resolveSimpleOption(priceOption);

  const handleShareOnWhatsApp = () => {
    const text = `¡Hola ${BRAND_NAME}! Quería consultar si tienen disponible esta prenda:\n👕 ${product.nombre}\n🔢 Código: ${product.codigo}\n📏 Talle: ${selectedSize}\n💵 Precio efectivo/transferencia: ${formatPrice(product.precioTransferencia)}\nhttps://catalogo-react-xi.vercel.app/`;
    window.open(`https://wa.me/${WHATSAPP_PHONE}?text=${encodeURIComponent(text)}`, '_blank');
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(`https://catalogo-react-xi.vercel.app/?p=${product.codigo}`);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  // Get high-resolution version of current photo
  const currentPhoto = images[activePhotoIdx] ? images[activePhotoIdx].replace('sz=w800', 'sz=w1600') : '';

  return (
    <>
      {/* Full-Screen Lightbox View if toggled */}
      {isFullScreen && (
        <div
          onClick={() => setIsFullScreen(false)}
          className="fixed inset-0 z-60 bg-black/95 flex flex-col items-center justify-between p-4 animate-in fade-in duration-200"
        >
          <div className="w-full flex items-center justify-between text-white p-2">
            <span className="text-sm font-bold font-brand text-amber-300">
              {product.nombre} (Foto {activePhotoIdx + 1} de {images.length})
            </span>
            <button
              onClick={() => setIsFullScreen(false)}
              className="w-10 h-10 rounded-full bg-white/20 hover:bg-white/30 text-white flex items-center justify-center transition-colors"
            >
              <Minimize2 className="w-5 h-5" />
            </button>
          </div>

          <div className="relative flex-1 w-full max-h-[85vh] flex items-center justify-center">
            {images.length > 1 && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setActivePhotoIdx((prev) => (prev - 1 + images.length) % images.length);
                }}
                className="absolute left-4 w-12 h-12 rounded-full bg-white/20 hover:bg-white/40 text-white flex items-center justify-center text-2xl z-10"
              >
                ‹
              </button>
            )}

            <img
              src={currentPhoto}
              alt={product.nombre}
              className="max-h-[82vh] max-w-full object-contain rounded-2xl shadow-2xl"
            />

            {images.length > 1 && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setActivePhotoIdx((prev) => (prev + 1) % images.length);
                }}
                className="absolute right-4 w-12 h-12 rounded-full bg-white/20 hover:bg-white/40 text-white flex items-center justify-center text-2xl z-10"
              >
                ›
              </button>
            )}
          </div>

          {images.length > 1 && (
            <div className="flex gap-2 overflow-x-auto p-2">
              {images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={(e) => {
                    e.stopPropagation();
                    setActivePhotoIdx(idx);
                  }}
                  className={`w-14 h-14 rounded-xl overflow-hidden border-2 ${
                    activePhotoIdx === idx ? 'border-amber-400 scale-105' : 'border-white/30 opacity-60'
                  }`}
                >
                  <img src={img} alt="mini" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Main Large Modal */}
      <div
        onClick={onClose}
        className="fixed inset-0 z-50 bg-[#2b2d42]/75 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 overflow-y-auto animate-in fade-in duration-150"
      >
        <div
          onClick={(e) => e.stopPropagation()}
          className="bg-[#fffaf0] rounded-3xl max-w-5xl w-full overflow-hidden shadow-2xl border-2 border-[#fff3c4] flex flex-col md:flex-row relative max-h-[92vh]"
        >
          {/* Close Button */}
          <button
            onClick={onClose}
            aria-label="Cerrar modal"
            className="absolute top-4 right-4 z-20 w-10 h-10 rounded-full bg-white/90 hover:bg-white text-[#2b2d42] flex items-center justify-center shadow-md transition-all hover:scale-105"
          >
            <X className="w-5 h-5" />
          </button>

          {/* LEFT: EXTRA-LARGE Photo Gallery (User requested much bigger photos!) */}
          <div className="w-full md:w-3/5 bg-gradient-to-b from-[#fff3c4]/40 via-[#ffe5ec]/30 to-[#d8f3ff]/30 flex flex-col justify-between relative min-h-[380px] sm:min-h-[460px] md:min-h-[580px] p-3 sm:p-5 border-b md:border-b-0 md:border-r border-[#fed7aa]/60">
            {/* Top Action inside Image: Fullscreen Zoom Button */}
            <div className="flex items-center justify-between mb-2">
              <span className="px-3 py-1 rounded-full bg-white/90 text-xs font-extrabold text-[#2b2d42] shadow-xs flex items-center gap-1 border border-[#fed7aa]">
                <span>{CATEGORY_ICONS[product.categoria] || '👕'}</span>
                <span>{product.categoria}</span>
                {product.codigo && <span className="text-[#ff6b6b] ml-1">· {product.codigo}</span>}
              </span>

              <button
                onClick={() => setIsFullScreen(true)}
                title="Ver imagen en tamaño completo"
                className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/90 hover:bg-white text-xs font-bold text-[#2b2d42] shadow-xs transition-colors border border-[#fed7aa]"
              >
                <Maximize2 className="w-3.5 h-3.5 text-[#ff6b6b]" />
                <span className="hidden sm:inline">Ampliar Foto</span>
              </button>
            </div>

            {/* BIG IMAGE CONTAINER */}
            <div
              onClick={() => setIsFullScreen(true)}
              className="relative flex-1 flex items-center justify-center p-2 cursor-zoom-in group"
            >
              {currentPhoto ? (
                <img
                  src={currentPhoto}
                  alt={product.nombre}
                  className="max-h-[340px] sm:max-h-[420px] md:max-h-[490px] w-auto max-w-full object-contain rounded-2xl shadow-md group-hover:scale-[1.02] transition-transform duration-300"
                />
              ) : (
                <div className="text-center py-16">
                  <span className="text-7xl">{CATEGORY_ICONS[product.categoria] || '🧸'}</span>
                  <p className="text-xs text-[#2b2d42]/70 mt-2 font-bold font-brand text-base">Dos Solcitos</p>
                </div>
              )}

              {/* Prev / Next buttons */}
              {images.length > 1 && (
                <>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setActivePhotoIdx((prev) => (prev - 1 + images.length) % images.length);
                    }}
                    className="absolute left-2 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/90 hover:bg-white text-[#2b2d42] flex items-center justify-center shadow-md transition-colors text-xl font-bold"
                  >
                    <ChevronLeft className="w-6 h-6" />
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setActivePhotoIdx((prev) => (prev + 1) % images.length);
                    }}
                    className="absolute right-2 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/90 hover:bg-white text-[#2b2d42] flex items-center justify-center shadow-md transition-colors text-xl font-bold"
                  >
                    <ChevronRight className="w-6 h-6" />
                  </button>
                </>
              )}
            </div>

            {/* Thumbnails below large photo */}
            {images.length > 1 && (
              <div className="pt-2 flex justify-center gap-2 overflow-x-auto">
                {images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActivePhotoIdx(idx)}
                    className={`w-14 h-14 sm:w-16 sm:h-16 rounded-xl overflow-hidden border-2 transition-all shrink-0 bg-white shadow-xs ${
                      activePhotoIdx === idx
                        ? 'border-[#ff6b6b] ring-2 ring-[#ff6b6b]/40 scale-105'
                        : 'border-white opacity-60 hover:opacity-100'
                    }`}
                  >
                    <img src={img} alt={`Miniatura ${idx + 1}`} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* RIGHT: Product Details, Pricing, Size Selection & Actions */}
          <div className="w-full md:w-2/5 p-6 sm:p-8 flex flex-col justify-between overflow-y-auto space-y-5 bg-white">
            <div className="space-y-4">
              {/* Product Title with Baloo 2 */}
              <div>
                <h2 className="text-xl sm:text-2xl font-black font-brand text-[#2b2d42] leading-tight">
                  {product.nombre}
                </h2>
                {product.descripcion && (
                  <p className="text-xs sm:text-sm text-[#2b2d42]/70 mt-2 leading-relaxed">
                    {product.descripcion}
                  </p>
                )}
              </div>

              {/* PRICING BOX (Exact match to user's image_7b972a5e.png) */}
              <div className="space-y-2 py-2">
                <div>
                  <span className="text-3xl sm:text-4xl font-black text-[#16a34a] font-brand tracking-tight block leading-none">
                    {formatPrice(product.precioTransferencia)}
                  </span>
                  <span className="text-xs sm:text-sm font-bold text-stone-600 mt-1.5 block">
                    Efectivo / Transferencia
                  </span>
                </div>

                <div className="flex items-center justify-between text-xs sm:text-sm pt-2.5 mt-2 border-t border-stone-100">
                  <span className="text-stone-400 font-medium">
                    Lista: {formatPrice(product.precioLista)}
                  </span>
                  <span className="text-[#0284c7] font-black text-sm sm:text-base tracking-tight">
                    3 cuotas de {formatPrice(product.cuotas3)}
                  </span>
                </div>
              </div>

              {/* SIZE PICKER (Original Style con talles disponibles y sin stock) */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-extrabold text-[#2b2d42] uppercase tracking-wide">
                    Seleccioná el talle:
                  </label>
                  <span className="text-[11px] text-[#15803d] font-extrabold bg-[#dcfce7] border border-[#86efac] px-2.5 py-0.5 rounded-full flex items-center gap-1">
                    <span>✓</span> Talle seleccionado: {selectedSize}
                  </span>
                </div>

                <div className="flex flex-wrap gap-2 items-center">
                  {allSizes.map((size) => {
                    const isAvailable = availableSizes.includes(size);
                    const isSelected = selectedSize === size;

                    if (isAvailable) {
                      return (
                        <button
                          key={size}
                          type="button"
                          onClick={() => setSelectedSize(size)}
                          title={`Talle ${size} disponible para compra`}
                          className={`px-4 py-2 rounded-xl text-xs font-black transition-all cursor-pointer ${
                            isSelected
                              ? 'bg-[#2b2d42] text-white shadow-md scale-105 ring-2 ring-[#ffb703]'
                              : 'bg-[#fffaf0] text-[#2b2d42] hover:bg-[#ffe5ec] hover:border-[#ff6b6b] border border-[#fed7aa]'
                          }`}
                        >
                          Talle {size}
                        </button>
                      );
                    }

                    // Talle no disponible (sin stock): aparece pero NO se puede seleccionar
                    return (
                      <button
                        key={size}
                        type="button"
                        disabled
                        aria-disabled="true"
                        title={`Talle ${size} (Sin stock actualmente)`}
                        className="px-3.5 py-2 rounded-xl text-xs font-bold text-stone-400 bg-stone-100 border border-dashed border-stone-300 opacity-45 cursor-not-allowed line-through select-none"
                      >
                        Talle {size} (Agotado)
                      </button>
                    );
                  })}
                </div>

                <div className="flex items-center gap-4 text-[10px] text-[#2b2d42]/60 pt-0.5">
                  <span className="flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-[#25d366]"></span>
                    Talles disponibles en stock
                  </span>
                  <span className="flex items-center gap-1 text-stone-400">
                    <span className="line-through">Tachados</span> = Sin stock momentáneamente
                  </span>
                </div>
              </div>

              {/* Store Benefits */}
              <div className="bg-[#fffaf0] p-3 rounded-xl border border-[#fed7aa] text-[11px] text-[#2b2d42]/80 space-y-1">
                <div className="flex items-center gap-1.5 font-bold">
                  <span>☀️</span>
                  <span>Prendas de algodón suave y diseño infantil</span>
                </div>
                <div className="flex items-center gap-1.5 text-stone-600">
                  <span>📍</span>
                  <span>Retiro en Glew y envíos a todo el país</span>
                </div>
              </div>
            </div>

            {/* ACTION BUTTONS (Original Pastel Palette: Rosa #ff6b6b, Verde #25d366) */}
            <div className="space-y-2.5 pt-3 border-t border-stone-100">
              <button
                onClick={() => {
                  onAddToCart(product, selectedSize);
                  onClose();
                }}
                className="w-full py-3.5 px-4 rounded-2xl text-xs sm:text-sm font-extrabold bg-[#ff6b6b] hover:bg-[#ff4f4f] text-white flex items-center justify-center gap-2 shadow-lg shadow-[#ff6b6b]/30 active:scale-98 transition-all"
              >
                <ShoppingCart className="w-4 h-4" />
                Sumar al pedido en Talle {selectedSize}
              </button>

              <div className="flex items-center gap-2">
                <button
                  onClick={handleShareOnWhatsApp}
                  className="flex-1 py-2.5 px-3 rounded-xl text-xs font-bold bg-[#dcfce7] hover:bg-[#bbf7d0] text-[#15803d] border border-[#86efac] flex items-center justify-center gap-1.5 transition-colors"
                >
                  <MessageCircle className="w-4 h-4 text-[#25d366] fill-current" />
                  Consultar por WhatsApp
                </button>

                <button
                  onClick={handleCopyLink}
                  className="py-2.5 px-3.5 rounded-xl text-xs font-bold bg-[#fffaf0] hover:bg-[#fef3c7] text-[#2b2d42] border border-[#fed7aa] flex items-center gap-1.5 transition-colors"
                >
                  {copiedLink ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Share2 className="w-3.5 h-3.5" />}
                  <span>{copiedLink ? 'Copiado' : 'Compartir'}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
