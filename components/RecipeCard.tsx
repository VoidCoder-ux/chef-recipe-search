"use client";

import { Recipe } from "@/types/recipe";
import { Clock, ChefHat, Thermometer, Users, ChevronRight } from "lucide-react";

interface RecipeCardProps {
  recipe: Recipe;
  onClick: (recipe: Recipe) => void;
}

const difficultyColor = {
  Intermediate: "text-yellow-400 border-yellow-400/30 bg-yellow-400/10",
  Advanced: "text-orange-400 border-orange-400/30 bg-orange-400/10",
  Expert: "text-red-400 border-red-400/30 bg-red-400/10",
};

export default function RecipeCard({ recipe, onClick }: RecipeCardProps) {
  return (
    <div
      className="recipe-card-hover cursor-pointer bg-dark-800 border border-dark-600 rounded-xl overflow-hidden group"
      onClick={() => onClick(recipe)}
      style={{ backgroundColor: "#1a1a1a", borderColor: "#2e2e2e" }}
    >
      {/* Header */}
      <div
        className="p-5 border-b"
        style={{
          borderColor: "#2e2e2e",
          background: "linear-gradient(to right, #1a1a1a, #1e1a14)",
        }}
      >
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="flex-1 min-w-0">
            <h3
              className="font-serif text-lg font-semibold text-white group-hover:text-chef-400 transition-colors leading-tight"
              style={{ fontFamily: "'Playfair Display', serif" }}
            >
              {recipe.name}
            </h3>
            <p className="text-sm mt-1" style={{ color: "#888" }}>
              {recipe.cuisine} · {recipe.category}
            </p>
          </div>
          <div className="flex flex-col items-end gap-2 shrink-0">
            <span
              className={`difficulty-badge px-2 py-1 rounded border ${
                difficultyColor[recipe.difficulty] || difficultyColor.Advanced
              }`}
            >
              {recipe.difficulty}
            </span>
            {recipe.originalLanguage && (
              <span
                className="text-xs px-2 py-0.5 rounded"
                style={{
                  color: "#c8842a",
                  backgroundColor: "rgba(200, 132, 42, 0.1)",
                  border: "1px solid rgba(200, 132, 42, 0.2)",
                }}
              >
                {recipe.originalLanguage}
              </span>
            )}
          </div>
        </div>

        <p
          className="text-sm leading-relaxed line-clamp-3"
          style={{ color: "#aaa" }}
        >
          {recipe.description}
        </p>
      </div>

      {/* Stats */}
      <div
        className="grid grid-cols-2 gap-px"
        style={{ backgroundColor: "#2e2e2e" }}
      >
        <div
          className="flex items-center gap-2 px-4 py-3"
          style={{ backgroundColor: "#1a1a1a" }}
        >
          <Clock size={14} style={{ color: "#c8842a" }} />
          <div>
            <p className="text-xs" style={{ color: "#666" }}>
              Total Time
            </p>
            <p className="text-sm font-medium text-white">{recipe.totalTime}</p>
          </div>
        </div>
        <div
          className="flex items-center gap-2 px-4 py-3"
          style={{ backgroundColor: "#1a1a1a" }}
        >
          <Users size={14} style={{ color: "#c8842a" }} />
          <div>
            <p className="text-xs" style={{ color: "#666" }}>
              Yield
            </p>
            <p className="text-sm font-medium text-white">
              {recipe.yieldAmount}
            </p>
          </div>
        </div>
        <div
          className="flex items-center gap-2 px-4 py-3"
          style={{ backgroundColor: "#1a1a1a" }}
        >
          <Thermometer size={14} style={{ color: "#c8842a" }} />
          <div>
            <p className="text-xs" style={{ color: "#666" }}>
              Service Temp
            </p>
            <p className="text-sm font-medium text-white">
              {recipe.serviceTemp}
            </p>
          </div>
        </div>
        <div
          className="flex items-center gap-2 px-4 py-3"
          style={{ backgroundColor: "#1a1a1a" }}
        >
          <ChefHat size={14} style={{ color: "#c8842a" }} />
          <div>
            <p className="text-xs" style={{ color: "#666" }}>
              Steps
            </p>
            <p className="text-sm font-medium text-white">
              {recipe.method?.length || 0} steps
            </p>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div
        className="flex items-center justify-between px-5 py-3"
        style={{ backgroundColor: "#161616" }}
      >
        <div className="flex gap-2 flex-wrap">
          {recipe.allergens?.slice(0, 3).map((allergen) => (
            <span
              key={allergen}
              className="text-xs px-2 py-0.5 rounded"
              style={{
                backgroundColor: "rgba(239, 68, 68, 0.1)",
                color: "#f87171",
                border: "1px solid rgba(239, 68, 68, 0.2)",
              }}
            >
              {allergen}
            </span>
          ))}
          {(recipe.allergens?.length || 0) > 3 && (
            <span className="text-xs" style={{ color: "#666" }}>
              +{recipe.allergens.length - 3}
            </span>
          )}
        </div>
        <div
          className="flex items-center gap-1 text-sm font-medium group-hover:gap-2 transition-all"
          style={{ color: "#c8842a" }}
        >
          View Recipe <ChevronRight size={14} />
        </div>
      </div>
    </div>
  );
}
