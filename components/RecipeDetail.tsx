"use client";

import { Recipe } from "@/types/recipe";
import {
  X,
  Clock,
  Users,
  Thermometer,
  ChefHat,
  Lightbulb,
  Package,
  BookOpen,
  AlertTriangle,
  Wrench,
} from "lucide-react";

interface RecipeDetailProps {
  recipe: Recipe;
  onClose: () => void;
}

const tipCategoryIcon: Record<string, React.ReactNode> = {
  technique: <ChefHat size={14} />,
  storage: <Package size={14} />,
  plating: <BookOpen size={14} />,
  sourcing: <Lightbulb size={14} />,
  variation: <Lightbulb size={14} />,
};

const tipCategoryColor: Record<string, string> = {
  technique: "#c8842a",
  storage: "#60a5fa",
  plating: "#a78bfa",
  sourcing: "#34d399",
  variation: "#f472b6",
};

export default function RecipeDetail({ recipe, onClose }: RecipeDetailProps) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center p-4 overflow-y-auto"
      style={{ backgroundColor: "rgba(0,0,0,0.85)", backdropFilter: "blur(4px)" }}
    >
      <div
        className="relative w-full max-w-4xl my-8 rounded-2xl overflow-hidden animate-slide-up"
        style={{ backgroundColor: "#141414", border: "1px solid #2e2e2e" }}
      >
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 p-2 rounded-full transition-colors"
          style={{ backgroundColor: "#2e2e2e", color: "#aaa" }}
        >
          <X size={18} />
        </button>

        {/* Hero Header */}
        <div
          className="px-8 pt-8 pb-6"
          style={{
            background:
              "linear-gradient(135deg, #1a1208 0%, #1a1a1a 60%, #141414 100%)",
            borderBottom: "1px solid #2e2e2e",
          }}
        >
          <div className="flex items-start gap-4 pr-8">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <span
                  className="text-xs font-semibold px-3 py-1 rounded-full uppercase tracking-widest"
                  style={{
                    backgroundColor: "rgba(200, 132, 42, 0.15)",
                    color: "#c8842a",
                    border: "1px solid rgba(200, 132, 42, 0.3)",
                  }}
                >
                  {recipe.category}
                </span>
                <span
                  className="text-xs font-semibold px-3 py-1 rounded-full uppercase tracking-widest"
                  style={{
                    backgroundColor:
                      recipe.difficulty === "Expert"
                        ? "rgba(239, 68, 68, 0.1)"
                        : recipe.difficulty === "Advanced"
                        ? "rgba(251, 146, 60, 0.1)"
                        : "rgba(250, 204, 21, 0.1)",
                    color:
                      recipe.difficulty === "Expert"
                        ? "#f87171"
                        : recipe.difficulty === "Advanced"
                        ? "#fb923c"
                        : "#facc15",
                    border: `1px solid ${
                      recipe.difficulty === "Expert"
                        ? "rgba(239,68,68,0.3)"
                        : recipe.difficulty === "Advanced"
                        ? "rgba(251,146,60,0.3)"
                        : "rgba(250,204,21,0.3)"
                    }`,
                  }}
                >
                  {recipe.difficulty}
                </span>
              </div>

              <h1
                className="text-3xl font-bold text-white mb-2"
                style={{ fontFamily: "'Playfair Display', serif" }}
              >
                {recipe.name}
              </h1>
              <p className="text-base leading-relaxed mb-4" style={{ color: "#999" }}>
                {recipe.description}
              </p>

              {recipe.source && (
                <p className="text-sm" style={{ color: "#666" }}>
                  Source: {recipe.source}
                </p>
              )}
            </div>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6">
            {[
              { icon: <Clock size={16} />, label: "Prep", value: recipe.prepTime },
              { icon: <Clock size={16} />, label: "Cook", value: recipe.cookTime },
              { icon: <Users size={16} />, label: "Yield", value: recipe.yieldAmount },
              { icon: <Thermometer size={16} />, label: "Service", value: recipe.serviceTemp },
            ].map(({ icon, label, value }) => (
              <div
                key={label}
                className="flex items-center gap-3 px-4 py-3 rounded-xl"
                style={{ backgroundColor: "rgba(200, 132, 42, 0.08)", border: "1px solid rgba(200, 132, 42, 0.15)" }}
              >
                <span style={{ color: "#c8842a" }}>{icon}</span>
                <div>
                  <p className="text-xs" style={{ color: "#666" }}>{label}</p>
                  <p className="text-sm font-semibold text-white">{value}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Body */}
        <div className="p-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column: Ingredients + Equipment */}
          <div className="lg:col-span-1 space-y-6">
            {/* Ingredients */}
            <section>
              <h2
                className="text-lg font-bold text-white mb-4 flex items-center gap-2"
                style={{ fontFamily: "'Playfair Display', serif" }}
              >
                <span style={{ color: "#c8842a" }}>—</span> Ingredients
              </h2>
              <div className="space-y-2">
                {recipe.ingredients?.map((ing, i) => (
                  <div
                    key={i}
                    className="flex items-start justify-between gap-2 py-2"
                    style={{ borderBottom: "1px solid #1e1e1e" }}
                  >
                    <div className="flex-1">
                      <span className="text-sm text-white font-medium">{ing.name}</span>
                      {ing.notes && (
                        <p className="text-xs mt-0.5" style={{ color: "#666" }}>
                          {ing.notes}
                        </p>
                      )}
                    </div>
                    <div className="text-right shrink-0">
                      <span
                        className="text-sm font-mono font-bold"
                        style={{ color: "#c8842a" }}
                      >
                        {ing.amount} {ing.unit}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* Equipment */}
            {recipe.equipment && recipe.equipment.length > 0 && (
              <section>
                <h2
                  className="text-lg font-bold text-white mb-4 flex items-center gap-2"
                  style={{ fontFamily: "'Playfair Display', serif" }}
                >
                  <span style={{ color: "#c8842a" }}>—</span> Equipment
                </h2>
                <div className="space-y-2">
                  {recipe.equipment.map((item, i) => (
                    <div
                      key={i}
                      className="flex items-center gap-2 text-sm"
                      style={{ color: "#aaa" }}
                    >
                      <Wrench size={12} style={{ color: "#c8842a", flexShrink: 0 }} />
                      {item}
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Allergens */}
            {recipe.allergens && recipe.allergens.length > 0 && (
              <section>
                <h2
                  className="text-lg font-bold text-white mb-3 flex items-center gap-2"
                  style={{ fontFamily: "'Playfair Display', serif" }}
                >
                  <AlertTriangle size={16} style={{ color: "#f87171" }} /> Allergens
                </h2>
                <div className="flex flex-wrap gap-2">
                  {recipe.allergens.map((a) => (
                    <span
                      key={a}
                      className="text-xs px-2 py-1 rounded"
                      style={{
                        backgroundColor: "rgba(239, 68, 68, 0.1)",
                        color: "#f87171",
                        border: "1px solid rgba(239, 68, 68, 0.2)",
                      }}
                    >
                      {a}
                    </span>
                  ))}
                </div>
              </section>
            )}

            {/* Storage */}
            {recipe.storageNotes && (
              <section>
                <h2
                  className="text-lg font-bold text-white mb-3 flex items-center gap-2"
                  style={{ fontFamily: "'Playfair Display', serif" }}
                >
                  <Package size={16} style={{ color: "#60a5fa" }} /> Storage
                </h2>
                <p className="text-sm leading-relaxed" style={{ color: "#999" }}>
                  {recipe.storageNotes}
                </p>
              </section>
            )}
          </div>

          {/* Right Column: Method + Chef Tips */}
          <div className="lg:col-span-2 space-y-8">
            {/* Method */}
            <section>
              <h2
                className="text-lg font-bold text-white mb-5 flex items-center gap-2"
                style={{ fontFamily: "'Playfair Display', serif" }}
              >
                <span style={{ color: "#c8842a" }}>—</span> Method
              </h2>
              <div className="space-y-4">
                {recipe.method?.map((step) => (
                  <div
                    key={step.step}
                    className="flex gap-4 p-4 rounded-xl"
                    style={{ backgroundColor: "#1a1a1a", border: "1px solid #252525" }}
                  >
                    <div
                      className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold"
                      style={{
                        backgroundColor: "rgba(200, 132, 42, 0.2)",
                        color: "#c8842a",
                        border: "1px solid rgba(200, 132, 42, 0.3)",
                      }}
                    >
                      {step.step}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-3 mb-2 flex-wrap">
                        <h4 className="text-sm font-bold text-white">{step.title}</h4>
                        {step.technique && (
                          <span
                            className="text-xs px-2 py-0.5 rounded font-mono"
                            style={{
                              backgroundColor: "rgba(167, 139, 250, 0.1)",
                              color: "#a78bfa",
                              border: "1px solid rgba(167, 139, 250, 0.2)",
                            }}
                          >
                            {step.technique}
                          </span>
                        )}
                      </div>
                      <p className="text-sm leading-relaxed" style={{ color: "#999" }}>
                        {step.description}
                      </p>
                      {(step.duration || step.temperature) && (
                        <div className="flex gap-4 mt-2">
                          {step.duration && (
                            <span className="text-xs flex items-center gap-1" style={{ color: "#666" }}>
                              <Clock size={11} /> {step.duration}
                            </span>
                          )}
                          {step.temperature && (
                            <span className="text-xs flex items-center gap-1" style={{ color: "#666" }}>
                              <Thermometer size={11} /> {step.temperature}
                            </span>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* Plating */}
            {recipe.plating && (
              <section>
                <h2
                  className="text-lg font-bold text-white mb-3 flex items-center gap-2"
                  style={{ fontFamily: "'Playfair Display', serif" }}
                >
                  <span style={{ color: "#c8842a" }}>—</span> Plating & Presentation
                </h2>
                <p
                  className="text-sm leading-relaxed p-4 rounded-xl"
                  style={{
                    color: "#aaa",
                    backgroundColor: "#1a1a1a",
                    border: "1px solid #252525",
                  }}
                >
                  {recipe.plating}
                </p>
              </section>
            )}

            {/* Chef Tips */}
            {recipe.chefTips && recipe.chefTips.length > 0 && (
              <section>
                <h2
                  className="text-lg font-bold text-white mb-4 flex items-center gap-2"
                  style={{ fontFamily: "'Playfair Display', serif" }}
                >
                  <span style={{ color: "#c8842a" }}>—</span> Chef Tips
                </h2>
                <div className="space-y-3">
                  {recipe.chefTips.map((tip, i) => (
                    <div
                      key={i}
                      className="flex gap-3 p-4 rounded-xl"
                      style={{
                        backgroundColor: "#1a1a1a",
                        border: `1px solid ${tipCategoryColor[tip.category] || "#2e2e2e"}22`,
                      }}
                    >
                      <span
                        className="mt-0.5 flex-shrink-0"
                        style={{ color: tipCategoryColor[tip.category] || "#c8842a" }}
                      >
                        {tipCategoryIcon[tip.category] || <Lightbulb size={14} />}
                      </span>
                      <div>
                        <span
                          className="text-xs font-bold uppercase tracking-wider mb-1 block"
                          style={{ color: tipCategoryColor[tip.category] || "#c8842a" }}
                        >
                          {tip.category}
                        </span>
                        <p className="text-sm leading-relaxed" style={{ color: "#aaa" }}>
                          {tip.tip}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
