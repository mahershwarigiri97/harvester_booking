export function calculateDistance(lat1: string | number, lon1: string | number, lat2: string | number, lon2: string | number): number {
  const l1 = Number(lat1);
  const ln1 = Number(lon1);
  const l2 = Number(lat2);
  const ln2 = Number(lon2);
  
  if (!l1 || !ln1 || !l2 || !ln2) return 0;
  
  const R = 6371; // Radius of the earth in km
  const dLat = deg2rad(l2 - l1);
  const dLon = deg2rad(ln2 - ln1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(deg2rad(l1)) * Math.cos(deg2rad(l2)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const d = R * c; // Distance in km
  return d;
}

function deg2rad(deg: number): number {
  return deg * (Math.PI / 180);
}

export async function fetchRouteCoordinates(start: { latitude: number; longitude: number }, end: { latitude: number; longitude: number }) {
  try {
    const url = `https://router.project-osrm.org/route/v1/driving/${start.longitude},${start.latitude};${end.longitude},${end.latitude}?overview=full&geometries=geojson&steps=true`;
    const response = await fetch(url);
    const data = await response.json();
    
    if (data.routes && data.routes.length > 0) {
      const route = data.routes[0];
      const coordinates = route.geometry.coordinates.map((coord: any) => ({
        latitude: coord[1],
        longitude: coord[0],
      }));

      // Extract simplified steps
      const steps = route.legs[0].steps.map((step: any) => ({
        instruction: step.maneuver.type + (step.maneuver.modifier ? ` ${step.maneuver.modifier}` : ''),
        distance: step.distance,
        name: step.name,
        location: {
          latitude: step.maneuver.location[1],
          longitude: step.maneuver.location[0],
        }
      }));

      return { coordinates, steps };
    }
  } catch (error) {
    console.error('Error fetching route:', error);
  }
  return { coordinates: [start, end], steps: [] };
}
