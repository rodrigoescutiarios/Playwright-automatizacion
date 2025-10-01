import { expect } from '@playwright/test';
import { BASE_URL, ROUTES } from '../constants/urls';
import { BasePage } from '../utils/base-page';

export class LoginPage extends BasePage {
    // Selectores - Inputs y botones
    private usernameInput = '#qa-username-input';
    private passwordInput = '#qa-password-input';
    private loginButton = '#qa-login-button';
    private rememberMeCheckbox = "//span[@class='qa-checkmark']";
    private showPasswordButton = "//button[normalize-space()='MOSTRAR']";
    
    // Selectores - Mensajes de error
    private usernameError = '#qa-username-error';
    private passwordError = '#qa-password-error';
    
    async goto() {
        await this.execute('Navegar a la página de login', async () => {
            await this.page.goto(BASE_URL);
        });
    }
    
    async fillUsername(username: string) {
        await this.execute(`Ingresar usuario: ${username}`, async () => {
            await this.page.fill(this.usernameInput, username);
        });
    }
    
    async fillPassword(password: string) {
        await this.execute('Ingresar contraseña', async () => {
            await this.page.fill(this.passwordInput, password);
        });
    }
    
    async clickLoginButton() {
        await this.execute('Hacer clic en botón login', async () => {
            await this.page.click(this.loginButton);
        });
    }
    
    async clickRememberMe() {
        await this.execute('Hacer clic en checkbox Recordarme', async () => {
            await this.page.click(this.rememberMeCheckbox);
        });
    }
    
    async clickShowPassword() {
        await this.execute('Hacer clic en botón Mostrar contraseña', async () => {
            await this.page.click(this.showPasswordButton);
        });
    }
    
    async clearUsername() {
        await this.execute('Limpiar campo de usuario', async () => {
            await this.page.fill(this.usernameInput, '');
        });
    }
    
    async clearPassword() {
        await this.execute('Limpiar campo de contraseña', async () => {
            await this.page.fill(this.passwordInput, '');
        });
    }
    
    async verifyUsernameErrorMessage(expectedMessage: string = 'El usuario es requerido') {
        await this.execute(`Validar mensaje de error: "${expectedMessage}"`, async () => {
            await expect(this.page.locator(this.usernameError)).toContainText(expectedMessage);
        });
    }
    
    async verifyPasswordErrorMessage(expectedMessage: string = 'La contraseña es requerida') {
        await this.execute(`Validar mensaje de error: "${expectedMessage}"`, async () => {
            await expect(this.page.locator(this.passwordError)).toContainText(expectedMessage);
        });
    }
    
    async verifyPasswordIsVisible() {
        await this.execute('Validar que la contraseña es visible', async () => {
            const passwordType = await this.page.locator(this.passwordInput).getAttribute('type');
            expect(passwordType).toBe('text');
        });
    }
    
    async verifyPasswordIsHidden() {
        await this.execute('Validar que la contraseña está oculta', async () => {
            const passwordType = await this.page.locator(this.passwordInput).getAttribute('type');
            expect(passwordType).toBe('password');
        });
    }
    
    async verifyRememberMeIsChecked() {
        await this.execute('Validar que Recordarme está seleccionado', async () => {
            const checkbox = this.page.locator(this.rememberMeCheckbox).locator('..');
            await expect(checkbox).toHaveClass(/.*checked.*/);
        });
    }
    
    async verifyRedirectToStore() {
        await this.execute('Validar redirección a /store', async () => {
            await this.page.waitForLoadState('networkidle');
            await expect(this.page).toHaveURL(`${BASE_URL}${ROUTES.STORE}`);
        });
    }
    
    async verifyLoginPageIsDisplayed() {
        await this.execute('Validar que la página de login es visible', async () => {
            await expect(this.page.locator(this.loginButton)).toBeVisible();
        });
    }
}