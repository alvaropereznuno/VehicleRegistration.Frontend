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
                        const brandId = SharedUtils.getBrandDescription(curr.modelId);
                        acc[brandId] = (acc[brandId] || 0) + curr.count;
                        return acc;
                    }, {})
                ).sort((a, b) => b[1] - a[1]);

                // 2. Obtener los top resultados. El resto se agrupan en una única entrada.
                const topBrands = groupedData.slice(0, tops);

                // 3. Crear el objeto de datos para el gráfico.
                var alphaIncremental = (1 - 0.4) / (tops - 1);

                const labels = topBrands.map(item => item[0]); 
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

                const labels = topModels.map(item => SharedUtils.getBrandDescription(item[0]) + " " +  SharedUtils.getModelDescription(item[0])); 
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
        }
    }
}

export default ChartUtils;