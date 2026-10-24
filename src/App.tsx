import React, { useState, useEffect } from 'react';
import { Product, CartItem } from './types';
import { fetchCatalogFromSheet, FALLBACK_PRODUCTS, BRAND_NAME, WHATSAPP_PHONE } from './services/catalogService';
import { HeaderNav } from './components/HeaderNav';
import { AuditView } from './components/AuditView';
import { RedesignedCatalogDemo } from './components/RedesignedCatalogDemo';
import { BeforeAfterComparison } from './components/BeforeAfterComparison';
import { CodeFixesGuide } from './components/CodeFixesGuide';
import { CartDrawer } from './components/CartDrawer';
import { ToastNotification } from './components/ToastNotification';
import { Heart, MessageCircle } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState<'audit' | 'demo' | 'compare' | 'code'>('demo');
  const [isCleanStoreView, setIsCleanStoreView] = useState<boolean>(() => {
    try {
      const p = new URLSearchParams(window.location.search);
      if (p.get('view') === 'dev' || p.get('audit') === 'true') return false;
      return true; // Vista limpia por defecto
    } catch {
      return true;
    }
  });
  const [products, setProducts] = useState<Product[]>(FALLBACK_PRODUCTS);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isLiveSync, setIsLiveSync] = useState<boolean>(false);
  const [syncTimestamp, setSyncTimestamp] = useState<string>('');
  const [isSyncing, setIsSyncing] = useState<boolean>(false);

  // Cart state persisted to localStorage
  const [cartItems, setCartItems] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem('dos_solcitos_v2_cart');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [isCartOpen, setIsCartOpen] = useState<boolean>(false);
  const [toast, setToast] = useState<{ message: string; subMessage?: string } | null>(null);

  // Sync cart with localStorage
  useEffect(() => {
    try {
      localStorage.setItem('dos_solcitos_v2_cart', JSON.stringify(cartItems));
    } catch (e) {
      console.warn('LocalStorage error:', e);
    }
  }, [cartItems]);

  // Load catalog data from Google Sheets on start
  const loadData = async () => {
    setIsSyncing(true);
    try {
      const res = await fetchCatalogFromSheet();
      setProducts(res.products);
      setIsLiveSync(res.fromLiveSheet);
      setSyncTimestamp(res.timestamp);
    } catch (err) {
      console.error('Error loading catalog:', err);
    } finally {
      setIsLoading(false);
      setIsSyncing(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // Cart operations
  const handleAddToCart = (product: Product, size: string) => {
    const selectedSize = size || product.talles[0] || 'Único';
    const cartItemId = `${product.id}_${selectedSize}`;

    setCartItems((prev) => {
      const existing = prev.find((item) => item.cartItemId === cartItemId);
      if (existing) {
        return prev.map((item) =>
          item.cartItemId === cartItemId ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prev, { cartItemId, product, selectedSize, quantity: 1 }];
    });

    setToast({
      message: `¡Sumaste "${product.nombre}"!`,
      subMessage: `Talle: ${selectedSize} · Agregado al pedido para WhatsApp`,
    });
  };

  const handleUpdateQuantity = (cartItemId: string, delta: number) => {
    setCartItems((prev) =>
      prev
        .map((item) => {
          if (item.cartItemId === cartItemId) {
            const nextQty = item.quantity + delta;
            return nextQty > 0 ? { ...item, quantity: nextQty } : null;
          }
          return item;
        })
        .filter(Boolean) as CartItem[]
    );
  };

  const handleUpdateSize = (cartItemId: string, newSize: string) => {
    setCartItems((prev) =>
      prev.map((item) => {
        if (item.cartItemId === cartItemId) {
          return {
            ...item,
            selectedSize: newSize,
            cartItemId: `${item.product.id}_${newSize}`,
          };
        }
        return item;
      })
    );
  };

  const handleRemoveItem = (cartItemId: string) => {
    setCartItems((prev) => prev.filter((item) => item.cartItemId !== cartItemId));
  };

  const handleClearCart = () => {
    setCartItems([]);
  };

  const cartCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);
  const cartTotal = cartItems.reduce(
    (acc, item) => acc + item.product.precioTransferencia * item.quantity,
    0
  );

  return (
    <div className="min-h-screen flex flex-col bg-[#fffaf0] text-[#2b2d42] font-sans selection:bg-[#ffe5ec]">
      {/* Header and Global Navigation */}
      <HeaderNav
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        cartCount={cartCount}
        openCart={() => setIsCartOpen(true)}
        isLiveSync={isLiveSync}
        onRefreshSheet={loadData}
        isSyncing={isSyncing}
        totalProductsCount={products.length}
        isCleanStoreView={isCleanStoreView}
        onToggleCleanView={() => {
          setIsCleanStoreView((prev) => !prev);
          if (!isCleanStoreView) setActiveTab('demo');
        }}
      />

      {/* Main Content View based on activeTab */}
      <main className="flex-1 pb-16">
        {activeTab === 'audit' && (
          <AuditView onSwitchToDemo={() => setActiveTab('demo')} />
        )}

        {activeTab === 'demo' && (
          <RedesignedCatalogDemo
            products={products}
            isLoading={isLoading}
            onAddToCart={handleAddToCart}
            onOpenCart={() => setIsCartOpen(true)}
            cartCount={cartCount}
            cartTotal={cartTotal}
          />
        )}

        {activeTab === 'compare' && (
          <BeforeAfterComparison onSwitchToDemo={() => setActiveTab('demo')} />
        )}

        {activeTab === 'code' && <CodeFixesGuide />}
      </main>

      {/* Cart Drawer */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        items={cartItems}
        onUpdateQuantity={handleUpdateQuantity}
        onUpdateSize={handleUpdateSize}
        onRemoveItem={handleRemoveItem}
        onClearCart={handleClearCart}
      />

      {/* Toast feedback */}
      {toast && (
        <ToastNotification
          message={toast.message}
          subMessage={toast.subMessage}
          onClose={() => setToast(null)}
          onAction={() => {
            setToast(null);
            setIsCartOpen(true);
          }}
          actionLabel="Ver Pedido"
        />
      )}

      {/* Footer con el estilo original: background: var(--ink); color: #fff */}
      <footer className="bg-[#2b2d42] text-white py-8 px-4 sm:px-6 text-center text-xs space-y-2 mt-auto">
        <div className="flex flex-wrap items-center justify-center gap-3 font-bold text-sm">
          <span className="flex items-center gap-1.5">
            <img src="/logo.png" alt="Dos Solcitos" className="h-6 w-auto inline-block invert brightness-200" />
            {BRAND_NAME} · Ropa para bebés, niños y niñas
          </span>
          <span>•</span>
          <a
            href={`https://wa.me/${WHATSAPP_PHONE}`}
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-[#25d366] flex items-center gap-1.5 transition-colors text-emerald-400 font-extrabold"
          >
            <MessageCircle className="w-4 h-4 fill-current" />
            +54 9 11 2350-4802
          </a>
        </div>
        <p className="text-[11px] text-stone-400">
          © {new Date().getFullYear()} {BRAND_NAME} · Glew, Buenos Aires
        </p>
      </footer>
    </div>
  );
}
