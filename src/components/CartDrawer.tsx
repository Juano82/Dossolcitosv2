import React, { useState } from 'react';
import { CartItem, CheckoutDetails, DeliveryMethod, PaymentMethod } from '../types';
import { BRAND_NAME, WHATSAPP_PHONE } from '../services/catalogService';
import confetti from 'canvas-confetti';
import {
  X,
  Trash2,
  Plus,
  Minus,
  MessageCircle,
  Copy,
  Check,
  ShoppingBag,
  CreditCard,
  Banknote,
  Truck,
  MapPin,
  Sparkles,
} from 'lucide-react';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  onUpdateQuantity: (cartItemId: string, delta: number) => void;
  onUpdateSize: (cartItemId: string, newSize: string) => void;
  onRemoveItem: (cartItemId: string) => void;
  onClearCart: () => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({
  isOpen,
  onClose,
  items,
  onUpdateQuantity,
  onUpdateSize,
  onRemoveItem,
  onClearCart,
}) => {
  const [checkout, setCheckout] = useState<CheckoutDetails>({
    customerName: '',
    customerPhone: '',
    deliveryMethod: 'retiro',
    deliveryAddress: '',
    paymentMethod: 'transferencia',
    notes: '',
  });

  const [copiedMessage, setCopiedMessage] = useState<boolean>(false);
  const [showPreview, setShowPreview] = useState<boolean>(false);

  if (!isOpen) return null;

  const formatPrice = (val: number) =>
    val.toLocaleString('es-AR', {
      style: 'currency',
      currency: 'ARS',
      maximumFractionDigits: 0,
    });

  const totalQuantity = items.reduce((acc, item) => acc + item.quantity, 0);

  // Totals depending on payment method
  const totalList = items.reduce((acc, item) => acc + item.product.precioLista * item.quantity, 0);
  const totalCash = items.reduce(
    (acc, item) => acc + item.product.precioTransferencia * item.quantity,
    0
  );
  const totalToPay = checkout.paymentMethod === 'transferencia' ? totalCash : totalList;
  const savings = totalList - totalCash;

  // Build the enhanced WhatsApp Message
  const buildWhatsAppMessage = (): string => {
    const deliveryText =
      checkout.deliveryMethod === 'retiro'
        ? '📍 Retiro en Glew / Punto de encuentro'
        : checkout.deliveryMethod === 'envio_domicilio'
        ? `🚚 Envío a Domicilio (${checkout.deliveryAddress || 'a coordinar'})`
        : '📦 Envío por Correo Argentino / Andreani';

    const paymentText =
      checkout.paymentMethod === 'transferencia'
        ? `💵 Transferencia / Efectivo (Total: ${formatPrice(totalCash)} - ¡Ahorro: ${formatPrice(savings)}!)`
        : `💳 Tarjeta en 3 Cuotas de ${formatPrice(Math.round(totalList / 3))} (Total: ${formatPrice(totalList)})`;

    const productLines = items
      .map(
        (item) =>
          `• ${item.quantity}x ${item.product.nombre}\n  📏 Talle: ${item.selectedSize} | Subtotal: ${formatPrice(
            (checkout.paymentMethod === 'transferencia'
              ? item.product.precioTransferencia
              : item.product.precioLista) * item.quantity
          )}`
      )
      .join('\n');

    let msg = `☀️ *¡Hola ${BRAND_NAME}! Quiero realizar este pedido:*\n\n`;
    if (checkout.customerName) {
      msg += `👤 *Cliente:* ${checkout.customerName}\n`;
    }
    msg += `📦 *Detalle del pedido (${totalQuantity} prendas):*\n${productLines}\n\n`;
    msg += `💳 *Forma de pago:* ${paymentText}\n`;
    msg += `🚚 *Forma de entrega:* ${deliveryText}\n`;

    if (checkout.notes) {
      msg += `📝 *Aclaraciones:* ${checkout.notes}\n`;
    }

    msg += `\n💰 *TOTAL FINAL:* ${formatPrice(totalToPay)}\n\n¿Me confirman disponibilidad y datos para transferir? ¡Muchas gracias!`;

    return msg;
  };

  const handleSendWhatsApp = () => {
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 },
    });

    const msg = buildWhatsAppMessage();
    const url = `https://wa.me/${WHATSAPP_PHONE}?text=${encodeURIComponent(msg)}`;
    window.open(url, '_blank');
  };

  const handleCopyMessage = () => {
    const msg = buildWhatsAppMessage();
    navigator.clipboard.writeText(msg);
    setCopiedMessage(true);
    setTimeout(() => setCopiedMessage(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden animate-in fade-in duration-200">
      {/* Backdrop */}
      <div onClick={onClose} className="absolute inset-0 bg-stone-900/60 backdrop-blur-xs" />

      {/* Slide-over Drawer */}
      <div className="absolute inset-y-0 right-0 max-w-lg w-full bg-[#fffaf0] shadow-2xl flex flex-col z-10 border-l-2 border-[#fed7aa]">
        {/* Header con color original Sol #ffb703 */}
        <div className="px-5 py-4 border-b border-[#fed7aa] flex items-center justify-between bg-[#ffb703] text-[#2b2d42]">
          <div className="flex items-center gap-2">
            <span className="text-xl">🛍️</span>
            <div>
              <h2 className="font-extrabold text-base font-brand leading-tight">
                Tu Pedido para WhatsApp
              </h2>
              <p className="text-xs text-[#2b2d42]/80 font-bold">
                {totalQuantity} {totalQuantity === 1 ? 'prenda seleccionada' : 'prendas seleccionadas'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            aria-label="Cerrar pedido"
            className="w-8 h-8 rounded-full bg-white hover:bg-stone-100 flex items-center justify-center text-[#2b2d42] font-black transition-colors shadow-xs"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-5 space-y-5 bg-[#fffaf0]">
          {items.length === 0 ? (
            <div className="text-center py-16 space-y-3">
              <div className="w-16 h-16 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center text-2xl mx-auto">
                🧺
              </div>
              <h3 className="font-bold text-stone-800 text-base">Tu pedido está vacío</h3>
              <p className="text-xs text-stone-500 max-w-xs mx-auto">
                Elegí tus prendas favoritas del catálogo seleccionando el talle que necesitás.
              </p>
              <button
                onClick={onClose}
                className="mt-3 px-4 py-2 rounded-xl bg-amber-500 text-white text-xs font-bold shadow-xs hover:bg-amber-600"
              >
                Explorar catálogo
              </button>
            </div>
          ) : (
            <>
              {/* Items List */}
              <div className="space-y-3">
                <div className="flex items-center justify-between text-xs text-stone-500 font-semibold">
                  <span>Prendas en tu bolsa</span>
                  <button
                    onClick={onClearCart}
                    className="text-stone-400 hover:text-rose-600 transition-colors flex items-center gap-1 text-[11px]"
                  >
                    <Trash2 className="w-3 h-3" /> Vaciar
                  </button>
                </div>

                <div className="divide-y divide-[#fed7aa]/50 border-2 border-[#fed7aa] rounded-2xl overflow-hidden bg-white shadow-xs">
                  {items.map((item) => (
                    <div key={item.cartItemId} className="p-3.5 flex items-start gap-3 bg-white">
                      {/* Thumb Más Grande */}
                      <div className="w-16 h-16 rounded-2xl bg-[#fffaf0] overflow-hidden shrink-0 border border-[#fed7aa] flex items-center justify-center shadow-xs">
                        {item.product.imagenPrincipal ? (
                          <img
                            src={item.product.imagenPrincipal}
                            alt={item.product.nombre}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <span className="text-2xl">👕</span>
                        )}
                      </div>

                      {/* Info & Size selection */}
                      <div className="flex-1 min-w-0">
                        <h4 className="text-xs font-bold text-stone-900 truncate">
                          {item.product.nombre}
                        </h4>

                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-[11px] font-semibold text-stone-500">Talle:</span>
                          {item.product.talles.length > 1 ? (
                            <select
                              value={item.selectedSize}
                              onChange={(e) => onUpdateSize(item.cartItemId, e.target.value)}
                              className="text-[11px] font-bold text-amber-900 bg-amber-100/70 border border-amber-300 rounded px-1.5 py-0.5 cursor-pointer"
                            >
                              {item.product.talles.map((size) => (
                                <option key={size} value={size}>
                                  Talle {size}
                                </option>
                              ))}
                            </select>
                          ) : (
                            <span className="text-[11px] font-bold text-amber-900 bg-amber-100 px-1.5 py-0.5 rounded">
                              {item.selectedSize}
                            </span>
                          )}
                        </div>

                        <div className="text-xs font-black text-stone-900 mt-1">
                          {formatPrice(
                            (checkout.paymentMethod === 'transferencia'
                              ? item.product.precioTransferencia
                              : item.product.precioLista) * item.quantity
                          )}
                        </div>
                      </div>

                      {/* Quantity Controls */}
                      <div className="flex items-center gap-1.5 bg-[#ffe5ec] p-1 rounded-full border border-[#fed7aa] shrink-0">
                        <button
                          onClick={() => onUpdateQuantity(item.cartItemId, -1)}
                          className="w-6 h-6 rounded-lg bg-white hover:bg-stone-200 text-stone-700 flex items-center justify-center text-xs font-bold shadow-2xs"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="text-xs font-bold text-stone-800 w-5 text-center">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => onUpdateQuantity(item.cartItemId, 1)}
                          className="w-6 h-6 rounded-lg bg-white hover:bg-stone-200 text-stone-700 flex items-center justify-center text-xs font-bold shadow-2xs"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Step 2: Mini-Checkout Settings (The Key Improvement!) */}
              <div className="space-y-4 pt-2 border-t border-stone-200">
                <div className="flex items-center gap-1.5 text-xs font-bold text-stone-900">
                  <span className="w-5 h-5 rounded-full bg-amber-500 text-white flex items-center justify-center text-[10px]">
                    ✓
                  </span>
                  Datos del Pedido para WhatsApp
                </div>

                {/* Customer Name */}
                <div>
                  <label className="text-[11px] font-bold text-stone-700 block mb-1">
                    Tu Nombre o Apodo:
                  </label>
                  <input
                    type="text"
                    placeholder="Ej: Lucía / Mamá de Benja"
                    value={checkout.customerName}
                    onChange={(e) => setCheckout({ ...checkout, customerName: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl text-xs bg-stone-50 border border-stone-300 focus:outline-none focus:ring-2 focus:ring-amber-400 focus:bg-white"
                  />
                </div>

                {/* Payment Method Toggle */}
                <div>
                  <label className="text-[11px] font-bold text-stone-700 block mb-1">
                    ¿Cómo preferís abonar?
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => setCheckout({ ...checkout, paymentMethod: 'transferencia' })}
                      className={`p-2.5 rounded-xl text-left border transition-all ${
                        checkout.paymentMethod === 'transferencia'
                          ? 'border-emerald-500 bg-emerald-50/70 text-emerald-950 ring-1 ring-emerald-500'
                          : 'border-stone-200 bg-white text-stone-700 hover:bg-stone-50'
                      }`}
                    >
                      <div className="flex items-center gap-1.5 text-xs font-bold">
                        <Banknote className="w-4 h-4 text-emerald-600" />
                        Transferencia
                      </div>
                      <p className="text-[10px] text-emerald-700 font-semibold mt-0.5">
                        Ahorrás {formatPrice(savings)}
                      </p>
                    </button>

                    <button
                      type="button"
                      onClick={() => setCheckout({ ...checkout, paymentMethod: 'cuotas' })}
                      className={`p-2.5 rounded-xl text-left border transition-all ${
                        checkout.paymentMethod === 'cuotas'
                          ? 'border-amber-500 bg-amber-50/70 text-amber-950 ring-1 ring-amber-500'
                          : 'border-stone-200 bg-white text-stone-700 hover:bg-stone-50'
                      }`}
                    >
                      <div className="flex items-center gap-1.5 text-xs font-bold">
                        <CreditCard className="w-4 h-4 text-amber-600" />
                        Tarjeta de Crédito
                      </div>
                      <p className="text-[10px] text-stone-500 mt-0.5">
                        3 cuotas de {formatPrice(Math.round(totalList / 3))}
                      </p>
                    </button>
                  </div>
                </div>

                {/* Delivery Method Selector */}
                <div>
                  <label className="text-[11px] font-bold text-stone-700 block mb-1">
                    Forma de Entrega:
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => setCheckout({ ...checkout, deliveryMethod: 'retiro' })}
                      className={`p-2 rounded-xl text-xs font-bold flex items-center gap-1.5 border transition-all ${
                        checkout.deliveryMethod === 'retiro'
                          ? 'border-amber-500 bg-amber-100/70 text-amber-950'
                          : 'border-stone-200 bg-white text-stone-600 hover:bg-stone-50'
                      }`}
                    >
                      <MapPin className="w-3.5 h-3.5 text-amber-600" />
                      Retiro en Glew
                    </button>

                    <button
                      type="button"
                      onClick={() => setCheckout({ ...checkout, deliveryMethod: 'envio_domicilio' })}
                      className={`p-2 rounded-xl text-xs font-bold flex items-center gap-1.5 border transition-all ${
                        checkout.deliveryMethod === 'envio_domicilio'
                          ? 'border-amber-500 bg-amber-100/70 text-amber-950'
                          : 'border-stone-200 bg-white text-stone-600 hover:bg-stone-50'
                      }`}
                    >
                      <Truck className="w-3.5 h-3.5 text-amber-600" />
                      Envío a Domicilio
                    </button>
                  </div>

                  {checkout.deliveryMethod === 'envio_domicilio' && (
                    <input
                      type="text"
                      placeholder="Dirección, localidad o código postal"
                      value={checkout.deliveryAddress}
                      onChange={(e) => setCheckout({ ...checkout, deliveryAddress: e.target.value })}
                      className="mt-2 w-full px-3 py-2 rounded-xl text-xs bg-stone-50 border border-stone-300 focus:outline-none focus:ring-2 focus:ring-amber-400"
                    />
                  )}
                </div>

                {/* WhatsApp Message Preview Toggle */}
                <div>
                  <button
                    type="button"
                    onClick={() => setShowPreview(!showPreview)}
                    className="text-[11px] text-amber-800 hover:text-amber-900 font-bold flex items-center gap-1 underline underline-offset-2"
                  >
                    <span>{showPreview ? 'Ocultar vista previa del mensaje' : 'Ver cómo se leerá el mensaje en WhatsApp'}</span>
                  </button>

                  {showPreview && (
                    <div className="mt-2 p-3 bg-stone-900 text-stone-200 rounded-xl font-mono text-[11px] whitespace-pre-wrap leading-relaxed border border-stone-800">
                      {buildWhatsAppMessage()}
                    </div>
                  )}
                </div>
              </div>
            </>
          )}
        </div>

        {/* Footer with Totals & WhatsApp CTA */}
        {items.length > 0 && (
          <div className="p-5 border-t border-stone-200 bg-stone-50 space-y-3">
            {/* Price breakdown */}
            <div className="space-y-1">
              {checkout.paymentMethod === 'transferencia' ? (
                <>
                  <div className="flex justify-between text-xs text-stone-500">
                    <span>Precio de Lista:</span>
                    <span className="line-through">{formatPrice(totalList)}</span>
                  </div>
                  <div className="flex justify-between text-xs text-emerald-700 font-bold">
                    <span>Descuento Transferencia:</span>
                    <span>-{formatPrice(savings)}</span>
                  </div>
                  <div className="flex justify-between text-base font-black text-stone-900 pt-1 border-t border-stone-200">
                    <span>Total a abonar:</span>
                    <span className="text-emerald-700">{formatPrice(totalCash)}</span>
                  </div>
                </>
              ) : (
                <>
                  <div className="flex justify-between text-base font-black text-stone-900">
                    <span>Total en 3 Cuotas:</span>
                    <span>{formatPrice(totalList)}</span>
                  </div>
                  <div className="text-[11px] text-stone-500 text-right">
                    3 cuotas de <strong>{formatPrice(Math.round(totalList / 3))}</strong>
                  </div>
                </>
              )}
            </div>

            {/* Direct Send button to WhatsApp */}
            <button
              onClick={handleSendWhatsApp}
              className="w-full py-3.5 px-4 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-lg shadow-emerald-600/30 active:scale-98 transition-all"
            >
              <MessageCircle className="w-5 h-5 fill-current" />
              <span>Enviar Pedido a WhatsApp</span>
            </button>

            {/* Copy Button */}
            <button
              onClick={handleCopyMessage}
              className="w-full py-2 px-3 rounded-xl bg-white hover:bg-stone-100 text-stone-700 font-medium text-xs flex items-center justify-center gap-1.5 border border-stone-200 transition-colors"
            >
              {copiedMessage ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedMessage ? '¡Texto copiado al portapapeles!' : 'Copiar texto del pedido'}</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
