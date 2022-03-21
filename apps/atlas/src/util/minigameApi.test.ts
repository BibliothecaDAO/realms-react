import {
  getNextMintAmount,
  MINIMUM_MINT_AMOUNT,
  EFFECT_BASE_FACTOR,
} from './minigameApi';

describe('Dynamic element balancing', () => {
  test('calculates next mint amount', () => {
    const light = 10000;
    const dark = 40000;
    const next = getNextMintAmount({ light, dark });
    expect(next).toBe((dark - light) / 2);
  });
  test('uses minimum amount', () => {
    const multiplier = EFFECT_BASE_FACTOR; // to convert to basis points
    const light = MINIMUM_MINT_AMOUNT * multiplier;
    const dark = MINIMUM_MINT_AMOUNT * 2 * multiplier;
    // diff would be MIN / 2 which is lower than minimum
    const next = getNextMintAmount({ light, dark });
    expect(next).toEqual(MINIMUM_MINT_AMOUNT * multiplier);
  });
});
