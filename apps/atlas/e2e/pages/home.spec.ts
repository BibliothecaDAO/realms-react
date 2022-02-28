import { test, expect } from '@playwright/test';

test.describe('Homepage', () => {
  test('should have a title containing Atlas', async ({ page }) => {
    await page.goto('/');
    await expect(page).toHaveTitle(/.*atlas/);
  });
});
