"use client";

import { useMemo, useState } from "react";
import type {
  ApplicationFormData,
  Challenge,
  FormErrors,
  FormFieldName,
} from "./types";
import { fieldNames, initialFormData } from "./types";
import { validateAll, validateField } from "./validation";

function isFormFieldName(name: string): name is FormFieldName {
  return fieldNames.includes(name as FormFieldName);
}

function hasErrors(errors: FormErrors): boolean {
  return Object.keys(errors).length > 0;
}

function inputClass(hasError: boolean): string {
  const base =
    "w-full rounded-md border bg-slate-900/80 px-3 py-2 text-slate-100 outline-none transition focus:border-teal-300";
  return hasError ? `${base} border-red-400` : `${base} border-slate-600`;
}

export function ApplicationForm() {
  const [formData, setFormData] = useState<ApplicationFormData>(initialFormData);
  const [errors, setErrors] = useState<FormErrors>({});
  const [statusMessage, setStatusMessage] = useState<string>("");

  const errorSummary = useMemo(() => {
    const values = Object.values(errors).filter(Boolean);
    if (values.length === 0) return "";
    return `Revisa los siguientes campos: ${values.join(" ")}`;
  }, [errors]);

  const handleBlur = (
    event: React.FocusEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>,
  ) => {
    const { name } = event.target;
    if (!isFormFieldName(name)) return;

    setStatusMessage("");
    const nextError = validateField(name, formData);
    setErrors((prev) => ({ ...prev, [name]: nextError || undefined }));
  };

  const handleChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>,
  ) => {
    const target = event.target;
    const { name } = target;

    setStatusMessage("");

    if (name === "challenges" && target instanceof HTMLInputElement) {
      const value = target.value as Challenge;
      const checked = target.checked;

      setFormData((prev) => ({
        ...prev,
        challenges: checked
          ? [...prev.challenges, value]
          : prev.challenges.filter((item) => item !== value),
      }));

      setErrors((prev) => ({
        ...prev,
        challenges: checked ? undefined : prev.challenges,
      }));
      return;
    }

    if (!isFormFieldName(name)) return;

    const nextValue =
      target instanceof HTMLInputElement && target.type === "checkbox"
        ? target.checked
        : target.value;

    setFormData((prev) => ({
      ...prev,
      [name]: nextValue,
    }));
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const nextErrors = validateAll(formData);
    setErrors(nextErrors);

    if (hasErrors(nextErrors)) return;

    setStatusMessage(
      "Solicitud enviada correctamente. En este entorno no hay backend conectado, pero tus datos pasaron todas las validaciones.",
    );
    setFormData(initialFormData);
    setErrors({});
  };

  return (
    <form onSubmit={handleSubmit} noValidate aria-describedby="errorSummary formStatus">
      <div
        id="formStatus"
        className={
          statusMessage
            ? "mb-6 rounded-md border border-emerald-300/40 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-100"
            : "mb-6 hidden rounded-md border px-4 py-3 text-sm"
        }
        role="status"
        aria-live="polite"
      >
        {statusMessage}
      </div>

      <div
        id="errorSummary"
        className={
          errorSummary
            ? "mb-6 rounded-md border border-red-400/40 bg-red-500/10 px-4 py-3 text-sm text-red-100"
            : "mb-6 hidden rounded-md border border-red-400/40 bg-red-500/10 px-4 py-3 text-sm text-red-100"
        }
        role="alert"
        aria-live="assertive"
      >
        {errorSummary}
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <div>
          <label htmlFor="fullName" className="mb-2 block text-sm font-medium text-slate-100">
            Nombre completo *
          </label>
          <input
            id="fullName"
            name="fullName"
            type="text"
            autoComplete="name"
            value={formData.fullName}
            onChange={handleChange}
            onBlur={handleBlur}
            className={inputClass(Boolean(errors.fullName))}
            aria-invalid={Boolean(errors.fullName)}
            aria-required="true"
          />
          <p className="mt-1 text-sm text-red-300" aria-live="polite">
            {errors.fullName}
          </p>
        </div>

        <div>
          <label htmlFor="company" className="mb-2 block text-sm font-medium text-slate-100">
            Empresa *
          </label>
          <input
            id="company"
            name="company"
            type="text"
            autoComplete="organization"
            value={formData.company}
            onChange={handleChange}
            onBlur={handleBlur}
            className={inputClass(Boolean(errors.company))}
            aria-invalid={Boolean(errors.company)}
            aria-required="true"
          />
          <p className="mt-1 text-sm text-red-300" aria-live="polite">
            {errors.company}
          </p>
        </div>

        <div>
          <label htmlFor="email" className="mb-2 block text-sm font-medium text-slate-100">
            Email corporativo *
          </label>
          <input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            value={formData.email}
            onChange={handleChange}
            onBlur={handleBlur}
            className={inputClass(Boolean(errors.email))}
            aria-invalid={Boolean(errors.email)}
            aria-required="true"
          />
          <p className="mt-1 text-sm text-red-300" aria-live="polite">
            {errors.email}
          </p>
        </div>

        <div>
          <label htmlFor="phone" className="mb-2 block text-sm font-medium text-slate-100">
            Telefono de contacto *
          </label>
          <input
            id="phone"
            name="phone"
            type="tel"
            autoComplete="tel"
            placeholder="+34 600 000 000"
            value={formData.phone}
            onChange={handleChange}
            onBlur={handleBlur}
            className={inputClass(Boolean(errors.phone))}
            aria-invalid={Boolean(errors.phone)}
            aria-required="true"
          />
          <p className="mt-1 text-sm text-red-300" aria-live="polite">
            {errors.phone}
          </p>
        </div>

        <div>
          <label htmlFor="city" className="mb-2 block text-sm font-medium text-slate-100">
            Ciudad *
          </label>
          <input
            id="city"
            name="city"
            type="text"
            autoComplete="address-level2"
            value={formData.city}
            onChange={handleChange}
            onBlur={handleBlur}
            className={inputClass(Boolean(errors.city))}
            aria-invalid={Boolean(errors.city)}
            aria-required="true"
          />
          <p className="mt-1 text-sm text-red-300" aria-live="polite">
            {errors.city}
          </p>
        </div>

        <div>
          <label htmlFor="country" className="mb-2 block text-sm font-medium text-slate-100">
            Pais *
          </label>
          <input
            id="country"
            name="country"
            type="text"
            autoComplete="country-name"
            value={formData.country}
            onChange={handleChange}
            onBlur={handleBlur}
            className={inputClass(Boolean(errors.country))}
            aria-invalid={Boolean(errors.country)}
            aria-required="true"
          />
          <p className="mt-1 text-sm text-red-300" aria-live="polite">
            {errors.country}
          </p>
        </div>

        <div>
          <label htmlFor="serviceLine" className="mb-2 block text-sm font-medium text-slate-100">
            Servicio de interes *
          </label>
          <select
            id="serviceLine"
            name="serviceLine"
            value={formData.serviceLine}
            onChange={handleChange}
            onBlur={handleBlur}
            className={inputClass(Boolean(errors.serviceLine))}
            aria-invalid={Boolean(errors.serviceLine)}
            aria-required="true"
          >
            <option value="">Selecciona una opcion</option>
            <option value="headhunting">Headhunting para mandos y directivos</option>
            <option value="outsourcing">Outsourcing de soporte al cliente</option>
            <option value="training">Formacion corporativa</option>
            <option value="full">Solucion integral de talento</option>
          </select>
          <p className="mt-1 text-sm text-red-300" aria-live="polite">
            {errors.serviceLine}
          </p>
        </div>

        <div>
          <label htmlFor="teamSize" className="mb-2 block text-sm font-medium text-slate-100">
            Tamano aproximado del equipo *
          </label>
          <select
            id="teamSize"
            name="teamSize"
            value={formData.teamSize}
            onChange={handleChange}
            onBlur={handleBlur}
            className={inputClass(Boolean(errors.teamSize))}
            aria-invalid={Boolean(errors.teamSize)}
            aria-required="true"
          >
            <option value="">Selecciona una opcion</option>
            <option value="1-20">1 - 20 personas</option>
            <option value="21-100">21 - 100 personas</option>
            <option value="101-500">101 - 500 personas</option>
            <option value="500+">Mas de 500 personas</option>
          </select>
          <p className="mt-1 text-sm text-red-300" aria-live="polite">
            {errors.teamSize}
          </p>
        </div>

        <div>
          <label htmlFor="industry" className="mb-2 block text-sm font-medium text-slate-100">
            Sector principal *
          </label>
          <select
            id="industry"
            name="industry"
            value={formData.industry}
            onChange={handleChange}
            onBlur={handleBlur}
            className={inputClass(Boolean(errors.industry))}
            aria-invalid={Boolean(errors.industry)}
            aria-required="true"
          >
            <option value="">Selecciona una opcion</option>
            <option value="tech">Tecnologia</option>
            <option value="retail">Retail</option>
            <option value="finance">Servicios financieros</option>
            <option value="other">Otro</option>
          </select>
          <p className="mt-1 text-sm text-red-300" aria-live="polite">
            {errors.industry}
          </p>
        </div>

        <div>
          <label htmlFor="timeline" className="mb-2 block text-sm font-medium text-slate-100">
            Plazo para iniciar *
          </label>
          <select
            id="timeline"
            name="timeline"
            value={formData.timeline}
            onChange={handleChange}
            onBlur={handleBlur}
            className={inputClass(Boolean(errors.timeline))}
            aria-invalid={Boolean(errors.timeline)}
            aria-required="true"
          >
            <option value="">Selecciona una opcion</option>
            <option value="immediate">Inmediato (0-30 dias)</option>
            <option value="quarter">Este trimestre</option>
            <option value="semester">Este semestre</option>
            <option value="exploring">Aun evaluando opciones</option>
          </select>
          <p className="mt-1 text-sm text-red-300" aria-live="polite">
            {errors.timeline}
          </p>
        </div>
      </div>

      <fieldset className="mt-8 rounded-lg border border-slate-700 p-4">
        <legend className="px-2 text-sm font-semibold text-slate-100">
          Retos prioritarios (selecciona al menos uno) *
        </legend>
        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          <label className="flex items-center gap-2 text-sm text-slate-200">
            <input
              type="checkbox"
              name="challenges"
              value="speed"
              checked={formData.challenges.includes("speed")}
              onChange={handleChange}
              className="h-4 w-4 rounded border-slate-500 bg-slate-900"
            />
            Reducir tiempo de contratacion
          </label>
          <label className="flex items-center gap-2 text-sm text-slate-200">
            <input
              type="checkbox"
              name="challenges"
              value="quality"
              checked={formData.challenges.includes("quality")}
              onChange={handleChange}
              className="h-4 w-4 rounded border-slate-500 bg-slate-900"
            />
            Mejorar calidad del talento contratado
          </label>
          <label className="flex items-center gap-2 text-sm text-slate-200">
            <input
              type="checkbox"
              name="challenges"
              value="sla"
              checked={formData.challenges.includes("sla")}
              onChange={handleChange}
              className="h-4 w-4 rounded border-slate-500 bg-slate-900"
            />
            Cumplir SLA de soporte al cliente
          </label>
          <label className="flex items-center gap-2 text-sm text-slate-200">
            <input
              type="checkbox"
              name="challenges"
              value="leadership"
              checked={formData.challenges.includes("leadership")}
              onChange={handleChange}
              className="h-4 w-4 rounded border-slate-500 bg-slate-900"
            />
            Fortalecer liderazgo y habilidades blandas
          </label>
        </div>
        <p className="mt-2 text-sm text-red-300" aria-live="polite">
          {errors.challenges}
        </p>
      </fieldset>

      <div className="mt-8">
        <label htmlFor="message" className="mb-2 block text-sm font-medium text-slate-100">
          Describe tu necesidad de talento *
        </label>
        <textarea
          id="message"
          name="message"
          rows={5}
          minLength={80}
          placeholder="Cuentanos tu situacion actual, objetivo y perfil del talento que necesitas..."
          value={formData.message}
          onChange={handleChange}
          onBlur={handleBlur}
          className={inputClass(Boolean(errors.message))}
          aria-invalid={Boolean(errors.message)}
          aria-required="true"
        />
        <p className="mt-1 text-xs text-slate-400">
          Minimo 80 caracteres para poder disenar una propuesta inicial.
        </p>
        <p className="mt-1 text-sm text-red-300" aria-live="polite">
          {errors.message}
        </p>
      </div>

      <div className="mt-8 space-y-3">
        <label className="flex items-start gap-2 text-sm text-slate-200">
          <input
            id="privacy"
            name="privacy"
            type="checkbox"
            checked={formData.privacy}
            onChange={handleChange}
            onBlur={handleBlur}
            className="mt-0.5 h-4 w-4 rounded border-slate-500 bg-slate-900"
          />
          Acepto la politica de privacidad y el tratamiento de mis datos para gestionar
          esta solicitud. *
        </label>
        <p className="text-sm text-red-300" aria-live="polite">
          {errors.privacy}
        </p>

        <label className="flex items-start gap-2 text-sm text-slate-200">
          <input
            id="consent"
            name="consent"
            type="checkbox"
            checked={formData.consent}
            onChange={handleChange}
            onBlur={handleBlur}
            className="mt-0.5 h-4 w-4 rounded border-slate-500 bg-slate-900"
          />
          Autorizo a Nexova Solutions a contactarme por email o telefono para
          seguimiento comercial. *
        </label>
        <p className="text-sm text-red-300" aria-live="polite">
          {errors.consent}
        </p>
      </div>

      <button
        type="submit"
        className="mt-10 w-full rounded-md bg-teal-400 px-6 py-3 font-semibold text-slate-900 transition hover:bg-teal-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-300 sm:w-auto"
      >
        Enviar solicitud
      </button>
    </form>
  );
}