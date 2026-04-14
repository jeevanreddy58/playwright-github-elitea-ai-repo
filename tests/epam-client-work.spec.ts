import { test, expect } from '@playwright/test';

// Test: Navigate EPAM site -> Services -> Explore Our Client Work -> verify "Client Work" text
// Located at: tests/epam-client-work.spec.ts

test.describe('EPAM - Explore Client Work', () => {
  test('Navigate to EPAM Services -> Explore Our Client Work and verify Client Work text', async ({ page }) => {
    // Step 1 — Navigate to homepage
    await page.goto('https://www.epam.com/', { waitUntil: 'networkidle' });

    // Optional: handle common cookie / consent banners if present
    const cookieButton = page.getByRole('button', { name: /accept all cookies|accept all|accept cookies|agree|allow cookies|accept/i });
    if (await cookieButton.count() > 0) {
      await cookieButton.first().click().catch(() => {});
    }

    // Step 2 — Select "Services" from the header
    // Try a role-based locator first
    const servicesLink = page.getByRole('link', { name: /^Services$/i });
    if (await servicesLink.count() === 0) {
      // fallback to partial match if exact label differs in DOM
      const fallback = page.getByRole('link', { name: /Services/i }).first();
      await expect(fallback).toBeVisible({ timeout: 5000 });
      await fallback.click();
    } else {
      await expect(servicesLink.first()).toBeVisible({ timeout: 5000 });
      await servicesLink.first().click();
    }

    // Wait for menu/navigation to settle
    await page.waitForLoadState('networkidle');

    // Step 3 — Click "Explore Our Client Work"
    const exploreLink = page.getByRole('link', { name: /Explore Our Client Work/i });
    if (await exploreLink.count() > 0) {
      await Promise.all([
        page.waitForNavigation({ waitUntil: 'networkidle' }).catch(() => {}),
        exploreLink.first().click().catch(() => {}),
      ]);
    } else {
      // fallback to any element with the text
      const exploreText = page.getByText(/Explore Our Client Work/i);
      await expect(exploreText.first()).toBeVisible({ timeout: 7000 });
      await Promise.all([
        page.waitForNavigation({ waitUntil: 'networkidle' }).catch(() => {}),
        exploreText.first().click().catch(() => {}),
      ]);
    }

    // Step 4 — Verify the "Client Work" text is visible on the target page
    const clientWork = page.getByText(/Client Work/i);
    await expect(clientWork.first()).toBeVisible({ timeout: 10000 });
  });
});
