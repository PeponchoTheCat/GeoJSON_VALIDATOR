// validate GeoJSON data
// This function checks if the provided GeoJSON object adheres to the GeoJSON specification.
// It checks for the presence of required properties and their types.
// Returns true if valid, false otherwise.

export function validateGeoJSON(geojson) {
  // Check if the input is an object and has the required properties
  if (!geojson || typeof geojson !== 'object') {
    return false;
  }

  const requiredProperties = ['type', 'features'];
  for (const prop of requiredProperties) {
    // Check if the property exists and is of the correct type
    if (!geojson.hasOwnProperty(prop)) {
      return false;
    }
  }
  // Check if the type is 'FeatureCollection'
  if (geojson.type !== 'FeatureCollection') {
    return false;
  }
  // Check if features is an array
  if (!Array.isArray(geojson.features)) {
    return false;
  }

  for (const feature of geojson.features) {
    // Each feature should be an object with required properties
    if (!feature.hasOwnProperty('type') || feature.type !== 'Feature') {
      return false;
    }
    // Check if geometry and properties are present and of the correct type
    if (!feature.hasOwnProperty('geometry') || typeof feature.geometry !== 'object') {
      return false;
    }
    // Properties can be an object or null, but must exist
    if (!feature.hasOwnProperty('properties') || typeof feature.properties !== 'object') {
      return false;
    }
  }

  return true;
}
