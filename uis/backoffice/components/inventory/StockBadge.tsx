/**
 * Umbrales de nivel de stock (ajustables, no vienen del backend):
 * - Sin stock: current_stock === 0 -> rojo, urgente.
 * - Stock bajo: 0 < current_stock <= 5 -> ámbar, atención.
 * - Stock saludable: current_stock > 5 -> verde.
 */
const LOW_STOCK_THRESHOLD = 5;

export default function StockBadge({ currentStock }: { currentStock: number }) {
  if (currentStock === 0) {
    return (
      <span className="inline-flex items-center gap-1.5 rounded-full border border-red-200 bg-red-50 px-2.5 py-1 text-xs font-medium text-red-700">
        <span className="h-1.5 w-1.5 rounded-full bg-red-500" />
        Sin stock
      </span>
    );
  }

  if (currentStock <= LOW_STOCK_THRESHOLD) {
    return (
      <span className="inline-flex items-center gap-1.5 rounded-full border border-amber-200 bg-amber-50 px-2.5 py-1 text-xs font-medium text-amber-700">
        <span className="h-1.5 w-1.5 rounded-full bg-amber-500" />
        Stock bajo ({currentStock})
      </span>
    );
  }

  return (
    <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-200 bg-emerald-50 px-2.5 py-1 text-xs font-medium text-emerald-700">
      <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
      Stock saludable ({currentStock})
    </span>
  );
}
