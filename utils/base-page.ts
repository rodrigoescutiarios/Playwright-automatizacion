import { Page, test } from '@playwright/test';

export class BasePage {
    protected page: Page;
    
    constructor(page: Page) {
        this.page = page;
    }
    
    protected async execute(stepName: string, action: () => Promise<void>) {
        await test.step(stepName, async () => {
            await action();
            const screenshot = await this.page.screenshot();
            await test.info().attach(`screenshot-${stepName}`, {
                body: screenshot,
                contentType: 'image/png'
            });
        });
    }
}