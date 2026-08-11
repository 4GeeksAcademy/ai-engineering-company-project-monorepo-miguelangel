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
