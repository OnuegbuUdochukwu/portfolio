const apiBase = process.env.NEXT_PUBLIC_API_URL || "";

export async function GET(request: Request) {
  if (!apiBase) {
    return Response.json([]);
  }

  const { searchParams } = new URL(request.url);
  const limit = searchParams.get("limit") || "30";
  const source = searchParams.get("source") || "all";

  try {
    const res = await fetch(
      `${apiBase}/api/trending?limit=${limit}&source=${source}`,
      { next: { revalidate: 300 } },
    );
    if (!res.ok) throw new Error("API error");
    const data = await res.json();
    return Response.json(data);
  } catch {
    return Response.json([]);
  }
}
