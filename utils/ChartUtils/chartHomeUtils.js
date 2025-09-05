import Colors from '../colorsUtils.js';
import SharedUtils from '../sharedUtils.js';

const Home = {
    data: {
        minDate: null,
        maxDate: null,
        dataNor: null,
        dataAcc: null
    },
    ranking: {
        chart: null,
        create: async (registrationList, ctx) => {
            return new Promise((resolve) => {
                let methods = Home.ranking;

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
                resolve();
            });
        },
        groupData: (registrationList, tops = 5) => {
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
            const labels = topModels.map(item => SharedUtils.getModelDescription(item[0], true)); 
            const data = topModels.map(item => item[1]);

            const backgroundColor = Array.from({ length: tops }, (_, index) => {
                return Colors.getIndexColor(index % 8, 1);
            });

            const borderColor = Array.from({ length: tops }, (_, index) => {
                return Colors.getIndexColor(index % 8, 1);
            });

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
    annuals: {
        chart: null,
        create: async (registrationList, ctx) => {
            return new Promise((resolve) => {
                let methods = Home.annuals;

                const config = {
                    type: 'bar',
                    data: methods.groupData(registrationList),
                    options: {
                        indexAxis: 'x',
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
                resolve();
            });
        },
        groupData: (registrationList, tops = 5) => {
            // 1. Agrupar RegistrationList por año y sumar matriculaciones
            const groupedData = registrationList.reduce((acc, curr) => {
                const year = new Date(curr.registrationDate).getFullYear();
                acc[year] = (acc[year] || 0) + curr.count;
                return acc;
            }, {});

            // 2. Ordenar años cronológicamente
            const sortedYears = Object.keys(groupedData).sort((a, b) => a - b);

            // 3. Limitar a los top años más recientes si se especifica
            const topYears = sortedYears.slice(-tops);

            // 4. Crear arrays de labels y data
            const labels = topYears;
            const data = topYears.map(year => groupedData[year]);

            // 5. Asignar colores cíclicamente según índice
            const backgroundColor = Array.from({ length: topYears.length }, (_, index) => Colors.getIndexColor(index % 8, 1));
            const borderColor = Array.from({ length: topYears.length }, (_, index) => Colors.getIndexColor(index % 8, 1));

            // 6. Retornar objeto listo para Chart.js
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
    propulsion: {
        chart: null,
        create: async (registrationList, ctx) => {
            return new Promise((resolve) => {
                let methods = Home.propulsion;
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
                            },
                            tooltip: {
                                callbacks: {
                                    label: function(context) {
                                        const value = dataset.data[context.dataIndex];
                                        return context.label + ': ' + value + '%';
                                    }
                                }
                            },
                            datalabels: {
                                formatter: (value, context) => { return value + '%'; },
                                color: Colors.primary()
                            }
                        }
                    },
                    plugins: [ChartDataLabels] // Registra el plugin
                    };

                methods.chart = new Chart(ctx, config);
                resolve();
            });
        },
        groupData: (registrationList) => {
            // 1. Agrupa los registros por tipo de motor y suma las matriculaciones
            const groupedData = registrationList.reduce((acc, curr) => {
                const motorTypeId = curr.motorTypeId;
                acc[motorTypeId] = (acc[motorTypeId] || 0) + curr.count;
                return acc;
            }, {});

            // 2. Calcula el total de matriculaciones
            const total = Object.values(groupedData).reduce((sum, val) => sum + val, 0);

            // 3. Convierte los valores en porcentaje con dos decimales
            const percentages = Object.values(groupedData).map(val => ((val / total) * 100).toFixed(2));

            const data = {
                labels: Object.keys(groupedData).map(item => SharedUtils.getMotorTypeDescription(item)),
                datasets: [
                    {
                        data: percentages,
                        backgroundColor: Object.keys(groupedData).map(item => Colors.getPropulsionColor(item, 1)),
                        borderColor: Object.keys(groupedData).map(item => Colors.getPropulsionColor(item, 0.6)),
                        borderWidth: 3
                    }
                ]
            };

            return data;
        }
    }
}

export default Home;