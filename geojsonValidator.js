// validate GeoJSON data
// This function checks if the provided GeoJSON object adheres to the GeoJSON specification.
// It checks for the presence of required properties and their types.
// Returns true if valid, false otherwise.

export function validateGeoJSON(geojson) {
  // Check if the input is an object and has the required properties
  if (!geojson || typeof geojson !== 'object') {
    alert('Invalid GeoJSON data');
    return false;
  }

  // check if it is a feature collection
  if (!geojson.hasOwnProperty('type') && geojson.type !== 'FeatureCollection') {
    const requiredProperties = ['type', 'features'];
    for (const prop of requiredProperties) {
      // Check if the property exists and is of the correct type
      if (!geojson.hasOwnProperty(prop)) {
        alert(`Missing required property: ${prop}`);
        return false;
      }
    }
    // Check if the type is 'FeatureCollection'
    if (geojson.type !== 'FeatureCollection') {
      alert('GeoJSON type must be FeatureCollection');
      return false;
    }
    // Check if features is an array
    if (!Array.isArray(geojson.features)) {
      alert('GeoJSON features must be an array');
      return false;
    }

    for (const feature of geojson.features) {
      // Each feature should be an object with required properties
      if (!feature.hasOwnProperty('type') || feature.type !== 'Feature') {
        alert('Each feature must be of type Feature');
        return false;
      }
      // Check if geometry and properties are present and of the correct type
      if (!feature.hasOwnProperty('geometry') || typeof feature.geometry !== 'object') {
        alert('Each feature must have a geometry object');
        return false;
      }
      // Properties can be an object or null, but must exist
      if (!feature.hasOwnProperty('properties') || typeof feature.properties !== 'object') {
        alert('Each feature must have a properties object');
        return false;
      }
    }
  } else if (geojson.type === 'Feature') {
    // If it's a single feature, check the required properties
    if (!geojson.hasOwnProperty('geometry') || typeof geojson.geometry !== 'object') {
      alert('GeoJSON Feature must have a geometry object');
      return false;
    }
    if (!geojson.hasOwnProperty('properties') || typeof geojson.properties !== 'object') {
      alert('GeoJSON Feature must have a properties object');
      return false;
    }
  }


  return true;
}
