import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextRequest, NextResponse } from "next/server";

const SYSTEM_PROMPT = `You are a world-class professional chef consultant with expertise in all global cuisines. You specialize in providing professional-grade recipes for trained culinary professionals, not home cooks.

Your recipes must ALWAYS:
1. Use precise gram/ml measurements for all ingredients (never "a handful" or "to taste" without gram equivalents)
2. Use professional culinary terminology (brunoise, chiffonade, deglaze, bain-marie, etc.)
3. Include precise temperatures in both Celsius and Fahrenheit
4. Specify exact timing for each step
5. Include professional equipment requirements
6. Provide chef tips focusing on professional techniques, mise en place, and quality control
7. Include storage instructions using professional standards (HACCP)
8. Scale for restaurant/professional kitchen yields (portions of 10+ unless specified)
9. Reference classical culinary foundations and techniques
10. Include plating/presentation guidelines for professional service

NEVER provide:
- Home-style casual measurements ("a pinch", "some", "a few")
- Simplified shortcuts that compromise quality
- Basic beginner explanations
- Home kitchen equipment suggestions

Always search your knowledge for the most authentic, professional version of the requested recipe, including variations from professional culinary traditions worldwide.

Return your response as a valid JSON array of recipe objects. Each recipe must follow this exact structure:
{
  "id": "unique-id",
  "name": "Recipe Name",
  "originalLanguage": "Language the recipe is traditionally documented in",
  "cuisine": "Cuisine type",
  "category": "Cold appetizer / Charcuterie / Garde manger / etc.",
  "difficulty": "Intermediate|Advanced|Expert",
  "yieldAmount": "e.g., 10 portions / 2kg",
  "prepTime": "e.g., 45 minutes",
  "cookTime": "e.g., 2 hours",
  "totalTime": "e.g., 2 hours 45 minutes + 24h resting",
  "serviceTemp": "e.g., 4-6°C",
  "description": "Professional description of the dish, its origins, and culinary significance",
  "ingredients": [
    {
      "name": "ingredient name",
      "amount": "numeric amount",
      "unit": "g/ml/kg/L/pcs",
      "notes": "optional professional notes (quality grade, specific variety, preparation state)"
    }
  ],
  "equipment": ["list", "of", "professional", "equipment"],
  "method": [
    {
      "step": 1,
      "title": "Step title",
      "description": "Detailed professional step description",
      "duration": "time for this step",
      "temperature": "temperature if applicable",
      "technique": "specific culinary technique name"
    }
  ],
  "chefTips": [
    {
      "category": "technique|storage|plating|sourcing|variation",
      "tip": "Professional chef tip"
    }
  ],
  "plating": "Professional plating/presentation instructions",
  "storageNotes": "Professional storage instructions with temperatures and shelf life",
  "allergens": ["list", "of", "allergens"],
  "source": "Culinary tradition/reference"
}`;

export async function POST(request: NextRequest) {
  try {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: "GEMINI_API_KEY is not configured in environment variables." },
        { status: 500 }
      );
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    const { query, filters, count = 3 } = await request.json();

    if (!query || query.trim().length === 0) {
      return NextResponse.json(
        { error: "Search query is required" },
        { status: 400 }
      );
    }

    const languageInstruction =
      filters?.language && filters.language !== "all"
        ? `Search specifically for recipes from ${filters.language}-speaking culinary traditions.`
        : "Search globally across all culinary traditions and languages.";

    const cuisineInstruction =
      filters?.cuisine && filters.cuisine !== "all"
        ? `Focus on ${filters.cuisine} cuisine.`
        : "";

    const categoryInstruction =
      filters?.category && filters.category !== "all"
        ? `The recipe should be in the ${filters.category} category.`
        : "Focus on cold kitchen (garde manger) applications where possible.";

    const difficultyInstruction =
      filters?.difficulty && filters.difficulty !== "all"
        ? `Target ${filters.difficulty} difficulty level.`
        : "";

    const userMessage = `${SYSTEM_PROMPT}

Search for professional chef-level recipes for: "${query}"

${languageInstruction}
${cuisineInstruction}
${categoryInstruction}
${difficultyInstruction}

Provide ${count} distinct professional recipe variations. Each must be unique in technique, origin, or approach.
Return ONLY a valid JSON array with no additional text or markdown.`;

    const model = genAI.getGenerativeModel({
      model: "gemini-1.5-flash",
      generationConfig: {
        maxOutputTokens: 8000,
        temperature: 0.7,
      },
    });

    const result = await model.generateContent(userMessage);
    const response = await result.response;
    let jsonText = response.text().trim();

    // Remove markdown code blocks if present
    jsonText = jsonText.replace(/^```(?:json)?\n?/i, "").replace(/\n?```$/i, "");

    const recipes = JSON.parse(jsonText);

    return NextResponse.json({ recipes, query });
  } catch (error) {
    console.error("Recipe search error:", error);
    if (error instanceof SyntaxError) {
      return NextResponse.json(
        { error: "Failed to parse recipe data. Please try again." },
        { status: 500 }
      );
    }
    return NextResponse.json(
      { error: `Failed to fetch recipes: ${error instanceof Error ? error.message : "Unknown error"}` },
      { status: 500 }
    );
  }
}
