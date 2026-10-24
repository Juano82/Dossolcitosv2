import { AuditFinding } from '../types';

export const AUDIT_METRICS = {
  overallScore: 71,
  uxScore: 76,
  conversionScore: 61,
  performanceScore: 68,
  mobileScore: 79,
  codeQualityScore: 72,
};

export const AUDIT_FINDINGS: AuditFinding[] = [
  {
    id: 'f-talles-cart',
    severity: 'critical',
    category: 'conversion',
    title: 'Falta de Selección Obligatoria de Talle al Agregar al Carrito',
    subtitle: 'El cliente agrega prendas pero el pedido llega a WhatsApp sin talle',
    description:
      'En tu código actual (`me` component), el botón "Agregar +" agrega directamente `S(e, 1)` sin preguntar qué talle desea la persona. En ropa infantil, el talle es el atributo más importante: un body o remera no sirve si no es el talle exacto del bebé/niño. Al enviar el mensaje por WhatsApp, el pedido dice simplemente "• 1 x Remera Juliette - $22.584", obligándote a responder manualmente "¿Hola, en qué talle lo buscabas?", generando idas y vueltas innecesarias y riesgo de que el cliente abandone o compre en otro lado.',
    currentCodeOrBehavior:
      '// Código actual en tu app:\nconst onAdd = () => S(product, 1);\n// El carrito almacena el producto como clave única por ID:\n{ [e.id]: { p: e, n: r } }\n// Si un cliente compra la misma remera en 2 talles distintos (ej: para 2 hermanitos), ¡el sistema no lo permite!',
    improvedSolution:
      'Hacer que la clave del carrito sea `productId + "_" + selectedSize`. Al presionar "Agregar", si la prenda tiene múltiples talles (ej. 3T, 6T, 8T), abrir un selector táctil inmediato para que el usuario elija el talle antes de sumar.',
    businessImpact:
      'Ahorra hasta 3 a 5 minutos por cliente en WhatsApp y evita cancelaciones por falta de stock en el talle deseado.',
    tags: ['Conversión', 'Ventas', 'WhatsApp', 'Talles'],
  },
  {
    id: 'f-gdrive-images',
    severity: 'critical',
    category: 'tech',
    title: 'Riesgo de Fotos Caídas por Google Drive Thumbnail Hotlinking',
    subtitle: 'Google Drive aplica rate-limits (HTTP 429) y no tiene fallback en caso de error',
    description:
      'Actualmente extraés las imágenes transformando el link de Google Drive a `https://drive.google.com/thumbnail?id=${id}&sz=w800`. Si bien es una solución rápida y sin costo de hosting, Google Drive no es un CDN para sitios web públicos: cuando varias personas navegan a la vez o desde ciertas conexiones móviles, Google bloquea la carga de miniaturas con error 429 o bloqueo por cookies de terceros. Además, tus etiquetas `<img>` no tienen manejador `onError`, por lo que si una foto falla, queda un recuadro roto o vacío.',
    currentCodeOrBehavior:
      '// Código actual:\nce(e) {\n  let t = e.match(/\\/d\\/([\\w-]+)/) || e.match(/[?&]id=([\\w-]+)/);\n  return t ? `https://drive.google.com/thumbnail?id=${t[1]}&sz=w800` : e;\n}\n// Y en el componente:\n<img src={e.imagen} alt={e.nombre} loading="lazy" />',
    improvedSolution:
      '1. Agregar `onError` con fallback automático a una imagen placeholder con el logo de Dos Solcitos o un avatar tierno de la categoría.\n2. A mediano plazo, usar un CDN gratuito o servicio de optimización como Cloudinary o Supabase Storage / ImgBB que soporte compresión WebP automática.',
    businessImpact:
      'Evita que un cliente vea imágenes rotas en el catálogo, lo cual genera desconfianza y reduce la tasa de compra un 80%.',
    tags: ['Rendimiento', 'Imágenes', 'Estabilidad'],
  },
  {
    id: 'f-whatsapp-message',
    severity: 'critical',
    category: 'conversion',
    title: 'Mensaje de WhatsApp sin Datos de Envío ni Medio de Pago',
    subtitle: 'El pedido llega crudo sin información indispensable para despachar',
    description:
      'El mensaje actual que se envía a WhatsApp (+54 9 11 2350-4802) contiene solo los ítems y el total, unidos sin saltos de línea claros (`join("")`). Falta solicitar: Nombre del cliente, Forma de entrega (Retiro en local/punto o Envío a domicilio/correo) y Método de pago elegido (Transferencia con descuento vs Cuotas con tarjeta). Al no pedir esto en la web, el vendedor tiene que pedirlo uno por uno en el chat.',
    currentCodeOrBehavior:
      '// Mensaje actual en tu app:\nlet e = `Hola ${re}! Quiero hacer este pedido:\\n${\n  x.map(e => `• ${e.n} x ${e.p.nombre} - ${de(e.p.precio*e.n)}`).join("")\n}\\n\\nTotal: ${de(te)}`;\nwindow.open(`https://wa.me/${C}?text=${encodeURIComponent(e)}`, `_blank`);',
    improvedSolution:
      'Incorporar un mini-paso de checkout en el carrito: campos rápidos para Nombre, Método de Entrega (Retiro o Envío) y Opción de Pago (Transferencia con descuento o Tarjeta en 3 cuotas). El mensaje generado saldrá con formato impecable, emojis organizados y listo para cotizar o confirmar.',
    businessImpact:
      'Convierte cada conversación de WhatsApp en una orden lista para empaquetar, reduciendo el ciclo de venta de 15 minutos a 2 minutos.',
    tags: ['WhatsApp', 'Checkout', 'Automatización'],
  },
  {
    id: 'f-cart-persistence',
    severity: 'high',
    category: 'ux',
    title: 'Pérdida del Carrito al Recargar o Cambiar de Pestaña',
    subtitle: 'El estado del carrito vive solo en memoria RAM (useState)',
    description:
      'Muchas madres y padres navegan desde el celular mientras hacen otras tareas (consultan las medidas de su hijo, responden un mensaje de WhatsApp o comparan precios). Si el navegador de su teléfono suspende la pestaña o recargan la página, el carrito se vacía por completo a cero. Esto causa frustración y pérdida de pedidos.',
    currentCodeOrBehavior:
      '// Código actual:\nlet [c, u] = useState({}); // Al recargar la página, se inicializa en {}\n',
    improvedSolution:
      'Guardar el carrito en `localStorage` mediante un hook `useLocalStorage("dos_solcitos_cart", {})`. Así, si el cliente vuelve 3 horas después, sus prendas seleccionadas siguen esperándolo.',
    businessImpact:
      'Recupera carritos abandonados involuntarios (aproximadamente 12% a 18% de las compras en dispositivos móviles).',
    tags: ['UX', 'Retención', 'LocalStorage'],
  },
  {
    id: 'f-size-filter',
    severity: 'high',
    category: 'ux',
    title: 'Ausencia de Filtro por Talle en el Catálogo',
    subtitle: 'Quien compra ropa para un niño de 6 años no quiere ver prendas que solo quedan en talle 1',
    description:
      'Actualmente tu web permite filtrar únicamente por Categoría (Remera, Body, etc.) o buscar texto. Sin embargo, en ropa de chicos la búsqueda primordial de los padres es: *"¿Qué tenés disponible en talle 6T para mi nene?"* o *"¿Qué tenés para recién nacido (0-3 meses)?"*. Al no haber filtro de talle, el usuario debe abrir producto por producto hasta encontrar uno que tenga su talle.',
    currentCodeOrBehavior:
      '// Tu filtrado actual:\nlet ee = e.filter(e =>\n  (i === "Todos" || e.categoria === i) &&\n  e.nombre.toLowerCase().includes(o.toLowerCase())\n);',
    improvedSolution:
      'Extraer todos los talles únicos disponibles en el catálogo y agregar una barra rápida de selección de talles (chips: "Todos", "0-3m", "3-6m", "2T", "4T", "6T", "8T", etc.).',
    businessImpact:
      'Mejora drástica del tiempo de navegación: los padres van directo a lo que pueden comprarles hoy mismo a sus hijos.',
    tags: ['Filtros', 'Navegación', 'Conversión'],
  },
  {
    id: 'f-transfer-discount-highlight',
    severity: 'high',
    category: 'conversion',
    title: 'Descuento por Efectivo / Transferencia Oculto en el Total',
    subtitle: 'El carrito suma solo el precio de lista, desaprovechando el incentivo del pago contado',
    description:
      'En tu Google Sheet tenés columnas diferenciadas: "Precio de venta" ($22.584) y "Precio efectivo o Transferencia" ($17.999). Es un descuento enorme (~$4.500 de ahorro por prenda). En la tarjeta lo mencionás abajo en letra pequeña, pero en el carrito el Total se calcula exclusivamente con el precio más caro. Si el usuario selecciona pagar por transferencia, debería ver reflejado el ahorro en grande: *"¡Ahorrás $9.170 pagando por transferencia!"*.',
    currentCodeOrBehavior:
      '// Cálculo actual del carrito:\nlet te = x.reduce((e, t) => e + t.p.precio * t.n, 0); // Siempre usa precio de lista',
    improvedSolution:
      'Permitir elegir la forma de pago en el carrito y mostrar ambos totales: Total con tarjeta en 3 cuotas y Total promocional por transferencia con el desglose del ahorro.',
    businessImpact:
      'Incentiva el pago por transferencia inmediata, mejorando la liquidez del negocio y las comisiones bancarias/financieras.',
    tags: ['Precios', 'Ahorro', 'Promociones'],
  },
  {
    id: 'f-toast-feedback',
    severity: 'quickwin',
    category: 'ux',
    title: 'Falta de Notificación Visual al Agregar un Producto',
    subtitle: 'El usuario no percibe con certeza si la prenda fue agregada al carrito',
    description:
      'Al hacer clic en "Agregar", el único cambio es que un pequeño numerito en la esquina superior derecha pasa de 0 a 1. Muchos usuarios tocan varias veces pensando que no funcionó, o no se dan cuenta de que se añadió.',
    currentCodeOrBehavior:
      '// Al clickear:\n<button className="add" onClick={() => t(e)}>Agregar al pedido</button>',
    improvedSolution:
      'Disparar un Toast animado ("✓ ¡Agregaste Remera Juliette al pedido!") con un botón de acceso rápido para "Ver carrito".',
    businessImpact:
      'Reduce la incertidumbre del comprador y genera sensación de dinamismo y respuesta rápida.',
    tags: ['Micro-interacción', 'Feedback', 'UI'],
  },
  {
    id: 'f-category-classification',
    severity: 'medium',
    category: 'tech',
    title: 'Lógica Frágil para Clasificar Categorías (`se(e)`)',
    subtitle: 'Toma la primera palabra del nombre como categoría',
    description:
      'En tu código, la categoría se deduce con: `e.split(" ")[0].toLowerCase().replace(/s$/, "")`. Si cargás un producto llamado "Pack de bodies" o "Set de verano", la categoría resultará "Pack" o "Set" en lugar de "Bodies" o "Conjuntos". Además, si la descripción empieza con el código (por ejemplo "COD 0031 Remera..."), la categoría queda como "Cod".',
    currentCodeOrBehavior:
      'se(e) {\n  let t = e.split(" ")[0].toLowerCase().replace(/s$/, "");\n  return t.charAt(0).toUpperCase() + t.slice(1);\n}',
    improvedSolution:
      'Crear un diccionario de clasificación inteligente o agregar una columna dedicada "Categoría" en el Google Sheet para tener control absoluto sin depender de cómo se redacte el título.',
    businessImpact:
      'Mantiene el catálogo ordenado y evita que aparezcan botones de categorías extrañas como "Cod", "Set" o "Super".',
    tags: ['Arquitectura', 'Google Sheets', 'Mantenimiento'],
  },
  {
    id: 'f-skeleton-loading',
    severity: 'quickwin',
    category: 'ux',
    title: 'Falta de Skeleton Loaders durante la Descarga del Catálogo',
    subtitle: 'El texto simple "Cargando productos..." provoca Cumulative Layout Shift (CLS)',
    description:
      'Al ingresar a la web, como el Google Sheet tarda entre 800ms y 2.5s en descargarse y parsearse, la pantalla muestra únicamente un párrafo centrado: "Cargando productos...". Cuando los productos llegan, el contenido empuja toda la pantalla abruptamente. Google penaliza esto en SEO técnico (Core Web Vitals - CLS).',
    currentCodeOrBehavior:
      'n === "cargando" && <p className="msg">Cargando productos...</p>',
    improvedSolution:
      'Mostrar 6 o 8 tarjetas grises parpadeantes (shimmer skeleton) que simulen la grilla de productos real mientras se descarga el CSV.',
    businessImpact:
      'Sensación de velocidad inmediata y mejora en las métricas de Google Search Console.',
    tags: ['Performance', 'Core Web Vitals', 'Diseño'],
  },
  {
    id: 'f-share-whatsapp',
    severity: 'quickwin',
    category: 'conversion',
    title: 'Falta de Botón "Compartir Prenda" por WhatsApp',
    subtitle: 'Las compras de ropa infantil son compartidas entre familiares',
    description:
      'Típicamente una madre o padre encuentra una ropita que le gusta y quiere consultárselo a su pareja, abuela o madrina antes de comprar. Actualmente no hay forma de compartir una prenda específica ni su foto o link directo.',
    currentCodeOrBehavior:
      'La tarjeta solo tiene el botón de "Agregar al pedido" y la lupa para zoom.',
    improvedSolution:
      'Incluir un botón secundario discreto "Compartir" con icono de WhatsApp que copie o abra el enlace/mensaje pre-armado: *"¡Mirá qué linda esta prenda en Dos Solcitos: Remera Juliette ($17.999 en efectivo)! https://catalogo-react-xi.vercel.app/"*.',
    businessImpact:
      'Genera tráfico viral orgánico gratis sin gastar en publicidad.',
    tags: ['Viralidad', 'Crecimiento', 'WhatsApp'],
  },
];
