const apiBase = process.env.NEXT_PUBLIC_API_URL || "";

export async function GET() {
  if (!apiBase) {
    return Response.json([]);
  }

  try {
    const res = await fetch(`${apiBase}/api/trending?limit=30`, {
      next: { revalidate: 300 },
    });
    if (!res.ok) throw new Error("API error");
    const data = await res.json();
    return Response.json(data);
  } catch {
    return Response.json([]);
  }
}
