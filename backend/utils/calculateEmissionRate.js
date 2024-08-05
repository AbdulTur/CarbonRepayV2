function calculateEmissionRate(engineType, year, fuelEfficiency, drivingCondition) {
  let baseRate = 0;

  switch (engineType.toLowerCase()) {
    case 'petrol':
      baseRate = 0.2;
      break;
    case 'diesel':
      baseRate = 0.25; 
      break;
    case 'electric':
      baseRate = 0.05; 
      break;
    default:
      baseRate = 0.3; 
  }


  if (drivingCondition === 'city') {
    baseRate *= 1.2;
  } else if (drivingCondition === 'highway') {
    baseRate *= 0.9;
  }

  baseRate *= (fuelEfficiency / 100); 

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
