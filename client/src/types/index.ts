export interface Incident {
  id: number;
  title: string;
  description: string;
  severity: "Low" | "Medium" | "High";
  reported_at: string;
  updated_at?: string;
}

export type SeverityFilter = "All" | "Low" | "Medium" | "High";

export type SortOrder = "newest" | "oldest";

export type IncidentFormData = Omit<Incident, "id">;
