"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import {
  ApiError,
  createSupplier,
  listSuppliers,
  updateSupplierRate,
  updateSupplierStatus,
} from "@/lib/api";
import type { CreateSupplierPayload, Supplier, SupplierCountry, SupplierStatus } from "@/lib/types";

const CATEGORY_OPTIONS = [
  "job_boards",
  "ats_software",
  "assessment_tools",
  "training_platforms",
  "payroll_and_hr_software",
  "video_interview",
  "background_check",
  "office_and_facilities",
  "it_and_software_licenses",
] as const;

const COUNTRY_OPTIONS: SupplierCountry[] = ["Spain", "USA"];
const STATUS_OPTIONS: SupplierStatus[] = ["active", "suspended"];

type SupplierDraft = {
  name: string;
  country: SupplierCountry;
  categories: string;
  monthly_rate: string;
  currency: "EUR" | "USD";
  status: SupplierStatus;
  contract_renewal_date: string;
  contact_email: string;
  notes: string;
};

const INITIAL_DRAFT: SupplierDraft = {
  name: "",
  country: "Spain",
  categories: "job_boards",
  monthly_rate: "",
  currency: "EUR",
  status: "active",
  contract_renewal_date: "",
  contact_email: "",
  notes: "",
};

export default function SuppliersPage() {
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [countryFilter, setCountryFilter] = useState<string>("all");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");

  const [draft, setDraft] = useState<SupplierDraft>(INITIAL_DRAFT);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [updatingRateId, setUpdatingRateId] = useState<number | null>(null);
  const [updatingStatusId, setUpdatingStatusId] = useState<number | null>(null);
  const [inlineError, setInlineError] = useState<string | null>(null);

  useEffect(() => {
    const run = async () => {
      try {
        const data = await listSuppliers({
          country: countryFilter === "all" ? undefined : (countryFilter as SupplierCountry),
          category: categoryFilter === "all" ? undefined : categoryFilter,
        });
        setSuppliers(data);
        setError(null);
      } catch (err) {
        setError(
          err instanceof ApiError
            ? err.message
            : "No se pudo cargar el directorio de proveedores."
        );
      } finally {
        setIsLoading(false);
      }
    };

    void run();
  }, [countryFilter, categoryFilter]);

  const totals = useMemo(() => {
    const active = suppliers.filter((s) => s.status === "active").length;
    const suspended = suppliers.length - active;
    return { active, suspended };
  }, [suppliers]);

  const handleCreateSupplier = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmitError(null);
    setIsSubmitting(true);

    const categories = draft.categories
      .split(",")
      .map((item) => item.trim())
      .filter(Boolean);

    const payload: CreateSupplierPayload = {
      name: draft.name.trim(),
      country: draft.country,
      categories,
      monthly_rate: Number(draft.monthly_rate),
      currency: draft.currency,
      status: draft.status,
      contract_renewal_date: draft.contract_renewal_date || undefined,
      contact_email: draft.contact_email || undefined,
      notes: draft.notes || undefined,
    };

    try {
      const created = await createSupplier(payload);
      setSuppliers((prev) => [created, ...prev]);
      setDraft({ ...INITIAL_DRAFT, country: draft.country, currency: draft.country === "USA" ? "USD" : "EUR" });
    } catch (err) {
      setSubmitError(
        err instanceof ApiError
          ? err.message
          : "No se pudo registrar el proveedor."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRateUpdate = async (supplierId: number, rateValue: string) => {
    setInlineError(null);
    const monthlyRate = Number(rateValue);
    if (!Number.isFinite(monthlyRate) || monthlyRate <= 0) {
      setInlineError("La tarifa mensual debe ser mayor que cero.");
      return;
    }

    setUpdatingRateId(supplierId);
    try {
      const updated = await updateSupplierRate(supplierId, { monthly_rate: monthlyRate });
      setSuppliers((prev) => prev.map((item) => (item.id === supplierId ? updated : item)));
    } catch (err) {
      setInlineError(err instanceof ApiError ? err.message : "No se pudo actualizar la tarifa.");
    } finally {
      setUpdatingRateId(null);
    }
  };

  const handleStatusUpdate = async (supplierId: number, status: SupplierStatus) => {
    setInlineError(null);
    setUpdatingStatusId(supplierId);
    try {
      const updated = await updateSupplierStatus(supplierId, { status });
      setSuppliers((prev) => prev.map((item) => (item.id === supplierId ? updated : item)));
    } catch (err) {
      setInlineError(err instanceof ApiError ? err.message : "No se pudo actualizar el estado.");
    } finally {
      setUpdatingStatusId(null);
    }
  };

  return (
    <section className="mx-auto flex w-full max-w-7xl flex-col gap-6">
      <header className="relative overflow-hidden rounded-2xl border border-slate-800 bg-slate-900/60 p-6 shadow-[0_12px_40px_-30px_rgba(14,165,233,0.45)] backdrop-blur-xl">
        <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-cyan-300/60 to-transparent" />
        <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Compras y Operaciones</p>
        <h2 className="mt-2 text-3xl font-semibold text-slate-100 sm:text-4xl">
          Directorio de proveedores
        </h2>
        <p className="mt-3 max-w-3xl text-sm text-slate-300">
          Registro centralizado de partners de Nexova. Filtra por país o categoría,
          añade proveedores y ajusta tarifa o estado en tiempo real.
        </p>
      </header>

      <div className="grid gap-4 sm:grid-cols-3">
        <article className="rounded-xl border border-slate-800 bg-slate-900 p-4 shadow-[0_24px_40px_-36px_rgba(0,0,0,0.8)]">
          <p className="text-xs uppercase tracking-wide text-slate-400">Total proveedores</p>
          <p className="mt-3 text-3xl font-semibold text-slate-100">{suppliers.length}</p>
        </article>
        <article className="rounded-xl border border-emerald-700/40 bg-slate-900 p-4 shadow-[0_24px_40px_-36px_rgba(0,0,0,0.8)]">
          <p className="text-xs uppercase tracking-wide text-emerald-300">Activos</p>
          <p className="mt-3 text-3xl font-semibold text-emerald-200">{totals.active}</p>
        </article>
        <article className="rounded-xl border border-amber-700/40 bg-slate-900 p-4 shadow-[0_24px_40px_-36px_rgba(0,0,0,0.8)]">
          <p className="text-xs uppercase tracking-wide text-amber-300">Suspendidos</p>
          <p className="mt-3 text-3xl font-semibold text-amber-200">{totals.suspended}</p>
        </article>
      </div>

      <div className="grid gap-6 xl:grid-cols-[1fr_2fr]">
        <article className="rounded-xl border border-slate-800 bg-slate-900 p-5 shadow-[0_24px_40px_-36px_rgba(0,0,0,0.8)]">
          <h3 className="text-sm font-semibold text-slate-100">Registrar proveedor</h3>
          <form className="mt-4 space-y-3" onSubmit={handleCreateSupplier}>
            <input
              value={draft.name}
              onChange={(e) => setDraft((prev) => ({ ...prev, name: e.target.value }))}
              placeholder="Nombre comercial"
              className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-slate-100 outline-none ring-cyan-300/40 transition focus:ring"
              required
            />
            <div className="grid grid-cols-2 gap-3">
              <select
                value={draft.country}
                onChange={(e) => {
                  const nextCountry = e.target.value as SupplierCountry;
                  setDraft((prev) => ({
                    ...prev,
                    country: nextCountry,
                    currency: nextCountry === "USA" ? "USD" : "EUR",
                  }));
                }}
                className="rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-slate-100 outline-none ring-cyan-300/40 transition focus:ring"
              >
                {COUNTRY_OPTIONS.map((country) => (
                  <option key={country} value={country}>
                    {country}
                  </option>
                ))}
              </select>
              <input
                value={draft.currency}
                onChange={(e) =>
                  setDraft((prev) => ({ ...prev, currency: e.target.value as "EUR" | "USD" }))
                }
                className="rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-slate-100 outline-none ring-cyan-300/40 transition focus:ring"
                required
              />
            </div>
            <input
              value={draft.categories}
              onChange={(e) => setDraft((prev) => ({ ...prev, categories: e.target.value }))}
              list="supplier-categories"
              placeholder="Categorías separadas por coma"
              className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-slate-100 outline-none ring-cyan-300/40 transition focus:ring"
              required
            />
            <datalist id="supplier-categories">
              {CATEGORY_OPTIONS.map((category) => (
                <option key={category} value={category} />
              ))}
            </datalist>
            <input
              type="number"
              min="0.01"
              step="0.01"
              value={draft.monthly_rate}
              onChange={(e) => setDraft((prev) => ({ ...prev, monthly_rate: e.target.value }))}
              placeholder="Tarifa mensual"
              className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-slate-100 outline-none ring-cyan-300/40 transition focus:ring"
              required
            />
            <div className="grid grid-cols-2 gap-3">
              <select
                value={draft.status}
                onChange={(e) =>
                  setDraft((prev) => ({ ...prev, status: e.target.value as SupplierStatus }))
                }
                className="rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-slate-100 outline-none ring-cyan-300/40 transition focus:ring"
              >
                {STATUS_OPTIONS.map((status) => (
                  <option key={status} value={status}>
                    {status}
                  </option>
                ))}
              </select>
              <input
                type="date"
                value={draft.contract_renewal_date}
                onChange={(e) =>
                  setDraft((prev) => ({ ...prev, contract_renewal_date: e.target.value }))
                }
                className="rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-slate-100 outline-none ring-cyan-300/40 transition focus:ring"
              />
            </div>
            <input
              type="email"
              value={draft.contact_email}
              onChange={(e) => setDraft((prev) => ({ ...prev, contact_email: e.target.value }))}
              placeholder="Email de contacto"
              className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-slate-100 outline-none ring-cyan-300/40 transition focus:ring"
            />
            <textarea
              value={draft.notes}
              onChange={(e) => setDraft((prev) => ({ ...prev, notes: e.target.value }))}
              placeholder="Notas internas"
              className="h-20 w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-slate-100 outline-none ring-cyan-300/40 transition focus:ring"
            />

            {submitError && (
              <p className="rounded-lg border border-rose-700/50 bg-rose-950/20 px-3 py-2 text-xs text-rose-200">
                {submitError}
              </p>
            )}

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full rounded-lg border border-cyan-500/30 bg-cyan-500/10 px-4 py-2 text-sm font-semibold text-cyan-100 transition hover:bg-cyan-500/20 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {isSubmitting ? "Guardando..." : "Crear proveedor"}
            </button>
          </form>
        </article>

        <article className="rounded-xl border border-slate-800 bg-slate-900 p-5 shadow-[0_24px_40px_-36px_rgba(0,0,0,0.8)]">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h3 className="text-sm font-semibold text-slate-100">Listado de proveedores</h3>
              <p className="mt-1 text-xs text-slate-400">Filtros client-side con recarga desde API</p>
            </div>
            <div className="flex gap-2">
              <select
                value={countryFilter}
                onChange={(e) => {
                  setIsLoading(true);
                  setCountryFilter(e.target.value);
                }}
                className="rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-xs text-slate-200"
              >
                <option value="all">Todos los países</option>
                {COUNTRY_OPTIONS.map((country) => (
                  <option key={country} value={country}>
                    {country}
                  </option>
                ))}
              </select>
              <select
                value={categoryFilter}
                onChange={(e) => {
                  setIsLoading(true);
                  setCategoryFilter(e.target.value);
                }}
                className="rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-xs text-slate-200"
              >
                <option value="all">Todas las categorías</option>
                {CATEGORY_OPTIONS.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {error && (
            <p className="mt-4 rounded-lg border border-rose-700/50 bg-rose-950/20 px-3 py-2 text-xs text-rose-200">
              {error}
            </p>
          )}
          {inlineError && (
            <p className="mt-4 rounded-lg border border-rose-700/50 bg-rose-950/20 px-3 py-2 text-xs text-rose-200">
              {inlineError}
            </p>
          )}

          <div className="mt-4 overflow-x-auto">
            <table className="min-w-full divide-y divide-slate-800 text-left text-sm">
              <thead>
                <tr className="text-xs uppercase tracking-wide text-slate-500">
                  <th className="px-2 py-3 font-medium">Nombre</th>
                  <th className="px-2 py-3 font-medium">País</th>
                  <th className="px-2 py-3 font-medium">Categorías</th>
                  <th className="px-2 py-3 font-medium">Tarifa mensual</th>
                  <th className="px-2 py-3 font-medium">Estado</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                {isLoading ? (
                  <tr>
                    <td colSpan={5} className="px-2 py-4 text-slate-400">
                      Cargando proveedores...
                    </td>
                  </tr>
                ) : suppliers.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-2 py-4 text-slate-400">
                      No hay proveedores para los filtros seleccionados.
                    </td>
                  </tr>
                ) : (
                  suppliers.map((supplier) => (
                    <tr key={supplier.id} className="align-top">
                      <td className="px-2 py-3 text-slate-100">
                        <p className="font-medium">{supplier.name}</p>
                        {supplier.contact_email && (
                          <p className="mt-1 text-xs text-slate-400">{supplier.contact_email}</p>
                        )}
                      </td>
                      <td className="px-2 py-3 text-slate-300">{supplier.country}</td>
                      <td className="px-2 py-3">
                        <div className="flex flex-wrap gap-1">
                          {supplier.categories.map((category) => (
                            <span
                              key={category}
                              className="rounded-md border border-slate-700 bg-slate-950 px-2 py-0.5 text-xs text-slate-300"
                            >
                              {category}
                            </span>
                          ))}
                        </div>
                      </td>
                      <td className="px-2 py-3 text-slate-300">
                        <form
                          className="flex items-center gap-2"
                          onSubmit={(e) => {
                            e.preventDefault();
                            const formData = new FormData(e.currentTarget);
                            const value = String(formData.get("monthly_rate") ?? "");
                            void handleRateUpdate(supplier.id, value);
                          }}
                        >
                          <input
                            name="monthly_rate"
                            type="number"
                            min="0.01"
                            step="0.01"
                            defaultValue={supplier.monthly_rate}
                            className="w-28 rounded-lg border border-slate-700 bg-slate-950 px-2 py-1 text-xs text-slate-100"
                          />
                          <span className="text-xs text-slate-500">{supplier.currency}</span>
                          <button
                            type="submit"
                            disabled={updatingRateId === supplier.id}
                            className="rounded-md border border-cyan-500/30 px-2 py-1 text-xs text-cyan-200 transition hover:bg-cyan-500/15 disabled:opacity-50"
                          >
                            {updatingRateId === supplier.id ? "..." : "Actualizar"}
                          </button>
                        </form>
                      </td>
                      <td className="px-2 py-3">
                        <div className="flex items-center gap-2">
                          <span
                            className={
                              supplier.status === "active"
                                ? "rounded-full border border-emerald-500/40 bg-emerald-500/15 px-2 py-0.5 text-xs font-medium text-emerald-200"
                                : "rounded-full border border-amber-500/40 bg-amber-500/15 px-2 py-0.5 text-xs font-medium text-amber-200"
                            }
                          >
                            {supplier.status === "active" ? "Activo" : "Suspendido"}
                          </span>
                          <select
                            value={supplier.status}
                            onChange={(e) =>
                              void handleStatusUpdate(supplier.id, e.target.value as SupplierStatus)
                            }
                            disabled={updatingStatusId === supplier.id}
                            className="rounded-md border border-slate-700 bg-slate-950 px-2 py-1 text-xs text-slate-200 disabled:opacity-50"
                          >
                            <option value="active">active</option>
                            <option value="suspended">suspended</option>
                          </select>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </article>
      </div>
    </section>
  );
}
