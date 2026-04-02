const settlementCalculationEngine = require('../../src/services/settlementCalculationEngine');
const { loadPayrollConcepts } = require('../../src/utils/payrollConcepts');



beforeEach(async () => {
    await global.testHelper.prisma.employee.deleteMany({});
    await global.testHelper.prisma.concept.deleteMany({});
    await global.testHelper.loadStaticData();
    await global.testHelper.loadTestEmployees();
    // Cargar conceptos de nómina para que estén disponibles en los tests
    await loadPayrollConcepts();
})

describe('Settlement Calculation Engine', () => {
    describe('calculateConceptValue', () => {
        test('Debe calcular el valor de un concepto lineal correctamente', async () => {
            const concept = await global.testHelper.prisma.concept.findFirst({
                where: {
                    code: '101'
                }
            });

            const employee = await global.testHelper.prisma.employee.findFirst({
                where: {
                    identification: '123'
                }
            });

            // Verificar que el concepto y empleado existen
            expect(concept).toBeTruthy();
            expect(employee).toBeTruthy();
            console.log(employee.id);

            const result = await settlementCalculationEngine.calculateConceptValue(
                parseInt(concept.id, 10),
                parseInt(employee.id, 10),
                15,
                '2024-01-31'
            );

            // El resultado debería ser: (2000000 / 30) * 15 = 1000000
            expect(result).toBe(1000000);
            expect(typeof result).toBe('number');
        })
        test('Debe calcular el valor de un concepto FACTORIAL correctamente', async () => {
            const concept = await global.testHelper.prisma.concept.findFirst({
                where: {
                    code: '105'
                }
            });
            console.log(concept);
            const employee = await global.testHelper.prisma.employee.findFirst({
                where: {
                    identification: '123'
                }
            });

            // Verificar que el concepto y empleado existen
            expect(concept).toBeTruthy();
            expect(employee).toBeTruthy();
            console.log(employee.id);

            const result = await settlementCalculationEngine.calculateConceptValue(
                parseInt(concept.id, 10),
                parseInt(employee.id, 10),
                6,
                '2024-01-31'
            );

            // El resultado debería ser: (2000000 / 30) * 15 = 1000000
            expect(result).toBe(75757.58);
            expect(typeof result).toBe('number');
        })
        test('Debe arrojar un error cuando el tipo de cálculo no es soportado', async () => {
            // Arrange
            const conceptId = 999;
            const employeeId = 1;
            const quantity = 1;
            const date = '2024-01-31';

            // Act & Assert
            await expect(
                settlementCalculationEngine.calculateConceptValue(
                    conceptId,
                    employeeId,
                    quantity,
                    date
                )
            ).rejects.toThrow('Calculation type not supported');
        });
        test('Cálculo LINEAL correcto cuando la cantidad es un entero', async () => {
            const concept = await global.testHelper.prisma.concept.findFirst({
                where: {
                    code: '143'
                }
            });

            const employee = await global.testHelper.prisma.employee.findFirst({
                where: {
                    identification: '123'
                }
            });

            // Verificar que el concepto y empleado existen
            expect(concept).toBeTruthy();
            expect(employee).toBeTruthy();
            console.log(employee.id);

            const result = await settlementCalculationEngine.calculateConceptValue(
                parseInt(concept.id, 10),
                parseInt(employee.id, 10),
                1,
                '2024-01-31'
            );

            // El resultado debería ser: (2000000 / 30) * 15 = 1000000
            expect(result).toBe(66666.67);
            expect(typeof result).toBe('number');
        })
        test('Cálculo LINEAL correcto cuando la cantidad es un decimal', async () => {
            const concept = await global.testHelper.prisma.concept.findFirst({
                where: {
                    code: '101'
                }
            });

            const employee = await global.testHelper.prisma.employee.findFirst({
                where: {
                    identification: '123'
                }
            });

            // Verificar que el concepto y empleado existen
            expect(concept).toBeTruthy();
            expect(employee).toBeTruthy();
            console.log(employee.id);

            const result = await (settlementCalculationEngine.calculateConceptValue(
                parseInt(concept.id, 10),
                parseInt(employee.id, 10),
                0.5,
                '2024-01-31'
            ));

            // El resultado debería ser: (2000000 / 30) * 15 = 1000000
            expect(result).toBe(33333.33);
            expect(typeof result).toBe('number');
        })
        test('Cálculo LINEAL correcto cuando la cantidad es un valor negativo', async () => {
            const concept = await global.testHelper.prisma.concept.findFirst({
                where: {
                    code: '101'
                }
            });

            const employee = await global.testHelper.prisma.employee.findFirst({
                where: {
                    identification: '123'
                }
            });

            // Verificar que el concepto y empleado existen
            expect(concept).toBeTruthy();
            expect(employee).toBeTruthy();
            console.log(employee.id);

            expect(settlementCalculationEngine.calculateConceptValue(
                parseInt(concept.id, 10),
                parseInt(employee.id, 10),
                -1,
                '2024-01-31'
            )).rejects.toThrow('Quantity cannot be negative');
        })
        test('Cálculo LINEAL redondeado a 2 decimales', async () => {
            const concept = await global.testHelper.prisma.concept.findFirst({
                where: {
                    code: '101'
                }
            });

            const employee = await global.testHelper.prisma.employee.findFirst({
                where: {
                    identification: '123'
                }
            });

            // Verificar que el concepto y empleado existen
            expect(concept).toBeTruthy();
            expect(employee).toBeTruthy();
            console.log(employee.id);

            const result = await settlementCalculationEngine.calculateConceptValue(
                parseInt(concept.id, 10),
                parseInt(employee.id, 10),
                1,
                '2024-01-31'
            );
            expect(Number.isFinite(result) && (result * 100) % 1 === 0).toBe(true);
            expect(typeof result).toBe('number');
        })
        test('Cálculo FACTORIAL correcto cuando la cantidad es un entero positivo', async () => {
            const concept = await global.testHelper.prisma.concept.findFirst({
                where: {
                    code: '105'
                }
            });
            console.log(concept);
            const employee = await global.testHelper.prisma.employee.findFirst({
                where: {
                    identification: '123'
                }
            });

            // Verificar que el concepto y empleado existen
            expect(concept).toBeTruthy();
            expect(employee).toBeTruthy();
            console.log(employee.id);

            const result = await settlementCalculationEngine.calculateConceptValue(
                parseInt(concept.id, 10),
                parseInt(employee.id, 10),
                1,
                '2024-01-31'
            );

            // El resultado debería ser: (2000000 / 30) * 15 = 1000000
            expect(result).toBe(12626.26);
            expect(typeof result).toBe('number');
        })
        test('Cálculo FACTORIAL correcto cuando la cantidad es un entero negativo', async () => {
            const concept = await global.testHelper.prisma.concept.findFirst({
                where: {
                    code: '105'
                }
            });
            console.log(concept);
            const employee = await global.testHelper.prisma.employee.findFirst({
                where: {
                    identification: '123'
                }
            });

            // Verificar que el concepto y empleado existen
            expect(concept).toBeTruthy();
            expect(employee).toBeTruthy();
            console.log(employee.id);

            expect(settlementCalculationEngine.calculateConceptValue(
                parseInt(concept.id, 10),
                parseInt(employee.id, 10),
                -1,
                '2024-01-31'
            )).rejects.toThrow('Quantity cannot be negative');
        })
        test('Redondeo a 2 decimales en cálculo FACTORIAL', async () => {
            const concept = await global.testHelper.prisma.concept.findFirst({
                where: {
                    code: '105'
                }
            });
            console.log(concept);
            const employee = await global.testHelper.prisma.employee.findFirst({
                where: {
                    identification: '123'
                }
            });

            // Verificar que el concepto y empleado existen
            expect(concept).toBeTruthy();
            expect(employee).toBeTruthy();
            console.log(employee.id);

            const result = await settlementCalculationEngine.calculateConceptValue(
                parseInt(concept.id, 10),
                parseInt(employee.id, 10),
                1,
                '2024-01-31'
            );

            // El resultado debería ser: (2000000 / 30) * 15 = 1000000
            expect(Number.isFinite(result) && (result * 100) % 1 === 0).toBe(true);
            expect(typeof result).toBe('number');
        })
    })

    describe('getBaseValue', () => {
        test('Base de tipo Auxilio de transporte', async () => {
            const concept = await global.testHelper.prisma.concept.findFirst({
                where: {
                    code: '127'
                }
            });
            const employee = await global.testHelper.prisma.employee.findFirst({
                where: {
                    identification: '123'
                }
            });
            expect(concept).toBeTruthy();
            expect(employee).toBeTruthy();

            const result = await settlementCalculationEngine.getBaseValue(
                parseInt(concept.id, 10),
                parseInt(employee.id, 10),
                '2024-01-31'
            );
            expect(result).toBe(6666.666666666667);
            expect(typeof result).toBe('number');
        })
        test('Base de tipo HOURLY', async () => {
            const concept = await global.testHelper.prisma.concept.findFirst({
                where: {
                    code: '105'
                }
            });
            const employee = await global.testHelper.prisma.employee.findFirst({
                where: {
                    identification: '123'
                }
            });
            expect(concept).toBeTruthy();
            expect(employee).toBeTruthy();

            const result = await settlementCalculationEngine.getBaseValue(
                parseInt(concept.id, 10),
                parseInt(employee.id, 10),
                '2024-01-31'
            );
            expect(result).toBe(10101.0101010101);
            expect(typeof result).toBe('number');
        })
        test('Base de tipo SALARY', async () => {
            const concept = await global.testHelper.prisma.concept.findFirst({
                where: {
                    code: '101'
                }
            });
            const employee = await global.testHelper.prisma.employee.findFirst({
                where: {
                    identification: '123'
                }
            });
            expect(concept).toBeTruthy();
            expect(employee).toBeTruthy();

            const result = await settlementCalculationEngine.getBaseValue(
                parseInt(concept.id, 10),
                parseInt(employee.id, 10),
                '2024-01-31'
            );
            expect(result).toBe(66666.66666666667);
            expect(typeof result).toBe('number');
        })
        test('Base de tipo INCOME', async () => {
            const values = [1000, 2000, 500];
            const data = {
                date: new Date('2024-01-30'),
                status: 'PENDING'
            }
            const bonificacion = await global.testHelper.prisma.concept.findFirst({
                where: {
                    code: '148'
                }
            });
            const employee = await global.testHelper.prisma.employee.findFirst({
                where: {
                    identification: '123'
                }
            });
            for (const value of values) {
                await global.testHelper.prisma.novelty.create({
                    data: {
                        ...data,
                        value: value,
                        concept: { connect: { id: parseInt(bonificacion.id, 10) } },
                        employee: { connect: { id: parseInt(employee.id, 10) } }
                    }
                });
            }

            const concept = await global.testHelper.prisma.concept.findFirst({
                where: {
                    code: '130'
                }
            });

            const result = await settlementCalculationEngine.getBaseValue(
                parseInt(concept.id, 10),
                parseInt(employee.id, 10),
                '2024-01-30',
                new Map()
            );
            expect(result).toBe(3500);
            expect(typeof result).toBe('number');
        })
        test('Base de tipo VACATION', async () => {
            const values = [1000, 2000, 500];
            const data = {
                date: new Date('2024-01-30'),
                status: 'PENDING'
            }
            const bonificacion = await global.testHelper.prisma.concept.findFirst({
                where: {
                    code: '148'
                }
            });
            const employee = await global.testHelper.prisma.employee.findFirst({
                where: {
                    identification: '123'
                }
            });
            for (const value of values) {
                await global.testHelper.prisma.novelty.create({
                    data: {
                        ...data,
                        value: value,
                        concept: { connect: { id: parseInt(bonificacion.id, 10) } },
                        employee: { connect: { id: parseInt(employee.id, 10) } }
                    }
                });
            }

            const concept = await global.testHelper.prisma.concept.findFirst({
                where: {
                    code: '139'
                }
            });

            const result = await settlementCalculationEngine.getBaseValue(
                parseInt(concept.id, 10),
                parseInt(employee.id, 10),
                '2024-01-30',
                new Map()
            );
            expect(result).toBe(3500);
            expect(typeof result).toBe('number');
        })
        test('Base de tipo IBC', async () => {
            const calculatedValues = new Map();
            const values = [3500];
            const data = {
                date: new Date('2024-01-30'),
                status: 'PENDING'
            }
            const bonificacion = await global.testHelper.prisma.concept.findFirst({
                where: {
                    code: '148'
                }
            });
            const employee = await global.testHelper.prisma.employee.findFirst({
                where: {
                    identification: '123'
                }
            });
            for (const value of values) {
                await global.testHelper.prisma.novelty.create({
                    data: {
                        ...data,
                        value: value,
                        concept: { connect: { id: parseInt(bonificacion.id, 10) } },
                        employee: { connect: { id: parseInt(employee.id, 10) } }
                    }
                });
                const conceptKey = `${employee.id}-${bonificacion.id}-${data.date.toISOString().split('T')[0]}`;
                calculatedValues.set(conceptKey, value);
            }

            const concept = await global.testHelper.prisma.concept.findFirst({
                where: {
                    code: '204'
                }
            });

            const result = await settlementCalculationEngine.getBaseValue(
                parseInt(concept.id, 10),
                parseInt(employee.id, 10),
                '2024-01-30',
                calculatedValues
            );
            expect(result).toBe(3500);
            expect(typeof result).toBe('number');
        })
        test('Base de tipo ZERO', async () => {
            const concept = await global.testHelper.prisma.concept.findFirst({
                where: {
                    code: '144'
                }
            });
            const employee = await global.testHelper.prisma.employee.findFirst({
                where: {
                    identification: '123'
                }
            });
            expect(concept).toBeTruthy();
            expect(employee).toBeTruthy();

            const result = await settlementCalculationEngine.getBaseValue(
                parseInt(concept.id, 10),
                parseInt(employee.id, 10),
                '2024-01-31'
            );
            expect(result).toBe(0);
            expect(typeof result).toBe('number');
        })
        test('Tipo de base no soportado', async () => {
            const concept = await global.testHelper.prisma.concept.findFirst({
                where: {
                    code: '102'
                }
            });
            const employee = await global.testHelper.prisma.employee.findFirst({
                where: {
                    identification: '123'
                }
            });
            expect(concept).toBeTruthy();
            expect(employee).toBeTruthy();

            expect(settlementCalculationEngine.getBaseValue(
                parseInt(concept.id, 10),
                parseInt(employee.id, 10),
                '2024-01-31'
            )).rejects.toThrow(`Tipo de base no soportado: ${concept.base}`);
        })
    })
    describe('getPeriodBase with cache', () => {
        test('Usar el caché en getBaseValue para evitar recálculos', async () => {
            const values = [7000, 500, 2300];
            const calculatedValues = new Map();
            const conceptCodes = ['118', '121', '126']
            const concepts = []
            const data = {
                date: new Date('2024-01-30'),
                status: 'PENDING'
            }
            for (const code of conceptCodes) {
                const concept = await global.testHelper.prisma.concept.findFirst({
                    where: {
                        code: code
                    }
                });
                concepts.push(concept)
            }
            const employee = await global.testHelper.prisma.employee.findFirst({
                where: {
                    identification: '123'
                }
            });
            for (let i = 0; i < concepts.length; i++) {
                const concept = concepts[i]
                await global.testHelper.prisma.novelty.create({
                    data: {
                        ...data,
                        value: values[i],
                        concept: { connect: { id: parseInt(concept.id, 10) } },
                        employee: { connect: { id: parseInt(employee.id, 10) } }
                    }
                });
                const conceptKey = `${employee.id}-${concept.id}-${data.date.toISOString().split('T')[0]}`;
                calculatedValues.set(conceptKey, values[i]);

            }

            const result = await settlementCalculationEngine.getPeriodBase(
                parseInt(employee.id, 10),
                '2024-01-30',
                'IBC',
                calculatedValues
            );
            expect(result).toBe(9800);
            expect(typeof result).toBe('number');
        })
        test('Cálculo del IBC con novedades registradas', async () => {
            const values = [7000, 500, 2300];
            const calculatedValues = new Map();
            const conceptCodes = ['118', '121', '126']
            const concepts = []
            const data = {
                date: new Date('2024-01-30'),
                status: 'PENDING'
            }
            for (const code of conceptCodes) {
                const concept = await global.testHelper.prisma.concept.findFirst({
                    where: {
                        code: code
                    }
                });
                concepts.push(concept)
            }
            const employee = await global.testHelper.prisma.employee.findFirst({
                where: {
                    identification: '123'
                }
            });
            for (let i = 0; i < concepts.length; i++) {
                const concept = concepts[i]
                await global.testHelper.prisma.novelty.create({
                    data: {
                        ...data,
                        value: values[i],
                        concept: { connect: { id: parseInt(concept.id, 10) } },
                        employee: { connect: { id: parseInt(employee.id, 10) } }
                    }
                });
                const conceptKey = `${employee.id}-${concept.id}-${data.date.toISOString().split('T')[0]}`;
                calculatedValues.set(conceptKey, values[i]);

            }

            const result = await settlementCalculationEngine.getPeriodBase(
                parseInt(employee.id, 10),
                '2024-01-30',
                'IBC',
                calculatedValues
            );
            expect(result).toBe(9800);
            expect(typeof result).toBe('number');
        })
        test('Cálculo del IBC sin novedades registradas', async () => {
            const calculatedValues = new Map();

            const employee = await global.testHelper.prisma.employee.findFirst({
                where: {
                    identification: '123'
                }
            });

            const result = await settlementCalculationEngine.getPeriodBase(
                parseInt(employee.id, 10),
                '2024-01-30',
                'IBC',
                calculatedValues
            );
            expect(result).toBe(2000000);
            expect(typeof result).toBe('number');
        })
        test('Cálculo de INCOME con novedades', async () => {
            const values = [7000, 500, 2300];
            const calculatedValues = new Map();
            const conceptCodes = ['118', '121', '126']
            const concepts = []
            const data = {
                date: new Date('2024-01-30'),
                status: 'PENDING'
            }
            for (const code of conceptCodes) {
                const concept = await global.testHelper.prisma.concept.findFirst({
                    where: {
                        code: code
                    }
                });
                concepts.push(concept)
            }
            const employee = await global.testHelper.prisma.employee.findFirst({
                where: {
                    identification: '123'
                }
            });
            for (let i = 0; i < concepts.length; i++) {
                const concept = concepts[i]
                await global.testHelper.prisma.novelty.create({
                    data: {
                        ...data,
                        value: values[i],
                        concept: { connect: { id: parseInt(concept.id, 10) } },
                        employee: { connect: { id: parseInt(employee.id, 10) } }
                    }
                });
                const conceptKey = `${employee.id}-${concept.id}-${data.date.toISOString().split('T')[0]}`;
                calculatedValues.set(conceptKey, values[i]);

            }

            const result = await settlementCalculationEngine.getPeriodBase(
                parseInt(employee.id, 10),
                '2024-01-30',
                'INCOME',
                calculatedValues
            );
            expect(result).toBe(9800);
            expect(typeof result).toBe('number');
        })
        test('Cálculo de VACATION con novedades', async () => {
            const values = [7000, 500, 2300];
            const calculatedValues = new Map();
            const conceptCodes = ['118', '121', '126']
            const concepts = []
            const data = {
                date: new Date('2024-01-30'),
                status: 'PENDING'
            }
            for (const code of conceptCodes) {
                const concept = await global.testHelper.prisma.concept.findFirst({
                    where: {
                        code: code
                    }
                });
                concepts.push(concept)
            }
            const employee = await global.testHelper.prisma.employee.findFirst({
                where: {
                    identification: '123'
                }
            });
            for (let i = 0; i < concepts.length; i++) {
                const concept = concepts[i]
                await global.testHelper.prisma.novelty.create({
                    data: {
                        ...data,
                        value: values[i],
                        concept: { connect: { id: parseInt(concept.id, 10) } },
                        employee: { connect: { id: parseInt(employee.id, 10) } }
                    }
                });
                const conceptKey = `${employee.id}-${concept.id}-${data.date.toISOString().split('T')[0]}`;
                calculatedValues.set(conceptKey, values[i]);

            }

            const result = await settlementCalculationEngine.getPeriodBase(
                parseInt(employee.id, 10),
                '2024-01-30',
                'VACATION',
                calculatedValues
            );
            expect(result).toBe(9800);
            expect(typeof result).toBe('number');
        })
        test('Tipo de base no soportado', async () => {
            const values = [7000, 500, 2300];
            const calculatedValues = new Map();
            const conceptCodes = ['118', '121', '126']
            const concepts = []
            const data = {
                date: new Date('2024-01-30'),
                status: 'PENDING'
            }
            for (const code of conceptCodes) {
                const concept = await global.testHelper.prisma.concept.findFirst({
                    where: {
                        code: code
                    }
                });
                concepts.push(concept)
            }
            const employee = await global.testHelper.prisma.employee.findFirst({
                where: {
                    identification: '123'
                }
            });
            for (let i = 0; i < concepts.length; i++) {
                const concept = concepts[i]
                await global.testHelper.prisma.novelty.create({
                    data: {
                        ...data,
                        value: values[i],
                        concept: { connect: { id: parseInt(concept.id, 10) } },
                        employee: { connect: { id: parseInt(employee.id, 10) } }
                    }
                });
                const conceptKey = `${employee.id}-${concept.id}-${data.date.toISOString().split('T')[0]}`;
                calculatedValues.set(conceptKey, values[i]);

            }

            expect(settlementCalculationEngine.getPeriodBase(
                parseInt(employee.id, 10),
                '2024-01-30',
                null,
                calculatedValues
            )).rejects.toThrow('Tipo de base no soportado: null');
        })
    })
    describe('getCalculationOrder', () => {
        test('Ordenamiento de conceptos independientes', async () => {
            const conceptCodes = [
                { code: '210' }, // IBC
                { code: '144' }, // Zero
                { code: '125' }, // Salary
                { code: '140' }, // Vacation
                { code: '127' }, // Allowance
                { code: '214' }, // null
                { code: '111' }, // Hourly
                { code: '133' }, // Income
            ]
            const concepts = [];
            for (const code of conceptCodes) {
                console.log(code);
                const c = await global.testHelper.prisma.concept.findFirst({
                    where: {
                        code: code.code
                    }
                });
                concepts.push(c);
            }
            for (const c of concepts) {
                const id = c.id;
                await global.testHelper.prisma.novelty.create({
                    data: {
                        date: new Date('2024-01-30'),
                        status: 'PENDING',
                        concept: { connect: { id: id } },
                        employee: { connect: { id: 1 } },
                        value: 1000
                    }
                });
            }

            const novelties = await global.testHelper.prisma.novelty.findMany({
                where: {
                    employeeId: 1
                },
                include: {
                    concept: true
                }
            });

            const unorderedConcepts = novelties.map(n => n.concept)

            const ordered = settlementCalculationEngine.getCalculationOrder(unorderedConcepts);

            const firstBases = ordered.slice(0, 5).map(c => c.code)
            expect(firstBases).toEqual(['214', '144', '125', '127', '111']);
        })
        test('Ordenamiento de conceptos base IBC', async () => {
            const conceptCodes = [
                { code: '210' }, // IBC
                { code: '144' }, // Zero
                { code: '125' }, // Salary
                { code: '140' }, // Vacation
                { code: '127' }, // Allowance
                { code: '214' }, // null
                { code: '111' }, // Hourly
                { code: '133' }, // Income
            ]
            const concepts = [];
            for (const code of conceptCodes) {
                console.log(code);
                const c = await global.testHelper.prisma.concept.findFirst({
                    where: {
                        code: code.code
                    }
                });
                concepts.push(c);
            }
            for (const c of concepts) {
                const id = c.id;
                await global.testHelper.prisma.novelty.create({
                    data: {
                        date: new Date('2024-01-30'),
                        status: 'PENDING',
                        concept: { connect: { id: id } },
                        employee: { connect: { id: 1 } },
                        value: 1000
                    }
                });
            }

            const novelties = await global.testHelper.prisma.novelty.findMany({
                where: {
                    employeeId: 1
                },
                include: {
                    concept: true
                }
            });

            const unorderedConcepts = novelties.map(n => n.concept)

            const ordered = settlementCalculationEngine.getCalculationOrder(unorderedConcepts);

            // const firstBases = ordered.slice(0,4).map(c => c.code)
            expect(ordered[5].base).toEqual('IBC');
        })
        test('Ordenamiento de conceptos dependientes', async () => {
            const conceptCodes = [
                { code: '210' }, // IBC
                { code: '144' }, // Zero
                { code: '125' }, // Salary
                { code: '140' }, // Vacation
                { code: '127' }, // Allowance
                { code: '214' }, // null
                { code: '111' }, // Hourly
                { code: '133' }, // Income
            ]
            const concepts = [];
            for (const code of conceptCodes) {
                console.log(code);
                const c = await global.testHelper.prisma.concept.findFirst({
                    where: {
                        code: code.code
                    }
                });
                concepts.push(c);
            }
            for (const c of concepts) {
                const id = c.id;
                await global.testHelper.prisma.novelty.create({
                    data: {
                        date: new Date('2024-01-30'),
                        status: 'PENDING',
                        concept: { connect: { id: id } },
                        employee: { connect: { id: 1 } },
                        value: 1000
                    }
                });
            }

            const novelties = await global.testHelper.prisma.novelty.findMany({
                where: {
                    employeeId: 1
                },
                include: {
                    concept: true
                }
            });

            const unorderedConcepts = novelties.map(n => n.concept)

            const ordered = settlementCalculationEngine.getCalculationOrder(unorderedConcepts);

            const firstBases = ordered.slice(5, 8).map(c => c.code)
            expect(firstBases).toEqual(['210', '140', '133']);
        })
        test('Eliminación de conceptos duplicados en ordenamiento de conceptos', async () => {
            const conceptCodes = [
                { code: '210' }, // IBC
                { code: '210' }, // IBC
                { code: '144' }, // Zero
                { code: '125' }, // Salary
                { code: '125' }, // Salary
                { code: '140' }, // Vacation
                { code: '140' }, // Vacation
                { code: '127' }, // Allowance
                { code: '111' }, // Hourly
                { code: '105' }, // Hourly
                { code: '133' }, // Income
                { code: '130' }, // Income
            ]
            const concepts = [];
            for (const code of conceptCodes) {

                const c = await global.testHelper.prisma.concept.findFirst({
                    where: {
                        code: code.code
                    }
                });
                concepts.push(c);
            }
            for (const c of concepts) {
                const id = c.id;
                await global.testHelper.prisma.novelty.create({
                    data: {
                        date: new Date('2024-01-30'),
                        status: 'PENDING',
                        concept: { connect: { id: id } },
                        employee: { connect: { id: 1 } },
                        value: 1000
                    }
                });
            }

            const novelties = await global.testHelper.prisma.novelty.findMany({
                where: {
                    employeeId: 1
                },
                include: {
                    concept: true
                }
            });

            const unorderedConcepts = novelties.map(n => n.concept)

            const ordered = settlementCalculationEngine.getCalculationOrder(unorderedConcepts);

            // const firstBases = ordered.slice(4,8).map(c => c.code);
            expect(ordered.length).toEqual(9);
            // expect(firstBases).toEqual(['210','140','133']);
        })
    })
    describe('generateSettlement', () => {
        test('Debe generar la liquidación de un empleado activo', async () => {
            // Arrange
            const employee = await global.testHelper.createTestEmployee({
                salary: 1500000,
                transportAllowance: true
            });

            const period = await global.testHelper.createTestPeriod({
                id: 1,
                period: '2024-01',
                startDate: new Date('2024-01-01'),
                endDate: new Date('2024-01-31'),
                status: 'OPEN'
            });

            const result = await settlementCalculationEngine.generateSettlement(
                employee.id,
                period.id,
                '2024-01-01',
                '2024-01-31'
            );

            // Assert
            expect(result).toHaveProperty('employeeId', employee.id);
            expect(result).toHaveProperty('periodId', period.id);
            expect(result).toHaveProperty('status', 'OPEN');
            expect(result).toHaveProperty('details');
            expect(result.details.length).toBeGreaterThan(0);
        });
        test('Debe lanzar un error al liquidar un empleado inactivo', async () => {
            // Arrange
            const employee = await global.testHelper.createTestEmployee({
                isActive: false
            });

            const period = await global.testHelper.createTestPeriod();

            // Act & Assert
            await expect(
                settlementCalculationEngine.generateSettlement(
                    employee.id,
                    period.id,
                    '2024-01-01',
                    '2024-01-31'
                )
            ).rejects.toThrow('Empleado no encontrado o inactivo');
        });
        test('Debe lanzar un error al liquidar un empleado que no existe', async () => {
            // Arrange

            const period = await global.testHelper.createTestPeriod();

            // Act
            await expect(settlementCalculationEngine.generateSettlement(
                999,
                period.id,
                '2024-01-01',
                '2024-01-31'
            )).rejects.toThrow('Empleado no encontrado');

        });
        test('Debe generar la liquidación de un empleado activo sin subsidio de transporte', async () => {
            // Arrange
            const employee = await global.testHelper.createTestEmployee({
                salary: 1500000,
                transportAllowance: false
            });

            const period = await global.testHelper.createTestPeriod({
                id: 1,
                period: '2024-01',
                startDate: new Date('2024-01-01'),
                endDate: new Date('2024-01-31'),
                status: 'OPEN'
            });

            const result = await settlementCalculationEngine.generateSettlement(
                employee.id,
                period.id,
                '2024-01-01',
                '2024-01-31'
            );

            // Assert
            expect(result).toHaveProperty('employeeId', employee.id);
            expect(result).toHaveProperty('periodId', period.id);
            expect(result).toHaveProperty('status', 'OPEN');
            expect(result).toHaveProperty('details');
            for (let i = 0; i < result.details.length; i++) {
                const detail = result.details[i];
                expect(detail.conceptId).not.toBe(127);
            }
            expect(result.details.length).toBe(3);
        });
        test('Debe generar la liquidación de un empleado activo con subsidio de transporte', async () => {
            // Arrange
            const employee = await global.testHelper.createTestEmployee({
                salary: 1500000,
                transportAllowance: true
            });

            const period = await global.testHelper.createTestPeriod({
                id: 1,
                period: '2024-01',
                startDate: new Date('2024-01-01'),
                endDate: new Date('2024-01-31'),
                status: 'OPEN'
            });

            const result = await settlementCalculationEngine.generateSettlement(
                employee.id,
                period.id,
                '2024-01-01',
                '2024-01-31'
            );

            // Assert
            expect(result).toHaveProperty('employeeId', employee.id);
            expect(result).toHaveProperty('periodId', period.id);
            expect(result).toHaveProperty('status', 'OPEN');
            expect(result).toHaveProperty('details');
            const hasTransportAllowance = result.details.some(detail => detail.conceptId === 17);
            expect(hasTransportAllowance).toBe(true);
            expect(result.details.length).toBe(4);
        });
        test('Debe generar la liquidación de un empleado para un período de 15 días', async () => {
            // Arrange
            const employee = await global.testHelper.createTestEmployee({
                salary: 2000000,
                transportAllowance: true
            });

            const period = await global.testHelper.createTestPeriod({
                id: 1,
                period: '2024-01',
                startDate: new Date('2024-01-01'),
                endDate: new Date('2024-01-15'),
                status: 'OPEN'
            });

            const result = await settlementCalculationEngine.generateSettlement(
                employee.id,
                period.id,
                '2024-01-01',
                '2024-01-15'
            );

            // Assert
            expect(result).toHaveProperty('employeeId', employee.id);
            expect(result).toHaveProperty('periodId', period.id);
            expect(result).toHaveProperty('status', 'OPEN');
            expect(result).toHaveProperty('details');
            expect(result.startDate).toEqual(new Date('2024-01-01'));
            expect(result.endDate).toEqual(new Date('2024-01-15'));
            const hasTransportAllowance = result.details.some(detail => detail.conceptId === 17);
            expect(hasTransportAllowance).toBe(true);
            expect(result.details.length).toBe(4);
            expect(result.details[0].value).toEqual(1000000);
            expect(result.details[0].quantity).toEqual(15);
            expect(result.details[1].value).toEqual(100000);
            expect(result.details[1].quantity).toEqual(15);
            expect(result.details[2].value).toEqual(40000);
            expect(result.details[2].quantity).toEqual(1);
            expect(result.details[3].value).toEqual(40000);
            expect(result.details[3].quantity).toEqual(1);
        });
        test('Debe aplicar un límite máximo de 30 días para cada liquidación de un empleado', async () => {
            // Arrange
            const employee = await global.testHelper.createTestEmployee({
                salary: 2000000,
                transportAllowance: true
            });

            const period = await global.testHelper.createTestPeriod({
                id: 1,
                period: '2024-01',
                startDate: new Date('2024-01-01'),
                endDate: new Date('2024-01-31'),
                status: 'OPEN'
            });

            const result = await settlementCalculationEngine.generateSettlement(
                employee.id,
                period.id,
                '2024-01-01',
                '2024-01-31'
            );

            // Assert
            expect(result).toHaveProperty('employeeId', employee.id);
            expect(result).toHaveProperty('periodId', period.id);
            expect(result).toHaveProperty('status', 'OPEN');
            expect(result).toHaveProperty('details');
            expect(result.startDate).toEqual(new Date('2024-01-01'));
            expect(result.endDate).toEqual(new Date('2024-01-31'));
            const hasTransportAllowance = result.details.some(detail => detail.conceptId === 17);
            expect(hasTransportAllowance).toBe(true);
            expect(result.details.length).toBe(4);
            expect(result.details[0].value).toEqual(2000000);
            expect(result.details[0].quantity).toEqual(30);
            expect(result.details[1].value).toEqual(200000);
            expect(result.details[1].quantity).toEqual(30);
            expect(result.details[2].value).toEqual(80000);
            expect(result.details[2].quantity).toEqual(1);
            expect(result.details[3].value).toEqual(80000);
            expect(result.details[3].quantity).toEqual(1);
        });
        test('Debe aplicar solo las novedades marcadas como pendientes', async () => {
            // Arrange
            const employee = await global.testHelper.createTestEmployee({
                salary: 2000000,
                transportAllowance: true
            });

            const period = await global.testHelper.createTestPeriod({
                id: 1,
                period: '2024-01',
                startDate: new Date('2024-01-01'),
                endDate: new Date('2024-01-31'),
                status: 'OPEN'
            });

            const conceptCodes = [
                { code: '125', quantity: 1, status: 'PENDING' }, // Salary
                { code: '150', value: 100000, status: 'PENDING' }, // Salary
                { code: '140', status: 'APPLIED' }, // Vacation
                { code: '130', status: 'APPLIED' }, // Vacation
                { code: '111', quantity: 1, status: 'PENDING' }, // Hourly
                { code: '105', quantity: 1, status: 'PENDING' }
            ]
            const concepts = [];
            for (const code of conceptCodes) {

                const c = await global.testHelper.prisma.concept.findFirst({
                    where: {
                        code: code.code
                    }
                });
                concepts.push(c);
            }
            for (let i = 0; i < concepts.length; i++) {
                const c = concepts[i];
                console.log(c);
                const conceptCode = conceptCodes[i];
                console.log(conceptCode);
                await global.testHelper.prisma.novelty.create({
                    data: {
                        date: new Date('2024-01-20'),
                        status: conceptCode.status,
                        concept: { connect: { id: c.id } },
                        employee: { connect: { id: employee.id } },
                        value: conceptCode.value || 0,
                        quantity: conceptCode.quantity || null
                    }
                });
            }

            const result = await settlementCalculationEngine.generateSettlement(
                employee.id,
                period.id,
                '2024-01-01',
                '2024-01-31'
            );
            console.log(result);
            // Assert
            expect(result).toHaveProperty('employeeId', employee.id);
            expect(result).toHaveProperty('periodId', period.id);
            expect(result).toHaveProperty('status', 'OPEN');
            expect(result).toHaveProperty('details');
            expect(result.startDate).toEqual(new Date('2024-01-01'));
            expect(result.endDate).toEqual(new Date('2024-01-31'));
            const hasTransportAllowance = result.details.some(detail => detail.conceptId === 17);
            expect(hasTransportAllowance).toBe(true);
            expect(result.details.length).toBeGreaterThan(0);

            const license = result.details.filter(detail => detail.conceptId === 15);
            expect(license[0].value).toEqual(66666.67);
            expect(license[0].quantity).toEqual(1);

            const compensations = result.details.filter(detail => detail.conceptId === 29);
            expect(compensations[0].value).toEqual(100000);

            const HRNDF = result.details.filter(detail => detail.conceptId === 10);
            expect(HRNDF[0].value).toEqual(11111.11);
            expect(HRNDF[0].quantity).toEqual(1);

            const HED = result.details.filter(detail => detail.conceptId === 4);
            expect(HED[0].value).toEqual(12626.26);
            expect(HED[0].quantity).toEqual(1);

            const appliedNovelties = [];
            result.details.forEach(detail => {
                if (detail.conceptId === '22' || detail.conceptId === '18') {
                    appliedNovelties.push(detail);
                }
            });
            expect(appliedNovelties.length).toBe(0);
        });
        test('Debe actualizar las novedades a un estado \'APPLIED\' al convertirlas en liquidación', async () => {
            // Arrange
            const employee = await global.testHelper.createTestEmployee({
                salary: 2000000,
                transportAllowance: true
            });

            const period = await global.testHelper.createTestPeriod({
                id: 1,
                period: '2024-01',
                startDate: new Date('2024-01-01'),
                endDate: new Date('2024-01-31'),
                status: 'OPEN'
            });

            const conceptCodes = [
                { code: '125', quantity: 1, status: 'PENDING' }, // Salary
                { code: '150', value: 100000, status: 'PENDING' }, // Salary
                { code: '111', quantity: 1, status: 'PENDING' }, // Hourly
                { code: '105', quantity: 1, status: 'PENDING' }
            ]
            const concepts = [];
            for (const code of conceptCodes) {

                const c = await global.testHelper.prisma.concept.findFirst({
                    where: {
                        code: code.code
                    }
                });
                concepts.push(c);
            }
            for (let i = 0; i < concepts.length; i++) {
                const c = concepts[i];
                console.log(c);
                const conceptCode = conceptCodes[i];
                console.log(conceptCode);
                await global.testHelper.prisma.novelty.create({
                    data: {
                        date: new Date('2024-01-20'),
                        status: conceptCode.status,
                        concept: { connect: { id: c.id } },
                        employee: { connect: { id: employee.id } },
                        value: conceptCode.value || 0,
                        quantity: conceptCode.quantity || null
                    }
                });
            }

            await settlementCalculationEngine.generateSettlement(
                employee.id,
                period.id,
                '2024-01-01',
                '2024-01-31'
            );

            const result = await global.testHelper.prisma.novelty.findMany({
                where: {
                    employeeId: employee.id,
                    periodId: period.id
                }
            });
            expect(result.length).toBe(4);
            for (const novelty of result) {
                expect(novelty.status).toBe('APPLIED');
            }
        });
        test('Debe generar correctamente los valores devengados', async () => {
            // Arrange
            const employee = await global.testHelper.createTestEmployee({
                salary: 2000000,
                transportAllowance: true
            });

            const period = await global.testHelper.createTestPeriod({
                id: 1,
                period: '2024-01',
                startDate: new Date('2024-01-01'),
                endDate: new Date('2024-01-31'),
                status: 'OPEN'
            });

            const result = await settlementCalculationEngine.generateSettlement(
                employee.id,
                period.id,
                '2024-01-01',
                '2024-01-31'
            );

            // Assert
            expect(result).toHaveProperty('employeeId', employee.id);
            expect(result).toHaveProperty('periodId', period.id);
            expect(result).toHaveProperty('status', 'OPEN');
            expect(result.earningsValue).toBe(2200000);
            expect(result.deductionsValue).toBe(160000);
            expect(result.totalValue).toBe(2200000 - 160000);
        });
        test('Debe generar correctamente el valor de las deducciones', async () => {
            // Arrange
            const employee = await global.testHelper.createTestEmployee({
                salary: 2000000,
                transportAllowance: true
            });

            const period = await global.testHelper.createTestPeriod({
                id: 1,
                period: '2024-01',
                startDate: new Date('2024-01-01'),
                endDate: new Date('2024-01-31'),
                status: 'OPEN'
            });

            const conceptCodes = [
                { code: '220', value: 220000, status: 'PENDING' }, // Salary
                { code: '230', value: 50000, status: 'PENDING' }, // Salary
                { code: '248', value: 36500, status: 'PENDING' }, // Salary
                { code: '290', value: 42500, status: 'PENDING' }, // Salary

            ]
            const concepts = [];
            for (const code of conceptCodes) {

                const c = await global.testHelper.prisma.concept.findFirst({
                    where: {
                        code: code.code
                    }
                });
                concepts.push(c);
            }
            for (let i = 0; i < concepts.length; i++) {
                const c = concepts[i];
                console.log(c);
                const conceptCode = conceptCodes[i];
                console.log(conceptCode);
                await global.testHelper.prisma.novelty.create({
                    data: {
                        date: new Date('2024-01-20'),
                        status: conceptCode.status,
                        concept: { connect: { id: c.id } },
                        employee: { connect: { id: employee.id } },
                        value: conceptCode.value || 0,
                        quantity: conceptCode.quantity || null
                    }
                });
            }

            const result = await settlementCalculationEngine.generateSettlement(
                employee.id,
                period.id,
                '2024-01-01',
                '2024-01-31'
            );
            expect(result).toHaveProperty('employeeId', employee.id);
            expect(result).toHaveProperty('periodId', period.id);
            expect(result).toHaveProperty('status', 'OPEN');
            expect(result.earningsValue).toBe(2200000);
            expect(result.deductionsValue).toBe(509000);
            expect(result.totalValue).toBe(2200000 - 509000);
        });
        test('Debe generar correctamente el valor a pagar a partir de los valores devengados y deducidos', async () => {
            // Arrange
            const employee = await global.testHelper.createTestEmployee({
                salary: 2000000,
                transportAllowance: true
            });

            const period = await global.testHelper.createTestPeriod({
                id: 1,
                period: '2024-01',
                startDate: new Date('2024-01-01'),
                endDate: new Date('2024-01-31'),
                status: 'OPEN'
            });

            const result = await settlementCalculationEngine.generateSettlement(
                employee.id,
                period.id,
                '2024-01-01',
                '2024-01-31'
            );

            // Assert
            expect(result).toHaveProperty('employeeId', employee.id);
            expect(result).toHaveProperty('periodId', period.id);
            expect(result).toHaveProperty('status', 'OPEN');
            expect(result.earningsValue).toBe(2200000);
            expect(result.deductionsValue).toBe(160000);
            expect(result.totalValue).toBe(2040000);
        });
        test('Debe crear todos los detalles de la liquidación', async () => {
            // Arrange
            const employee = await global.testHelper.createTestEmployee({
                salary: 2000000,
                transportAllowance: true
            });

            const period = await global.testHelper.createTestPeriod({
                id: 1,
                period: '2024-01',
                startDate: new Date('2024-01-01'),
                endDate: new Date('2024-01-31'),
                status: 'OPEN'
            });

            const conceptCodes = [
                { code: '125', quantity: 1, status: 'PENDING' }, // Salary
                { code: '150', value: 100000, status: 'PENDING' }, // Salary
                { code: '220', value: 220000, status: 'PENDING' }, // Salary
                { code: '248', value: 36500, status: 'PENDING' }, // Salary
                { code: '111', quantity: 1, status: 'PENDING' }, // Hourly
                { code: '105', quantity: 1, status: 'PENDING' }
            ]
            const concepts = [];
            for (const code of conceptCodes) {

                const c = await global.testHelper.prisma.concept.findFirst({
                    where: {
                        code: code.code
                    }
                });
                concepts.push(c);
            }
            for (let i = 0; i < concepts.length; i++) {
                const c = concepts[i];
                console.log(c);
                const conceptCode = conceptCodes[i];
                console.log(conceptCode);
                await global.testHelper.prisma.novelty.create({
                    data: {
                        date: new Date('2024-01-20'),
                        status: conceptCode.status,
                        concept: { connect: { id: c.id } },
                        employee: { connect: { id: employee.id } },
                        value: conceptCode.value || 0,
                        quantity: conceptCode.quantity || null
                    }
                });
            }

            const result = await settlementCalculationEngine.generateSettlement(
                employee.id,
                period.id,
                '2024-01-01',
                '2024-01-31'
            );
            console.log(result);
            // Assert
            expect(result).toHaveProperty('employeeId', employee.id);
            expect(result).toHaveProperty('periodId', period.id);
            expect(result).toHaveProperty('status', 'OPEN');
            expect(result).toHaveProperty('details');
            expect(result.startDate).toEqual(new Date('2024-01-01'));
            expect(result.endDate).toEqual(new Date('2024-01-31'));
            expect(result.details.length).toBe(conceptCodes.length + 4); // 4 son los conceptos regulares

            // Conceptos regulares
            const salary = result.details.filter(detail => detail.conceptId === 1);
            expect(salary[0].value).toEqual(2000000);
            expect(salary[0].quantity).toEqual(30);

            const transportAllowance = result.details.filter(detail => detail.conceptId === 17);
            expect(transportAllowance[0].value).toEqual(200000);
            expect(transportAllowance[0].quantity).toEqual(30);

            const health = result.details.filter(detail => detail.conceptId === 41);
            expect(health[0].value).toEqual(80949.49);
            expect(health[0].quantity).toEqual(1);

            const pension = result.details.filter(detail => detail.conceptId === 42);
            expect(pension[0].value).toEqual(80949.49);
            expect(pension[0].quantity).toEqual(1);

            const license = result.details.filter(detail => detail.conceptId === 15);
            expect(license[0].value).toEqual(66666.67);
            expect(license[0].quantity).toEqual(1);

            const compensations = result.details.filter(detail => detail.conceptId === 29);
            expect(compensations[0].value).toEqual(100000);

            const HRNDF = result.details.filter(detail => detail.conceptId === 10);
            expect(HRNDF[0].value).toEqual(11111.11);
            expect(HRNDF[0].quantity).toEqual(1);

            const HED = result.details.filter(detail => detail.conceptId === 4);
            expect(HED[0].value).toEqual(12626.26);
            expect(HED[0].quantity).toEqual(1);

            const orderLoans = result.details.filter(detail => detail.conceptId === 48);
            expect(orderLoans[0].value).toEqual(conceptCodes.find(code => code.code === '220').value);
            
            const loans = result.details.filter(detail => detail.conceptId === 54);
            expect(loans[0].value).toEqual(conceptCodes.find(code => code.code === '248').value);

        });
        test('Liquidación con múltiples tipos de conceptos', async () => {
            // Arrange
            const employee = await global.testHelper.createTestEmployee({
                salary: 2000000,
                transportAllowance: true
            });

            const period = await global.testHelper.createTestPeriod({
                id: 1,
                period: '2024-01',
                startDate: new Date('2024-01-01'),
                endDate: new Date('2024-01-31'),
                status: 'OPEN'
            });

            const conceptCodes = [
                { code: '125', quantity: 1, status: 'PENDING' }, // Salary
                { code: '150', value: 100000, status: 'PENDING' }, // Salary
                { code: '220', value: 220000, status: 'PENDING' }, // Salary
                { code: '248', value: 36500, status: 'PENDING' }, // Salary
                { code: '111', quantity: 1, status: 'PENDING' }, // Hourly
                { code: '105', quantity: 1, status: 'PENDING' }
            ]
            const concepts = [];
            for (const code of conceptCodes) {

                const c = await global.testHelper.prisma.concept.findFirst({
                    where: {
                        code: code.code
                    }
                });
                concepts.push(c);
            }
            for (let i = 0; i < concepts.length; i++) {
                const c = concepts[i];
                console.log(c);
                const conceptCode = conceptCodes[i];
                console.log(conceptCode);
                await global.testHelper.prisma.novelty.create({
                    data: {
                        date: new Date('2024-01-20'),
                        status: conceptCode.status,
                        concept: { connect: { id: c.id } },
                        employee: { connect: { id: employee.id } },
                        value: conceptCode.value || 0,
                        quantity: conceptCode.quantity || null
                    }
                });
            }

            const result = await settlementCalculationEngine.generateSettlement(
                employee.id,
                period.id,
                '2024-01-01',
                '2024-01-31'
            );
            console.log(result);
            // Assert
            expect(result).toHaveProperty('employeeId', employee.id);
            expect(result).toHaveProperty('periodId', period.id);
            expect(result).toHaveProperty('status', 'OPEN');
            expect(result).toHaveProperty('details');
            expect(result.startDate).toEqual(new Date('2024-01-01'));
            expect(result.endDate).toEqual(new Date('2024-01-31'));
            expect(result.details.length).toBe(conceptCodes.length + 4); // 4 son los conceptos regulares

            // Conceptos regulares
            const salary = result.details.filter(detail => detail.conceptId === 1);
            expect(salary[0].value).toEqual(2000000);
            expect(salary[0].quantity).toEqual(30);

            const transportAllowance = result.details.filter(detail => detail.conceptId === 17);
            expect(transportAllowance[0].value).toEqual(200000);
            expect(transportAllowance[0].quantity).toEqual(30);

            const health = result.details.filter(detail => detail.conceptId === 41);
            expect(health[0].value).toEqual(80949.49);
            expect(health[0].quantity).toEqual(1);

            const pension = result.details.filter(detail => detail.conceptId === 42);
            expect(pension[0].value).toEqual(80949.49);
            expect(pension[0].quantity).toEqual(1);

            const license = result.details.filter(detail => detail.conceptId === 15);
            expect(license[0].value).toEqual(66666.67);
            expect(license[0].quantity).toEqual(1);

            const compensations = result.details.filter(detail => detail.conceptId === 29);
            expect(compensations[0].value).toEqual(100000);

            const HRNDF = result.details.filter(detail => detail.conceptId === 10);
            expect(HRNDF[0].value).toEqual(11111.11);
            expect(HRNDF[0].quantity).toEqual(1);

            const HED = result.details.filter(detail => detail.conceptId === 4);
            expect(HED[0].value).toEqual(12626.26);
            expect(HED[0].quantity).toEqual(1);

            const orderLoans = result.details.filter(detail => detail.conceptId === 48);
            expect(orderLoans[0].value).toEqual(conceptCodes.find(code => code.code === '220').value);
            
            const loans = result.details.filter(detail => detail.conceptId === 54);
            expect(loans[0].value).toEqual(conceptCodes.find(code => code.code === '248').value);

        });
        test('Liquidación con novedades y conceptos regulares', async () => {
            // Arrange
            const employee = await global.testHelper.createTestEmployee({
                salary: 2000000,
                transportAllowance: true
            });

            const period = await global.testHelper.createTestPeriod({
                id: 1,
                period: '2024-01',
                startDate: new Date('2024-01-01'),
                endDate: new Date('2024-01-31'),
                status: 'OPEN'
            });

            const conceptCodes = [
                { code: '111', quantity: 1, status: 'PENDING' }, // Hourly
                { code: '105', quantity: 1, status: 'PENDING' }
            ]
            const concepts = [];
            for (const code of conceptCodes) {

                const c = await global.testHelper.prisma.concept.findFirst({
                    where: {
                        code: code.code
                    }
                });
                concepts.push(c);
            }
            for (let i = 0; i < concepts.length; i++) {
                const c = concepts[i];
                console.log(c);
                const conceptCode = conceptCodes[i];
                console.log(conceptCode);
                await global.testHelper.prisma.novelty.create({
                    data: {
                        date: new Date('2024-01-20'),
                        status: conceptCode.status,
                        concept: { connect: { id: c.id } },
                        employee: { connect: { id: employee.id } },
                        value: conceptCode.value || 0,
                        quantity: conceptCode.quantity || null
                    }
                });
            }

            const result = await settlementCalculationEngine.generateSettlement(
                employee.id,
                period.id,
                '2024-01-01',
                '2024-01-31'
            );
            console.log(result);
            // Assert
            expect(result).toHaveProperty('employeeId', employee.id);
            expect(result).toHaveProperty('periodId', period.id);
            expect(result).toHaveProperty('status', 'OPEN');
            expect(result).toHaveProperty('details');
            expect(result.startDate).toEqual(new Date('2024-01-01'));
            expect(result.endDate).toEqual(new Date('2024-01-31'));
            expect(result.details.length).toBe(conceptCodes.length + 4); // 4 son los conceptos regulares

            // Conceptos regulares
            const salary = result.details.filter(detail => detail.conceptId === 1);
            expect(salary[0].value).toEqual(2000000);
            expect(salary[0].quantity).toEqual(30);

            const transportAllowance = result.details.filter(detail => detail.conceptId === 17);
            expect(transportAllowance[0].value).toEqual(200000);
            expect(transportAllowance[0].quantity).toEqual(30);

            const health = result.details.filter(detail => detail.conceptId === 41);
            expect(health[0].value).toEqual(80949.49);
            expect(health[0].quantity).toEqual(1);

            const pension = result.details.filter(detail => detail.conceptId === 42);
            expect(pension[0].value).toEqual(80949.49);
            expect(pension[0].quantity).toEqual(1);

            const HRNDF = result.details.filter(detail => detail.conceptId === 10);
            expect(HRNDF[0].value).toEqual(11111.11);
            expect(HRNDF[0].quantity).toEqual(1);

            const HED = result.details.filter(detail => detail.conceptId === 4);
            expect(HED[0].value).toEqual(12626.26);
            expect(HED[0].quantity).toEqual(1);

        });
        test('Dependencias entre conceptos', async () => {
            // Arrange
            const employee = await global.testHelper.createTestEmployee({
                salary: 2000000,
                transportAllowance: true
            });

            const period = await global.testHelper.createTestPeriod({
                id: 1,
                period: '2024-01',
                startDate: new Date('2024-01-01'),
                endDate: new Date('2024-01-31'),
                status: 'OPEN'
            });

            const conceptCodes = [
                { code: '139', quantity: 1, status: 'PENDING' }, // vacations: isIBC
                { code: '105', quantity: 1, status: 'PENDING' },  // isVacation, isIncome, isIBC
                { code: '121', value: 150000, status: 'PENDING' }  // isVacation, isIncome, isIBC
            ]
            const concepts = [];
            for (const code of conceptCodes) {

                const c = await global.testHelper.prisma.concept.findFirst({
                    where: {
                        code: code.code
                    }
                });
                concepts.push(c);
            }
            for (let i = 0; i < concepts.length; i++) {
                const c = concepts[i];
                const conceptCode = conceptCodes[i];
                await global.testHelper.prisma.novelty.create({
                    data: {
                        date: new Date('2024-01-20'),
                        status: conceptCode.status,
                        concept: { connect: { id: c.id } },
                        employee: { connect: { id: employee.id } },
                        value: conceptCode.value || 0,
                        quantity: conceptCode.quantity || null
                    }
                });
            }

            const result = await settlementCalculationEngine.generateSettlement(
                employee.id,
                period.id,
                '2024-01-01',
                '2024-01-31'
            );

            // Assert
            expect(result).toHaveProperty('employeeId', employee.id);
            expect(result).toHaveProperty('periodId', period.id);
            expect(result).toHaveProperty('status', 'OPEN');
            expect(result).toHaveProperty('details');
            expect(result.startDate).toEqual(new Date('2024-01-01'));
            expect(result.endDate).toEqual(new Date('2024-01-31'));
            expect(result.details.length).toBe(conceptCodes.length+4); // 4 son los conceptos regulares

            // Conceptos regulares
            const salary = result.details.filter(detail => detail.conceptId === 1);
            expect(salary[0].value).toEqual(2000000);
            expect(salary[0].quantity).toEqual(30);

            const transportAllowance = result.details.filter(detail => detail.conceptId === 17);
            expect(transportAllowance[0].value).toEqual(200000);
            expect(transportAllowance[0].quantity).toEqual(30);

            const orderConcepts = result.details.map(detail => detail.conceptId);
            console.log('Order of concepts:', orderConcepts);
            expect(orderConcepts).toEqual([
                12,  // Viaticos
                1,  // Salary
                17, // Transport allowance 
                4,  // HED
                21, // Vacation
                41, // Health
                42, // Pension
            ]);

        });
        test('Caché compartido entre cálculos de liquidaciones', async () => {
            const employee = await global.testHelper.createTestEmployee({
                salary: 2000000,
                transportAllowance: true
            });

            const period = await global.testHelper.createTestPeriod({
                id: 1,
                period: '2024-01',
                startDate: new Date('2024-01-01'),
                endDate: new Date('2024-01-31'),
                status: 'OPEN'
            });

            const conceptCodes = [
                { code: '139', quantity: 1, status: 'PENDING' }, // vacations: isIBC
                { code: '105', quantity: 1, status: 'PENDING' },  // isVacation, isIncome, isIBC
                { code: '121', value: 150000, status: 'PENDING' },  // isVacation, isIncome, isIBC
                { code: '118', value: 7000, status: 'PENDING' },  // isVacation, isIncome, isIBC
                { code: '126', value: 2300, status: 'PENDING' },  // isVacation, isIncome, isIBC
                { code: '130', quantity: 1, status: 'PENDING' },  // isVacation, isIncome, isIBC
            ]
            const calculatedValues = new Map();
            const concepts = []
            const data = {
                date: new Date('2024-01-30'),
                status: 'PENDING'
            }
            for (const code of conceptCodes) {
                const concept = await global.testHelper.prisma.concept.findFirst({
                    where: {
                        code: code.code
                    }
                });
                concepts.push(concept)
            }
            
            for (let i = 0; i < concepts.length; i++) {
                const c = concepts[i];
                const conceptCode = conceptCodes[i];
                await global.testHelper.prisma.novelty.create({
                    data: {
                        date: new Date('2024-01-20'),
                        status: conceptCode.status,
                        concept: { connect: { id: c.id } },
                        employee: { connect: { id: employee.id } },
                        value: conceptCode.value || 0,
                        quantity: conceptCode.quantity || null
                    }
                });
            }

            const result = await settlementCalculationEngine.generateSettlement(
                employee.id,
                period.id,
                '2024-01-01',
                '2024-01-31'
            );
            // Conceptos regulares
            const salary = result.details.filter(detail => detail.conceptId === 1);
            expect(salary[0].value).toEqual(2000000);
            expect(salary[0].quantity).toEqual(30);

            const transportAllowance = result.details.filter(detail => detail.conceptId === 17);
            expect(transportAllowance[0].value).toEqual(200000);
            expect(transportAllowance[0].quantity).toEqual(30);

            const health = result.details.filter(detail => detail.conceptId === 41);
            expect(health[0].value).toEqual(89717.22);
            expect(health[0].quantity).toEqual(1);

            const pension = result.details.filter(detail => detail.conceptId === 42);
            expect(pension[0].value).toEqual(89717.22);
            expect(pension[0].quantity).toEqual(1);

            const HED = result.details.filter(detail => detail.conceptId === 4);
            expect(HED[0].value).toEqual(12626.26);
            expect(HED[0].quantity).toEqual(1);
            
                        const commissions = result.details.filter(detail => detail.conceptId === 11);
                        expect(commissions[0].value).toEqual(7000);

            const travelAllowance = result.details.filter(detail => detail.conceptId === 12);
            expect(travelAllowance[0].value).toEqual(150000);

            const license = result.details.filter(detail => detail.conceptId === 16);
            expect(license[0].value).toEqual(66666.67);
            expect(license[0].quantity).toEqual(1);


            const cesantias = result.details.filter(detail => detail.conceptId === 18);
            expect(cesantias[0].value).toEqual(13275);
            expect(cesantias[0].quantity).toEqual(1);
            
            const vacations = result.details.filter(detail => detail.conceptId === 21);
            expect(vacations[0].value).toEqual(6637.5);
            expect(vacations[0].quantity).toEqual(1);
        })
        describe('Error handling', () => {
            test('Debe lanzar un error si employeeService.getById falla', async () => {
                const period = await global.testHelper.createTestPeriod({
                    id: 1,
                    period: '2024-01',
                    startDate: new Date('2024-01-01'),
                    endDate: new Date('2024-01-31'),
                    status: 'OPEN'
                });
                await expect(settlementCalculationEngine.generateSettlement(
                    999,
                    period.id,
                    '2024-01-01',
                    '2024-01-31'
                )).rejects.toThrow('Empleado no encontrado');
            })
            test('Debe lanzar un error si periodService.getById falla', async () => {
                await expect(settlementCalculationEngine.generateSettlement(
                    1,
                    999,
                    '2024-01-01',
                    '2024-01-31'
                )).rejects.toThrow('Período no encontrado');
            })
        })
    });
});
