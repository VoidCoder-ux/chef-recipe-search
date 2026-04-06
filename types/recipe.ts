export interface Ingredient {
  name: string;
  amount: string;
  unit: string;
  notes?: string;
}

export interface RecipeStep {
  step: number;
  title: string;
  description: string;
  duration?: string;
  temperature?: string;
  technique?: string;
}

export interface ChefTip {
  category: "technique" | "storage" | "plating" | "sourcing" | "variation";
  tip: string;
}

export interface Recipe {
  id: string;
  name: string;
  originalLanguage: string;
  cuisine: string;
  category: string;
  difficulty: "Intermediate" | "Advanced" | "Expert";
  yieldAmount: string;
  prepTime: string;
  cookTime: string;
  totalTime: string;
  serviceTemp: string;
  description: string;
  ingredients: Ingredient[];
  equipment: string[];
  method: RecipeStep[];
  chefTips: ChefTip[];
  plating: string;
  storageNotes: string;
  allergens: string[];
  source?: string;
}

export interface SearchFilters {
  cuisine: string;
  category: string;
  difficulty: string;
  language: string;
}
