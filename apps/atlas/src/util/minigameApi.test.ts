import {
  getNextMintAmount,
  MINIMUM_MINT_AMOUNT,
  EFFECT_BASE_FACTOR,
} from './minigameApi';

const minimumMint = MINIMUM_MINT_AMOUNT * EFFECT_BASE_FACTOR;

describe('Dynamic element balancing', () => {
  test('calculates next mint amount for light when dark minted more', () => {
    const light = 10000;
    const dark = 40000;
    const next = getNextMintAmount({ light, dark }, 'light');
    // Light is not auto-balanced
    expect(next).toBe(minimumMint);
  });
  test('calculates next mint amount for light when light minted more', () => {
    const light = 40000;
    const dark = 10000;
    const next = getNextMintAmount({ light, dark }, 'light');
    expect(next).toBe(minimumMint);
  });
  test('calculates next mint amount for dark when light minted more', () => {
    const light = 40000;
    const dark = 10000;
    const next = getNextMintAmount({ light, dark }, 'dark');
    // Dark amount minted is boosted for balance
    expect(next).toBe((light - dark) / 2);
  });
  test('calculates next mint amount for dark when dark minted more', () => {
    const light = 10000;
    const dark = 40000;
    const next = getNextMintAmount({ light, dark }, 'dark');
    expect(next).toBe(minimumMint);
  });
  test('uses minimum amount', () => {
    const multiplier = EFFECT_BASE_FACTOR; // to convert to basis points
    const light = MINIMUM_MINT_AMOUNT * multiplier;
    const dark = MINIMUM_MINT_AMOUNT * 2 * multiplier;
    // diff would be MIN / 2 which is lower than minimum
    const next = getNextMintAmount({ light, dark }, 'light');
    expect(next).toEqual(MINIMUM_MINT_AMOUNT * multiplier);
  });
});
