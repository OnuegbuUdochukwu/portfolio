const QUIDAX_API = "https://app.quidax.io/api/v1/markets/tickers";

interface QuidaxTicker {
  buy: string;
  sell: string;
  high: string;
  low: string;
  open: string;
  last: string;
  vol: string;
}

interface QuidaxResponse {
  status: string;
  message: string;
  data: {
    at: number;
    ticker: QuidaxTicker;
    market: string;
  };
}

function calcChangePct(last: string, open: string): string {
  const l = parseFloat(last);
  const o = parseFloat(open);
  if (o === 0) return "0";
  return (((l - o) / o) * 100).toFixed(2);
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
    const { ticker, at } = json.data;

    return Response.json({
      pair,
      price: ticker.last,
      changePct: calcChangePct(ticker.last, ticker.open),
      high: ticker.high,
      low: ticker.low,
      volume: ticker.vol,
      updatedAt: new Date(at * 1000).toISOString(),
    });
  } catch (err) {
    console.error("Failed to fetch Quidax ticker:", err);
    return Response.json(
      { error: "Failed to fetch ticker" },
      { status: 502 }
    );
  }
}
