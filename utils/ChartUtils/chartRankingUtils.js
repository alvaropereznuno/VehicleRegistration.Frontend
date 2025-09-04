import Colors from '../colorsUtils.js';
import SharedUtils from '../sharedUtils.js';

const Ranking = {
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
    topBrands: {
        chart: null,
        create: (registrationList, ctx) => {
            let methods = Ranking.topBrands;

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
                plugins: [ChartDataLabels, Ranking.watermark(80, 50, 50)] // Registra el plugin
            };
        
            methods.chart = new Chart(ctx, config);
        },
        update: (registrationList) => {
            let methods = Ranking.topBrands;
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
            const alphaIncremental = tops > 1 ? (1 - 0.4) / (tops - 1) : 1;

            const labels = topBrands.map(item => SharedUtils.getBrandDescription2(item[0])); 
            const data = topBrands.map(item => item[1]);

            const backgroundColor = Array.from({ length: tops }, (_, index) => {
                const alpha = 1 - alphaIncremental * index;
                return Colors.getIndexColor(index % 8, alpha);
            });

            const borderColor = Array.from({ length: tops }, (_, index) => {
                const alpha = 0.7 - alphaIncremental * index;
                return Colors.getIndexColor(index % 8, alpha);
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
    topModels: {
        chart: null,
        create: (registrationList, ctx) => {
            let methods = Ranking.topModels;

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
                plugins: [ChartDataLabels, Ranking.watermark(80, 50, 50)] // Registra el plugin
            };
        
            methods.chart = new Chart(ctx, config);
        },
        update: (registrationList) => {
            let methods = Ranking.topModels;
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
            const alphaIncremental = tops > 1 ? (1 - 0.4) / (tops - 1) : 1;

            const labels = topModels.map(item => SharedUtils.getModelDescription(item[0], true)); 
            const data = topModels.map(item => item[1]);

            const backgroundColor = Array.from({ length: tops }, (_, index) => {
                const alpha = 1 - alphaIncremental * index;
                return Colors.getIndexColor(index % 8, alpha);
            });

            const borderColor = Array.from({ length: tops }, (_, index) => {
                const alpha = 0.7 - alphaIncremental * index;
                return Colors.getIndexColor(index % 8, alpha);
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
    }
}

export default Ranking;