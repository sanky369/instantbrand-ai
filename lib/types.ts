// Frontend type definitions that mirror backend models

export interface BrandRequest {
  startup_idea: string;
}

export interface DetailedBrandRequest {
  startup_idea: string;
  business_model: string;
  target_demographics: string;
  key_differentiators: string;
  competitors: string[];
  brand_personality_preferences: string[];
  visual_style_preferences: string;
  budget_constraints?: string;
  timeline?: string;
  industry_vertical: string;
}

export interface BrandStrategy {
  company_name: string;
  alternative_names: string[];
  tagline: string;
  positioning_statement: string;
  
  industry: string;
  target_audience: string;
  customer_pain_points: string[];
  unique_value_proposition: string;
  competitive_advantage: string;
  
  brand_personality: string[];
  brand_archetype: string;
  brand_values: Array<{ value: string; explanation: string }>;
  brand_story: string;
  
  color_scheme: { [key: string]: string };
  logo_style: string;
  visual_elements: string[];
  typography_recommendations?: { [key: string]: string };
  
  domain_suggestions: string[];
  social_handles_availability: { [platform: string]: boolean };
}

export interface GeneratedAsset {
  type: string;
  url: string;
  filename: string;
  metadata?: { [key: string]: any };
}

export interface BrandPackage {
  id: string;
  strategy: BrandStrategy;
  assets: GeneratedAsset[];
  created_at: string;
  status: string;
  generation_time_seconds?: number;
}

export interface AgentProgress {
  agent_name: string;
  status: 'pending' | 'in_progress' | 'completed' | 'failed';
  progress: number;
  message: string;
  result?: any;
}

export interface ProgressUpdate {
  package_id: string;
  overall_progress: number;
  current_agent: string;
  agents: AgentProgress[];
  message: string;
  completed: boolean;
  result?: BrandPackage;
}