import { test } from '@playwright/test';
import { LoginPage } from '../pages/Login';

test.describe('Login Tests', () => {
    let loginPage: LoginPage;
    
    test.beforeEach(async ({ page }) => {
        loginPage = new LoginPage(page);
        await loginPage.goto();
    });
    
    test('TC01 - Login exitoso con credenciales válidas', async () => {
        await loginPage.fillUsername('admin');
        await loginPage.fillPassword('123456');
        await loginPage.clickLoginButton();
        await loginPage.verifyRedirectToStore();
    });
    
    test('TC02 - Validar mensaje de error cuando no se ingresa usuario', async () => {
        await loginPage.clearUsername();
        await loginPage.fillPassword('123456');
        await loginPage.clickLoginButton();
        await loginPage.verifyUsernameErrorMessage();
    });
    
    test('TC03 - Validar mensaje de error cuando no se ingresa contraseña', async () => {
        await loginPage.fillUsername('admin');
        await loginPage.clearPassword();
        await loginPage.clickLoginButton();
        await loginPage.verifyPasswordErrorMessage();
    });
    
    test('TC04 - Validar mensaje de error cuando no se ingresan credenciales', async () => {
        await loginPage.clearUsername();
        await loginPage.clearPassword();
        await loginPage.clickLoginButton();
        await loginPage.verifyUsernameErrorMessage();
        await loginPage.verifyPasswordErrorMessage();
    });
    
    test('TC05 - Validar funcionalidad de mostrar/ocultar contraseña', async () => {
        await loginPage.fillPassword('123456');
        await loginPage.verifyPasswordIsHidden();
        await loginPage.clickShowPassword();
        await loginPage.verifyPasswordIsVisible();
        await loginPage.clickShowPassword();
        await loginPage.verifyPasswordIsHidden();
    });
    
    test('TC06 - Validar funcionalidad de checkbox Recordarme', async () => {
        await loginPage.clickRememberMe();
        await loginPage.verifyRememberMeIsChecked();
        await loginPage.fillUsername('admin');
        await loginPage.fillPassword('123456');
        await loginPage.clickLoginButton();
        await loginPage.verifyRedirectToStore();
    });
    
    test('TC07 - Login fallido con usuario incorrecto', async () => {
        await loginPage.fillUsername('usuarioIncorrecto');
        await loginPage.fillPassword('123456');
        await loginPage.clickLoginButton();
        await loginPage.verifyLoginPageIsDisplayed();
    });
    
    test('TC08 - Login fallido con contraseña incorrecta', async () => {
        await loginPage.fillUsername('admin');
        await loginPage.fillPassword('contraseñaIncorrecta');
        await loginPage.clickLoginButton();
        await loginPage.verifyLoginPageIsDisplayed();
    });
    
    test('TC09 - Login fallido con credenciales incorrectas', async () => {
        await loginPage.fillUsername('usuarioIncorrecto');
        await loginPage.fillPassword('contraseñaIncorrecta');
        await loginPage.clickLoginButton();
        await loginPage.verifyLoginPageIsDisplayed();
    });
    
    test('TC10 - Validar que los campos se limpian al recargar la página', async () => {
        await loginPage.fillUsername('admin');
        await loginPage.fillPassword('123456');
        await loginPage.goto(); // Recargar página
        await loginPage.verifyLoginPageIsDisplayed();
    });
});