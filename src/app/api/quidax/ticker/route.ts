const QUIDAX_API = "https://app.quidax.io/api/v1/markets/tickers";

interface QuidaxTicker {
  buy: string;
  sell: string;
  high: string;
  low: string;
  last: string;
  vol: string;
  change: string;
  at: string;
}

interface QuidaxResponse {
  status: string;
  message: string;
  ticker: QuidaxTicker;
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const pair = searchParams.get("pair");

  if (!pair) {
    return Response.json({ error: "Missing 'pair' query parameter" }, { status: 400 });
  }

  try {
    const res = await fetch(`${QUIDAX_API}/${pair}`, { next: { revalidate: 60 } });

    if (!res.ok) {
      const errText = await res.text();
      console.error("Quidax API error:", res.status, errText);
      return Response.json(
        { error: "Failed to fetch ticker" },
        { status: 502 }
      );
    }

    const json: QuidaxResponse = await res.json();

    return Response.json({
      pair,
      price: json.ticker.last,
      changePct: json.ticker.change,
      high: json.ticker.high,
      low: json.ticker.low,
      volume: json.ticker.vol,
      updatedAt: json.ticker.at,
    });
  } catch (err) {
    console.error("Failed to fetch Quidax ticker:", err);
    return Response.json(
      { error: "Failed to fetch ticker" },
      { status: 502 }
    );
  }
}
