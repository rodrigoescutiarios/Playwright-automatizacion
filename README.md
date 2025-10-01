# 🚀 Framework de Automatización con Playwright

Framework de automatización de pruebas E2E desarrollado con Playwright y TypeScript, implementando el patrón Page Object Model (POM) y generación automática de reportes profesionales en Word.

## 📋 Requisitos Previos

- **Node.js** (versión 14 o superior)
- **npm** o **yarn** como gestor de paquetes
- **Visual Studio Code** (recomendado) o cualquier editor de código

## 🔧 Instalación

### 1. Clonar el repositorio
```bash
git clone https://github.com/rodrigoescutiarios/Playwright-automatizacion.git
cd Playwright-automatizacion
```

### 2. Instalar las dependencias
```bash
npm install
```

### 3. Instalar los navegadores de Playwright
```bash
npx playwright install
```

### 4. Instalar la librería para reportes en Word
```bash
npm install docx --save-dev
```

## 🏗️ Estructura del Proyecto

```
Playwright/
├── constants/
│   └── urls.ts                 # URLs y rutas de la aplicación
├── pages/
│   └── Login.tsx               # Page Object del módulo de Login
├── tests/
│   └── login.spec.ts           # Casos de prueba del Login
├── utils/
│   └── base-page.ts           # Clase base con funciones comunes
├── reporters/
│   └── word-reporter.ts       # Generador de reportes en Word
├── test-reports/               # Carpeta de reportes generados (se crea automáticamente)
├── test-results/               # Resultados de las pruebas
├── images/
│   └── logo_original.png       # Logo para los reportes
├── playwright.config.ts        # Configuración principal de Playwright
└── package.json               # Dependencias del proyecto
```

## 📁 Descripción de Archivos Principales

### **playwright.config.ts**
Archivo de configuración principal que define:
- **testDir**: Directorio donde están los tests (`./tests`)
- **reporters**: Configuración de reportes (HTML y Word personalizado)
- **use**: Configuraciones globales (trace, screenshots, video)
- **projects**: Navegadores donde se ejecutarán las pruebas (actualmente solo Chromium)

### **constants/urls.ts**
Centraliza todas las URLs de la aplicación:
```typescript
export const BASE_URL = 'https://practica.testqacademy.com';
export const ROUTES = {
    STORE: '/store'
};
```

### **utils/base-page.ts**
Clase base que proporciona:
- Método `execute()` para encapsular acciones con capturas automáticas
- Integración con el sistema de pasos de Playwright
- Captura de screenshots automática después de cada acción

### **pages/Login.tsx**
Page Object que encapsula:
- Selectores del módulo de login
- Métodos de interacción (llenar campos, clicks, validaciones)
- Cada método incluye su propia captura de pantalla

### **reporters/word-reporter.ts**
Reporter personalizado que genera:
- Documentos Word profesionales con identidad visual corporativa
- Tablas con información de la ejecución
- Evidencias (screenshots) por cada paso
- Paginación automática

## ▶️ Ejecución de Pruebas

### **Ejecutar todas las pruebas**
```bash
npx playwright test
```

### **Ejecutar un test específico**
```bash
npx playwright test login.spec.ts
```

### **Ejecutar tests en modo debug**
```bash
npx playwright test --debug
```

### **Ejecutar tests con interfaz gráfica**
```bash
npx playwright test --ui
```

### **Ver el último reporte HTML**
```bash
npx playwright show-report
```

## 📊 Reportes

### **Reporte HTML**
Se genera automáticamente en `playwright-report/`. Para visualizarlo:
```bash
npx playwright show-report
```

### **Reporte Word**
Se genera automáticamente en `test-reports/` después de cada ejecución. Incluye:
- ✅ Información general del test (nombre, estado, duración, navegador)
- ✅ Fecha y hora de ejecución
- ✅ Tabla detallada de pasos ejecutados
- ✅ Screenshots por cada paso
- ✅ Identidad visual corporativa

## 🎨 Identidad Visual

El framework utiliza la siguiente paleta de colores en los reportes:

| Color | Código HEX | Uso |
|-------|------------|-----|
| **Azul profundo** | `#1E3A8A` | Headers y títulos principales |
| **Verde menta** | `#10B981` | Estados de éxito |
| **Rojo** | `#EF4444` | Estados de fallo |
| **Gris claro** | `#F3F4F6` | Bordes y elementos secundarios |
| **Negro suave** | `#111827` | Texto principal |

## 🧪 Casos de Prueba Disponibles

El framework incluye **10 casos de prueba** para el módulo de Login:

| Test ID | Descripción |
|---------|-------------|
| **TC01** | Login exitoso con credenciales válidas |
| **TC02** | Validar mensaje de error sin usuario |
| **TC03** | Validar mensaje de error sin contraseña |
| **TC04** | Validar mensajes de error sin credenciales |
| **TC05** | Funcionalidad mostrar/ocultar contraseña |
| **TC06** | Funcionalidad checkbox "Recordarme" |
| **TC07** | Login fallido con usuario incorrecto |
| **TC08** | Login fallido con contraseña incorrecta |
| **TC09** | Login fallido con ambas credenciales incorrectas |
| **TC10** | Validar limpieza de campos al recargar |

## 🔍 Modo Depuración

### **Ver los navegadores durante la ejecución**
Modificar en `playwright.config.ts`:
```typescript
use: {
    headless: false,  // Agregar esta línea
    trace: 'on',
    screenshot: 'on',
    video: 'on',
}
```

### **Desactivar el paralelismo**
Modificar en `playwright.config.ts`:
```typescript
fullyParallel: false,  // Cambiar a false
workers: 1,           // Forzar un solo worker
```

## 🛠️ Personalización

### **Agregar nuevos navegadores**
Descomentar en `playwright.config.ts` los navegadores deseados:
```typescript
projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'firefox',  // Descomentar para activar
      use: { ...devices['Desktop Firefox'] },
    },
]
```

### **Cambiar el logo del reporte**
Reemplazar el archivo en:
```
images/logo_original.png
```

### **Modificar timeouts**
Agregar en `playwright.config.ts`:
```typescript
use: {
    actionTimeout: 30000,      // Timeout para acciones
    navigationTimeout: 30000,  // Timeout para navegación
}
```

## 📝 Agregar Nuevos Tests

### **1. Crear un nuevo Page Object**
Crear archivo en `pages/`:
```typescript
import { expect } from '@playwright/test';
import { BasePage } from '../utils/base-page';

export class NuevaPagina extends BasePage {
    // Selectores
    private boton = '#mi-boton';
    
    // Métodos
    async clickBoton() {
        await this.execute('Click en botón', async () => {
            await this.page.click(this.boton);
        });
    }
}
```

### **2. Crear el archivo de test**
Crear archivo en `tests/`:
```typescript
import { test } from '@playwright/test';
import { NuevaPagina } from '../pages/NuevaPagina';

test.describe('Nuevos Tests', () => {
    test('TC01 - Descripción del test', async ({ page }) => {
        const nuevaPagina = new NuevaPagina(page);
        await nuevaPagina.clickBoton();
    });
});
```

## 💡 Tips y Mejores Prácticas

### **Nomenclatura de Tests**
- Usar formato: `TC[número] - [Descripción clara]`
- Ejemplo: `TC01 - Login exitoso con credenciales válidas`

### **Selectores Recomendados**
Prioridad de selectores:
1. `id` → `#elemento-id`
2. `data-testid` → `[data-testid="elemento"]`
3. `class` específica → `.clase-unica`
4. `xpath` → `//button[text()="Click"]`

### **Organización de Page Objects**
- Un archivo por página/módulo
- Heredar siempre de `BasePage`
- Mantener selectores privados
- Métodos públicos descriptivos

## 🚨 Solución de Problemas Comunes

### **Error: "Test timeout exceeded"**
```typescript
// Aumentar timeout en el test específico
test('Mi test', async ({ page }) => {
    test.setTimeout(60000); // 60 segundos
});
```

### **Error: "Element not found"**
```typescript
// Agregar esperas explícitas
await page.waitForSelector('#elemento', { timeout: 10000 });
```

### **Screenshots no aparecen en el reporte**
- Verificar que `BasePage` esté siendo usado correctamente
- Confirmar que el método `execute()` envuelve las acciones

## 📦 Scripts Útiles

Agregar en `package.json`:
```json
{
  "scripts": {
    "test": "npx playwright test",
    "test:debug": "npx playwright test --debug",
    "test:ui": "npx playwright test --ui",
    "report": "npx playwright show-report",
    "test:login": "npx playwright test login.spec.ts"
  }
}
```

Luego ejecutar con:
```bash
npm run test
npm run test:debug
npm run test:ui
npm run report
npm run test:login
```

## 🤝 Contribución

1. Crear una rama para tu feature:
```bash
git checkout -b feature/nueva-funcionalidad
```

2. Commit de tus cambios:
```bash
git commit -m 'feat: Agregar nueva funcionalidad'
```

3. Push a la rama:
```bash
git push origin feature/nueva-funcionalidad
```

4. Crear un Pull Request

## 📧 Soporte

Para preguntas o problemas, contactar:
- 📧 Email: rodrigoingsis@gmail.com
- 🔗 Repositorio: [https://github.com/rodrigoescutiarios/Playwright-automatizacion](https://github.com/rodrigoescutiarios/Playwright-automatizacion)

## 📄 Licencia

Este proyecto es de uso interno de la empresa. Todos los derechos reservados.

---

<p align="center">
  <b>Desarrollado con ❤️ por Jose Rodrigo Escutia Rios</b>
</p>

<p align="center">
  <i>Framework Version: 1.0.0 | Última actualización: 2025</i>
</p>