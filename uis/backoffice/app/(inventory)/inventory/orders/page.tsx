"use client";

import { useEffect, useState } from "react";
import OrdersHistoryTable from "@/components/inventory/OrdersHistoryTable";
import { ApiError, listOrders } from "@/lib/inventory";
import type { Order } from "@/lib/inventory-types";

export default function OrdersHistoryPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    listOrders()
      .then((data) => {
        if (!cancelled) setOrders(data);
      })
      .catch((err) => {
        if (!cancelled) {
          setError(
            err instanceof ApiError
              ? err.message
              : "No se pudo conectar con la API. Comprueba que el backend esté en marcha."
          );
        }
      })
      .finally(() => {
        if (!cancelled) setIsLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <section className="px-6 py-12">
      <div className="mx-auto w-full max-w-6xl">
        <header className="mb-8">
          <p className="font-mono text-xs uppercase tracking-widest text-teal-700">
            Nexova · Inventario
          </p>
          <h1 className="mt-2 text-4xl font-medium tracking-tight text-stone-900">
            Historial de órdenes
          </h1>
          <p className="mt-3 max-w-2xl text-base leading-7 text-stone-600">
            Todas las entradas y salidas registradas. Vista de solo lectura.
          </p>
        </header>

        {error && (
          <div className="mb-6 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        )}

        {isLoading ? (
          <p className="text-sm text-stone-500">Cargando órdenes...</p>
        ) : (
          <OrdersHistoryTable orders={orders} />
        )}
      </div>
    </section>
  );
}
