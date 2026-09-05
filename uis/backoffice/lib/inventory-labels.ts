import type { AssetCategory, ExitType } from "./inventory-types";

export const CATEGORY_LABELS: Record<AssetCategory, string> = {
  hardware: "Hardware",
  peripherals: "Periféricos",
  office_supplies: "Material de oficina",
  training_materials: "Material de formación",
};

export const EXIT_TYPE_LABELS: Record<ExitType, string> = {
  allocation: "Asignación",
  consumption: "Consumo",
};
