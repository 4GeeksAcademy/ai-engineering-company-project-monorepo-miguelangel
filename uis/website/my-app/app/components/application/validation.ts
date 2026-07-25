import type { ApplicationFormData, FormErrors, FormFieldName } from "./types";

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const phoneRegex = /^\+?[0-9\s()\-]{7,20}$/;

type Validator = (value: ApplicationFormData[FormFieldName]) => string;

const validators: Record<FormFieldName, Validator> = {
  fullName: (value) => {
    const parsed = String(value).trim();
    if (!parsed) return "El nombre completo es obligatorio.";
    if (parsed.length < 3) return "El nombre debe tener al menos 3 caracteres.";
    return "";
  },
  company: (value) => (!String(value).trim() ? "El nombre de la empresa es obligatorio." : ""),
  email: (value) => {
    const parsed = String(value).trim();
    if (!parsed) return "El email corporativo es obligatorio.";
    if (!emailRegex.test(parsed)) return "Introduce un email valido.";
    return "";
  },
  phone: (value) => {
    const parsed = String(value).trim();
    if (!parsed) return "El telefono es obligatorio.";
    if (!phoneRegex.test(parsed)) return "Introduce un telefono valido (7 a 20 digitos).";
    return "";
  },
  city: (value) => (!String(value).trim() ? "La ciudad es obligatoria." : ""),
  country: (value) => (!String(value).trim() ? "El pais es obligatorio." : ""),
  serviceLine: (value) => (!value ? "Selecciona un servicio de interes." : ""),
  teamSize: (value) => (!value ? "Selecciona el tamano aproximado del equipo." : ""),
  industry: (value) => (!value ? "Selecciona el sector principal." : ""),
  timeline: (value) => (!value ? "Selecciona el plazo para iniciar." : ""),
  message: (value) => {
    const parsed = String(value).trim();
    if (!parsed) return "Describe tu necesidad de talento.";
    if (parsed.length < 80) return "La descripcion debe tener al menos 80 caracteres.";
    return "";
  },
  privacy: (value) => (value ? "" : "Debes aceptar la politica de privacidad."),
  consent: (value) =>
    value ? "" : "Debes autorizar el contacto para seguimiento comercial.",
};

export function validateField(
  field: FormFieldName,
  formData: ApplicationFormData,
): string {
  return validators[field](formData[field]);
}

export function validateAll(formData: ApplicationFormData): FormErrors {
  const errors: FormErrors = {};

  (Object.keys(validators) as FormFieldName[]).forEach((field) => {
    const error = validateField(field, formData);
    if (error) errors[field] = error;
  });

  if (formData.challenges.length === 0) {
    errors.challenges = "Selecciona al menos un reto prioritario.";
  }

  return errors;
}