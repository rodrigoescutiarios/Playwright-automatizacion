import { Reporter, FullConfig, Suite, TestCase, TestResult, FullResult, TestStep } from '@playwright/test/reporter';
import { Document, Packer, Paragraph, TextRun, ImageRun, HeadingLevel, AlignmentType, Table, TableRow, TableCell, WidthType, BorderStyle, Header, Footer, PageNumber, VerticalAlign, ShadingType } from 'docx';
import * as fs from 'fs';
import * as path from 'path';

class WordReporter implements Reporter {
    private testResults: Map<string, any> = new Map();
    private outputDir = 'test-reports';
    private logoPath = 'C:\\Users\\Rodrigo\\Desktop\\Trabajo\\CV_proyectos\\Playwright\\images\\logo_oiginal.png';
    
    // Colores de identidad visual
    private colors = {
        azulProfundo: '1E3A8A',
        blanco: 'FFFFFF',
        grisClaro: 'F3F4F6',
        verdeMenta: '10B981',
        negroSuave: '111827',
        rojo: 'EF4444'
    };

    onBegin(config: FullConfig, suite: Suite) {
        console.log(`Iniciando suite de pruebas con ${suite.allTests().length} tests`);
        if (!fs.existsSync(this.outputDir)) {
            fs.mkdirSync(this.outputDir, { recursive: true });
        }
    }

    onTestEnd(test: TestCase, result: TestResult) {
        const testInfo = {
            title: test.title,
            status: result.status,
            duration: result.duration,
            steps: this.extractStepsWithScreenshots(result),
            errors: result.errors,
            projectName: test.parent.project()?.name || 'default',
            executionDate: new Date()
        };
        
        const key = `${test.parent.title} - ${test.title} - ${testInfo.projectName}`;
        this.testResults.set(key, testInfo);
    }

    private extractStepsWithScreenshots(result: TestResult): any[] {
        const steps: any[] = [];
        
        const processStep = (step: TestStep, level: number = 0) => {
            if (step.category === 'test.step') {
                const stepData: any = {
                    title: step.title,
                    duration: step.duration,
                    level: level,
                    error: step.error,
                    screenshots: []
                };

                result.attachments.forEach(attachment => {
                    if (attachment.name && attachment.name.includes(step.title.substring(0, 20))) {
                        stepData.screenshots.push(attachment);
                    }
                });

                steps.push(stepData);
            }
            
            if (step.steps) {
                step.steps.forEach(s => processStep(s, level + 1));
            }
        };

        result.steps.forEach(step => processStep(step));
        
        if (steps.length > 0 && result.attachments.length > 0) {
            const unassignedScreenshots = result.attachments.filter(a => 
                a.name && a.name.includes('screenshot')
            );
            
            if (unassignedScreenshots.length === steps.length) {
                steps.forEach((step, index) => {
                    if (step.screenshots.length === 0 && unassignedScreenshots[index]) {
                        step.screenshots.push(unassignedScreenshots[index]);
                    }
                });
            }
        }
        
        return steps;
    }

    async onEnd(result: FullResult) {
        console.log(`Suite finalizada con estado: ${result.status}`);
        await this.generateWordReport();
    }

    private async generateWordReport() {
        const reportCount = this.testResults.size;
        console.log(`Generando ${reportCount} reportes...`);
        
        for (const [testName, testData] of this.testResults) {
            try {
                // Crear header con logo
                const logoBuffer = fs.existsSync(this.logoPath) ? fs.readFileSync(this.logoPath) : null;
                
                const doc = new Document({
                    sections: [{
                        headers: {
                            default: new Header({
                                children: [
                                    new Paragraph({
                                        children: logoBuffer ? [
                                            new ImageRun({
                                                data: logoBuffer,
                                                transformation: {
                                                    width: 150,
                                                    height: 50
                                                },
                                                type: "png"
                                            }),
                                            new TextRun({ text: '   TEST QACADEMY', bold: true, color: this.colors.azulProfundo, font: 'Aptos' })
                                        ] : [
                                            new TextRun({ text: 'REPORTE DE PRUEBAS AUTOMATIZADAS', bold: true, color: this.colors.azulProfundo, font: 'Aptos' })
                                        ],
                                        alignment: AlignmentType.CENTER,
                                        spacing: { after: 200 }
                                    })
                                ]
                            })
                        },
                        footers: {
                            default: new Footer({
                                children: [
                                    new Paragraph({
                                        children: [
                                            new TextRun({
                                                text: 'Página ',
                                                color: this.colors.negroSuave
                                            }),
                                            new TextRun({
                                                children: [PageNumber.CURRENT],
                                                color: this.colors.negroSuave
                                            }),
                                            new TextRun({
                                                text: ' de ',
                                                color: this.colors.negroSuave
                                            }),
                                            new TextRun({
                                                children: [PageNumber.TOTAL_PAGES],
                                                color: this.colors.negroSuave
                                            })
                                        ],
                                        alignment: AlignmentType.CENTER
                                    })
                                ]
                            })
                        },
                        properties: {
                            page: {
                                margin: {
                                    top: 2000,
                                    right: 1000,
                                    bottom: 1500,
                                    left: 1000,
                                }
                            }
                        },
                        children: await this.createDocumentContent(testName, testData)
                    }]
                });

                const fileName = `${testName.replace(/[^a-z0-9]/gi, '_')}_${Date.now()}.docx`;
                const filePath = path.join(this.outputDir, fileName);
                
                const buffer = await Packer.toBuffer(doc);
                fs.writeFileSync(filePath, buffer);
                console.log(`✓ Reporte generado: ${filePath}`);
            } catch (error) {
                console.error(`✗ Error generando reporte para ${testName}:`, error);
            }
        }
    }

    private async createDocumentContent(testName: string, testData: any): Promise<(Paragraph | Table)[]> {
        const elements: (Paragraph | Table)[] = [];

        // Título principal
        elements.push(
            new Paragraph({
                children: [
                    new TextRun({
                        text: 'INFORME DE EJECUCIÓN DE PRUEBAS',
                        bold: true,
                        color: this.colors.azulProfundo,
                        size: 32,
                        font: 'Aptos'
                    })
                ],
                heading: HeadingLevel.HEADING_1,
                alignment: AlignmentType.CENTER,
                spacing: { after: 400 }
            })
        );

        elements.push(
            new Paragraph({
                children: [
                    new TextRun({
                        text: `Caso de Prueba: ${testData.title}`,
                        color: this.colors.azulProfundo,
                        size: 24,
                        font: 'Aptos'
                    })
                ],
                alignment: AlignmentType.CENTER,
                spacing: { after: 600 }
            })
        );

        // Tabla de información general
        const infoTable = new Table({
            width: {
                size: 100,
                type: WidthType.PERCENTAGE
            },
            borders: {
                top: { style: BorderStyle.SINGLE, size: 4, color: this.colors.azulProfundo },
                bottom: { style: BorderStyle.SINGLE, size: 4, color: this.colors.azulProfundo },
                left: { style: BorderStyle.SINGLE, size: 4, color: this.colors.azulProfundo },
                right: { style: BorderStyle.SINGLE, size: 4, color: this.colors.azulProfundo },
                insideHorizontal: { style: BorderStyle.SINGLE, size: 2, color: this.colors.grisClaro },
                insideVertical: { style: BorderStyle.SINGLE, size: 2, color: this.colors.grisClaro }
            },
            rows: [
                // Fila 1
                new TableRow({
                    children: [
                        new TableCell({
                            children: [new Paragraph({ 
                                children: [new TextRun({ 
                                    text: 'Nombre', 
                                    bold: true, 
                                    color: this.colors.blanco,
                                    font: 'Aptos'
                                })], 
                                alignment: AlignmentType.CENTER
                            })],
                            width: { size: 20, type: WidthType.PERCENTAGE },
                            shading: { fill: this.colors.azulProfundo, type: ShadingType.SOLID },
                            verticalAlign: VerticalAlign.CENTER
                        }),
                        new TableCell({
                            children: [new Paragraph({ 
                                text: testData.title,
                                alignment: AlignmentType.CENTER 
                            })],
                            width: { size: 30, type: WidthType.PERCENTAGE },
                            verticalAlign: VerticalAlign.CENTER
                        }),
                        new TableCell({
                            children: [new Paragraph({ 
                                children: [new TextRun({ 
                                    text: 'Estado', 
                                    bold: true, 
                                    color: this.colors.blanco 
                                })], 
                                alignment: AlignmentType.CENTER
                            })],
                            width: { size: 20, type: WidthType.PERCENTAGE },
                            shading: { fill: this.colors.azulProfundo, type: ShadingType.SOLID },
                            verticalAlign: VerticalAlign.CENTER
                        }),
                        new TableCell({
                            children: [new Paragraph({ 
                                children: [new TextRun({ 
                                    text: testData.status.toUpperCase(),
                                    bold: true, 
                                    color: testData.status === 'passed' ? this.colors.verdeMenta : this.colors.rojo 
                                })],
                                alignment: AlignmentType.CENTER
                            })],
                            width: { size: 30, type: WidthType.PERCENTAGE },
                            shading: { 
                                fill: testData.status === 'passed' ? 'E6F7F1' : 'FFE4E4', 
                                type: ShadingType.SOLID 
                            },
                            verticalAlign: VerticalAlign.CENTER
                        })
                    ]
                }),
                // Fila 2
                new TableRow({
                    children: [
                        new TableCell({
                            children: [new Paragraph({ 
                                children: [new TextRun({ 
                                    text: 'Duración', 
                                    bold: true, 
                                    color: this.colors.blanco 
                                })], 
                                alignment: AlignmentType.CENTER
                            })],
                            shading: { fill: this.colors.azulProfundo, type: ShadingType.SOLID },
                            verticalAlign: VerticalAlign.CENTER
                        }),
                        new TableCell({
                            children: [new Paragraph({ 
                                text: `${(testData.duration / 1000).toFixed(2)} segundos`,
                                alignment: AlignmentType.CENTER 
                            })],
                            verticalAlign: VerticalAlign.CENTER
                        }),
                        new TableCell({
                            children: [new Paragraph({ 
                                children: [new TextRun({ 
                                    text: 'Navegador', 
                                    bold: true, 
                                    color: this.colors.blanco 
                                })], 
                                alignment: AlignmentType.CENTER
                            })],
                            shading: { fill: this.colors.azulProfundo, type: ShadingType.SOLID },
                            verticalAlign: VerticalAlign.CENTER
                        }),
                        new TableCell({
                            children: [new Paragraph({ 
                                text: testData.projectName,
                                alignment: AlignmentType.CENTER 
                            })],
                            verticalAlign: VerticalAlign.CENTER
                        })
                    ]
                }),
                // Fila 3
                new TableRow({
                    children: [
                        new TableCell({
                            children: [new Paragraph({ 
                                children: [new TextRun({ 
                                    text: 'Fecha y Hora de Ejecución', 
                                    bold: true, 
                                    color: this.colors.blanco 
                                })], 
                                alignment: AlignmentType.CENTER
                            })],
                            shading: { fill: this.colors.azulProfundo, type: ShadingType.SOLID },
                            verticalAlign: VerticalAlign.CENTER
                        }),
                        new TableCell({
                            children: [new Paragraph({ 
                                text: testData.executionDate.toLocaleString('es-MX'),
                                alignment: AlignmentType.CENTER 
                            })],
                            columnSpan: 3,
                            verticalAlign: VerticalAlign.CENTER
                        })
                    ]
                })
            ]
        });

        elements.push(infoTable);

        // Espacio
        elements.push(new Paragraph({ text: '', spacing: { after: 400 } }));

        // Título de pasos ejecutados
        elements.push(
            new Paragraph({
                children: [new TextRun({
                    text: 'PASOS EJECUTADOS',
                    bold: true,
                    color: this.colors.azulProfundo,
                    size: 28,
                    font: 'Aptos'
                })],
                heading: HeadingLevel.HEADING_2,
                alignment: AlignmentType.CENTER,
                spacing: { before: 400, after: 400 }
            })
        );

        // Crear una tabla individual para cada paso
        for (const [index, step] of testData.steps.entries()) {
            // Agregar espacio entre pasos
            if (index > 0) {
                elements.push(new Paragraph({ text: '', spacing: { after: 300 } }));
            }

            // Crear contenido de evidencia
            const evidenceContent: Paragraph[] = [];

            // Agregar screenshots
            for (const screenshot of step.screenshots) {
                if (screenshot.path && fs.existsSync(screenshot.path)) {
                    try {
                        const imageBuffer = fs.readFileSync(screenshot.path);
                        evidenceContent.push(
                            new Paragraph({
                                children: [
                                    new ImageRun({
                                        data: imageBuffer,
                                        transformation: {
                                            width: 600,
                                            height: 400
                                        },
                                        type: "png"
                                    })
                                ],
                                alignment: AlignmentType.CENTER
                            })
                        );
                    } catch (error) {
                        console.error(`Error cargando imagen: ${screenshot.path}`);
                    }
                } else if (screenshot.body) {
                    try {
                        evidenceContent.push(
                            new Paragraph({
                                children: [
                                    new ImageRun({
                                        data: screenshot.body,
                                        transformation: {
                                            width: 600,
                                            height: 400
                                        },
                                        type: "png"
                                    })
                                ],
                                alignment: AlignmentType.CENTER
                            })
                        );
                    } catch (error) {
                        console.error(`Error procesando screenshot`);
                    }
                }
            }

            if (evidenceContent.length === 0) {
                evidenceContent.push(
                    new Paragraph({
                        children: [new TextRun({
                            text: 'Sin evidencia',
                            color: this.colors.grisClaro,
                            font: 'Aptos'
                        })],
                        alignment: AlignmentType.CENTER
                    })
                );
            }

            // Crear tabla individual para este paso
            const stepTable = new Table({
                width: {
                    size: 100,
                    type: WidthType.PERCENTAGE
                },
                borders: {
                    top: { style: BorderStyle.SINGLE, size: 4, color: this.colors.azulProfundo },
                    bottom: { style: BorderStyle.SINGLE, size: 4, color: this.colors.azulProfundo },
                    left: { style: BorderStyle.SINGLE, size: 4, color: this.colors.azulProfundo },
                    right: { style: BorderStyle.SINGLE, size: 4, color: this.colors.azulProfundo },
                    insideHorizontal: { style: BorderStyle.SINGLE, size: 2, color: this.colors.grisClaro },
                    insideVertical: { style: BorderStyle.SINGLE, size: 2, color: this.colors.grisClaro }
                },
                rows: [
                    // Fila del título del paso
                    new TableRow({
                        children: [
                            new TableCell({
                                children: [
                                    new Paragraph({
                                        children: [
                                            new TextRun({
                                                text: `PASO ${index + 1}: ${step.title.toUpperCase()}`,
                                                bold: true,
                                                color: this.colors.blanco,
                                                font: 'Aptos',
                                                size: 24
                                            }),
                                            new TextRun({
                                                text: step.error ? '  ❌' : '  ✅',
                                                color: step.error ? this.colors.rojo : this.colors.verdeMenta,
                                                size: 24
                                            })
                                        ],
                                        alignment: AlignmentType.CENTER,
                                        spacing: { before: 200, after: 200 }
                                    })
                                ],
                                shading: { fill: this.colors.azulProfundo, type: ShadingType.SOLID },
                                verticalAlign: VerticalAlign.CENTER,
                                margins: { top: 300, bottom: 300, left: 200, right: 200 }
                            })
                        ]
                    }),
                    // Fila de la evidencia
                    new TableRow({
                        children: [
                            new TableCell({
                                children: evidenceContent,
                                verticalAlign: VerticalAlign.CENTER,
                                margins: { top: 400, bottom: 400, left: 200, right: 200 }
                            })
                        ]
                    })
                ]
            });

            elements.push(stepTable);
        }

        return elements;
    }
}

export default WordReporter;