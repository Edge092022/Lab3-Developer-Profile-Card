export async function fetchKraftonPubgTelemetry(squadId, { signal }) {
  const res = await fetch(`/squads/${squadId}.json`, { signal });

  if (!res.ok) {
    throw new Error(`Telemetry request failed (${res.status})`);
  }

  const data = await res.json();

  // Simulate 35% packet loss on Erangel and Miramar
  if (['Erangel', 'Miramar'].includes(data.map) && Math.random() < 0.35) {
    throw new Error('Satellite packet lost');
  }

  return data;
}
