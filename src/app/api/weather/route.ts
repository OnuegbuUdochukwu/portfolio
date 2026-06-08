const LAT = 6.4541;
const LON = 3.3947;
const BASE = "https://api.open-meteo.com/v1/forecast";

export async function GET() {
  try {
    const params = new URLSearchParams({
      latitude: String(LAT),
      longitude: String(LON),
      current: "temperature_2m,relative_humidity_2m,apparent_temperature,weather_code,wind_speed_10m",
    });
    const url = `${BASE}?${params}`;
    const res = await fetch(url, { next: { revalidate: 600 } });
    if (!res.ok) {
      const errText = await res.text();
      console.error("Open-Meteo error:", res.status, errText);
      return Response.json({ error: "Weather API error" }, { status: 502 });
    }
    const data = await res.json();
    const current = data.current;
    return Response.json({
      temp: Math.round(current.temperature_2m),
      feels_like: Math.round(current.apparent_temperature),
      humidity: current.relative_humidity_2m,
      wind_speed: current.wind_speed_10m,
      weather_code: current.weather_code,
      city: "Lagos",
      country: "NG",
      lastUpdated: current.time,
    });
  } catch (err) {
    console.error("Failed to fetch weather:", err);
    return Response.json({ error: "Failed to fetch weather" }, { status: 502 });
  }
}
