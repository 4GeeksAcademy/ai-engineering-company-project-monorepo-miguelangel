"use client";

import { useEffect, useState } from "react";
import ProductsTable from "@/components/inventory/ProductsTable";
import { ApiError, listProducts } from "@/lib/inventory";
import type { Asset } from "@/lib/inventory-types";

export default function ProductsPage() {
  const [products, setProducts] = useState<Asset[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    listProducts()
      .then((data) => {
        if (!cancelled) setProducts(data);
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
          <h1 className="mt-2 text-4xl font-medium tracking-tight text-stone-900">Productos</h1>
          <p className="mt-3 max-w-2xl text-base leading-7 text-stone-600">
            Activos (equipos y materiales) con su stock actual, calculado a partir del
            historial de entradas y salidas.
          </p>
        </header>

        {error && (
          <div className="mb-6 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        )}

        {isLoading ? (
          <p className="text-sm text-stone-500">Cargando productos...</p>
        ) : (
          <ProductsTable products={products} />
        )}
      </div>
    </section>
  );
}
