import Colors from '../colorsUtils.js';
import SharedUtils from '../sharedUtils.js';

const Propulsion = {
    watermark: function(maxWidth, marginLeft, marginRight){
        const img = new Image();
        img.src = '/images/metricars_es.svg';

        return {
            id: 'watermark',
            beforeDraw: (chart) => {
                const ctx = chart.ctx;
                const { width, height } = chart;

                if (!img.complete) return;

                const aspectRatio = img.height / img.width;
                const imgWidth = maxWidth;
                const imgHeight = maxWidth * aspectRatio;
                const x = width - imgWidth - marginLeft;
                const y = height - imgHeight - marginRight;

                ctx.save();
                ctx.globalAlpha = 0.3;
                ctx.drawImage(img, x, y, imgWidth, imgHeight);
                ctx.restore();
            }
        }
    },
    data: {
        dataNor: null,
        dataAcc: null
    },
    motorTypesAcc: {
        chart: null,
        create: async (registrationList, ctx) => {
            return new Promise((resolve) => {
                let methods = Propulsion.motorTypesAcc;
                const config = {
                    type: 'line',
                    data: methods.groupData(registrationList),
                    options: {
                        responsive: true,
                        maintainAspectRatio: false,
                        scales: {
                            y: {
                                stacked: true
                            }
                        },
                        plugins: {
                            title: {
                                display: false
                            },
                            tooltip: {
                                mode: 'index'
                            }
                        },
                        interaction: {
                            mode: 'nearest',
                            axis: 'x',
                            intersect: false
                        }
                    }
                };

                methods.chart = new Chart(ctx, config);
                resolve();
            });
        },
        update: async (registrationList) => {
            return new Promise((resolve) => {
                let methods = Propulsion.motorTypesAcc;
                if (methods.chart) {
                    // Actualiza la data del Chart usando el método update
                    methods.chart.data = methods.groupData(registrationList);
                    methods.chart.update();
                } else {
                    console.error('El gráfico no ha sido creado aún. Llame primero a create().');
                }
                resolve();
            });
        },
        groupData: (registrationList) => {
            const data = Propulsion.data;

            // 1. Agrupamos matriculaciones por fecha y tipo de motor
            const groupedData = {};
            for (const { registrationDate, motorTypeId, count } of registrationList) {
                const date = registrationDate.slice(0, 7); // YYYY-MM
                if (!groupedData[date]) groupedData[date] = {};
                groupedData[date][motorTypeId] = (groupedData[date][motorTypeId] || 0) + count;
            }

            // 2. Ordenamos por fecha (al ser YYYY-MM, string sort funciona bien)
            const sortedDates = Object.keys(groupedData).sort();

            // 3. Construimos datasets (valores mensuales sin acumulado)
            const datasets = {};
            for (const date of sortedDates) {
                const motors = groupedData[date];
                for (const motorTypeId in motors) {
                    if (!datasets[motorTypeId]) datasets[motorTypeId] = [];
                    datasets[motorTypeId].push(motors[motorTypeId]);
                }
                // Si algún motor no aparece en esta fecha, rellenamos con 0 para mantener alineación
                for (const motorTypeId in datasets) {
                    if (datasets[motorTypeId].length < sortedDates.indexOf(date) + 1) {
                        datasets[motorTypeId].push(0);
                    }
                }
            }

            // 4. Construimos objeto final
            data.dataNor = {
                labels: sortedDates,
                datasets: Object.entries(datasets).map(([motorTypeId, data]) => ({
                    label: SharedUtils.getMotorTypeDescription(motorTypeId),
                    data,
                    backgroundColor: Colors.getPropulsionColor(motorTypeId, 1),
                    borderColor: Colors.getPropulsionColor(motorTypeId, 0.6),
                    borderWidth: 3,
                    fill: true
                }))
            };

            // 5. Creamos versión acumulada a partir de data.dataNor
            const accumulatedDatasets = data.dataNor.datasets.map(ds => {
                const accumulatedData = ds.data.reduce((acc, val, i) => {
                    acc[i] = (acc[i - 1] || 0) + val;
                    return acc;
                }, []);
                return {
                    ...ds,
                    data: accumulatedData
                };
            });

            data.dataAcc = {
                labels: data.dataNor.labels,
                datasets: accumulatedDatasets
            };

            // Devolvemos la versión acumulada
            return data.dataAcc;
        }
    },
    motorTypes100: {
        chart: null,
        create: async (registrationList, ctx) => {
            return new Promise((resolve) => {
                let methods = Propulsion.motorTypes100;
                const config = {
                    type: 'line',
                    data: methods.groupData(registrationList),
                    options: {
                        responsive: true,
                        maintainAspectRatio: false,
                        scales: {
                            y: {
                                stacked: true
                            }
                        },
                        plugins: {
                            title: {
                                display: false
                            },
                            tooltip: {
                                mode: 'index',
                                callbacks: {
                                    label: function(context) {
                                        const label = context.dataset.label || '';
                                        const value = context.raw !== undefined ? context.raw : context.parsed.y;
                                        return `${label}: ${value.toFixed(2)}%`;
                                    }
                                }
                            }
                        },
                        interaction: {
                            mode: 'nearest',
                            axis: 'x',
                            intersect: false
                        }
                    }
                };

                methods.chart = new Chart(ctx, config);
                resolve();
            });
        },
        update: async (registrationList) => {
            return new Promise((resolve) => {
                let methods = Propulsion.motorTypes100;
                if (methods.chart) {
                    // Actualiza la data del Chart usando el método update
                    methods.chart.data = methods.groupData(registrationList);
                    methods.chart.update();
                } else {
                    console.error('El gráfico no ha sido creado aún. Llame primero a create().');
                }
                resolve();
            });
        },
        groupData: (registrationList) => {
            const data = Propulsion.data;

            // 1. Obtenemos el resultado normal
            const result = JSON.parse(JSON.stringify(data.dataNor));

            // 2. Recorremos cada mes
            result.labels.forEach((_, monthIndex) => {
                const monthValues = result.datasets.map(ds => ds.data[monthIndex] || 0);
                const total = monthValues.reduce((a, b) => a + b, 0);

                if (total > 0) {
                    // normalizamos con 2 decimales
                    result.datasets.forEach((ds, i) => {
                        const percent = (monthValues[i] / total) * 100;
                        ds.data[monthIndex] = Math.round(percent * 100) / 100;
                    });

                    // ajuste fino
                    let sum = result.datasets.reduce((s, ds) => s + ds.data[monthIndex], 0);
                    let diff = Math.round((100 - sum) * 100) / 100;
                    if (diff !== 0) {
                        const maxIdx = result.datasets
                            .map(ds => ds.data[monthIndex])
                            .reduce((maxI, val, i, arr) => val > arr[maxI] ? i : maxI, 0);
                        result.datasets[maxIdx].data[monthIndex] =
                            Math.round((result.datasets[maxIdx].data[monthIndex] + diff) * 100) / 100;
                    }
                } else {
                    result.datasets.forEach(ds => {
                        ds.data[monthIndex] = 0;
                    });
                }
            });

            return result;
        }
    },
    motorTypesAnnualDiff: {
        chart: null,
        create: async (registrationList, ctx) => {
            return new Promise((resolve) => {
                let methods = Propulsion.motorTypesAnnualDiff;
                const config = {
                    type: 'bar',
                    data: methods.groupData(registrationList),
                    options: {
                        indexAxis: 'x',
                        responsive: true,
                        maintainAspectRatio: false,

                        plugins: {
                            legend: {
                                display: true,
                            },
                            title: {
                                display: false,
                            },
                            datalabels: {
                                anchor: 'end',
                                align: 'end',
                                color: '#7d7d7d',
                                font: { size: 12 },
                                // formatter: (value) => value.toLocaleString()
                            }
                        }
                    },
                    plugins: [ChartDataLabels] // Registra el plugin
                };
            
                methods.chart = new Chart(ctx, config);
                resolve();
            });
        },
        update: async (registrationList) => {
            return new Promise((resolve) => {
                let methods = Propulsion.motorTypesAnnualDiff;
                if (methods.chart) {
                    // Actualiza la data del Chart usando el método update
                    methods.chart.data = methods.groupData(registrationList);
                    methods.chart.update();
                } else {
                    console.error('El gráfico no ha sido creado aún. Llame primero a create().');
                }
                resolve();
            });
        },
        groupData: (registrationList) => {
            const data = Propulsion.data;

            // 1. Obtenemos los datos “normales” ya procesados
            const baseData = JSON.parse(JSON.stringify(data.dataAcc));

            // 2. Inicializamos estructura para totales anuales por motor
            const annualGrouped = {};

            // 3. Recorremos las fechas y acumulamos por año
            for (let i = 0; i < baseData.labels.length; i++) {
                const monthLabel = baseData.labels[i]; // "YYYY-MM"
                const year = monthLabel.slice(0, 4);

                baseData.datasets.forEach(ds => {
                    const motorLabel = ds.label;
                    const value = ds.data[i];

                    if (!annualGrouped[motorLabel]) annualGrouped[motorLabel] = {};
                    if (!annualGrouped[motorLabel][year]) annualGrouped[motorLabel][year] = 0;

                    const prevMonthValue = ds.data[i - 1] || 0;
                    const delta = value - prevMonthValue; // solo matriculaciones de este mes
                    annualGrouped[motorLabel][year] += delta;
                });
            }

            // 4. Obtenemos todos los años y motores
            const motorLabels = Object.keys(annualGrouped);
            const allYears = [...new Set(baseData.labels.map(l => l.slice(0, 4)))].sort();

            // 5. Construimos datasets, un dataset por año
            
            const datasets = allYears.map(year => ({
                label: year,
                data: motorLabels.map(motor => annualGrouped[motor][year] || 0),
                backgroundColor: Colors.accent(1), // Colors.getPropulsionColor(year, 0.7),
                borderColor: Colors.accent(0.7),
                borderWidth: 3,
                fill: true
            }));

            // Se colorean adecuadamente
            var alphaIncremental = allYears.length > 1 ? (1 - 0.4) / (allYears.length - 1) : 1;

            datasets.forEach((dataset, index) => {
                let alpha = alphaIncremental * (allYears.length - 1 - index); // degradado por año
                dataset.backgroundColor = motorLabels.map(motor => Colors.getPropulsionColor(motor, 1 - alpha));
                dataset.borderColor = motorLabels.map(motor => Colors.getPropulsionColor(motor, 0.7 - alpha));
            });

            // 6. Construimos objeto final para Chart.js
            data.dataAnnual = {
                labels: motorLabels, // eje X: tipos de motor
                datasets
            };

            return data.dataAnnual;
        }
    },
    motorTypesAnnualDiff100: {
        chart: null,
        create: async (registrationList, ctx) => {
            return new Promise((resolve) => {
                let methods = Propulsion.motorTypesAnnualDiff100;
                const config = {
                    type: 'bar',
                    data: methods.groupData(registrationList),
                    options: {
                        indexAxis: 'x',
                        responsive: true,
                        maintainAspectRatio: false,

                        plugins: {
                            legend: {
                                display: true,
                            },
                            title: {
                                display: false,
                            },
                            datalabels: {
                                anchor: 'end',
                                align: 'end',
                                color: '#7d7d7d',
                                font: { size: 12 },
                                // formatter: (value) => value.toLocaleString()
                            },
                            tooltip: {
                                callbacks: {
                                    label: function (context) {
                                        const label = context.chart.data.labels[context.dataIndex];
                                        const value = context.parsed.y !== undefined ? context.parsed.y : context.parsed;
                                        return `${label}: ${value.toFixed(2)}%`;
                                    }
                                }
                            }
                        }
                    },
                    plugins: [ChartDataLabels] // Registra el plugin
                };
            
                methods.chart = new Chart(ctx, config);
                resolve();
            });
        },
        update: async (registrationList) => {
            return new Promise((resolve) => {
                let methods = Propulsion.motorTypesAnnualDiff100;
                if (methods.chart) {
                    // Actualiza la data del Chart usando el método update
                    methods.chart.data = methods.groupData(registrationList);
                    methods.chart.update();
                } else {
                    console.error('El gráfico no ha sido creado aún. Llame primero a create().');
                }
                resolve();
            });
        },
        groupData: (registrationList) => {
            const data = Propulsion.data;

            // 1. Usamos el acumulado ya calculado previamente
            const baseData = JSON.parse(JSON.stringify(data.dataAcc));

            // 2. Inicializamos estructura para guardar el último valor por año y motor
            const lastValues = {};

            // 3. Recorremos todas las fechas y guardamos el último valor visto de cada año
            baseData.labels.forEach((monthLabel, i) => {
                const year = monthLabel.slice(0, 4);

                baseData.datasets.forEach(ds => {
                    const motorLabel = ds.label;
                    if (!lastValues[motorLabel]) lastValues[motorLabel] = {};
                    // siempre nos quedamos con el valor más reciente de ese año
                    lastValues[motorLabel][year] = ds.data[i];
                });
            });

            // 4. Obtenemos todos los motores y años
            const motorLabels = Object.keys(lastValues);
            const allYears = [...new Set(baseData.labels.map(l => l.slice(0, 4)))].sort();

            // 5. Calculamos los porcentajes finales por año
            const percentGrouped = {};
            allYears.forEach(year => {
                let yearTotal = 0;
                motorLabels.forEach(motor => {
                    yearTotal += lastValues[motor][year] || 0;
                });

                // cálculo inicial en porcentaje (2 decimales)
                motorLabels.forEach(motor => {
                    if (!percentGrouped[motor]) percentGrouped[motor] = {};
                    const value = lastValues[motor][year] || 0;
                    percentGrouped[motor][year] = yearTotal > 0 ? Math.round((value / yearTotal) * 10000) / 100 : 0;
                });

                // ajuste fino para que sume 100
                let sumPercent = motorLabels.reduce((sum, motor) => sum + percentGrouped[motor][year], 0);
                let diff = Math.round((100 - sumPercent) * 100) / 100;

                if (diff !== 0) {
                    const maxMotor = motorLabels.reduce((a, b) =>
                        (percentGrouped[a][year] > percentGrouped[b][year] ? a : b)
                    );
                    percentGrouped[maxMotor][year] = Math.round((percentGrouped[maxMotor][year] + diff) * 100) / 100;
                }
            });

            // 6. Construimos datasets para Chart.js (un dataset por año)
            const datasets = allYears.map((year, index) => {
                let alpha = allYears.length > 1
                    ? (1 - 0.4) / (allYears.length - 1) * (allYears.length - 1 - index)
                    : 1;

                return {
                    label: year,
                    data: motorLabels.map(motor => percentGrouped[motor][year]),
                    backgroundColor: motorLabels.map(motor => Colors.getPropulsionColor(motor, 1 - alpha)),
                    borderColor: motorLabels.map(motor => Colors.getPropulsionColor(motor, 0.7 - alpha)),
                    borderWidth: 3,
                    fill: true
                };
            });

            // 7. Construimos objeto final para Chart.js
            data.dataAnnualPercent = {
                labels: motorLabels, // eje X: tipos de motor
                datasets
            };

            return data.dataAnnualPercent;
        }
    }
}

export default Propulsion;