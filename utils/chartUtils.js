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
                var alphaIncremental = (1 - 0.4) / (tops - 1);

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
                var alphaIncremental = (1 - 0.4) / (tops - 1);

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
                // 1. Agrupar los registros por fecha, y sumar las matriculaciones.
                const groupedData = registrationList.reduce((acc, curr) => {
                    acc[curr.registrationDate] = (acc[curr.registrationDate] || 0) + curr.count;
                    return acc;
                }
                , {});

                // 2. Crear un dataset para cada año, con sus respectivos meses y matriculaciones en orden ascendente por mes.
                const datasets = Object.entries(groupedData).reduce((acc, curr) => {
                    const year = new Date(curr[0]).getFullYear();
                    const month = new Date(curr[0]).getMonth();

                    if (!acc[year]) {
                        acc[year] = { 
                            data: [],
                            borderWidth: 3, 
                        };
                    };
                    acc[year].data[month] = curr[1]; // Sumar matriculaciones al mes correspondiente

                    return acc;
                }, {});

                // 3. Retorna el objeto de datos para el gráfico.
                var alphaIncremental = (1 - 0.4) / (Object.keys(datasets).length - 1);
                return {
                    labels: ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"],
                    datasets: Object.entries(datasets).map((item, index) => {
                        return {
                            label: item[0],
                            data: item[1].data,
                            backgroundColor: Colors.accent(0.4 + alphaIncremental*index),
                            borderColor: Colors.accent(0.1 + alphaIncremental*index),
                            borderWidth: 3,
                        };
                    })
                };
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
                                formatter: (value) => value.toLocaleString()
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
                // 1. Agrupar los registros por fecha, y sumar las matriculaciones.
                const groupedData = registrationList.reduce((acc, curr) => {
                    acc[curr.registrationDate] = (acc[curr.registrationDate] || 0) + curr.count;
                    return acc;
                }
                , {});

                // 2. Crear un dataset para cada año, con sus respectivos meses y matriculaciones en orden ascendente por mes.
                const datasets = Object.entries(groupedData).reduce((acc, curr) => {
                    const year = new Date(curr[0]).getFullYear();
                    const month = new Date(curr[0]).getMonth();

                    if (!acc[year]) {
                        acc[year] = { 
                            data: [],
                            borderWidth: 3, 
                        };
                    };
                    acc[year].data[month] = curr[1]; // Sumar matriculaciones al mes correspondiente

                    return acc;
                }, {});

                // 2.2. Por cada mes del año, calcula la diferencia respecto al mismo mes del año anterior, creando un nuevo dataset, ignorando el primer año.
                const datasetsDiff = Object.entries(datasets).reduce((acc, curr) => {
                    const year = curr[0];
                    const data = curr[1].data;
                    acc[year] = { data: [] };
                    for (let i = 0; i < data.length; i++) {
                        acc[year].data[i] = data[i] - (datasets[year - 1]?.data[i] || 0);
                    }
                    return acc;
                }, {});
                
                // 2.3 . Elimina el primer año de los datasetsDiff.
                delete datasetsDiff[Object.keys(datasets)[0]];

                // 3. Retorna el objeto de datos para el gráfico.
                var alphaIncremental = (1 - 0.4) / (Object.keys(datasets).length - 1);
                return {
                    labels: ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"],
                    datasets: Object.entries(datasetsDiff).map((item, index) => {
                        return {
                            label: item[0],
                            data: item[1].data,
                            backgroundColor: Colors.accent(0.4 + alphaIncremental*(index+1)),
                            borderColor: Colors.accent(0.1 + alphaIncremental*(index+1)),
                            borderWidth: 3,
                        };
                    })
                };
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
                // 1. Agrupar los registros por fecha, y sumar las matriculaciones.
                const groupedData = registrationList.reduce((acc, curr) => {
                    acc[curr.registrationDate] = (acc[curr.registrationDate] || 0) + curr.count;
                    return acc;
                }
                , {});

                // 2. Crear un dataset para cada año, con sus respectivos meses y matriculaciones en orden ascendente por mes.
                const datasets = Object.entries(groupedData).reduce((acc, curr) => {
                    const year = new Date(curr[0]).getFullYear();
                    const month = new Date(curr[0]).getMonth();

                    if (!acc[year]) {
                        acc[year] = { 
                            data: [],
                            borderWidth: 3, 
                        };
                    };
                    acc[year].data[month] = curr[1]; // Sumar matriculaciones al mes correspondiente

                    return acc;
                }, {});

                // 2.1. Por cada mes del año, sumar las matriculaciones de los meses anteriores.
                Object.entries(datasets).forEach((item) => {
                    const year = item[0];
                    const data = item[1].data;
                    for (let i = 1; i < data.length; i++) {
                        data[i] += data[i - 1] || 0;
                    }
                });

                // 3. Retorna el objeto de datos para el gráfico.
                var alphaIncremental = (1 - 0.4) / (Object.keys(datasets).length - 1);
                return {
                    labels: ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"],
                    datasets: Object.entries(datasets).map((item, index) => {
                        return {
                            label: item[0],
                            data: item[1].data,
                            backgroundColor: Colors.accent(0.4 + alphaIncremental*index),
                            borderColor: Colors.accent(0.1 + alphaIncremental*index),
                            borderWidth: 3,
                        };
                    })
                };
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
                                formatter: (value) => value.toLocaleString()
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
                // 1. Agrupar los registros por fecha, y sumar las matriculaciones.
                const groupedData = registrationList.reduce((acc, curr) => {
                    acc[curr.registrationDate] = (acc[curr.registrationDate] || 0) + curr.count;
                    return acc;
                }
                , {});

                // 2. Crear un dataset para cada año, con sus respectivos meses y matriculaciones en orden ascendente por mes.
                const datasets = Object.entries(groupedData).reduce((acc, curr) => {
                    const year = new Date(curr[0]).getFullYear();
                    const month = new Date(curr[0]).getMonth();

                    if (!acc[year]) {
                        acc[year] = { 
                            data: [],
                            borderWidth: 3, 
                        };
                    };
                    acc[year].data[month] = curr[1]; // Sumar matriculaciones al mes correspondiente

                    return acc;
                }, {});

                // 2.1. Por cada mes del año, sumar las matriculaciones de los meses anteriores.
                Object.entries(datasets).forEach((item) => {
                    const year = item[0];
                    const data = item[1].data;
                    for (let i = 1; i < data.length; i++) {
                        data[i] += data[i - 1] || 0;
                    }
                });

                // 2.2. Por cada mes del año, calcula la diferencia respecto al mismo mes del año anterior, creando un nuevo dataset, ignorando el primer año.
                const datasetsDiff = Object.entries(datasets).reduce((acc, curr) => {
                    const year = curr[0];
                    const data = curr[1].data;
                    acc[year] = { data: [] };
                    for (let i = 0; i < data.length; i++) {
                        acc[year].data[i] = data[i] - (datasets[year - 1]?.data[i] || 0);
                    }
                    return acc;
                }, {});

                // 2.3 . Elimina el primer año de los datasetsDiff.
                delete datasetsDiff[Object.keys(datasets)[0]];

                // 3. Retorna el objeto de datos para el gráfico.
                var alphaIncremental = (1 - 0.4) / (Object.keys(datasets).length - 1);
                return {
                    labels: ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"],
                    datasets: Object.entries(datasetsDiff).map((item, index) => {
                        return {
                            label: item[0],
                            data: item[1].data,
                            backgroundColor: Colors.accent(0.4 + alphaIncremental*(index+1)),
                            borderColor: Colors.accent(0.1 + alphaIncremental*(index+1)),
                            borderWidth: 3,
                        };
                    })
                };
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