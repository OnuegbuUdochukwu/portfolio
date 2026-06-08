const API_KEY = process.env.OPENWEATHER_API_KEY;
const CITY = "Lagos";
const COUNTRY = "NG";
const BASE = "https://api.openweathermap.org/data/2.5/weather";

export async function GET() {
  if (!API_KEY) {
    return Response.json({ error: "No API key configured" }, { status: 500 });
  }

  try {
    const url = `${BASE}?q=${CITY},${COUNTRY}&units=metric&appid=${API_KEY}`;
    const res = await fetch(url, { next: { revalidate: 600 } });
    if (!res.ok) {
      const errText = await res.text();
      console.error("OpenWeatherMap error:", res.status, errText);
      return Response.json({ error: "Weather API error" }, { status: 502 });
    }
    const data = await res.json();
    return Response.json({
      temp: Math.round(data.main.temp),
      feels_like: Math.round(data.main.feels_like),
      humidity: data.main.humidity,
      wind_speed: data.wind.speed,
      description: data.weather[0].description,
      icon: data.weather[0].icon,
      city: data.name,
      country: data.sys.country,
      lastUpdated: new Date().toISOString(),
    });
  } catch (err) {
    console.error("Failed to fetch weather:", err);
    return Response.json({ error: "Failed to fetch weather" }, { status: 502 });
  }
}
