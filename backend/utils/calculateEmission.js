function calculateEmission(vehicle, distance, cargoWeight = 0) {
  // Calculate base emission in kilograms
  let baseEmission = vehicle.emissionRate * distance;

  // Adjust for cargo weight if applicable
  if (vehicle.loadCapacity && cargoWeight) {
    const loadFactor = cargoWeight / vehicle.loadCapacity;
    baseEmission += baseEmission * loadFactor;
  }

  // Convert emission from kilograms to metric tons
  const emissionInTons = baseEmission / 1000;

  return emissionInTons;
}

module.exports = calculateEmission;
