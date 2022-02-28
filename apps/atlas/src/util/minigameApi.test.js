import {
  getNextMintAmount,
  MINIMUM_MINT_AMOUNT,
  EFFECT_BASE_FACTOR,
} from './minigameApi';

describe('Dynamic element balancing', () => {
  test('calculates next mint amount', () => {
    let light = 100;
    let dark = 400;
    let next = getNextMintAmount({ light, dark });
    expect(next).toBe((dark - light) / 2);
  });
  test('uses minimum amount', () => {
    let multiplier = EFFECT_BASE_FACTOR; // to convert to basis points
    let light = MINIMUM_MINT_AMOUNT * multiplier;
    let dark = MINIMUM_MINT_AMOUNT * 2 * multiplier;
    // diff would be MIN / 2 which is lower than minimum
    let next = getNextMintAmount({ light, dark });
    expect(next).toEqual(MINIMUM_MINT_AMOUNT * multiplier);
  });
});
