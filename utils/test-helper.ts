import { Page, test } from '@playwright/test';

export async function stepWithScreenshot(
    stepName: string, 
    action: () => Promise<void>,
    page: Page
) {
    await test.step(stepName, async () => {
        await action();
        await page.screenshot({ 
            path: `test-results/screenshots/${stepName.replace(/[^a-z0-9]/gi, '_')}_${Date.now()}.png`,
            fullPage: true 
        });
    });
}