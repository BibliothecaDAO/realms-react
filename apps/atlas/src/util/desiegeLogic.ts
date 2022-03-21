export const applyActionAmount = (
  amount: string,
  boostBips: string,
  shield: number,
  health: number
) => {
  const amountInt = parseInt(amount);

  const amountPlusBoost =
    ((amountInt / 100) * parseInt(boostBips)) / 100 + amountInt;

  const diff = amountPlusBoost - shield;

  if (amountPlusBoost <= shield) {
    // Shield remains
    return {
      amountPlusBoost: amountPlusBoost.toFixed(2),
      shield: (shield - amountPlusBoost).toFixed(2),
      health: health.toFixed(2),
    };
  } else {
    const healthRemaining = health - diff;
    return {
      amountPlusBoost: amountPlusBoost.toFixed(2),
      shield: '0',
      health: healthRemaining > 0 ? healthRemaining.toFixed(2) : '0',
    };
  }
};
