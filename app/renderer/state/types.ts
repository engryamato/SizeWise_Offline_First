// Shared renderer types for stores (Phase 3 scaffolding)
export type ID = string;

export interface Project {
  id: ID;
  name: string;
  unit_system: 'imperial' | 'metric';
  created_at: string;
  updated_at: string;
}

export interface Job {
  id: ID;
  project_id: ID;
  name: string;
  order_index: number;
  created_at: string;
  updated_at: string;
}

export interface Endpoint {
  id: ID;
  job_id: ID;
  label?: string | null;
  x_in: number;
  y_in: number;
  orientation: number; // deg
  layer?: string | null;
  created_at: string;
  updated_at: string;
}

export type Shape = 'rect' | 'round';

export interface DuctRun {
  id: ID;
  job_id: ID;
  from_endpoint_id: ID;
  to_endpoint_id: ID;
  shape: Shape;
  width_in?: number | null;
  height_in?: number | null;
  diameter_in?: number | null;
  length_ft: number;
  material?: string | null;
  lining?: string | null;
  cfm: number;
  notes?: string | null;
  created_at: string;
  updated_at: string;
}

export interface Fitting {
  id: ID;
  duct_run_id: ID;
  type: string;
  order_index: number;
  params_json?: string | null;
  k_value?: number | null;
  created_at: string;
  updated_at: string;
}

export interface ResultRow {
  id: ID;
  duct_run_id: ID;
  velocity_fpm: number;
  reynolds: number;
  friction_inwg_per100ft: number;
  fittings_loss_inwg: number;
  total_loss_inwg: number;
  pressure_class?: string | null;
  warnings_json?: string | null; // JSON array
  ruleset_version?: string | null;
  ruleset_hash?: string | null;
  computed_at: string;
}

