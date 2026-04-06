import { NextRequest, NextResponse } from "next/server";

const SYSTEM_PROMPT = `Profesyonel bir şef danışmanısın. Yalnızca eğitimli mutfak profesyonellerine yönelik, restoran kalitesinde tarifler veriyorsun.

KESİN KURAL: Tüm çıktı Türkçe olacak. İstisna yok.

VALİDASYON KURALI (EN ÖNEMLİ KURAL):
Kullanıcının arama terimi gerçek bir yemek, malzeme, mutfak tekniği veya bilinen bir gıda kavramı DEĞİLSE:
- Uydurma veya var olmayan tarifler KESINLIKLE oluşturma
- Anlamsız, sahte veya hayali yemek isimleri türetme
- Bunun yerine SADECE boş bir JSON dizisi döndür: []
Arama terimi tanınmayan, anlamsız veya mutfakla ilgisi olmayan bir kelimeyse boş dizi döndür.

VARİYASYON KURALI (ÇOK ÖNEMLİ):
Birden fazla tarif varyasyonu üretirken:
- SADECE aranan yemeğin/malzemenin gerçekte var olan hazırlama yöntemlerini veya bölgesel versiyonlarını sun
- Aranan terimi başka yemek türleriyle BİRLEŞTİREREK uydurma isimler YARATMA
- Örnek: "hibeş" arandıysa → farklı hibeş tariflerini sun; "hibeş pilavı" veya "hibeş çorbası" gibi var olmayan yemekler TÜRETME
- Yeterince varyasyon bulunamazsa daha az tarif döndür, asla hayali kombinasyonlar üretme

Kurallar:
- Tüm malzemelerde gram/ml ölçüsü kullan, asla "bir tutam" veya "biraz" gibi belirsiz ifade kullanma
- Profesyonel mutfak terimleri kullan (brunoise, chiffonade, bain-marie vb.)
- Sıcaklıkları °C ve °F olarak ver
- Her adımda süre belirt
- 10+ porsiyon için ölçekle
- Her yapılış adımını detaylı açıkla: neden yapıldığı, nelere dikkat edileceği, doğru sonucun görsel/koku/doku ipuçları, sık yapılan hatalar

JSON dizisi döndür. Her tarif:
{"id":"","name":"","cuisine":"","category":"","difficulty":"Intermediate|Advanced|Expert","yieldAmount":"","prepTime":"","cookTime":"","totalTime":"","serviceTemp":"","description":"","ingredients":[{"name":"","amount":"","unit":"g/ml/kg/L/adet","notes":""}],"equipment":[],"method":[{"step":1,"title":"","description":"","duration":"","temperature":"","technique":""}],"chefTips":[{"category":"technique|storage|plating|sourcing|variation","tip":""}],"plating":"","storageNotes":"","allergens":[],"source":""}`;

export async function POST(request: NextRequest) {
  try {
    const apiKey = process.env.GROQ_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: "GROQ_API_KEY is not configured in environment variables." },
        { status: 500 }
      );
    }

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

    const userMessage = `Şu arama terimi için profesyonel şef düzeyinde tarifler ara: "${query}"

ÖNEMLİ:
1. Önce bu terimin gerçek bir yemek, malzeme veya mutfak kavramı olup olmadığını değerlendir. Tanınmayan veya anlamsız bir kelimeyse SADECE [] döndür.
2. Gerçek bir yemekse, SADECE o yemeğin gerçekte var olan versiyonlarını/tekniklerini sun. Arama terimini başka yemek türleriyle birleştirerek uydurma isimler (örn. "${query} çorbası", "${query} pilavı") ASLA türetme.
3. Gerçek varyasyon bulunamazsa daha az tarif döndür.

${languageInstruction}
${cuisineInstruction}
${categoryInstruction}
${difficultyInstruction}

En fazla ${count} farklı profesyonel tarif varyasyonu sun. Her biri gerçek ve doğrulanabilir olsun.
SADECE geçerli bir JSON dizisi döndür, başka metin ekleme.`;

    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "llama-3.3-70b-versatile",
        messages: [
          { role: "system", content: SYSTEM_PROMPT },
          { role: "user", content: userMessage },
        ],
        max_tokens: 8000,
        temperature: 0.7,
      }),
    });

    if (!response.ok) {
      const errText = await response.text();
      throw new Error(`Groq API error ${response.status}: ${errText}`);
    }

    const data = await response.json();
    let jsonText = data.choices[0].message.content.trim();

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
