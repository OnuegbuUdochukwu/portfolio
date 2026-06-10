const QUIDAX_API = "https://app.quidax.io/api/v1/markets";

interface Market {
  id: string;
  name: string;
  base_unit: string;
  quote_unit: string;
}

interface QuidaxMarketsResponse {
  status: string;
  message: string;
  data: Market[];
}

export async function GET() {
  try {
    const res = await fetch(QUIDAX_API, { next: { revalidate: 3600 } });

    if (!res.ok) {
      const errText = await res.text();
      console.error("Quidax markets API error:", res.status, errText);
      return Response.json(
        { error: "Failed to fetch markets" },
        { status: 502 }
      );
    }

    const json: QuidaxMarketsResponse = await res.json();
    return Response.json({ markets: json.data });
  } catch (err) {
    console.error("Failed to fetch Quidax markets:", err);
    return Response.json(
      { error: "Failed to fetch markets" },
      { status: 502 }
    );
  }
}
