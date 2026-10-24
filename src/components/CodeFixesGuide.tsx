import React, { useState } from 'react';
import { Copy, Check, Code2, FileCode, Sparkles, Download, Layers } from 'lucide-react';

interface CodeSnippet {
  id: string;
  title: string;
  filename: string;
  description: string;
  isSingleFileDropIn?: boolean;
  code: string;
}

const SNIPPETS: CodeSnippet[] = [
  {
    id: 'single-file-app',
    title: '⭐ App.jsx / App.tsx Completo (Drop-in Listo para Vercel)',
    filename: 'src/App.jsx (o src/App.tsx)',
    description:
      '¡TODO EN UN SOLO ARCHIVO! Reemplazá todo el contenido de tu App.jsx o App.tsx por este código. Incluye selector obligatorio de talles, filtros por talle de niño, persistencia en localStorage, mini-checkout para WhatsApp y manejo seguro de imágenes.',
    isSingleFileDropIn: true,
    code: `import React, { useState, useEffect, useMemo } from 'react';

// ==========================================
// CONFIGURACIÓN DE TU NEGOCIO DOS SOLCITOS
// ==========================================
const SHEET_URL = 'https://docs.google.com/spreadsheets/d/1H09L_d_OKheqK42e8p-d4s7yclIXy6OVt5bcdq37Ev4/export?format=csv';
const WHATSAPP_PHONE = '5491123504802';
const BRAND_NAME = 'Dos Solcitos';

const CATEGORY_EMOJIS = {
  Remeras: '👕',
  Bodies: '👶',
  Conjuntos: '🧸',
  Pantalones: '👖',
  Vestidos: '👗',
  Abrigos: '🧥',
  Calzado: '👟',
  Prendas: '✨',
  Todos: '🌟',
};

// Formato de moneda argentina
const formatARS = (n) =>
  n ? n.toLocaleString('es-AR', { style: 'currency', currency: 'ARS', maximumFractionDigits: 0 }) : '$0';

// Convertidor de URL de Google Drive
const formatDriveImg = (url) => {
  if (!url) return '';
  const match = url.match(/\\/d\\/([\\w-]+)/) || url.match(/[?&]id=([\\w-]+)/);
  return match && match[1] ? \`https://drive.google.com/thumbnail?id=\${match[1]}&sz=w800\` : url;
};

// Parser CSV seguro para Google Sheets
function parseCSV(text) {
  const rows = [];
  let row = [];
  let val = '';
  let inQuotes = false;
  for (let i = 0; i < text.length; i++) {
    const c = text[i];
    const next = text[i + 1];
    if (inQuotes) {
      if (c === '"' && next === '"') { val += '"'; i++; }
      else if (c === '"') { inQuotes = false; }
      else { val += c; }
    } else {
      if (c === '"') inQuotes = true;
      else if (c === ',') { row.push(val.trim()); val = ''; }
      else if (c === '\\n') { row.push(val.trim()); rows.push(row); row = []; val = ''; }
      else if (c !== '\\r') val += c;
    }
  }
  if (val || row.length) { row.push(val.trim()); rows.push(row); }
  return rows;
}

// Clasificador inteligente de categorías
function getCategory(name) {
  const n = name.toLowerCase();
  if (n.includes('remera') || n.includes('remeron')) return 'Remeras';
  if (n.includes('body') || n.includes('ranita') || n.includes('bebe')) return 'Bodies';
  if (n.includes('conjunto') || n.includes('enterito') || n.includes('plush')) return 'Conjuntos';
  if (n.includes('pantalon') || n.includes('jogger') || n.includes('calza')) return 'Pantalones';
  if (n.includes('vestido')) return 'Vestidos';
  if (n.includes('zapatilla') || n.includes('zapato')) return 'Calzado';
// Curvas de talles estándar para ropa de niños y bebés
const BABY_SIZES_CURVE = ['RN', '3M', '6M', '9M', '12M'];
const KIDS_SIZES_CURVE = ['2T', '3T', '4T', '6T', '8T', '10T'];

// Determina todos los talles de la prenda: disponibles (elegibles) vs sin stock (deshabilitados)
function getProductSizes(product) {
  const available = product.talles && product.talles.length ? product.talles : ['Único'];
  if (available.length === 1 && available[0].toLowerCase().includes('único')) {
    return { allSizes: ['Único'], availableSizes: ['Único'] };
  }
  const isBaby = available.some(s => {
    const u = String(s).toUpperCase();
    return u === 'RN' || u.endsWith('M') || u.includes('-');
  }) || ['Bodies', 'Ranita', 'Ajuar'].includes(product.categoria) || product.nombre.toLowerCase().includes('body');

  const baseCurve = isBaby ? BABY_SIZES_CURVE : KIDS_SIZES_CURVE;
  const set = new Set([...baseCurve, ...available]);
  return { allSizes: Array.from(set), availableSizes: available };
}

export default function App() {
  const [products, setProducts] = useState([]);
  const [status, setStatus] = useState('cargando');
  const [selectedCat, setSelectedCat] = useState('Todos');
  const [selectedSizeFilter, setSelectedSizeFilter] = useState('all');
  const [search, setSearch] = useState('');
  const [priceMode, setPriceMode] = useState('transferencia'); // 'transferencia' | 'cuotas'
  
  // Carrito persistido en localStorage
  const [cart, setCart] = useState(() => {
    try {
      const saved = localStorage.getItem('dos_solcitos_cart');
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });

  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [zoomProduct, setZoomProduct] = useState(null);
  const [zoomPhotoIdx, setZoomPhotoIdx] = useState(0);
  const [zoomSelectedSize, setZoomSelectedSize] = useState('');
  const [toastMsg, setToastMsg] = useState('');

  // Datos para el checkout de WhatsApp
  const [checkoutData, setCheckoutData] = useState({
    nombre: '',
    metodoPago: 'transferencia', // 'transferencia' | 'cuotas'
    entrega: 'retiro', // 'retiro' | 'envio'
    direccion: '',
    notas: '',
  });

  // Guardar carrito en localStorage
  useEffect(() => {
    try {
      localStorage.setItem('dos_solcitos_cart', JSON.stringify(cart));
    } catch (e) {}
  }, [cart]);

  // Cerrar zoom con tecla Escape
  useEffect(() => {
    const onKey = (e) => e.key === 'Escape' && setZoomProduct(null);
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  // Cargar productos de Google Sheet
  useEffect(() => {
    async function loadData() {
      try {
        const res = await fetch(SHEET_URL);
        if (!res.ok) throw new Error('Error al conectar con la hoja');
        const csv = await res.text();
        const [headers, ...rows] = parseCSV(csv);
        const lowerH = headers.map(h => h.toLowerCase());

        const getIdx = (...k) => lowerH.findIndex(h => k.some(w => h.includes(w)));
        const descIdx = getIdx('descripcion', 'nombre');
        const codeIdx = getIdx('codigo', 'cod');
        const talleIdx = getIdx('talle');
        const pListIdx = getIdx('precio de venta', 'precio lista');
        const pCashIdx = getIdx('precio efectivo', 'efectivo', 'transferencia');
        const qtyIdx = getIdx('cantidad', 'stock');
        const obsIdx = getIdx('observacion');

        const imgIndices = [];
        lowerH.forEach((h, i) => { if (h.includes('foto') || h.includes('imagen')) imgIndices.push(i); });

        const parseNum = (v) => Number(String(v || '').replace(/[^\\d,]/g, '').replace(',', '.')) || 0;
        const prodMap = new Map();

        rows.forEach((row, i) => {
          const desc = descIdx !== -1 && row[descIdx] ? row[descIdx].replace(/\\s+/g, ' ').trim() : '';
          const obs = obsIdx !== -1 && row[obsIdx] ? row[obsIdx].trim().toLowerCase() : '';
          if (!desc || obs.includes('baja') || obs.includes('vendido')) return;

          const code = codeIdx !== -1 && row[codeIdx] ? row[codeIdx].trim() : \`P-\${i}\`;
          const talle = talleIdx !== -1 && row[talleIdx] ? row[talleIdx].trim() : '';
          const pList = pListIdx !== -1 ? parseNum(row[pListIdx]) : 22584;
          const pCash = pCashIdx !== -1 ? parseNum(row[pCashIdx]) : Math.round(pList * 0.8);
          const qty = qtyIdx !== -1 ? parseNum(row[qtyIdx]) || 1 : 1;

          const imgs = [];
          imgIndices.forEach(idx => {
            const val = row[idx];
            if (val && val.trim().startsWith('http')) {
              const url = formatDriveImg(val.trim());
              if (!imgs.includes(url)) imgs.push(url);
            }
          });

          if (prodMap.has(desc)) {
            const existing = prodMap.get(desc);
            if (talle && !existing.talles.includes(talle)) existing.talles.push(talle);
            imgs.forEach(img => { if (!existing.imagenes.includes(img)) existing.imagenes.push(img); });
            existing.stock += qty;
          } else {
            prodMap.set(desc, {
              id: prodMap.size + 1,
              codigo: code,
              nombre: desc,
              categoria: getCategory(desc),
              precioLista: pList,
              precioTransferencia: pCash,
              cuotas3: Math.round(pList / 3),
              talles: talle ? [talle] : ['Único'],
              imagenes: imgs,
              imagen: imgs[0] || '',
              stock: qty,
            });
          }
        });

        const list = Array.from(prodMap.values());
        setProducts(list);
        setStatus(list.length ? 'ok' : 'vacio');
      } catch (err) {
        console.error(err);
        setStatus('error');
      }
    }
    loadData();
  }, []);

  // Extraer categorías y talles disponibles
  const categories = useMemo(() => ['Todos', ...new Set(products.map(p => p.categoria))], [products]);
  const allSizes = useMemo(() => {
    const s = new Set();
    products.forEach(p => p.talles.forEach(t => { if (t && t !== 'Único') s.add(t); }));
    return Array.from(s).sort();
  }, [products]);

  // Filtrado de productos
  const filteredProducts = useMemo(() => {
    return products.filter(p => {
      if (selectedCat !== 'Todos' && p.categoria !== selectedCat) return false;
      if (selectedSizeFilter !== 'all' && !p.talles.includes(selectedSizeFilter)) return false;
      if (search.trim()) {
        const q = search.toLowerCase();
        const matches = p.nombre.toLowerCase().includes(q) || p.codigo.toLowerCase().includes(q) || p.talles.some(t => t.toLowerCase().includes(q));
        if (!matches) return false;
      }
      return true;
    });
  }, [products, selectedCat, selectedSizeFilter, search]);

  // Operaciones del Carrito con Talle (Clave: productId + "_" + talle)
  const addToCart = (product, size) => {
    const chosenSize = size || product.talles[0] || 'Único';
    const key = \`\${product.id}_\${chosenSize}\`;

    setCart(prev => {
      const cur = prev[key] || { p: product, size: chosenSize, qty: 0 };
      return { ...prev, [key]: { ...cur, qty: cur.qty + 1 } };
    });

    setToastMsg(\`✓ ¡Agregaste \${product.nombre} (Talle \${chosenSize})!\`);
    setTimeout(() => setToastMsg(''), 2500);
  };

  const updateCartQty = (key, delta) => {
    setCart(prev => {
      const cur = prev[key];
      if (!cur) return prev;
      const nextQty = cur.qty + delta;
      const next = { ...prev };
      if (nextQty <= 0) delete next[key];
      else next[key] = { ...cur, qty: nextQty };
      return next;
    });
  };

  const clearCart = () => setCart({});

  // Totales
  const cartList = Object.entries(cart).map(([key, item]) => ({ key, ...item }));
  const totalItemsCount = cartList.reduce((acc, i) => acc + i.qty, 0);
  const totalListPrice = cartList.reduce((acc, i) => acc + i.p.precioLista * i.qty, 0);
  const totalCashPrice = cartList.reduce((acc, i) => acc + i.p.precioTransferencia * i.qty, 0);
  const isCash = checkoutData.metodoPago === 'transferencia';
  const finalTotal = isCash ? totalCashPrice : totalListPrice;
  const savings = totalListPrice - totalCashPrice;

  // Enviar pedido por WhatsApp
  const sendWhatsAppOrder = () => {
    const entregaTxt = checkoutData.entrega === 'retiro'
      ? '📍 Retiro en Glew'
      : \`🚚 Envío a Domicilio (\${checkoutData.direccion || 'a coordinar'})\`;

    const pagoTxt = isCash
      ? \`💵 Transferencia/Efectivo (Total: \${formatARS(totalCashPrice)} - ¡Ahorro: \${formatARS(savings)}!)\`
      : \`💳 Tarjeta en 3 Cuotas de \${formatARS(Math.round(totalListPrice / 3))}\`;

    const itemsTxt = cartList
      .map(i => \`• \${i.qty}x \${i.p.nombre}\\n  📏 Talle: \${i.size} | Subtotal: \${formatARS((isCash ? i.p.precioTransferencia : i.p.precioLista) * i.qty)}\`)
      .join('\\n');

    let msg = \`☀️ *¡Hola \${BRAND_NAME}! Quiero hacer este pedido:*\\n\\n\`;
    if (checkoutData.nombre) msg += \`👤 *Cliente:* \${checkoutData.nombre}\\n\`;
    msg += \`📦 *Prendas (\${totalItemsCount}):*\\n\${itemsTxt}\\n\\n\`;
    msg += \`💳 *Medio de pago:* \${pagoTxt}\\n\`;
    msg += \`🚚 *Entrega:* \${entregaTxt}\\n\`;
    if (checkoutData.notas) msg += \`📝 *Notas:* \${checkoutData.notas}\\n\`;
    msg += \`\\n💰 *TOTAL A ABONAR:* \${formatARS(finalTotal)}\\n\\n¿Me confirman disponibilidad para transferir? ¡Muchas gracias!\`;

    window.open(\`https://wa.me/\${WHATSAPP_PHONE}?text=\${encodeURIComponent(msg)}\`, '_blank');
  };

  return (
    <div style={{ fontFamily: 'Nunito, sans-serif', backgroundColor: '#fffaf0', minHeight: '100vh', color: '#2b2d42' }}>
      
      {/* HEADER */}
      <header style={{ position: 'sticky', top: 0, zIndex: 30, background: 'rgba(255,255,255,0.95)', backdropFilter: 'blur(8px)', borderBottom: '1px solid #fed7aa', padding: '12px 16px', display: 'flex', alignItems: 'center', justifyContent: 'between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <img src="./logo.png" alt={BRAND_NAME} style={{ height: '54px', width: 'auto' }} />
          <div>
            <h1 style={{ margin: 0, fontSize: '18px', fontWeight: 800, fontFamily: 'Baloo 2, cursive', color: '#2b2d42', lineHeight: 1 }}>{BRAND_NAME}</h1>
            <span style={{ fontSize: '11px', color: '#78716c' }}>Ropa para bebés, niños y niñas</span>
          </div>
        </div>

        <button
          onClick={() => setIsDrawerOpen(true)}
          style={{ background: '#ffb703', color: '#2b2d42', border: 'none', borderRadius: '99px', padding: '10px 18px', fontSize: '13px', fontWeight: 800, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px', boxShadow: '0 2px 10px rgba(0,0,0,0.1)' }}
        >
          <span>🛒</span>
          <span>Pedido</span>
          <span style={{ background: '#2b2d42', color: '#fff', borderRadius: '999px', padding: '2px 8px', fontSize: '11px', fontWeight: 900 }}>
            {totalItemsCount}
          </span>
        </button>
      </header>

      {/* HERO BANNER CON EL ESTILO ORIGINAL EXACTO Y LOGO TRANSPARENTE EN EL DEGRADÉ */}
      <section style={{ width: '100%', background: 'linear-gradient(135deg, #ffe5ec, #fff3c4 50%, #d8f3ff)', padding: '36px 5vw 24px', textAlign: 'center', borderBottom: '1px solid #fed7aa' }}>
        {/* Logo integrado en la parte del degradé sin fondo blanco */}
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '10px' }}>
          <img
            src="./logo.png"
            alt={BRAND_NAME}
            style={{ height: '95px', width: 'auto', objectFit: 'contain', mixBlendMode: 'multiply' }}
          />
        </div>

        <h1 style={{ fontSize: 'clamp(1.9rem, 4.5vw, 3rem)', fontWeight: 800, fontFamily: 'Baloo 2, cursive', margin: '0 0 10px', color: '#2b2d42', lineHeight: 1.1 }}>
          Ropa para <span style={{ color: '#ff6b6b' }}>bebés, niños y niñas</span>
        </h1>
        <p style={{ margin: '8px 0 18px', fontSize: '15px', color: '#57534e' }}>
          Elegí tus favoritos y hacé tu pedido por WhatsApp en un minuto.
        </p>

        {/* Buscador Píldora Centrado Original */}
        <div style={{ maxWidth: '540px', margin: '0 auto 16px' }}>
          <input
            type="search"
            placeholder="🔍 Buscar productos..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{ width: '100%', padding: '14px 22px', borderRadius: '99px', border: '3px solid #fff', fontSize: '14px', background: '#fff', outline: 'none', boxShadow: '0 6px 20px rgba(0,0,0,0.08)' }}
          />
        </div>

        {/* 3 PÍLDORAS DE BENEFICIOS (Cuotas, Descuento y Envíos) */}
        <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '10px', fontSize: '12px', fontWeight: 800 }}>
          <span style={{ background: '#fff', padding: '6px 14px', borderRadius: '99px', border: '1px solid #fed7aa', boxShadow: '0 2px 6px rgba(0,0,0,0.05)' }}>💳 3 Cuotas</span>
          <span style={{ background: '#fff', padding: '6px 14px', borderRadius: '99px', border: '1px solid #fed7aa', boxShadow: '0 2px 6px rgba(0,0,0,0.05)' }}>💵 Descuento en Efectivo/Transferencia</span>
          <span style={{ background: '#fff', padding: '6px 14px', borderRadius: '99px', border: '1px solid #fed7aa', boxShadow: '0 2px 6px rgba(0,0,0,0.05)' }}>🚚 Retiro en Glew y Envíos</span>
        </div>
      </section>

      {/* CONTROLES: CATEGORÍAS, TALLES Y PRECIO */}
      <section style={{ maxWidth: '1100px', margin: '16px auto 0', padding: '0 16px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
        
        {/* Categorías y Filtros */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12px', fontWeight: 700, color: '#2b2d42' }}>
            <span style={{ color: '#16a34a' }}>💵 Descuento en Efectivo/Transferencia</span>
            <span style={{ color: '#fed7aa' }}>•</span>
            <span style={{ color: '#0284c7' }}>💳 3 Cuotas</span>
          </div>
        </div>

        {/* Chips de Categorías */}
        <div style={{ display: 'flex', gap: '6px', overflowX: 'auto', paddingBottom: '4px' }}>
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCat(cat)}
              style={{ whiteSpace: 'nowrap', border: '1px solid #fed7aa', background: selectedCat === cat ? '#2b2d42' : '#fff', color: selectedCat === cat ? '#fff' : '#2b2d42', padding: '6px 12px', borderRadius: '999px', fontSize: '12px', fontWeight: 700, cursor: 'pointer' }}
            >
              {CATEGORY_EMOJIS[cat] || '✨'} {cat}
            </button>
          ))}
        </div>

        {/* Filtro por Talle (¡La gran mejora para los padres!) */}
        {allSizes.length > 0 && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', overflowX: 'auto', padding: '4px 0', fontSize: '12px' }}>
            <span style={{ fontWeight: 800, color: '#78716c', whiteSpace: 'nowrap' }}>📏 Talle de tu peque:</span>
            <button
              onClick={() => setSelectedSizeFilter('all')}
              style={{ border: 'none', background: selectedSizeFilter === 'all' ? '#ffb703' : '#f5f5f4', color: selectedSizeFilter === 'all' ? '#fff' : '#2b2d42', padding: '4px 10px', borderRadius: '8px', fontWeight: 700, cursor: 'pointer' }}
            >
              Todos
            </button>
            {allSizes.map((size) => (
              <button
                key={size}
                onClick={() => setSelectedSizeFilter(size)}
                style={{ border: 'none', background: selectedSizeFilter === size ? '#ffb703' : '#f5f5f4', color: selectedSizeFilter === size ? '#fff' : '#2b2d42', padding: '4px 10px', borderRadius: '8px', fontWeight: 700, cursor: 'pointer' }}
              >
                {size}
              </button>
            ))}
          </div>
        )}
      </section>

      {/* GRILLA DE PRODUCTOS */}
      <main style={{ maxWidth: '1100px', margin: '20px auto', padding: '0 16px' }}>
        {status === 'cargando' && (
          <div style={{ textAlign: 'center', padding: '40px 0', color: '#78716c' }}>
            <p style={{ fontSize: '18px', fontWeight: 700 }}>Cargando catálogo en vivo desde Google Sheets...</p>
          </div>
        )}

        {status === 'error' && (
          <div style={{ textAlign: 'center', padding: '40px 0', color: '#e11d48' }}>
            <p>No se pudo conectar con el catálogo. Verificá los permisos del Google Sheet.</p>
          </div>
        )}

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: '16px' }}>
          {filteredProducts.map((p) => (
            <CardItem
              key={p.id}
              product={p}
              priceMode={priceMode}
              onAdd={addToCart}
              onZoom={(prod) => {
                setZoomProduct(prod);
                setZoomPhotoIdx(0);
                const cfg = getProductSizes(prod);
                setZoomSelectedSize(cfg.availableSizes[0] || 'Único');
              }}
            />
          ))}
        </div>
      </main>

      {/* MODAL ZOOM / DETALLES */}
      {zoomProduct && (
        <div onClick={() => setZoomProduct(null)} style={{ position: 'fixed', inset: 0, zIndex: 50, background: 'rgba(0,0,0,0.7)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '16px' }}>
          <div onClick={(e) => e.stopPropagation()} style={{ background: '#fff', borderRadius: '24px', maxWidth: '500px', width: '100%', overflow: 'hidden', padding: '20px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
              <span style={{ fontSize: '12px', fontWeight: 800, background: '#fef3c7', color: '#92400e', padding: '3px 8px', borderRadius: '6px' }}>{zoomProduct.codigo}</span>
              <button onClick={() => setZoomProduct(null)} style={{ border: 'none', background: '#f5f5f4', borderRadius: '50%', width: '32px', height: '32px', cursor: 'pointer', fontWeight: 800 }}>✕</button>
            </div>
            
            {/* Foto principal */}
            <div style={{ aspectRatio: '1', width: '100%', background: '#f5f5f4', borderRadius: '16px', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              {zoomProduct.imagenes[zoomPhotoIdx] ? (
                <img src={zoomProduct.imagenes[zoomPhotoIdx]} alt={zoomProduct.nombre} style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
              ) : (
                <span style={{ fontSize: '48px' }}>{CATEGORY_EMOJIS[zoomProduct.categoria] || '✨'}</span>
              )}
            </div>

            {/* Miniaturas */}
            {zoomProduct.imagenes.length > 1 && (
              <div style={{ display: 'flex', gap: '8px', marginTop: '10px', justifyContent: 'center' }}>
                {zoomProduct.imagenes.map((img, idx) => (
                  <button key={idx} onClick={() => setZoomPhotoIdx(idx)} style={{ border: idx === zoomPhotoIdx ? '2px solid #ffb703' : '1px solid #e7e5e4', borderRadius: '8px', overflow: 'hidden', width: '44px', height: '44px', padding: 0 }}>
                    <img src={img} alt="mini" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  </button>
                ))}
              </div>
            )}

            <h3 style={{ margin: '14px 0 6px', fontSize: '16px', fontWeight: 800 }}>{zoomProduct.nombre}</h3>
            
            {/* Selector de talles en el modal con botones disponibles y no seleccionables */}
            <div style={{ margin: '12px 0 8px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', marginBottom: '6px' }}>
                <span style={{ fontWeight: 800, color: '#78716c' }}>Elegí el talle:</span>
                <span style={{ color: '#16a34a', fontWeight: 800 }}>✓ Talle {zoomSelectedSize}</span>
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                {getProductSizes(zoomProduct).allSizes.map((size) => {
                  const isAvailable = getProductSizes(zoomProduct).availableSizes.includes(size);
                  const isSelected = zoomSelectedSize === size;
                  if (isAvailable) {
                    return (
                      <button
                        key={size}
                        type="button"
                        onClick={() => setZoomSelectedSize(size)}
                        style={{ border: 'none', padding: '6px 12px', borderRadius: '8px', fontSize: '12px', fontWeight: 800, cursor: 'pointer', background: isSelected ? '#2b2d42' : '#f5f5f4', color: isSelected ? '#fff' : '#2b2d42' }}
                      >
                        Talle {size}
                      </button>
                    );
                  }
                  return (
                    <button
                      key={size}
                      type="button"
                      disabled
                      title={'Talle ' + size + ' (Sin stock)'}
                      style={{ border: '1px dashed #d6d3d1', padding: '5px 10px', borderRadius: '8px', fontSize: '12px', fontWeight: 700, cursor: 'not-allowed', background: '#fafaf9', color: '#a8a29e', textDecoration: 'line-through', opacity: 0.5 }}
                    >
                      {size}
                    </button>
                  );
                })}
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '12px' }}>
              <div>
                <span style={{ fontSize: '11px', color: '#78716c' }}>Transferencia:</span>
                <p style={{ margin: 0, fontSize: '20px', fontWeight: 900, color: '#16a34a' }}>{formatARS(zoomProduct.precioTransferencia)}</p>
              </div>
              <div style={{ textAlign: 'right' }}>
                <span style={{ fontSize: '11px', color: '#78716c' }}>3 cuotas de:</span>
                <p style={{ margin: 0, fontSize: '14px', fontWeight: 800, color: '#2b2d42' }}>{formatARS(zoomProduct.cuotas3)}</p>
              </div>
            </div>

            <button
              onClick={() => {
                addToCart(zoomProduct, zoomSelectedSize || getProductSizes(zoomProduct).availableSizes[0]);
                setZoomProduct(null);
              }}
              style={{ width: '100%', marginTop: '14px', padding: '12px', borderRadius: '12px', background: '#ff6b6b', color: '#fff', border: 'none', fontSize: '13px', fontWeight: 800, cursor: 'pointer' }}
            >
              + Agregar al pedido · Talle {zoomSelectedSize}
            </button>
          </div>
        </div>
      )}

      {/* DRAWER DEL CARRITO PRO (CHECKOUT DIRECTO A WHATSAPP) */}
      {isDrawerOpen && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 60 }}>
          <div onClick={() => setIsDrawerOpen(false)} style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.5)' }} />
          <div style={{ position: 'absolute', top: 0, right: 0, bottom: 0, width: '100%', maxWidth: '420px', background: '#fff', boxShadow: '-4px 0 24px rgba(0,0,0,0.2)', display: 'flex', flexDirection: 'column' }}>
            
            {/* Header del Drawer */}
            <div style={{ padding: '16px', borderBottom: '1px solid #fed7aa', background: '#fffaf0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h2 style={{ margin: 0, fontSize: '16px', fontWeight: 800, fontFamily: 'Baloo 2, cursive' }}>Tu Pedido para WhatsApp</h2>
              <button onClick={() => setIsDrawerOpen(false)} style={{ border: 'none', background: '#f5f5f4', borderRadius: '50%', width: '32px', height: '32px', cursor: 'pointer', fontWeight: 800 }}>✕</button>
            </div>

            {/* Lista de ítems */}
            <div style={{ flex: 1, overflowY: 'auto', padding: '16px' }}>
              {cartList.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '40px 0', color: '#78716c' }}>
                  <p style={{ fontSize: '32px', margin: 0 }}>🧺</p>
                  <p style={{ fontWeight: 700 }}>Todavía no agregaste prendas</p>
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  {cartList.map(({ key, p, size, qty }) => (
                    <div key={key} style={{ display: 'flex', gap: '10px', alignItems: 'center', borderBottom: '1px solid #f5f5f4', paddingBottom: '10px' }}>
                      <div style={{ flex: 1 }}>
                        <b style={{ fontSize: '12px', display: 'block' }}>{p.nombre}</b>
                        <span style={{ fontSize: '11px', background: '#fef3c7', color: '#92400e', padding: '1px 6px', borderRadius: '4px', fontWeight: 800 }}>
                          Talle: {size}
                        </span>
                        <div style={{ fontSize: '12px', fontWeight: 800, marginTop: '4px' }}>
                          {formatARS((isCash ? p.precioTransferencia : p.precioLista) * qty)}
                        </div>
                      </div>

                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <button onClick={() => updateCartQty(key, -1)} style={{ width: '26px', height: '26px', borderRadius: '6px', border: '1px solid #e7e5e4', background: '#fff', cursor: 'pointer', fontWeight: 800 }}>-</button>
                        <span style={{ fontSize: '12px', fontWeight: 800 }}>{qty}</span>
                        <button onClick={() => updateCartQty(key, 1)} style={{ width: '26px', height: '26px', borderRadius: '6px', border: '1px solid #e7e5e4', background: '#fff', cursor: 'pointer', fontWeight: 800 }}>+</button>
                      </div>
                    </div>
                  ))}

                  {/* MINI CHECKOUT */}
                  <div style={{ marginTop: '16px', borderTop: '1px dashed #fed7aa', paddingTop: '16px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    <b style={{ fontSize: '12px', color: '#2b2d42' }}>Datos para coordinar por WhatsApp:</b>
                    
                    <input
                      type="text"
                      placeholder="Tu Nombre / Apodo (ej: Lucía)"
                      value={checkoutData.nombre}
                      onChange={(e) => setCheckoutData({ ...checkoutData, nombre: e.target.value })}
                      style={{ padding: '8px 12px', borderRadius: '8px', border: '1px solid #d6d3d1', fontSize: '12px' }}
                    />

                    <div style={{ display: 'flex', gap: '8px' }}>
                      <button
                        onClick={() => setCheckoutData({ ...checkoutData, metodoPago: 'transferencia' })}
                        style={{ flex: 1, padding: '8px', borderRadius: '8px', border: '1px solid #16a34a', background: isCash ? '#f0fdf4' : '#fff', color: '#16a34a', fontSize: '11px', fontWeight: 700, cursor: 'pointer' }}
                      >
                        💵 Transferencia
                      </button>
                      <button
                        onClick={() => setCheckoutData({ ...checkoutData, metodoPago: 'cuotas' })}
                        style={{ flex: 1, padding: '8px', borderRadius: '8px', border: '1px solid #2b2d42', background: !isCash ? '#f5f5f4' : '#fff', color: '#2b2d42', fontSize: '11px', fontWeight: 700, cursor: 'pointer' }}
                      >
                        💳 3 Cuotas
                      </button>
                    </div>

                    <div style={{ display: 'flex', gap: '8px' }}>
                      <button
                        onClick={() => setCheckoutData({ ...checkoutData, entrega: 'retiro' })}
                        style={{ flex: 1, padding: '8px', borderRadius: '8px', border: '1px solid #ffb703', background: checkoutData.entrega === 'retiro' ? '#fffbeb' : '#fff', fontSize: '11px', fontWeight: 700, cursor: 'pointer' }}
                      >
                        📍 Retiro en Glew
                      </button>
                      <button
                        onClick={() => setCheckoutData({ ...checkoutData, entrega: 'envio' })}
                        style={{ flex: 1, padding: '8px', borderRadius: '8px', border: '1px solid #ffb703', background: checkoutData.entrega === 'envio' ? '#fffbeb' : '#fff', fontSize: '11px', fontWeight: 700, cursor: 'pointer' }}
                      >
                        🚚 Envío a Domicilio
                      </button>
                    </div>

                    {checkoutData.entrega === 'envio' && (
                      <input
                        type="text"
                        placeholder="Localidad / Dirección de entrega"
                        value={checkoutData.direccion}
                        onChange={(e) => setCheckoutData({ ...checkoutData, direccion: e.target.value })}
                        style={{ padding: '8px 12px', borderRadius: '8px', border: '1px solid #d6d3d1', fontSize: '12px' }}
                      />
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Footer con Totales y Botón WhatsApp */}
            {cartList.length > 0 && (
              <div style={{ padding: '16px', borderTop: '1px solid #fed7aa', background: '#fffaf0' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px', fontSize: '12px' }}>
                  <span>{isCash ? 'Descuento aplicado:' : 'Precio Lista:'}</span>
                  <span style={{ fontWeight: 800, color: isCash ? '#16a34a' : '#2b2d42' }}>
                    {isCash ? \`Ahorrás \${formatARS(savings)}\` : formatARS(totalListPrice)}
                  </span>
                </div>
                
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '16px', fontWeight: 900, marginBottom: '12px' }}>
                  <span>Total a Pagar:</span>
                  <span style={{ color: isCash ? '#16a34a' : '#2b2d42' }}>{formatARS(finalTotal)}</span>
                </div>

                <button
                  onClick={sendWhatsAppOrder}
                  style={{ width: '100%', padding: '14px', borderRadius: '14px', background: '#25d366', color: '#fff', border: 'none', fontSize: '14px', fontWeight: 800, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', boxShadow: '0 4px 12px rgba(37,211,102,0.3)' }}
                >
                  <span>💬</span> Enviar Pedido a WhatsApp
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* TOAST FLOTANTE */}
      {toastMsg && (
        <div style={{ position: 'fixed', bottom: '24px', right: '16px', zIndex: 70, background: '#2b2d42', color: '#fff', padding: '10px 16px', borderRadius: '12px', fontSize: '12px', fontWeight: 700, boxShadow: '0 4px 16px rgba(0,0,0,0.2)' }}>
          {toastMsg}
        </div>
      )}
    </div>
  );
}

// SUB-COMPONENTE: TARJETA DE PRODUCTO CON SELECTOR DE TALLE (DISPONIBLES VS DESHABILITADOS)
function CardItem({ product, priceMode, onAdd, onZoom }) {
  const { allSizes, availableSizes } = getProductSizes(product);
  const [selectedSize, setSelectedSize] = useState(availableSizes[0] || 'Único');
  const [imgErr, setImgErr] = useState(false);

  return (
    <article style={{ background: '#fff', borderRadius: '16px', border: '1px solid #fed7aa', overflow: 'hidden', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', padding: '12px' }}>
      <div>
        {/* Imagen */}
        <div
          onClick={() => onZoom(product)}
          style={{ aspectRatio: '1', borderRadius: '12px', background: '#f5f5f4', overflow: 'hidden', cursor: 'pointer', position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
        >
          {product.imagen && !imgErr ? (
            <img src={product.imagen} alt={product.nombre} onError={() => setImgErr(true)} loading="lazy" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          ) : (
            <span style={{ fontSize: '40px' }}>{CATEGORY_EMOJIS[product.categoria] || '👕'}</span>
          )}
          <span style={{ position: 'absolute', top: '8px', left: '8px', background: 'rgba(255,255,255,0.9)', padding: '2px 8px', borderRadius: '999px', fontSize: '10px', fontWeight: 800 }}>
            {product.categoria}
          </span>
        </div>

        {/* Título */}
        <h4 onClick={() => onZoom(product)} style={{ margin: '10px 0 4px', fontSize: '13px', fontWeight: 800, cursor: 'pointer', lineHeight: 1.3 }}>
          {product.nombre}
        </h4>

        {/* Selector de Talles: Disponibles (seleccionables) vs Sin Stock (deshabilitados) */}
        <div style={{ marginTop: '8px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '10px', marginBottom: '3px' }}>
            <span style={{ fontWeight: 800, color: '#78716c' }}>Elegí el talle:</span>
            <span style={{ color: '#16a34a', fontWeight: 800, background: '#dcfce7', padding: '1px 6px', borderRadius: '99px' }}>
              ✓ Talle {selectedSize}
            </span>
          </div>

          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
            {allSizes.map((size) => {
              const isAvailable = availableSizes.includes(size);
              const isSelected = selectedSize === size;

              if (isAvailable) {
                return (
                  <button
                    key={size}
                    type="button"
                    onClick={() => setSelectedSize(size)}
                    title={'Talle ' + size + ' disponible - Clic para elegir'}
                    style={{
                      border: 'none',
                      padding: '4px 8px',
                      borderRadius: '8px',
                      fontSize: '11px',
                      fontWeight: 800,
                      cursor: 'pointer',
                      background: isSelected ? '#2b2d42' : '#f5f5f4',
                      color: isSelected ? '#fff' : '#2b2d42',
                      boxShadow: isSelected ? '0 2px 6px rgba(43,45,66,0.3)' : 'none',
                    }}
                  >
                    {size}
                  </button>
                );
              }

              // Sin stock: aparece en el listado pero NO se puede seleccionar (deshabilitado)
              return (
                <button
                  key={size}
                  type="button"
                  disabled
                  title={'Talle ' + size + ' (Sin stock actualmente)'}
                  style={{
                    border: '1px dashed #d6d3d1',
                    padding: '3px 7px',
                    borderRadius: '8px',
                    fontSize: '11px',
                    fontWeight: 700,
                    cursor: 'not-allowed',
                    background: '#fafaf9',
                    color: '#a8a29e',
                    textDecoration: 'line-through',
                    opacity: 0.5,
                  }}
                >
                  {size}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Precios: Formato exacto elegido por vos */}
      <div style={{ marginTop: '10px' }}>
        <div style={{ padding: '2px 0 6px' }}>
          <div>
            <span style={{ fontSize: '24px', fontWeight: 900, color: '#16a34a', display: 'block', lineHeight: 1 }}>
              {formatARS(product.precioTransferencia)}
            </span>
            <span style={{ fontSize: '11px', fontWeight: 700, color: '#57534e', display: 'block', marginTop: '4px' }}>
              Efectivo / Transferencia
            </span>
          </div>
          <div style={{ borderTop: '1px solid #f5f5f4', marginTop: '8px', paddingTop: '6px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '11px' }}>
            <span style={{ color: '#a8a29e', fontWeight: 500 }}>Lista: {formatARS(product.precioLista)}</span>
            <span style={{ color: '#0284c7', fontWeight: 900, fontSize: '13px' }}>3 cuotas de {formatARS(product.cuotas3)}</span>
          </div>
        </div>

        <button
          onClick={() => onAdd(product, selectedSize)}
          style={{ width: '100%', marginTop: '8px', padding: '8px', borderRadius: '10px', background: '#ffb703', color: '#2b2d42', border: 'none', fontSize: '12px', fontWeight: 800, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px' }}
        >
          <span>+</span> Agregar (Talle {selectedSize})
        </button>
      </div>
    </article>
  );
}`,
  },
  {
    id: 'discount-strikethrough-options',
    title: '🎨 4 Opciones de Descuento Tachado y Color que Resalta',
    filename: 'src/components/DiscountPriceBox.jsx',
    description:
      'Código de las 4 opciones pedidas por vos: Rosa Coral (#ff6b6b), Magenta Flúor (#e11d48), Naranja Fuego (#ea580c) y Violeta Neón (#7c3aed). Podés copiar directamente cualquiera de los 4 bloques JSX a tu tarjeta de producto o modal.',
    code: `import React from 'react';

// Formato de moneda
const formatARS = (n) =>
  n ? n.toLocaleString('es-AR', { style: 'currency', currency: 'ARS', maximumFractionDigits: 0 }) : '$0';

/**
 * ========================================================
 * OPCIÓN 1A: ROSA CORAL DOS SOLCITOS (#ff6b6b)
 * Tono oficial de la marca: precio lista tachado en coral
 * y pastilla suave "Descontás -$X.XXX".
 * ========================================================
 */
export function PricingBoxOption1A({ product }) {
  const discountAmount = Math.max(0, product.precioLista - product.precioTransferencia);

  return (
    <div className="p-3 rounded-2xl bg-gradient-to-br from-[#ffe5ec]/50 via-[#fffaf0] to-[#d8f3ff]/30 border-2 border-[#fed7aa] space-y-2">
      <div className="flex items-start justify-between gap-1.5">
        <div>
          <span className="text-[10px] font-bold text-[#2b2d42]/70 block">Efectivo o Transferencia:</span>
          <span className="text-2xl font-black text-[#25d366] font-brand">{formatARS(product.precioTransferencia)}</span>
        </div>
        <div className="flex flex-col items-end gap-0.5 shrink-0">
          <span className="text-[9px] font-extrabold text-[#15803d] bg-[#dcfce7] px-2 py-0.5 rounded-full border border-[#86efac]">
            Descuento Efectivo
          </span>
          <div className="flex items-center gap-1 mt-0.5">
            <span className="line-through text-[#ff6b6b] font-black text-xs decoration-2">
              {formatARS(product.precioLista)}
            </span>
            <span className="bg-[#ffe5ec] text-[#ff6b6b] border border-[#ffb4c2] font-black text-[10px] px-1.5 py-0.5 rounded-md">
              Descontás -{formatARS(discountAmount)}
            </span>
          </div>
        </div>
      </div>
      <div className="pt-1.5 border-t border-[#fed7aa]/60 flex items-center justify-between text-[11px]">
        <span className="text-[#2b2d42]/75">Lista: <b>{formatARS(product.precioLista)}</b></span>
        <span className="text-[#0284c7] font-black">3 cuotas de {formatARS(product.cuotas3)}</span>
      </div>
    </div>
  );
}

/**
 * ========================================================
 * OPCIÓN 1B: MAGENTA FLÚOR & % OFF (#e11d48)
 * El monto del descuento tachado directamente en magenta
 * vivo con pastilla roja/fucsia "-20% OFF".
 * ========================================================
 */
export function PricingBoxOption1B({ product }) {
  const discountAmount = Math.max(0, product.precioLista - product.precioTransferencia);
  const percent = product.precioLista > 0 ? Math.round((discountAmount / product.precioLista) * 100) : 0;

  return (
    <div className="p-3 rounded-2xl bg-gradient-to-br from-[#ffe5ec]/50 via-[#fffaf0] to-[#d8f3ff]/30 border-2 border-[#fed7aa] space-y-2">
      <div className="flex items-start justify-between gap-1.5">
        <div>
          <span className="text-[10px] font-bold text-[#2b2d42]/70 block">Efectivo o Transferencia:</span>
          <span className="text-2xl font-black text-[#25d366] font-brand">{formatARS(product.precioTransferencia)}</span>
        </div>
        <div className="flex flex-col items-end gap-0.5 shrink-0">
          <span className="text-[9px] font-extrabold text-[#15803d] bg-[#dcfce7] px-2 py-0.5 rounded-full border border-[#86efac]">
            Descuento Efectivo
          </span>
          <div className="flex items-center gap-1 mt-0.5">
            <span className="line-through text-[#e11d48] font-black text-xs decoration-2 decoration-[#e11d48]">
              -{formatARS(discountAmount)}
            </span>
            <span className="bg-[#e11d48] text-white font-black text-[10px] px-1.5 py-0.5 rounded-md">
              -{percent}% OFF
            </span>
          </div>
          <span className="text-[9px] text-stone-400 font-bold">Lista: {formatARS(product.precioLista)}</span>
        </div>
      </div>
      <div className="pt-1.5 border-t border-[#fed7aa]/60 flex items-center justify-between text-[11px]">
        <span className="text-[#2b2d42]/75">3 cuotas</span>
        <span className="text-[#0284c7] font-black">3 cuotas de {formatARS(product.cuotas3)}</span>
      </div>
    </div>
  );
}

/**
 * ========================================================
 * OPCIÓN 1C: NARANJA FUEGO & "¡AHORRÁS!" (#ea580c)
 * Foco en ahorro cálido y soleado: "Antes $XX.XXX" tachado
 * y pastilla naranja brillante "🔥 Ahorrás $X.XXX".
 * ========================================================
 */
export function PricingBoxOption1C({ product }) {
  const discountAmount = Math.max(0, product.precioLista - product.precioTransferencia);

  return (
    <div className="p-3 rounded-2xl bg-gradient-to-br from-[#ffe5ec]/40 via-[#fffaf0] to-[#ffedd5]/40 border-2 border-[#fed7aa] space-y-2">
      <div className="flex items-start justify-between gap-1.5">
        <div>
          <span className="text-[10px] font-bold text-[#2b2d42]/70 block">Efectivo o Transferencia:</span>
          <span className="text-2xl font-black text-[#25d366] font-brand">{formatARS(product.precioTransferencia)}</span>
        </div>
        <div className="flex flex-col items-end gap-0.5 shrink-0">
          <span className="text-[9px] font-extrabold text-[#15803d] bg-[#dcfce7] px-2 py-0.5 rounded-full border border-[#86efac]">
            Descuento Efectivo
          </span>
          <div className="flex items-center gap-1 mt-0.5">
            <span className="text-[10px] text-stone-400 font-bold">Antes:</span>
            <span className="line-through text-[#ea580c] font-black text-xs decoration-2 decoration-[#ea580c]">
              {formatARS(product.precioLista)}
            </span>
          </div>
          <span className="bg-[#ffedd5] text-[#ea580c] border border-[#fdba74] font-black text-[10px] px-1.5 py-0.5 rounded-md inline-flex items-center gap-0.5">
            <span>🔥</span> Ahorrás {formatARS(discountAmount)}
          </span>
        </div>
      </div>
      <div className="pt-1.5 border-t border-[#fed7aa]/60 flex items-center justify-between text-[11px]">
        <span className="text-[#2b2d42]/75">Lista: <b>{formatARS(product.precioLista)}</b></span>
        <span className="text-[#0284c7] font-black">3 cuotas de {formatARS(product.cuotas3)}</span>
      </div>
    </div>
  );
}

/**
 * ========================================================
 * OPCIÓN 1D: VIOLETA ELÉCTRICO NEÓN (#7c3aed)
 * Máximo contraste cromático frente al verde: tachado
 * en púrpura neón y pastilla lavanda "✂️ -$X.XXX desc.".
 * ========================================================
 */
export function PricingBoxOption1D({ product }) {
  const discountAmount = Math.max(0, product.precioLista - product.precioTransferencia);

  return (
    <div className="p-3 rounded-2xl bg-gradient-to-br from-[#ffe5ec]/40 via-[#fffaf0] to-[#ede9fe]/40 border-2 border-[#fed7aa] space-y-2">
      <div className="flex items-start justify-between gap-1.5">
        <div>
          <span className="text-[10px] font-bold text-[#2b2d42]/70 block">Efectivo o Transferencia:</span>
          <span className="text-2xl font-black text-[#25d366] font-brand">{formatARS(product.precioTransferencia)}</span>
        </div>
        <div className="flex flex-col items-end gap-0.5 shrink-0">
          <span className="text-[9px] font-extrabold text-[#15803d] bg-[#dcfce7] px-2 py-0.5 rounded-full border border-[#86efac]">
            Descuento Efectivo
          </span>
          <span className="line-through text-[#7c3aed] font-black text-xs decoration-2 decoration-[#8b5cf6] mt-0.5">
            {formatARS(product.precioLista)}
          </span>
          <span className="bg-[#ede9fe] text-[#7c3aed] border border-[#ddd6fe] font-black text-[10px] px-1.5 py-0.5 rounded-md inline-flex items-center gap-0.5">
            <span>✂️</span> -{formatARS(discountAmount)} desc.
          </span>
        </div>
      </div>
      <div className="pt-1.5 border-t border-[#fed7aa]/60 flex items-center justify-between text-[11px]">
        <span className="text-[#2b2d42]/75">Lista: <b>{formatARS(product.precioLista)}</b></span>
        <span className="text-[#0284c7] font-black">3 cuotas de {formatARS(product.cuotas3)}</span>
      </div>
    </div>
  );
}`,
  },
  {
    id: 'size-selector-code',
    title: '📏 1. Selector de Talles: Disponibles vs Sin Stock (Deshabilitados)',
    filename: 'src/components/SizeSelector.jsx (o para tu tarjeta de producto)',
    description:
      '¡Justo lo que pediste! Muestra todos los talles de la prenda: los que tienen stock se pueden clickear y seleccionar, y los que NO tienen stock aparecen en gris tachado y deshabilitados (no cliqueables).',
    code: `import React, { useState } from 'react';

// Curvas estándar de talles
const BABY_SIZES = ['RN', '3M', '6M', '9M', '12M'];
const KIDS_SIZES = ['2T', '3T', '4T', '6T', '8T', '10T'];

/**
 * Helper para obtener todos los talles potenciales vs talles con stock
 */
export function getProductSizesConfig(product) {
  const available = product.talles && product.talles.length ? product.talles : ['Único'];
  
  if (available.length === 1 && available[0].toLowerCase().includes('único')) {
    return { allSizes: ['Único'], availableSizes: ['Único'] };
  }

  // Detecta si es talle de bebé o de niño
  const isBaby = available.some(s => {
    const u = String(s).toUpperCase();
    return u === 'RN' || u.endsWith('M') || u.includes('-');
  }) || (product.categoria && ['Bodies', 'Ranita', 'Ajuar'].includes(product.categoria));

  const baseCurve = isBaby ? BABY_SIZES : KIDS_SIZES;
  const set = new Set([...baseCurve, ...available]);

  return {
    allSizes: Array.from(set),
    availableSizes: available,
  };
}

/**
 * Componente SizeSelector listo para insertar en tu Card o Modal
 */
export function SizeSelector({ product, selectedSize, onSelectSize }) {
  const { allSizes, availableSizes } = getProductSizesConfig(product);

  return (
    <div style={{ marginTop: '8px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '11px', marginBottom: '4px' }}>
        <span style={{ fontWeight: 800, color: '#2b2d42' }}>Elegí el talle:</span>
        <span style={{ color: '#15803d', fontWeight: 800, background: '#dcfce7', padding: '1px 8px', borderRadius: '99px', fontSize: '10px' }}>
          ✓ Talle {selectedSize}
        </span>
      </div>

      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', alignItems: 'center' }}>
        {allSizes.map((size) => {
          const isAvailable = availableSizes.includes(size);
          const isSelected = selectedSize === size;

          // 1. SI ESTÁ DISPONIBLE: Te deja seleccionarlo
          if (isAvailable) {
            return (
              <button
                key={size}
                type="button"
                onClick={() => onSelectSize(size)}
                title={'Talle ' + size + ' disponible - Clic para elegir'}
                style={{
                  border: isSelected ? '2px solid #ffb703' : '1px solid #fed7aa',
                  padding: '5px 10px',
                  borderRadius: '10px',
                  fontSize: '11px',
                  fontWeight: 900,
                  cursor: 'pointer',
                  background: isSelected ? '#2b2d42' : '#fffaf0',
                  color: isSelected ? '#ffffff' : '#2b2d42',
                  transform: isSelected ? 'scale(1.05)' : 'none',
                  transition: 'all 0.15s ease',
                  boxShadow: isSelected ? '0 2px 6px rgba(43,45,66,0.3)' : 'none',
                }}
              >
                {size}
              </button>
            );
          }

          // 2. SI NO ESTÁ DISPONIBLE: Aparece pero NO se puede seleccionar (deshabilitado)
          return (
            <button
              key={size}
              type="button"
              disabled={true}
              aria-disabled="true"
              title={'Talle ' + size + ' (Sin stock actualmente)'}
              style={{
                border: '1px dashed #d6d3d1',
                padding: '4px 9px',
                borderRadius: '10px',
                fontSize: '11px',
                fontWeight: 700,
                cursor: 'not-allowed',
                background: '#f5f5f4',
                color: '#a8a29e',
                textDecoration: 'line-through',
                opacity: 0.5,
                userSelect: 'none',
              }}
            >
              {size}
            </button>
          );
        })}
      </div>

      <div style={{ display: 'flex', gap: '12px', fontSize: '10px', color: '#78716c', marginTop: '6px' }}>
        <span>● Disponible</span>
        <span style={{ textDecoration: 'line-through', color: '#a8a29e' }}>Tachado = Sin stock</span>
      </div>
    </div>
  );
}`,
  },
  {
    id: 'cart-talles',
    title: '1. useCart.ts (Módulo separado si usas carpetas)',
    filename: 'src/hooks/useCart.ts',
    description:
      'Almacena prendas distinguiendo el talle seleccionado y persiste el pedido en localStorage para no perderlo al recargar.',
    code: `import { useState, useEffect } from 'react';

export interface CartItem {
  cartItemId: string; // ej: "1_6T" (id del producto + talle)
  product: any;
  selectedSize: string;
  quantity: number;
}

export function useCart() {
  const [items, setItems] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem('dos_solcitos_cart');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem('dos_solcitos_cart', JSON.stringify(items));
    } catch (e) {
      console.warn('Error localStorage', e);
    }
  }, [items]);

  const addToCart = (product: any, selectedSize: string) => {
    const size = selectedSize || product.talles?.[0] || 'Único';
    const cartItemId = \`\${product.id}_\${size}\`;

    setItems((prev) => {
      const existing = prev.find((i) => i.cartItemId === cartItemId);
      if (existing) {
        return prev.map((i) =>
          i.cartItemId === cartItemId ? { ...i, quantity: i.quantity + 1 } : i
        );
      }
      return [...prev, { cartItemId, product, selectedSize: size, quantity: 1 }];
    });
  };

  const updateQuantity = (cartItemId: string, delta: number) => {
    setItems((prev) =>
      prev
        .map((item) => {
          if (item.cartItemId === cartItemId) {
            const newQty = item.quantity + delta;
            return newQty > 0 ? { ...item, quantity: newQty } : null;
          }
          return item;
        })
        .filter(Boolean) as CartItem[]
    );
  };

  const clearCart = () => setItems([]);

  return { items, addToCart, updateQuantity, clearCart };
}`,
  },
  {
    id: 'whatsapp-generator',
    title: '2. Formato Profesional de Pedido WhatsApp',
    filename: 'src/utils/generateWhatsApp.ts',
    description:
      'Formatea el texto que se envía al +54 9 11 2350-4802 con el nombre del cliente, método de entrega, talles exactos y cálculo de ahorro por transferencia.',
    code: `export function generateWhatsAppOrderUrl(phone: string, items: any[], details: any) {
  const formatMoney = (val: number) =>
    val.toLocaleString('es-AR', { style: 'currency', currency: 'ARS', maximumFractionDigits: 0 });

  const totalList = items.reduce((acc, i) => acc + i.product.precioLista * i.quantity, 0);
  const totalCash = items.reduce((acc, i) => acc + i.product.precioTransferencia * i.quantity, 0);
  const isCash = details.paymentMethod === 'transferencia';
  const total = isCash ? totalCash : totalList;
  const savings = totalList - totalCash;

  const deliveryStr = details.deliveryMethod === 'retiro'
    ? '📍 Retiro en Glew'
    : \`🚚 Envío a Domicilio (\${details.deliveryAddress || 'a coordinar'})\`;

  const paymentStr = isCash
    ? \`💵 Transferencia/Efectivo (¡Ahorro de \${formatMoney(savings)}!)\`
    : \`💳 Tarjeta en 3 Cuotas de \${formatMoney(Math.round(totalList / 3))}\`;

  const productList = items
    .map(i => \`• \${i.quantity}x \${i.product.nombre}\\n  📏 Talle: \${i.selectedSize} | Subtotal: \${formatMoney((isCash ? i.product.precioTransferencia : i.product.precioLista) * i.quantity)}\`)
    .join('\\n');

  let text = \`☀️ *¡Hola Dos Solcitos! Quiero realizar este pedido:*\\n\\n\`;
  if (details.customerName) text += \`👤 *Cliente:* \${details.customerName}\\n\`;
  text += \`📦 *Prendas:*\n\${productList}\\n\\n\`;
  text += \`💳 *Pago:* \${paymentStr}\\n\`;
  text += \`🚚 *Entrega:* \${deliveryStr}\\n\`;
  if (details.notes) text += \`📝 *Notas:* \${details.notes}\\n\`;
  text += \`\\n💰 *TOTAL:* \${formatMoney(total)}\\n\\n¿Me confirman si hay stock para transferir? ¡Muchas gracias!\`;

  return \`https://wa.me/\${phone}?text=\${encodeURIComponent(text)}\`;
}`,
  },
  {
    id: 'image-fallback',
    title: '3. Componente de Imagen con Fallback Seguro',
    filename: 'src/components/CatalogImage.tsx',
    description:
      'Evita que Google Drive deje recuadros de fotos rotas cuando supera el límite de solicitudes por hora.',
    code: `import React, { useState } from 'react';

export const CatalogImage = ({ src, alt, category = 'Prendas' }) => {
  const [hasError, setHasError] = useState(false);

  if (!src || hasError) {
    return (
      <div style={{ width: '100%', height: '100%', background: '#fffbeb', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
        <span style={{ fontSize: '32px' }}>👶</span>
        <span style={{ fontSize: '10px', fontWeight: 800, color: '#78716c' }}>Dos Solcitos</span>
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      loading="lazy"
      onError={() => setHasError(true)}
      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
    />
  );
};`,
  },
];

export const CodeFixesGuide: React.FC = () => {
  const [activeSnippetId, setActiveSnippetId] = useState<string>('single-file-app');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const currentSnippet = SNIPPETS.find((s) => s.id === activeSnippetId) || SNIPPETS[0];

  const handleCopy = (code: string, id: string) => {
    navigator.clipboard.writeText(code);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="max-w-6xl mx-auto py-6 px-4 sm:px-6 space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-amber-500 via-orange-400 to-rose-400 rounded-3xl p-6 sm:p-8 text-white shadow-md flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 backdrop-blur-xs text-xs font-bold mb-2">
            <Sparkles className="w-3.5 h-3.5 text-amber-200" />
            Código Listo para Producción
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold font-brand tracking-tight">
            Código Completo para tu Proyecto en Vercel
          </h2>
          <p className="text-xs sm:text-sm text-amber-100 max-w-2xl mt-1">
            Tenés la opción de copiar el <strong>archivo único completo (Drop-in)</strong> para reemplazar tu `App.jsx` en 1 minuto, o utilizar los módulos separados si tu proyecto está estructurado en varias carpetas.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2 shrink-0">
          <a
            href="/dossolcitosv2.zip"
            download="dossolcitosv2.zip"
            className="flex items-center gap-2 px-5 py-3 rounded-2xl bg-white hover:bg-stone-100 text-stone-900 text-xs font-black transition-transform active:scale-95 shadow-lg border border-white"
          >
            <Download className="w-4 h-4 text-emerald-600" />
            <span>Descargar dossolcitosv2.zip</span>
          </a>

          <button
            onClick={() => handleCopy(currentSnippet.code, currentSnippet.id)}
            className="flex items-center gap-2 px-5 py-3 rounded-2xl bg-stone-900 hover:bg-stone-800 text-white text-xs font-black transition-transform active:scale-95 shadow-lg"
          >
            {copiedId === currentSnippet.id ? (
              <>
                <Check className="w-4 h-4 text-emerald-400" />
                <span>¡Copiado con éxito!</span>
              </>
            ) : (
              <>
                <Copy className="w-4 h-4" />
                <span>Copiar {currentSnippet.filename}</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Snippets Navigation Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        {SNIPPETS.map((snippet) => (
          <button
            key={snippet.id}
            onClick={() => setActiveSnippetId(snippet.id)}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
              activeSnippetId === snippet.id
                ? 'bg-stone-900 text-white shadow-xs'
                : 'bg-white text-stone-700 hover:bg-stone-100 border border-stone-200'
            }`}
          >
            {snippet.isSingleFileDropIn ? (
              <span className="text-amber-400 font-black">⭐</span>
            ) : (
              <FileCode className="w-4 h-4 text-amber-500" />
            )}
            <span>{snippet.title}</span>
          </button>
        ))}
      </div>

      {/* Active Snippet Display */}
      <div className="bg-stone-900 text-stone-100 rounded-3xl overflow-hidden border border-stone-800 shadow-xl">
        {/* Code Header Bar */}
        <div className="px-6 py-4 bg-stone-950 border-b border-stone-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="font-mono text-xs font-bold text-amber-400">
                {currentSnippet.filename}
              </span>
              <span className="text-[10px] bg-stone-800 text-stone-400 px-2 py-0.5 rounded">
                React / JSX
              </span>
              {currentSnippet.isSingleFileDropIn && (
                <span className="text-[10px] bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 px-2 py-0.5 rounded font-bold">
                  Reemplazo Total Recomendado
                </span>
              )}
            </div>
            <p className="text-xs text-stone-400">{currentSnippet.description}</p>
          </div>

          <button
            onClick={() => handleCopy(currentSnippet.code, currentSnippet.id)}
            className="flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-amber-500 hover:bg-amber-400 text-stone-950 transition-colors shrink-0 shadow-xs"
          >
            {copiedId === currentSnippet.id ? (
              <>
                <Check className="w-4 h-4 text-stone-950" />
                <span>¡Copiado!</span>
              </>
            ) : (
              <>
                <Copy className="w-4 h-4" />
                <span>Copiar Todo el Código</span>
              </>
            )}
          </button>
        </div>

        {/* Code Content */}
        <pre className="p-6 font-mono text-xs text-emerald-300/90 overflow-x-auto leading-relaxed max-h-[650px] overflow-y-auto selection:bg-amber-500/30">
          <code>{currentSnippet.code}</code>
        </pre>
      </div>

      {/* Logo sin fondo: Descarga directa y Truco CSS */}
      <div className="bg-gradient-to-br from-[#ffe5ec] via-[#fff3c4] to-[#d8f3ff] rounded-2xl border border-[#fed7aa] p-6 shadow-sm">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-2 text-center md:text-left flex-1">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/90 text-[#2b2d42] text-xs font-black shadow-xs">
              <span>☀️</span>
              <span>¡Logo con fondo transparente listo!</span>
            </div>
            <h3 className="text-base sm:text-lg font-black text-[#2b2d42]">
              Tu logo ahora se integra perfecto sobre el degradé pastel
            </h3>
            <p className="text-xs text-[#2b2d42]/85 max-w-xl leading-relaxed">
              Le quitamos todo el fondo blanco rectangular para que no corte los colores pasteles. Además, en el código agregamos <code className="bg-white/80 px-1.5 py-0.5 rounded font-mono text-[11px] font-bold text-[#ff6b6b]">mixBlendMode: 'multiply'</code>, una propiedad mágica de CSS que hace que cualquier pixel blanco sea invisible sobre cualquier degradé claro.
            </p>
            <div className="pt-2 flex flex-wrap items-center gap-3 justify-center md:justify-start">
              <a
                href="/logo.png"
                download="logo-dos-solcitos-transparente.png"
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#2b2d42] hover:bg-stone-800 text-white text-xs font-black shadow-md transition-transform active:scale-95"
              >
                <Download className="w-4 h-4 text-[#ffb703]" />
                Descargar logo.png sin fondo
              </a>
              <span className="text-[11px] text-[#2b2d42]/70 font-medium">
                (Guardalo en tu carpeta <code className="font-mono bg-white/60 px-1 py-0.5 rounded">public/logo.png</code>)
              </span>
            </div>
          </div>

          {/* Vista previa en vivo del logo sobre el fondo degradé */}
          <div className="p-4 bg-white/40 backdrop-blur-xs rounded-2xl border border-white/60 flex flex-col items-center justify-center shrink-0 shadow-inner">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#2b2d42]/60 mb-2">
              Vista previa sobre el degradé
            </span>
            <img
              src="/logo.png"
              alt="Logo Dos Solcitos transparente"
              className="h-28 w-auto object-contain drop-shadow-xs"
              style={{ mixBlendMode: 'multiply' }}
            />
          </div>
        </div>
      </div>

      {/* Guía rápida de implementación en 3 pasos */}
      <div className="bg-white rounded-2xl border border-stone-200 p-6 space-y-3">
        <h3 className="text-sm font-bold text-stone-900 font-brand">
          ¿Cómo aplico esto en mi proyecto de Vercel?
        </h3>
        <ol className="list-decimal list-inside space-y-2 text-xs text-stone-600">
          <li>
            <strong>Copiá el código</strong> del archivo <code className="bg-stone-100 px-1 py-0.5 rounded text-stone-800 font-mono">App.jsx</code> de la primera pestaña de arriba.
          </li>
          <li>
            Abrí tu proyecto en VS Code o en GitHub, abrí el archivo <code className="bg-stone-100 px-1 py-0.5 rounded text-stone-800 font-mono">src/App.jsx</code> (o <code className="bg-stone-100 px-1 py-0.5 rounded text-stone-800 font-mono">src/App.tsx</code>) y <strong>reemplazá todo su contenido</strong> pegando este código nuevo.
          </li>
          <li>
            Hacé <code className="bg-stone-100 px-1 py-0.5 rounded text-stone-800 font-mono">git commit -m "Mejoras de talles, logo en degrade y carrito WhatsApp"</code> y <code className="bg-stone-100 px-1 py-0.5 rounded text-stone-800 font-mono">git push</code>. Vercel reconstruirá tu sitio automáticamente en 30 segundos. ¡Listo!
          </li>
        </ol>
      </div>
    </div>
  );
};
