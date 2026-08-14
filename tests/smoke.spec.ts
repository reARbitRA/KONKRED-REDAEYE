import { expect, test } from '@playwright/test';

test('application shell and install metadata load', async ({ page }) => {
  await page.goto('/');
  await expect(page).toHaveTitle(/RED A EYE/i);

  const manifest = await page.locator('link[rel="manifest"]').getAttribute('href');
  expect(manifest).toBe('/manifest.webmanifest');
  await expect(page.locator('body')).toBeVisible();
});

test('production CSP is present', async ({ page }) => {
  await page.goto('/');
  const csp = await page.locator('meta[http-equiv="Content-Security-Policy"]').getAttribute('content');
  expect(csp).toContain("default-src 'self'");
  expect(csp).toContain("object-src 'none'");
});
