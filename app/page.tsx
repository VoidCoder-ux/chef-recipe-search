"use client";

import { useState } from "react";
import { Search, ChefHat, Globe, Filter, X, Flame } from "lucide-react";
import { Recipe, SearchFilters } from "@/types/recipe";
import RecipeCard from "@/components/RecipeCard";
import RecipeDetail from "@/components/RecipeDetail";
import LoadingSkeleton from "@/components/LoadingSkeleton";

const CUISINES = [
  "all",
  "French",
  "Italian",
  "Japanese",
  "Spanish",
  "Turkish",
  "Mediterranean",
  "Nordic",
  "Asian",
  "Middle Eastern",
  "American",
  "Mexican",
  "Indian",
  "Chinese",
];

const CATEGORIES = [
  "all",
  "Garde Manger",
  "Cold Appetizer",
  "Charcuterie",
  "Terrine & Pâté",
  "Cured Fish",
  "Cold Sauce",
  "Salad",
  "Carpaccio",
  "Ceviche & Tartare",
  "Smoked Products",
  "Cold Buffet",
  "Canapé",
  "Mousse & Espuma",
];

const LANGUAGES = [
  { value: "all", label: "All Languages" },
  { value: "French", label: "French" },
  { value: "Italian", label: "Italian" },
  { value: "Japanese", label: "Japanese" },
  { value: "Spanish", label: "Spanish" },
  { value: "Turkish", label: "Turkish" },
  { value: "German", label: "German" },
  { value: "English", label: "English" },
  { value: "Arabic", label: "Arabic" },
];

const DIFFICULTIES = ["all", "Intermediate", "Advanced", "Expert"];

const QUICK_SEARCHES = [
  "Duck Confit Terrine",
  "Salmon Gravlax",
  "Vitello Tonnato",
  "Foie Gras Torchon",
  "Beef Carpaccio",
  "Sea Bass Ceviche",
  "Wagyu Tataki",
  "Lobster Mousse",
  "Charcuterie Board",
  "Smoked Duck Breast",
];

export default function Home() {
  const [query, setQuery] = useState("");
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showFilters, setShowFilters] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [filters, setFilters] = useState<SearchFilters>({
    cuisine: "all",
    category: "all",
    difficulty: "all",
    language: "all",
  });

  const handleSearch = async (searchQuery?: string) => {
    const q = searchQuery || query;
    if (!q.trim()) return;

    setLoading(true);
    setError(null);
    setHasSearched(true);
    if (searchQuery) setQuery(searchQuery);

    try {
      const res = await fetch("/api/recipe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query: q, filters, count: 3 }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Search failed");
      }

      setRecipes(data.recipes || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
      setRecipes([]);
    } finally {
      setLoading(false);
    }
  };

  const activeFilterCount = Object.values(filters).filter(
    (v) => v !== "all"
  ).length;

  return (
    <main className="min-h-screen" style={{ backgroundColor: "#0d0d0d" }}>
      {/* Header */}
      <header
        className="border-b sticky top-0 z-40"
        style={{
          backgroundColor: "rgba(13,13,13,0.95)",
          borderColor: "#1e1e1e",
          backdropFilter: "blur(10px)",
        }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div
              className="w-9 h-9 rounded-xl flex items-center justify-center"
              style={{
                background: "linear-gradient(135deg, #c8842a, #8a4f1d)",
              }}
            >
              <ChefHat size={18} className="text-white" />
            </div>
            <div>
              <h1
                className="text-lg font-bold leading-tight"
                style={{
                  fontFamily: "'Playfair Display', serif",
                  color: "#fff",
                }}
              >
                Chef&apos;s Recipe Intelligence
              </h1>
              <p className="text-xs" style={{ color: "#666" }}>
                Professional Kitchen Reference
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Globe size={14} style={{ color: "#666" }} />
            <span className="text-xs" style={{ color: "#666" }}>
              Multi-language Search
            </span>
          </div>
        </div>
      </header>

      {/* Hero Search */}
      <div
        className="relative overflow-hidden"
        style={{
          background:
            "linear-gradient(180deg, #161006 0%, #0d0d0d 100%)",
          borderBottom: "1px solid #1e1e1e",
        }}
      >
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-16 text-center">
          <div className="mb-3 flex items-center justify-center gap-2">
            <Flame size={14} style={{ color: "#c8842a" }} />
            <span
              className="text-xs font-semibold uppercase tracking-widest"
              style={{ color: "#c8842a" }}
            >
              Professional Grade Only
            </span>
            <Flame size={14} style={{ color: "#c8842a" }} />
          </div>
          <h2
            className="text-4xl sm:text-5xl font-bold text-white mb-4"
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            Search{" "}
            <span
              style={{
                background: "linear-gradient(135deg, #c8842a, #dca04a)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              Any Recipe
            </span>
            <br />
            In Any Language
          </h2>
          <p className="text-base mb-10" style={{ color: "#888" }}>
            Precise gram measurements · Professional techniques · Chef tips · No home-cook shortcuts
          </p>

          {/* Search Box */}
          <div className="relative mb-4">
            <div
              className="flex items-center gap-3 rounded-2xl px-5 py-4 transition-all"
              style={{
                backgroundColor: "#1a1a1a",
                border: "1px solid #2e2e2e",
                boxShadow: "0 0 0 0px rgba(200,132,42,0)",
              }}
            >
              <Search size={20} style={{ color: "#666", flexShrink: 0 }} />
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                placeholder="Search recipes... (e.g., Foie Gras Torchon, Ceviche, Gravlax)"
                className="flex-1 bg-transparent outline-none text-base text-white placeholder-gray-600"
              />
              {query && (
                <button
                  onClick={() => setQuery("")}
                  className="p-1 rounded-lg transition-colors"
                  style={{ color: "#666" }}
                >
                  <X size={16} />
                </button>
              )}
              <button
                onClick={() => handleSearch()}
                disabled={loading || !query.trim()}
                className="px-6 py-2 rounded-xl font-semibold text-sm text-white transition-all disabled:opacity-40"
                style={{
                  background: "linear-gradient(135deg, #c8842a, #a96820)",
                  flexShrink: 0,
                }}
              >
                {loading ? "Searching..." : "Search"}
              </button>
            </div>
          </div>

          {/* Filter Toggle */}
          <div className="flex items-center justify-center gap-3 mb-6">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm transition-all"
              style={{
                backgroundColor: showFilters ? "rgba(200,132,42,0.15)" : "#1a1a1a",
                border: `1px solid ${showFilters ? "rgba(200,132,42,0.4)" : "#2e2e2e"}`,
                color: showFilters ? "#c8842a" : "#888",
              }}
            >
              <Filter size={14} />
              Filters
              {activeFilterCount > 0 && (
                <span
                  className="w-5 h-5 rounded-full text-xs font-bold flex items-center justify-center"
                  style={{ backgroundColor: "#c8842a", color: "#fff" }}
                >
                  {activeFilterCount}
                </span>
              )}
            </button>
          </div>

          {/* Filters Panel */}
          {showFilters && (
            <div
              className="rounded-2xl p-5 mb-6 text-left grid grid-cols-2 sm:grid-cols-4 gap-4"
              style={{ backgroundColor: "#1a1a1a", border: "1px solid #2e2e2e" }}
            >
              {[
                { label: "Cuisine", key: "cuisine" as keyof SearchFilters, options: CUISINES },
                { label: "Category", key: "category" as keyof SearchFilters, options: CATEGORIES },
                { label: "Difficulty", key: "difficulty" as keyof SearchFilters, options: DIFFICULTIES },
                {
                  label: "Language",
                  key: "language" as keyof SearchFilters,
                  options: LANGUAGES.map((l) => l.value),
                  labels: LANGUAGES.reduce(
                    (a, l) => ({ ...a, [l.value]: l.label }),
                    {} as Record<string, string>
                  ),
                },
              ].map(({ label, key, options, labels }) => (
                <div key={key}>
                  <label
                    className="block text-xs font-semibold uppercase tracking-wider mb-2"
                    style={{ color: "#666" }}
                  >
                    {label}
                  </label>
                  <select
                    value={filters[key]}
                    onChange={(e) =>
                      setFilters((f) => ({ ...f, [key]: e.target.value }))
                    }
                    className="w-full rounded-lg px-3 py-2 text-sm outline-none"
                    style={{
                      backgroundColor: "#242424",
                      border: "1px solid #3a3a3a",
                      color: "#e0e0e0",
                    }}
                  >
                    {options.map((opt) => (
                      <option key={opt} value={opt}>
                        {labels ? labels[opt] : opt === "all" ? `All ${label}s` : opt}
                      </option>
                    ))}
                  </select>
                </div>
              ))}
            </div>
          )}

          {/* Quick Searches */}
          <div className="flex flex-wrap justify-center gap-2">
            {QUICK_SEARCHES.map((s) => (
              <button
                key={s}
                onClick={() => handleSearch(s)}
                className="px-3 py-1.5 rounded-full text-xs font-medium transition-all hover:scale-105"
                style={{
                  backgroundColor: "#1a1a1a",
                  border: "1px solid #2e2e2e",
                  color: "#888",
                }}
              >
                {s}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Results */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
        {loading && <LoadingSkeleton />}

        {error && (
          <div
            className="rounded-2xl p-6 text-center"
            style={{
              backgroundColor: "rgba(239, 68, 68, 0.05)",
              border: "1px solid rgba(239, 68, 68, 0.2)",
            }}
          >
            <p className="text-red-400 font-medium">{error}</p>
            <p className="text-sm mt-2" style={{ color: "#666" }}>
              Make sure your API key is configured in the environment variables.
            </p>
          </div>
        )}

        {!loading && hasSearched && recipes.length > 0 && (
          <div>
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3
                  className="text-xl font-bold text-white"
                  style={{ fontFamily: "'Playfair Display', serif" }}
                >
                  {recipes.length} Professional Recipes Found
                </h3>
                <p className="text-sm mt-1" style={{ color: "#666" }}>
                  Sorted by culinary complexity and authenticity
                </p>
              </div>
              <div
                className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs"
                style={{
                  backgroundColor: "rgba(200,132,42,0.1)",
                  border: "1px solid rgba(200,132,42,0.2)",
                  color: "#c8842a",
                }}
              >
                <ChefHat size={12} />
                Pro Grade
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
              {recipes.map((recipe) => (
                <RecipeCard
                  key={recipe.id}
                  recipe={recipe}
                  onClick={setSelectedRecipe}
                />
              ))}
            </div>
          </div>
        )}

        {!loading && hasSearched && recipes.length === 0 && !error && (
          <div className="text-center py-20">
            <ChefHat size={48} className="mx-auto mb-4" style={{ color: "#333" }} />
            <p className="text-xl font-medium" style={{ color: "#555" }}>
              No recipes found
            </p>
            <p className="text-sm mt-2" style={{ color: "#444" }}>
              Try a different search term
            </p>
          </div>
        )}

        {!hasSearched && (
          <div className="text-center py-20">
            <div
              className="w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-6"
              style={{
                background: "linear-gradient(135deg, rgba(200,132,42,0.15), rgba(200,132,42,0.05))",
                border: "1px solid rgba(200,132,42,0.2)",
              }}
            >
              <ChefHat size={36} style={{ color: "#c8842a" }} />
            </div>
            <h3
              className="text-2xl font-bold text-white mb-3"
              style={{ fontFamily: "'Playfair Display', serif" }}
            >
              Your Professional Kitchen Reference
            </h3>
            <p className="text-base max-w-md mx-auto" style={{ color: "#666" }}>
              Search for any recipe in any language. Get professional results with
              exact gram measurements, culinary techniques, and chef-level tips.
            </p>
          </div>
        )}
      </div>

      {/* Recipe Detail Modal */}
      {selectedRecipe && (
        <RecipeDetail
          recipe={selectedRecipe}
          onClose={() => setSelectedRecipe(null)}
        />
      )}

      {/* Footer */}
      <footer
        className="border-t mt-20 py-8 text-center"
        style={{ borderColor: "#1e1e1e" }}
      >
        <p className="text-sm" style={{ color: "#444" }}>
          Chef&apos;s Recipe Intelligence · Professional Culinary Reference ·{" "}
          <span style={{ color: "#c8842a" }}>Powered by Claude AI</span>
        </p>
      </footer>
    </main>
  );
}
