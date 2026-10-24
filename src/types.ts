export interface Product {
  id: number;
  codigo: string;
  nombre: string;
  categoria: string;
  precioLista: number;
  precioTransferencia: number;
  cuotas3: number;
  talles: string[];
  stock: number;
  imagenes: string[];
  imagenPrincipal: string;
  observacion?: string;
  descripcion?: string;
}

export interface CartItem {
  cartItemId: string; // unique for product.id + selectedSize
  product: Product;
  selectedSize: string;
  quantity: number;
}

export type DeliveryMethod = 'retiro' | 'envio_domicilio' | 'correo_argentino';
export type PaymentMethod = 'transferencia' | 'cuotas';

export interface CheckoutDetails {
  customerName: string;
  customerPhone?: string;
  deliveryMethod: DeliveryMethod;
  deliveryAddress: string;
  paymentMethod: PaymentMethod;
  notes: string;
}

export type FindingSeverity = 'critical' | 'high' | 'medium' | 'quickwin';
export type FindingCategory = 'conversion' | 'ux' | 'tech' | 'mobile' | 'seo';

export interface AuditFinding {
  id: string;
  severity: FindingSeverity;
  category: FindingCategory;
  title: string;
  subtitle: string;
  description: string;
  currentCodeOrBehavior: string;
  improvedSolution: string;
  businessImpact: string;
  tags: string[];
}
