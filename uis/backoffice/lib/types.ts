export interface InvalidBreakdownItem {
  rule: string;
  label: string;
  count: number;
}

export interface CategoryBreakdownItem {
  category: string;
  count: number;
  percentage: number;
}

export interface StatusBreakdownItem {
  status: string;
  count: number;
  percentage: number;
}

export interface SatisfactionDistributionItem {
  score: number;
  label: string;
  count: number;
}

export interface SatisfactionSummary {
  closed_tickets: number;
  scored_tickets: number;
  average: number;
  distribution: SatisfactionDistributionItem[];
}

export interface AnalysisSummary {
  source_file: string;
  total_records: number;
  valid_records: number;
  invalid_records: number;
  invalid_breakdown: InvalidBreakdownItem[];
  category_breakdown: CategoryBreakdownItem[];
  status_breakdown: StatusBreakdownItem[];
  satisfaction: SatisfactionSummary;
}

export interface ApiErrorBody {
  detail: string;
}

export type SupplierCountry = "Spain" | "USA";

export type SupplierStatus = "active" | "suspended";

export interface Supplier {
  id: number;
  name: string;
  country: SupplierCountry;
  categories: string[];
  monthly_rate: number;
  currency: "EUR" | "USD";
  updated_at: string;
  status: SupplierStatus;
  contract_renewal_date?: string | null;
  contact_email?: string | null;
  notes?: string | null;
}

export interface CreateSupplierPayload {
  name: string;
  country: SupplierCountry;
  categories: string[];
  monthly_rate: number;
  currency: "EUR" | "USD";
  status: SupplierStatus;
  contract_renewal_date?: string;
  contact_email?: string;
  notes?: string;
}

export interface UpdateSupplierRatePayload {
  monthly_rate: number;
}

export interface UpdateSupplierStatusPayload {
  status: SupplierStatus;
}
