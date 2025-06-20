// validate GeoJSON data
// This function checks if the provided GeoJSON object adheres to the GeoJSON specification.
// It checks for the presence of required properties and their types.
// Returns true if valid, false otherwise.


// Helper: Calculate signed area of a ring (Shoelace formula)
function ringArea(coords) {
  let area = 0;
  for (let i = 0, len = coords.length - 1; i < len; i++) {
    area += (coords[i][0] * coords[i + 1][1]) - (coords[i + 1][0] * coords[i][1]);
  }
  return area / 2;
}

// Helper: Check right-hand rule for a polygon
function checkPolygonRHR(coordinates) {
  if (!Array.isArray(coordinates) || coordinates.length === 0) return false;
  // Exterior ring (first) must be counterclockwise (area > 0)
  if (ringArea(coordinates[0]) <= 0) return false;
  // Holes (if any) must be clockwise (area < 0)
  for (let i = 1; i < coordinates.length; i++) {
    if (ringArea(coordinates[i]) >= 0) return false;
  }
  return true;
}

// Helper: Recursively check geometry for RHR
function checkGeometryRHR(geometry) {
  if (!geometry) return true;
  if (geometry.type === 'Polygon') {
    return checkPolygonRHR(geometry.coordinates);
  }
  if (geometry.type === 'MultiPolygon') {
    return geometry.coordinates.every(coords => checkPolygonRHR(coords));
  }
  // For other types, no RHR check needed
  return true;
}

export function validateGeoJSON(geojson) {
  // Check if the input is an object and has the required properties
  if (!geojson || typeof geojson !== 'object') {
    alert('Invalid GeoJSON data');
    return false;
  }
  // Check if the right-hand rule with respect to the area it bounds, i.e., exterior rings are counterclockwise, andholes are clockwise.
  

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
      // Check right-hand rule for geometry
      if (!checkGeometryRHR(feature.geometry)) {
        alert('Polygon/MultiPolygon coordinates do not respect the right-hand rule (exterior rings must be counterclockwise, holes clockwise)');
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
    // Check right-hand rule for geometry
    if (!checkGeometryRHR(geojson.geometry)) {
      alert('Polygon/MultiPolygon coordinates do not respect the right-hand rule (exterior rings must be counterclockwise, holes clockwise)');
      return false;
    }
  }


  return true;
}
