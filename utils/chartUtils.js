import COLORS from '../configurations/colors.js';
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
                const labels = topBrands.map(item => item[0]); 
                const data = topBrands.map(item => item[1]);
                // Circular de colores: topBrands.map((_, index) => ChartUtils.monocolors.filled[index % ChartUtils.monocolors.filled.length]);
                const backgroundColor = COLORS.THEME.SOLID.ACCENT;
                const borderColor = COLORS.THEME.ALPHA.ACCENT;

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
                const labels = topModels.map(item => SharedUtils.getBrandDescription(item[0]) + " " +  SharedUtils.getModelDescription(item[0])); 
                const data = topModels.map(item => item[1]);
                const backgroundColor = COLORS.THEME.SOLID.ACCENT;
                const borderColor = COLORS.THEME.ALPHA.ACCENT;

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
    }
}

export default ChartUtils;