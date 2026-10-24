import { Product } from '../types';

const SHEET_CSV_URL =
  'https://docs.google.com/spreadsheets/d/1H09L_d_OKheqK42e8p-d4s7yclIXy6OVt5bcdq37Ev4/export?format=csv';

export const WHATSAPP_PHONE = '5491123504802';
export const BRAND_NAME = 'Dos Solcitos';

// Pre-seeded fallback data based on the real catalog from the user's Google Sheet
// (Guarantees instant rendering even if Google Sheets is slow or throttled)
export const FALLBACK_PRODUCTS: Product[] = [
  {
    id: 1,
    codigo: 'COD 0031',
    nombre: 'Remera Juliette marca Gonper´s color Lila',
    categoria: 'Remeras',
    precioLista: 22584,
    precioTransferencia: 17999,
    cuotas3: 7528,
    talles: ['6T', '8T'],
    stock: 2,
    imagenPrincipal:
      'https://images.unsplash.com/photo-1596870230751-ebdfce98ec42?w=800&auto=format&fit=crop&q=80',
    imagenes: [
      'https://images.unsplash.com/photo-1596870230751-ebdfce98ec42?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1519238263530-99bdd11df2ea?w=800&auto=format&fit=crop&q=80',
    ],
    descripcion: 'Algodón peinado de primera calidad con detalle bordado Juliette.',
  },
  {
    id: 2,
    codigo: 'COD 0031-R',
    nombre: 'Remera Juliette marca Gonper´s color Rosa',
    categoria: 'Remeras',
    precioLista: 22584,
    precioTransferencia: 17999,
    cuotas3: 7528,
    talles: ['6T', '8T'],
    stock: 2,
    imagenPrincipal:
      'https://images.unsplash.com/photo-1519238263530-99bdd11df2ea?w=800&auto=format&fit=crop&q=80',
    imagenes: [
      'https://images.unsplash.com/photo-1519238263530-99bdd11df2ea?w=800&auto=format&fit=crop&q=80',
    ],
    descripcion: 'Remera suave en tono rosa pastel con mangas con detalle.',
  },
  {
    id: 3,
    codigo: 'COD 60-K',
    nombre: 'Remeras Teens M/C marca Gonper´s color Gris diseño Kitty',
    categoria: 'Remeras',
    precioLista: 22584,
    precioTransferencia: 17999,
    cuotas3: 7528,
    talles: ['4T', '6T', '8T'],
    stock: 3,
    imagenPrincipal:
      'https://images.unsplash.com/photo-1503919545889-aef636e10ad4?w=800&auto=format&fit=crop&q=80',
    imagenes: [
      'https://images.unsplash.com/photo-1503919545889-aef636e10ad4?w=800&auto=format&fit=crop&q=80',
    ],
    descripcion: 'Remera gris melange con estampa suave al tacto.',
  },
  {
    id: 4,
    codigo: 'COD 60-M',
    nombre: 'Remeras Teens M/C marca Gonper´s color Gris diseño Mickey & Minnie',
    categoria: 'Remeras',
    precioLista: 22584,
    precioTransferencia: 17999,
    cuotas3: 7528,
    talles: ['6T'],
    stock: 1,
    imagenPrincipal:
      'https://images.unsplash.com/photo-1622290291468-a28f7a7dc6a8?w=800&auto=format&fit=crop&q=80',
    imagenes: [
      'https://images.unsplash.com/photo-1622290291468-a28f7a7dc6a8?w=800&auto=format&fit=crop&q=80',
    ],
    descripcion: 'Diseño clásico retro con corte unisex cómodo para juego.',
  },
  {
    id: 5,
    codigo: 'COD 028',
    nombre: 'Remera Berlín marca Gonper´s color Rojo',
    categoria: 'Remeras',
    precioLista: 22584,
    precioTransferencia: 17999,
    cuotas3: 7528,
    talles: ['3T', '4T'],
    stock: 2,
    imagenPrincipal:
      'https://images.unsplash.com/photo-1578632767115-351597cf2477?w=800&auto=format&fit=crop&q=80',
    imagenes: [
      'https://images.unsplash.com/photo-1578632767115-351597cf2477?w=800&auto=format&fit=crop&q=80',
    ],
    descripcion: 'Color rojo vibrante, cuello reforzado y costuras dobles.',
  },
  {
    id: 6,
    codigo: 'COD PACK-BODIES',
    nombre: 'Pack Bodies de Algodón Peinado x3 Unidades',
    categoria: 'Bodies',
    precioLista: 26500,
    precioTransferencia: 21900,
    cuotas3: 8833,
    talles: ['0-3m', '3-6m', '6-9m'],
    stock: 4,
    imagenPrincipal:
      'https://images.unsplash.com/photo-1522771930-78848d9293e8?w=800&auto=format&fit=crop&q=80',
    imagenes: [
      'https://images.unsplash.com/photo-1522771930-78848d9293e8?w=800&auto=format&fit=crop&q=80',
    ],
    descripcion: 'Broches metálicos libres de níquel en la entrepierna, 100% hipoalergénico.',
  },
  {
    id: 7,
    codigo: 'COD CONJ-POLAR',
    nombre: 'Conjunto Enterito Plush Soft Abrigado con Capucha',
    categoria: 'Conjuntos',
    precioLista: 34900,
    precioTransferencia: 28900,
    cuotas3: 11633,
    talles: ['3-6m', '6-12m', '12-18m'],
    stock: 3,
    imagenPrincipal:
      'https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?w=800&auto=format&fit=crop&q=80',
    imagenes: [
      'https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?w=800&auto=format&fit=crop&q=80',
    ],
    descripcion: 'Súper abrigado para días frescos, fácil apertura con cierre frontal.',
  },
  {
    id: 8,
    codigo: 'COD PANT-JOGGER',
    nombre: 'Pantalón Jogger Rústico con Cordón Ajustable',
    categoria: 'Pantalones',
    precioLista: 19800,
    precioTransferencia: 15800,
    cuotas3: 6600,
    talles: ['2T', '4T', '6T', '8T'],
    stock: 5,
    imagenPrincipal:
      'https://images.unsplash.com/photo-1508296695146-257a814070b4?w=800&auto=format&fit=crop&q=80',
    imagenes: [
      'https://images.unsplash.com/photo-1508296695146-257a814070b4?w=800&auto=format&fit=crop&q=80',
    ],
    descripcion: 'Cintura elástica ancha que no aprieta la pancita, puños de ribb.',
  },
];

// Helper to convert Google Drive URL to direct thumbnail
export function formatDriveImageUrl(rawUrl: string): string {
  if (!rawUrl) return '';
  const match = rawUrl.match(/\/d\/([\w-]+)/) || rawUrl.match(/[?&]id=([\w-]+)/);
  if (match && match[1]) {
    return `https://drive.google.com/thumbnail?id=${match[1]}&sz=w800`;
  }
  return rawUrl;
}

// Robust CSV parser handling quotes, commas and multiple lines
function parseCSV(text: string): string[][] {
  const rows: string[][] = [];
  let currentRow: string[] = [];
  let currentVal = '';
  let insideQuotes = false;

  for (let i = 0; i < text.length; i++) {
    const char = text[i];
    const nextChar = text[i + 1];

    if (insideQuotes) {
      if (char === '"' && nextChar === '"') {
        currentVal += '"';
        i++;
      } else if (char === '"') {
        insideQuotes = false;
      } else {
        currentVal += char;
      }
    } else {
      if (char === '"') {
        insideQuotes = true;
      } else if (char === ',') {
        currentRow.push(currentVal.trim());
        currentVal = '';
      } else if (char === '\n') {
        currentRow.push(currentVal.trim());
        rows.push(currentRow);
        currentRow = [];
        currentVal = '';
      } else if (char !== '\r') {
        currentVal += char;
      }
    }
  }

  if (currentVal || currentRow.length > 0) {
    currentRow.push(currentVal.trim());
    rows.push(currentRow);
  }

  return rows;
}

// Classify category intelligently based on name keywords
export function detectCategory(nombre: string): string {
  const n = nombre.toLowerCase();
  if (n.includes('remera') || n.includes('remeron') || n.includes('chomba')) return 'Remeras';
  if (n.includes('body') || n.includes('ranita') || n.includes('bebe') || n.includes('babero')) return 'Bodies';
  if (n.includes('conjunto') || n.includes('enterito') || n.includes('plush') || n.includes('jumper')) return 'Conjuntos';
  if (n.includes('pantalon') || n.includes('jogger') || n.includes('calza') || n.includes('short') || n.includes('bermuda')) return 'Pantalones';
  if (n.includes('vestido')) return 'Vestidos';
  if (n.includes('campera') || n.includes('buzo') || n.includes('abrigo') || n.includes('polar')) return 'Abrigos';
  if (n.includes('zapatilla') || n.includes('zapato') || n.includes('sandalia')) return 'Calzado';
  return 'Prendas';
}

function parseNumber(val: any): number {
  if (!val) return 0;
  const cleaned = String(val).replace(/[^\d,]/g, '').replace(',', '.');
  return Number(cleaned) || 0;
}

export async function fetchCatalogFromSheet(): Promise<{
  products: Product[];
  fromLiveSheet: boolean;
  timestamp: string;
}> {
  try {
    const response = await fetch(SHEET_CSV_URL, { cache: 'no-store' });
    if (!response.ok) {
      throw new Error(`Google Sheets respondió con status ${response.status}`);
    }

    const csvText = await response.text();
    const rows = parseCSV(csvText);

    if (rows.length < 2) {
      throw new Error('El archivo CSV está vacío o sin filas de datos');
    }

    const headers = rows[0].map((h) => h.toLowerCase().trim());

    // Helper to find column index by matching prefixes
    const getColIndex = (...names: string[]): number => {
      for (let i = 0; i < headers.length; i++) {
        if (names.some((name) => headers[i].includes(name.toLowerCase()))) {
          return i;
        }
      }
      return -1;
    };

    const descIdx = getColIndex('descripcion', 'nombre', 'articulo');
    const codeIdx = getColIndex('codigo', 'cod');
    const sizeIdx = getColIndex('talle');
    const priceListIdx = getColIndex('precio de venta', 'precio lista');
    const priceCashIdx = getColIndex('precio efectivo', 'efectivo', 'transferencia');
    const qtyIdx = getColIndex('cantidad', 'stock');
    const obsIdx = getColIndex('observacion');

    // Find image columns
    const imageColIndices: number[] = [];
    headers.forEach((h, idx) => {
      if (h.includes('foto') || h.includes('imagen')) {
        imageColIndices.push(idx);
      }
    });

    const productMap = new Map<string, Product>();

    rows.slice(1).forEach((row, rowIdx) => {
      const desc = descIdx !== -1 && row[descIdx] ? row[descIdx].replace(/\s+/g, ' ').trim() : '';
      const obs = obsIdx !== -1 && row[obsIdx] ? row[obsIdx].trim() : '';

      // Skip empty or discontinued items
      if (!desc || obs.toLowerCase().includes('baja') || obs.toLowerCase().includes('vendido')) {
        return;
      }

      const code = codeIdx !== -1 && row[codeIdx] ? row[codeIdx].trim() : `P-${rowIdx}`;
      const size = sizeIdx !== -1 && row[sizeIdx] ? row[sizeIdx].trim() : '';
      const priceList = priceListIdx !== -1 ? parseNumber(row[priceListIdx]) : 0;
      const priceCash = priceCashIdx !== -1 ? parseNumber(row[priceCashIdx]) : Math.round(priceList * 0.8);
      const qty = qtyIdx !== -1 ? parseNumber(row[qtyIdx]) || 1 : 1;

      // Extract image URLs
      const extractedImages: string[] = [];
      imageColIndices.forEach((colIdx) => {
        const cell = row[colIdx];
        if (cell && cell.trim().startsWith('http')) {
          const directUrl = formatDriveImageUrl(cell.trim());
          if (directUrl && !extractedImages.includes(directUrl)) {
            extractedImages.push(directUrl);
          }
        }
      });

      // Group products with the same description to consolidate sizes
      const key = desc;
      const existing = productMap.get(key);

      if (existing) {
        if (size && !existing.talles.includes(size)) {
          existing.talles.push(size);
        }
        extractedImages.forEach((img) => {
          if (!existing.imagenes.includes(img)) {
            existing.imagenes.push(img);
          }
        });
        existing.stock += qty;
      } else {
        const category = detectCategory(desc);
        const product: Product = {
          id: productMap.size + 1,
          codigo: code,
          nombre: desc,
          categoria: category,
          precioLista: priceList > 0 ? priceList : 22584,
          precioTransferencia: priceCash > 0 ? priceCash : 17999,
          cuotas3: Math.round((priceList > 0 ? priceList : 22584) / 3),
          talles: size ? [size] : ['Único'],
          stock: qty,
          imagenes: extractedImages.length > 0 ? extractedImages : [],
          imagenPrincipal: extractedImages[0] || '',
          observacion: obs,
        };
        productMap.set(key, product);
      }
    });

    const parsedList = Array.from(productMap.values());

    if (parsedList.length > 0) {
      // Cache in localStorage if available
      try {
        localStorage.setItem(
          'dos_solcitos_cached_catalog',
          JSON.stringify({
            products: parsedList,
            timestamp: new Date().toISOString(),
          })
        );
      } catch (e) {
        // ignore storage quota issues
      }

      return {
        products: parsedList,
        fromLiveSheet: true,
        timestamp: new Date().toLocaleTimeString('es-AR', { hour: '2-digit', minute: '2-digit' }),
      };
    }

    throw new Error('No se encontraron productos válidos en el CSV');
  } catch (error) {
    console.warn('Error fetching live Google Sheet, falling back to verified seed:', error);

    // Try reading cached version from localStorage
    try {
      const cached = localStorage.getItem('dos_solcitos_cached_catalog');
      if (cached) {
        const parsed = JSON.parse(cached);
        return {
          products: parsed.products,
          fromLiveSheet: false,
          timestamp: 'Copia en caché local',
        };
      }
    } catch (e) {
      // fallback
    }

    return {
      products: FALLBACK_PRODUCTS,
      fromLiveSheet: false,
      timestamp: 'Modo respaldo seguro',
    };
  }
}

export const CATEGORY_ICONS: Record<string, string> = {
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

// Curvas estándar de talles para ropa de niños y bebés
export const BABY_SIZES_CURVE = ['RN', '3M', '6M', '9M', '12M'];
export const KIDS_SIZES_CURVE = ['2T', '3T', '4T', '6T', '8T', '10T'];

/**
 * Retorna todos los talles potenciales para una prenda y la lista de talles disponibles en stock.
 * Si un talle no está en stock, aparecerá visualmente en la grilla pero deshabilitado / no seleccionable.
 */
export function getProductSizesConfig(product: Product): {
  allSizes: string[];
  availableSizes: string[];
} {
  const available = product.talles && product.talles.length > 0 ? product.talles : ['Único'];

  if (available.length === 1 && available[0].toLowerCase().includes('único')) {
    return { allSizes: ['Único'], availableSizes: ['Único'] };
  }

  // Detectar si la prenda corresponde a bebés (RN, 3M, 6M...) o niños (2T, 3T, 4T...)
  const hasBabySize = available.some((s) => {
    const u = s.toUpperCase().trim();
    return u === 'RN' || u.endsWith('M') || u.includes('-') || u.includes('MES');
  });

  const isBabyCategory =
    ['Bodies', 'Ranita', 'Ajuar'].includes(product.categoria) ||
    product.nombre.toLowerCase().includes('body') ||
    product.nombre.toLowerCase().includes('bebe') ||
    product.nombre.toLowerCase().includes('pañalero') ||
    product.nombre.toLowerCase().includes('ajuar');

  let baseCurve: string[] = [];
  if (hasBabySize || isBabyCategory) {
    baseCurve = [...BABY_SIZES_CURVE];
  } else {
    baseCurve = [...KIDS_SIZES_CURVE];
  }

  const allSizesSet = new Set<string>();
  baseCurve.forEach((s) => allSizesSet.add(s));
  available.forEach((s) => allSizesSet.add(s));

  return {
    allSizes: Array.from(allSizesSet),
    availableSizes: available,
  };
}

