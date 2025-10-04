import Colors from '../colorsUtils.js';
import SharedUtils from '../sharedUtils.js';

const Trends = {
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
    brandGrowthMoM: {
        create: async (registrationList, ctx) => {
            return new Promise((resolve) => {
                let methods = Trends.brandGrowthMoM;

                const config = {
                    type: 'bar',
                    data: methods.groupData(registrationList),
                    options: {
                        indexAxis: 'y',
                        responsive: true,
                        maintainAspectRatio: false,
                        scales: {
                            x: {
                                beginAtZero: true,
                                grace: '10%'
                            }
                        },
                        plugins: {
                            legend: {
                                display: false,
                            },
                            title: {
                                display: false,
                                text: 'Top Modelos por matriculaciones'
                            },
                            datalabels: {
                                anchor: 'end',
                                align: 'end',
                                color: Colors.black(0.6),
                                font: { size: 12 },
                                formatter: (value) => `${value.toFixed(2)}%`
                            },
                            tooltip: {
                                callbacks: {
                                    label: function(context) {
                                        const value = context.raw;
                                        return `${value.toFixed(2)}%`;
                                    }
                                }
                            }
                        }
                    },
                    plugins: [ChartDataLabels, Trends.watermark(80, 50, 50)] // Registra el plugin
                };
            
                methods.chart = new Chart(ctx, config);
                resolve();
            });
        },
        update: async (registrationList) => {
            return new Promise((resolve) => {
                let methods = Trends.brandGrowthMoM;
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
        groupData: (registrationList, tops = 25) => {
            // 1. Agrupar RegistrationList por Marca y obtener sumatorios y se ordenan de mayor a menor cantidad.
            const groupedData = Object.entries(
                registrationList.reduce((acc, curr) => {
                    acc[curr.brandId] = (acc[curr.brandId] || 0) + curr.count;
                    return acc;
                }, {})
            ).sort((a, b) => b[1] - a[1]);

            // 2. Obtener los top brands y parsearlos a int.
            const topBrands = groupedData.slice(0, tops).map(b => parseInt(b[0]));

            // 3. Obtener por cada marca la última fecha y su valor, y compararlo con la del mismo mes del año anterior, y calcular el % de variación.
            const latestDate = registrationList.reduce((latest, curr) => {
                return curr.registrationDate > latest ? curr.registrationDate : latest;
            }, '0000-00-00');
            const latestYear = parseInt(latestDate.slice(0, 4));
            const latestMonth = latestDate.slice(5, 7);
            const prevYear = latestYear - 1;
            const prevDate = `${prevYear}-${latestMonth}`;
            const brandValues = {};
            registrationList.forEach(({ brandId, registrationDate, count }) => {
                if (topBrands.includes(brandId)) {
                    if (!brandValues[brandId]) {
                        brandValues[brandId] = { latest: 0, previous: 0 };
                    }
                    if (registrationDate.startsWith(`${latestYear}-${latestMonth}`)) {
                        brandValues[brandId].latest += count;
                    }
                    if (registrationDate.startsWith(prevDate)) {
                        brandValues[brandId].previous += count;
                    }
                }
            });

            const brandGrowth = topBrands.map(brandId => {
                const { latest, previous } = brandValues[brandId] || { latest: 0, previous: 0 };
                const growth = previous > 0 ? ((latest - previous) / previous) * 100 : (latest > 0 ? 100 : 0);
                return { brandId, growth, latest, previous };
            }).sort((a, b) => b.growth - a.growth);

            // 4. Calcular colores verde/rojo con degradado alpha según magnitud
            const positiveValues = brandGrowth.filter(d => d.growth > 0);
            const negativeValues = brandGrowth.filter(d => d.growth < 0);

            const maxPositive = positiveValues.length ? Math.max(...positiveValues.map(d => d.growth)) : 1;
            const minNegative = negativeValues.length ? Math.min(...negativeValues.map(d => d.growth)) : -1;

            const backgroundColor = brandGrowth.map(d => {
                if (d.growth > 0) {
                    const alpha = 0.4 + 0.6 * (d.growth / maxPositive); // más alto -> más intenso
                    return `rgba(0, 200, 0, ${alpha})`;
                } else if (d.growth < 0) {
                    const alpha = 0.4 + 0.6 * (d.growth / minNegative); // más negativo -> más intenso
                    return `rgba(200, 0, 0, ${alpha})`;
                } else {
                    return `rgba(200,200,200,0.4)`; // crecimiento 0
                }
            });

            const borderColor = brandGrowth.map(d => {
                if (d.growth > 0) {
                    const alpha = 0.7 + 0.3 * (d.growth / maxPositive);
                    return `rgba(0, 150, 0, ${alpha})`;
                } else if (d.growth < 0) {
                    const alpha = 0.7 + 0.3 * (d.growth / minNegative);
                    return `rgba(150, 0, 0, ${alpha})`;
                } else {
                    return `rgba(150,150,150,0.7)`;
                }
            });

            // 5. Construir labels y data
            const labels = brandGrowth.map(item => SharedUtils.getBrandDescription2(item.brandId)); 
            const data = brandGrowth.map(item => item.growth);

            // 6. Retornar el objeto de datos para el gráfico
            return {
                labels: labels,
                datasets: [{
                    data: data,
                    backgroundColor: backgroundColor,
                    borderColor: borderColor,
                    borderWidth: 1,
                }]
            };
        }
    },
    brandGrowthYoY: {
        create: async (registrationList, ctx) => {
            return new Promise((resolve) => {
                let methods = Trends.brandGrowthYoY;

                const config = {
                    type: 'bar',
                    data: methods.groupData(registrationList),
                    options: {
                        indexAxis: 'y',
                        responsive: true,
                        maintainAspectRatio: false,
                        scales: {
                            x: {
                                beginAtZero: true,
                                grace: '10%'
                            }
                        },
                        plugins: {
                            legend: {
                                display: false,
                            },
                            title: {
                                display: false,
                                text: 'Top Modelos por matriculaciones'
                            },
                            datalabels: {
                                anchor: 'end',
                                align: 'end',
                                color: Colors.black(0.6),
                                font: { size: 12 },
                                formatter: (value) => `${value.toFixed(2)}%`
                            },
                            tooltip: {
                                callbacks: {
                                    label: function(context) {
                                        const value = context.raw;
                                        return `${value.toFixed(2)}%`;
                                    }
                                }
                            }
                        }
                    },
                    plugins: [ChartDataLabels, Trends.watermark(80, 50, 50)] // Registra el plugin
                };
            
                methods.chart = new Chart(ctx, config);
                resolve();
            });
        },
        update: async (registrationList) => {
            return new Promise((resolve) => {
                let methods = Trends.brandGrowthYoY;
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
        groupData: (registrationList, tops = 25) => {
            // 1. Agrupar por marca y obtener sumatorios totales
            const groupedData = Object.entries(
                registrationList.reduce((acc, curr) => {
                    acc[curr.brandId] = (acc[curr.brandId] || 0) + curr.count;
                    return acc;
                }, {})
            ).sort((a, b) => b[1] - a[1]);

            // 2. Obtener los top brands y parsearlos a int
            const topBrands = groupedData.slice(0, tops).map(b => parseInt(b[0]));

            // 3. Determinar último mes disponible
            const latestDate = registrationList.reduce((latest, curr) => 
                curr.registrationDate > latest ? curr.registrationDate : latest, '0000-00-00');
            const latestYear = parseInt(latestDate.slice(0, 4));
            const latestMonth = parseInt(latestDate.slice(5, 7)); // 1-12
            const prevYear = latestYear - 1;

            const brandValues = {};
            registrationList.forEach(({ brandId, registrationDate, count }) => {
                if (topBrands.includes(brandId)) {
                    if (!brandValues[brandId]) brandValues[brandId] = { current: 0, previous: 0 };
                    const [year, month] = registrationDate.split('-').map(Number);
                    if (year === latestYear && month <= latestMonth) {
                        brandValues[brandId].current += count;
                    }
                    if (year === prevYear && month <= latestMonth) {
                        brandValues[brandId].previous += count;
                    }
                }
            });

            // 4. Calcular crecimiento %
            const brandGrowth = topBrands.map(brandId => {
                const { current, previous } = brandValues[brandId] || { current: 0, previous: 0 };
                const growth = previous > 0 ? ((current - previous) / previous) * 100 : (current > 0 ? 100 : 0);
                return { brandId, growth, current, previous };
            }).sort((a, b) => b.growth - a.growth);

            // 5. Colores verde/rojo con degradado alpha
            const positiveValues = brandGrowth.filter(d => d.growth > 0);
            const negativeValues = brandGrowth.filter(d => d.growth < 0);

            const maxPositive = positiveValues.length ? Math.max(...positiveValues.map(d => d.growth)) : 1;
            const minNegative = negativeValues.length ? Math.min(...negativeValues.map(d => d.growth)) : -1;

            const backgroundColor = brandGrowth.map(d => {
                if (d.growth > 0) {
                    const alpha = 0.4 + 0.6 * (d.growth / maxPositive);
                    return `rgba(0, 200, 0, ${alpha})`;
                } else if (d.growth < 0) {
                    const alpha = 0.4 + 0.6 * (d.growth / minNegative);
                    return `rgba(200, 0, 0, ${alpha})`;
                } else {
                    return `rgba(200,200,200,0.4)`;
                }
            });

            const borderColor = brandGrowth.map(d => {
                if (d.growth > 0) {
                    const alpha = 0.7 + 0.3 * (d.growth / maxPositive);
                    return `rgba(0, 150, 0, ${alpha})`;
                } else if (d.growth < 0) {
                    const alpha = 0.7 + 0.3 * (d.growth / minNegative);
                    return `rgba(150, 0, 0, ${alpha})`;
                } else {
                    return `rgba(150,150,150,0.7)`;
                }
            });

            // 6. Construir labels y data
            const labels = brandGrowth.map(item => SharedUtils.getBrandDescription2(item.brandId));
            const data = brandGrowth.map(item => item.growth);

            // 7. Retornar objeto listo para Chart.js
            return {
                labels: labels,
                datasets: [{
                    data: data,
                    backgroundColor: backgroundColor,
                    borderColor: borderColor,
                    borderWidth: 1,
                }]
            };
        }
    },



    domination100: {
        chart: null,
        create: async (registrationList, ctx) => {
            return new Promise((resolve) => {
                let methods = Trends.domination100;
                const config = {
                    type: 'line',
                    data: methods.groupData(registrationList),
                    options: {
                        responsive: true,
                        maintainAspectRatio: false,
                        scales: {
                            y: {
                                stacked: true,
                                beginAtZero: true,
                                grace: '10%'
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
                let methods = Trends.domination100;
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
            const data = Trends.data;

            // 1. Agrupamos matriculaciones por fecha y marca
            const groupedData = {};
            const totalPerBrand = {};
            for (const { registrationDate, brandId, count } of registrationList) {
                const date = registrationDate.slice(0, 7);
                if (!groupedData[date]) groupedData[date] = {};
                groupedData[date][brandId] = (groupedData[date][brandId] || 0) + count;
                totalPerBrand[brandId] = (totalPerBrand[brandId] || 0) + count;
            }

            // 2. Determinamos top 10 marcas globales
            const topBrands = Object.entries(totalPerBrand)
                .sort((a, b) => b[1] - a[1])
                .slice(0, 10)
                .map(([brandId]) => brandId);

            const sortedDates = Object.keys(groupedData).sort();

            // 3. Construimos datasets base
            const datasets = topBrands.reduce((acc, brandId) => {
                acc[brandId] = [];
                return acc;
            }, {});
            datasets["Resto"] = [];

            for (const date of sortedDates) {
                const brands = groupedData[date];

                topBrands.forEach(brandId => {
                    const value = brands[brandId] || 0;
                    datasets[brandId].push(value);
                });

                const restoValue = Object.entries(brands)
                    .filter(([brandId]) => !topBrands.includes(brandId))
                    .reduce((sum, [, val]) => sum + val, 0);
                datasets["Resto"].push(restoValue);
            }

            // 4. Convertimos a array de datasets
            let finalDatasets = Object.keys(datasets).map((brandId, index) => ({
                brandId,
                label: brandId === "Resto" ? "Resto" : SharedUtils.getBrandDescription2(brandId),
                data: datasets[brandId],
                colorIndex: index
            }));

            // 5. Normalizamos a porcentaje por mes y ajustamos al 100%
            sortedDates.forEach((_, monthIndex) => {
                const monthValues = finalDatasets.map(ds => ds.data[monthIndex]);
                const total = monthValues.reduce((a, b) => a + b, 0);

                finalDatasets.forEach((ds, i) => {
                    ds.data[monthIndex] = total > 0
                        ? Math.round((monthValues[i] / total) * 10000) / 100
                        : 0;
                });

                // Ajuste fino
                let sum = finalDatasets.reduce((s, ds) => s + ds.data[monthIndex], 0);
                let diff = Math.round((100 - sum) * 100) / 100;
                if (diff !== 0) {
                    const maxIdx = finalDatasets
                        .map(ds => ds.data[monthIndex])
                        .reduce((maxI, val, i, arr) => val > arr[maxI] ? i : maxI, 0);
                    finalDatasets[maxIdx].data[monthIndex] =
                        Math.round((finalDatasets[maxIdx].data[monthIndex] + diff) * 100) / 100;
                }
            });

            // 6. Ordenamos datasets de mayor a menor según el primer mes, Resto al final
            const resto = finalDatasets.find(ds => ds.brandId === "Resto");
            finalDatasets = finalDatasets
                .filter(ds => ds.brandId !== "Resto")
                .sort((a, b) => b.data[0] - a.data[0]); // de mayor a menor
            finalDatasets.push(resto);

            // 7. Asignamos colores
            finalDatasets.forEach((ds, i) => {
                const color = Colors.getIndexColor(i);
                ds.backgroundColor = color;
                ds.borderColor = color;
                ds.borderWidth = 3;
                ds.fill = true;
                ds.tension = 0.2;
            });

            return {
                labels: sortedDates,
                datasets: finalDatasets
            };
        }





    },
    dominationTrend: {
        chart: null,
        create: async (registrationList, ctx) => {
            return new Promise((resolve) => {
                let methods = Trends.motorTypesAnnualDiff100;
                const config = {
                    type: 'bar',
                    data: methods.groupData(registrationList),
                    options: {
                        indexAxis: 'x',
                        responsive: true,
                        maintainAspectRatio: false,
                        scales: {
                            y: {
                                beginAtZero: true,
                                grace: '10%'
                            }
                        },
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
                                color: Colors.black(0.6),
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
                let methods = Trends.motorTypesAnnualDiff100;
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
            const data = Trends.data;

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
                    : 0;

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

export default Trends;