import Colors from '../utils/colorsUtils.js';
import SharedUtils from './sharedUtils.js';

const ChartUtils = {
    ranking: {
        topBrands: {
            chart: null,
            create: (registrationList, ctx) => {
                let methods = ChartUtils.ranking.topBrands;

                const config = {
                    type: 'bar',
                    data: methods.groupData(registrationList),
                    options: {
                        indexAxis: 'y',
                        responsive: true,
                        maintainAspectRatio: false,

                        plugins: {
                            legend: {
                                display: false,
                            },
                            title: {
                                display: false,
                                text: 'Top Matriculaciones por Marca'
                            },
                            datalabels: {
                                anchor: 'end',
                                align: 'end',
                                color: '#7d7d7d',
                                font: { size: 12 },
                                formatter: (value) => value.toLocaleString()
                            }
                        }
                    },
                    plugins: [ChartDataLabels] // Registra el plugin
                };
            
                methods.chart = new Chart(ctx, config);
            },
            update: (registrationList) => {
                let methods = ChartUtils.ranking.topBrands;
                if (methods.chart) {
                    // Actualiza la data del Chart usando el método update
                    methods.chart.data = methods.groupData(registrationList);
                    methods.chart.update();
                } else {
                    console.error('El gráfico no ha sido creado aún. Llame primero a create().');
                }
            },
            groupData: (registrationList, tops = 25) => {
                // 1. Agrupar RegistrationList por Marca y obtener sumatorios y se ordenan de mayor a menor cantidad.
                const groupedData = Object.entries(
                    registrationList.reduce((acc, curr) => {
                        acc[curr.brandId] = (acc[curr.brandId] || 0) + curr.count;
                        return acc;
                    }, {})
                ).sort((a, b) => b[1] - a[1]);

                // 2. Obtener los top resultados. El resto se agrupan en una única entrada.
                const topBrands = groupedData.slice(0, tops);

                // 3. Crear el objeto de datos para el gráfico.
                var alphaIncremental = tops > 1 ? (1 - 0.4) / (tops - 1) : 1;

                const labels = topBrands.map(item => SharedUtils.getBrandDescription2(item[0])); 
                const data = topBrands.map(item => item[1]);
                const backgroundColor = Array.from({ length: tops }, (_, index) => Colors.accent(1 - alphaIncremental * (index + 1)));
                const borderColor = Array.from({ length: tops }, (_, index) => Colors.accent(0.7 - alphaIncremental * (index + 1)));

                // 4. Retorna el objeto de datos para el gráfico.
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
        topModels: {
            chart: null,
            create: (registrationList, ctx) => {
                let methods = ChartUtils.ranking.topModels;

                const config = {
                    type: 'bar',
                    data: methods.groupData(registrationList),
                    options: {
                        indexAxis: 'y',
                        responsive: true,
                        maintainAspectRatio: false,
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
                                color: '#7d7d7d',
                                font: { size: 12 },
                                formatter: (value) => value.toLocaleString()
                            }
                        }
                    },
                    plugins: [ChartDataLabels] // Registra el plugin
                };
            
                methods.chart = new Chart(ctx, config);
            },
            update: (registrationList) => {
                let methods = ChartUtils.ranking.topModels;
                if (methods.chart) {
                    // Actualiza la data del Chart usando el método update
                    methods.chart.data = methods.groupData(registrationList);
                    methods.chart.update();
                } else {
                    console.error('El gráfico no ha sido creado aún. Llame primero a create().');
                }
            },
            groupData: (registrationList, tops = 25) => {
                // 1. Agrupar RegistrationList por Modelo y obtener sumatorios y se ordenan de mayor a menor cantidad.
                const groupedData = Object.entries(
                    registrationList.reduce((acc, curr) => {
                        const modelId = curr.modelId;
                        acc[modelId] = (acc[modelId] || 0) + curr.count;
                        return acc;
                    }, {})
                ).sort((a, b) => b[1] - a[1]);

                // 2. Obtener los top resultados. El resto se agrupan en una única entrada.
                const topModels = groupedData.slice(0, tops);

                // 3. Crear el objeto de datos para el gráfico.
                var alphaIncremental = tops > 1 ? (1 - 0.4) / (tops - 1) : 1;

                const labels = topModels.map(item => SharedUtils.getModelDescription(item[0], true)); 
                const data = topModels.map(item => item[1]);
                const backgroundColor = Array.from({ length: tops }, (_, index) => Colors.accent(1 - alphaIncremental * (index + 1)));
                const borderColor = Array.from({ length: tops }, (_, index) => Colors.accent(0.7 - alphaIncremental * (index + 1)));

                // 4. Retorna el objeto de datos para el gráfico.
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
        }
    },
    annuals: {
        annualSellings: {
            chart: null,
            data: null,
            create: (registrationList, ctx) => {
                let methods = ChartUtils.annuals.annualSellings;
                const config = {
                    type: 'line',
                    data: methods.groupData(registrationList),
                    options: {
                        responsive: true,
                        maintainAspectRatio: false,
                        plugins: {
                            legend: {
                                display: true,
                            },
                            title: {
                                display: false,
                                text: 'Ventas anuales'
                            },
                            datalabels: {
                                anchor: 'end',
                                align: 'end',
                                color: '#7d7d7d',
                                font: { size: 12 },
                                formatter: (value) => value.toLocaleString()
                            }
                        }
                    },
                    plugins: [ChartDataLabels] // Registra el plugin
                };
            
                methods.chart = new Chart(ctx, config);
            },
            update: (registrationList) => {
                let methods = ChartUtils.annuals.annualSellings;
                if (methods.chart) {
                    // Actualiza la data del Chart usando el método update
                    methods.chart.data = methods.groupData(registrationList);
                    methods.chart.update();
                } else {
                    console.error('El gráfico no ha sido creado aún. Llame primero a create().');
                }
            },
            groupData: (registrationList) => {
                let methods = ChartUtils.annuals.annualSellings;
                let minDate = null;
                let maxDate = null;

                // 1. Agrupar los registros por fecha y año, y sumar las matriculaciones.
                const datasets = registrationList.reduce((acc, { registrationDate, count }) => {
                    const date = new Date(registrationDate);
                    const year = date.getFullYear();
                    const month = date.getMonth();

                    if (!acc[year]) acc[year] = { data: Array(12).fill(undefined) };

                    acc[year].data[month] = (acc[year].data[month] || 0) + count;

                    if (!minDate || date < minDate) minDate = date;
                    if (!maxDate || date > maxDate) maxDate = date;

                    return acc;
                }, {});

                // 2. Rellenamos con ceros los huecos.
                Object.entries(datasets).forEach(([yearStr, { data }]) => {
                    const year = Number(yearStr);
                    const yearStart = new Date(year, 0, 1);
                    const yearEnd = new Date(year, 11, 31);

                    data.forEach((value, monthIndex) => {
                        const monthStart = new Date(year, monthIndex, 1);
                        const monthEnd = new Date(year, monthIndex + 1, 0);

                        if (value === undefined && monthEnd >= minDate && monthStart <= maxDate) {
                            data[monthIndex] = 0;
                        }
                    });
                });

                // 3. Retorna el objeto de datos para el gráfico.
                var alphaIncremental = Object.keys(datasets).length > 1 ? (1 - 0.4) / (Object.keys(datasets).length - 1) : 1;

                methods.data = {
                    labels: ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"],
                    datasets: Object.entries(datasets).map((item, index) => {
                        return {
                            label: item[0],
                            data: item[1].data,
                            backgroundColor: Colors.accent(1 - alphaIncremental*(Object.keys(datasets).length-1-index)),
                            borderColor: Colors.accent(0.7 - alphaIncremental*(Object.keys(datasets).length-1-index)),
                            borderWidth: 3,
                        };
                    })
                };
                return methods.data;
            }
        },
        annualSellingsDiff: {
            chart: null,
            create: (registrationList, ctx) => {
                let methods = ChartUtils.annuals.annualSellingsDiff;
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
            },
            update: (registrationList) => {
                let methods = ChartUtils.annuals.annualSellingsDiff;
                if (methods.chart) {
                    // Actualiza la data del Chart usando el método update
                    methods.chart.data = methods.groupData(registrationList);
                    methods.chart.update();
                } else {
                    console.error('El gráfico no ha sido creado aún. Llame primero a create().');
                }
            },
            groupData: (registrationList) => {
                const methods = ChartUtils.annuals.annualSellings;

                // 1. Obtenemos los datos “normales” ya procesados
                const baseData = JSON.parse(JSON.stringify(methods.data));
                const result = JSON.parse(JSON.stringify(methods.data));

                // 2. Calculamos minDate y maxDate de registrationList
                let minDate = null;
                let maxDate = null;
                registrationList.forEach(({ registrationDate }) => {
                    const d = new Date(registrationDate);
                    if (!minDate || d < minDate) minDate = d;
                    if (!maxDate || d > maxDate) maxDate = d;
                });

                // 3. Calculamos el diferencial por año/mes usando baseData como referencia
                result.datasets.forEach((dataset, yearIndex) => {
                    if (yearIndex === 0) return; // primer año no tiene diferencial

                    const prevDataset = baseData.datasets[yearIndex - 1]; // referencia al valor real
                    const year = Number(dataset.label);

                    dataset.data = dataset.data.map((value, monthIndex) => {
                        const monthStart = new Date(year, monthIndex, 1);
                        const monthEnd = new Date(year, monthIndex + 1, 0);

                        // Si el mes actual está fuera del rango global o el año anterior no tiene valor → undefined
                        if (minDate > new Date(year-1, monthIndex, 1) || maxDate < new Date(year, monthIndex, 1))
                            return undefined;
                        const prevValue = prevDataset.data[monthIndex];
                        if (prevValue === undefined) return undefined;

                        return value - prevValue;
                    });
                });

                // 4. Eliminamos el primer año de la salida
                result.datasets = result.datasets.slice(1);

                return result;
            }
        },
        annualSellingsAcc: {
            chart: null,
            create: (registrationList, ctx) => {
                let methods = ChartUtils.annuals.annualSellingsAcc;
                const config = {
                    type: 'line',
                    data: methods.groupData(registrationList),
                    options: {
                        responsive: true,
                        maintainAspectRatio: false,
                        plugins: {
                            legend: {
                                display: true,
                            },
                            title: {
                                display: false,
                                text: 'Ventas anuales'
                            },
                            datalabels: {
                                anchor: 'end',
                                align: 'end',
                                color: '#7d7d7d',
                                font: { size: 12 },
                                formatter: (value) => value.toLocaleString()
                            }
                        }
                    },
                    plugins: [ChartDataLabels] // Registra el plugin
                };
            
                methods.chart = new Chart(ctx, config);
            },
            update: (registrationList) => {
                let methods = ChartUtils.annuals.annualSellingsAcc;
                if (methods.chart) {
                    // Actualiza la data del Chart usando el método update
                    methods.chart.data = methods.groupData(registrationList);
                    methods.chart.update();
                } else {
                    console.error('El gráfico no ha sido creado aún. Llame primero a create().');
                }
            },
            groupData: (registrationList) => {
                let methodsAcc = ChartUtils.annuals.annualSellingsAcc;
                let methods = ChartUtils.annuals.annualSellings;

                // 1. Obtenemos el resultado normal
                const result = JSON.parse(JSON.stringify(methods.data));

                const { minDate, maxDate } = registrationList.reduce((acc, { registrationDate }) => {
                    const d = new Date(registrationDate);
                    return {
                        minDate: acc.minDate === null || d < acc.minDate ? d : acc.minDate,
                        maxDate: acc.maxDate === null || d > acc.maxDate ? d : acc.maxDate
                    };
                }, { minDate: null, maxDate: null });

                // 2. Acumulamos los resultados
                result.datasets.forEach(dataset => {
                    let runningTotal = 0;
                    const year = Number(dataset.label);

                    dataset.data = dataset.data.map((value, monthIndex) => {
                        const monthStart = new Date(year, monthIndex, 1);
                        const monthEnd = new Date(year, monthIndex + 1, 0);

                        // Si está fuera del rango global, dejamos undefined
                        if (monthEnd < minDate || monthStart > maxDate) return undefined;

                        // Acumulamos solo si hay valor (0 incluido)
                        runningTotal += value || 0;
                        return runningTotal;
                    });
                });

                // 3. Devolvemos el resultado acumulativo
                methodsAcc.data = result;
                return result;
            }
        },
        annualSellingsAccDiff: {
            chart: null,
            create: (registrationList, ctx) => {
                let methods = ChartUtils.annuals.annualSellingsAccDiff;
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
            },
            update: (registrationList) => {
                let methods = ChartUtils.annuals.annualSellingsAccDiff;
                if (methods.chart) {
                    // Actualiza la data del Chart usando el método update
                    methods.chart.data = methods.groupData(registrationList);
                    methods.chart.update();
                } else {
                    console.error('El gráfico no ha sido creado aún. Llame primero a create().');
                }
            },
            groupData: (registrationList) => {
                const methods = ChartUtils.annuals.annualSellingsAcc;

                // 1. Obtenemos los datos “normales” ya procesados
                const baseData = JSON.parse(JSON.stringify(methods.data));
                const result = JSON.parse(JSON.stringify(methods.data));

                // 2. Calculamos minDate y maxDate de registrationList
                let minDate = null;
                let maxDate = null;
                registrationList.forEach(({ registrationDate }) => {
                    const d = new Date(registrationDate);
                    if (!minDate || d < minDate) minDate = d;
                    if (!maxDate || d > maxDate) maxDate = d;
                });

                // 3. Calculamos el diferencial por año/mes usando baseData como referencia
                result.datasets.forEach((dataset, yearIndex) => {
                    if (yearIndex === 0) return; // primer año no tiene diferencial

                    const prevDataset = baseData.datasets[yearIndex - 1]; // referencia al valor real
                    const year = Number(dataset.label);

                    dataset.data = dataset.data.map((value, monthIndex) => {
                        const monthStart = new Date(year, monthIndex, 1);
                        const monthEnd = new Date(year, monthIndex + 1, 0);

                        // Si el mes actual está fuera del rango global o el año anterior no tiene valor → undefined
                        if (minDate > new Date(year-1, monthIndex, 1) || maxDate < new Date(year, monthIndex, 1))
                            return undefined;
                        const prevValue = prevDataset.data[monthIndex];
                        if (prevValue === undefined) return undefined;

                        return value - prevValue;
                    });
                });

                // 4. Eliminamos el primer año de la salida
                result.datasets = result.datasets.slice(1);

                return result;
            }
        }
    },
    propulsion: {
        motorTypesAcc: {
            chart: null,
            create: (registrationList, ctx) => {
                let methods = ChartUtils.propulsion.motorTypesAcc;
                const config = {
                    type: 'line',
                    data: methods.groupData(registrationList),
                    options: {
                        responsive: true,
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
            },
            update: (registrationList) => {
                let methods = ChartUtils.propulsion.motorTypesAcc;
                if (methods.chart) {
                    // Actualiza la data del Chart usando el método update
                    methods.chart.data = methods.groupData(registrationList);
                    methods.chart.update();
                } else {
                    console.error('El gráfico no ha sido creado aún. Llame primero a create().');
                }
            },
            groupData: (registrationList) => {
                // 1. Agrupa los registros por fecha, y por cada fecha agrupa por tipo de motor, y suma las matriculaciones.
                const groupedData = registrationList.reduce((acc, curr) => {
                    const date = curr.registrationDate.substring(7,0);
                    const motorTypeId = curr.motorTypeId; // SharedUtils.getMotorTypeDescription(curr.motorTypeId);

                    if (!acc[date]) {
                        acc[date] = [];
                    };
                    if (!acc[date][motorTypeId]) {
                        acc[date][motorTypeId] = 0;
                    }
                    acc[date][motorTypeId] += curr.count; // Sumar matriculaciones al mes correspondiente
                    return acc;
                }, {});

                // Ordena groupedData por fecha
                const sortedGroupedData = Object.entries(groupedData).sort((a, b) => new Date(a[0]) - new Date(b[0]));

                // 2. Crear un dataset para cada tipo de motor, con sus respectivos meses y matriculaciones en orden ascendente por mes.
                const datasets = sortedGroupedData.reduce((acc, curr) => {
                    const date = curr[0];
                    const data = curr[1];

                    Object.entries(data).forEach(([motorTypeId, count]) => {
                        if (!acc[motorTypeId]) {
                            acc[motorTypeId] = { 
                                data: []
                            };
                        };
                        acc[motorTypeId].data.push(count); // Sumar matriculaciones al mes correspondiente
                    });

                    return acc;
                }, {});

                // 2.1. Por cada mes, sumar las matriculaciones de todos los meses anteriores de cada tipo de motor.
                Object.entries(datasets).forEach((item) => {
                    const motorTypeId = item[0];
                    const data = item[1].data;
                    for (let i = 1; i < data.length; i++) {
                        data[i] += data[i - 1] || 0;
                    }
                });

                const data = {
                    labels: Object.entries(sortedGroupedData).map((item, index) => item[1][0]),
                    datasets: Object.entries(datasets).map((item, index) => {
                        return {
                            label: SharedUtils.getMotorTypeDescription(item[0]),
                            data: item[1].data,
                            backgroundColor: Colors.getPropulsionColor(item[0], 1),
                            borderColor: Colors.getPropulsionColor(item[0], 0.6),
                            borderWidth: 3,
                            fill: true
                        }
                    })
                };

                return data;
            }
        },
        motorTypesPie: {
            chart: null,
            create: (registrationList, ctx) => {
                let methods = ChartUtils.propulsion.motorTypesPie;
                const config = {
                    type: 'doughnut',
                    data: methods.groupData(registrationList),
                    options: {
                        responsive: true,
                        plugins: {
                            legend: {
                                position: 'top',
                            },
                            title: {
                                display: false,
                            }
                      }
                    },
                    plugins: [ChartDataLabels] // Registra el plugin
                  };

                methods.chart = new Chart(ctx, config);
            },
            update: (registrationList) => {
                let methods = ChartUtils.propulsion.motorTypesPie;
                if (methods.chart) {
                    // Actualiza la data del Chart usando el método update
                    methods.chart.data = methods.groupData(registrationList);
                    methods.chart.update();
                } else {
                    console.error('El gráfico no ha sido creado aún. Llame primero a create().');
                }
            },
            groupData: (registrationList) => {
                // 1. Agrupa los registros por tipo de motor, y suma las matriculaciones.
                const groupedData = registrationList.reduce((acc, curr) => {
                    const motorTypeId = curr.motorTypeId; // SharedUtils.getMotorTypeDescription(curr.motorTypeId);
                    acc[motorTypeId] = (acc[motorTypeId] || 0) + curr.count;
                    return acc;
                }, {});

                const data = {
                    labels: Object.keys(groupedData).map((item, index) => SharedUtils.getMotorTypeDescription(item)),
                    datasets: [
                        {
                            data: Object.values(groupedData),
                            backgroundColor: Object.keys(groupedData).map((item, index) => Colors.getPropulsionColor(item, 1)),
                            borderColor: Object.keys(groupedData).map((item, index) => Colors.getPropulsionColor(item, 0.6)),
                            borderWidth: 3
                        }
                    ]
                };

                return data;
            }
        }
    }
}

export default ChartUtils;