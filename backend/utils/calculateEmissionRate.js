function calculateEmissionRate(engineType, year) {
  let baseRate = 0;

  switch (engineType.toLowerCase()) {
    case 'petrol':
      baseRate = 0.2; // kg CO2 per km
      break;
    case 'diesel':
      baseRate = 0.25; // kg CO2 per km
      break;
    case 'electric':
      baseRate = 0.05; // kg CO2 per km
      break;
    default:
      baseRate = 0.3; // kg CO2 per km
  }

  const currentYear = new Date().getFullYear();
  const age = currentYear - year;
  if (age > 10) {
    baseRate *= 1.2;
  } else if (age > 5) {
    baseRate *= 1.1;
  }

  return baseRate;
}

module.exports = calculateEmissionRate;
