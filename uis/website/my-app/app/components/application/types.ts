export type ServiceLine = "" | "headhunting" | "outsourcing" | "training" | "full";
export type TeamSize = "" | "1-20" | "21-100" | "101-500" | "500+";
export type Industry = "" | "tech" | "retail" | "finance" | "other";
export type Timeline = "" | "immediate" | "quarter" | "semester" | "exploring";
export type Challenge = "speed" | "quality" | "sla" | "leadership";

export interface ApplicationFormData {
  fullName: string;
  company: string;
  email: string;
  phone: string;
  city: string;
  country: string;
  serviceLine: ServiceLine;
  teamSize: TeamSize;
  industry: Industry;
  timeline: Timeline;
  message: string;
  privacy: boolean;
  consent: boolean;
  challenges: Challenge[];
}

export type FormFieldName = Exclude<keyof ApplicationFormData, "challenges">;
export type FormErrors = Partial<Record<FormFieldName | "challenges", string>>;

export const initialFormData: ApplicationFormData = {
  fullName: "",
  company: "",
  email: "",
  phone: "",
  city: "",
  country: "",
  serviceLine: "",
  teamSize: "",
  industry: "",
  timeline: "",
  message: "",
  privacy: false,
  consent: false,
  challenges: [],
};

export const fieldNames: FormFieldName[] = [
  "fullName",
  "company",
  "email",
  "phone",
  "city",
  "country",
  "serviceLine",
  "teamSize",
  "industry",
  "timeline",
  "message",
  "privacy",
  "consent",
];