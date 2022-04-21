const applyActionAmount = require('./desiegeLogic').applyActionAmount;

describe('Apply action amount', () => {
  test('with shield remaining', () => {
    const health = 100;
    const shield = 40;
    const res = applyActionAmount('30', '200', shield, health);
    expect(res.amountPlusBoost).toBe('30.60'); // 30 + 2%
    expect(res.shield).toBe('9.40'); // 40 - 30.6
    expect(res.health).toBe(health.toFixed(2));
  });

  test('with shield down', () => {
    const health = 100;
    const shield = 30;
    const res = applyActionAmount('40', '200', shield, health);
    expect(res.amountPlusBoost).toBe('40.80'); // 40 + 2%
    expect(res.shield).toBe('0'); // 40 - 30.6
    expect(res.health).toBe((health - 10.8).toFixed(2));
  });

  test('with 0 shield', () => {
    const health = 100;
    const shield = 0;
    const res = applyActionAmount('40', '200', shield, health);
    expect(res.shield).toBe('0');
    expect(res.health).toBe((health - 40.8).toFixed(2));
  });

  test('massive damage bringing health to 0', () => {
    const health = 20;
    const shield = 0;
    const amount = '100';
    const res = applyActionAmount(amount, '200', shield, health);
    expect(res.shield).toBe('0');
    expect(res.health).toBe('0');
  });
});
