import Colors from '../colorsUtils.js';
import SharedUtils from '../sharedUtils.js';
import DataUtils from '../dataUtils.js';
import Commons from './chartCommonsUtils.js';

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
        create: async (registrationList, ctx) => {
            return new Promise((resolve) => {
                let methods = Ranking.topBrands;

                const config = {
                    type: 'bar',
                    data: methods.groupData(registrationList),
                    options: Commons.bar.options('y', false),
                    plugins: [ChartDataLabels, Ranking.watermark(80, 50, 50)] // Registra el plugin
                };
            
                methods.chart = new Chart(ctx, config);
                resolve();
            });
        },
        update: async (registrationList) => {
            return new Promise((resolve) => {
                let methods = Ranking.topBrands;
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
            // 1. Agrupar por Marca y quedarse con los top ordenados de mayor a menor.
            const groupedData = DataUtils.registrations.group(["B"], "C", true, 25);

            // 2. Retorna el objeto de datos para el gráfico.
            return {
                labels: groupedData.map(item => item.B),
                datasets: [{
                    data: groupedData.map(item => item.C),
                    backgroundColor: Colors.getRainbowColors(tops, true, true, 1, 0.4)
                }]
            };
        }
    },
    topModels: {
        chart: null,
        create: async (registrationList, ctx) => {
            return new Promise((resolve) => {
                let methods = Ranking.topModels;

                const config = {
                    type: 'bar',
                    data: methods.groupData(registrationList),
                    options: Commons.bar.options('y', false),
                    plugins: [ChartDataLabels, Ranking.watermark(80, 50, 50)] // Registra el plugin
                };
            
                methods.chart = new Chart(ctx, config);
                resolve();
            });
        },
        update: async (registrationList) => {
            return new Promise((resolve) => {
                let methods = Ranking.topModels;
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
            // 1. Agrupar por Modelo y quedarse con los top ordenados de mayor a menor.
            const groupedData = DataUtils.registrations.group(["M"], "C", true, 25);

            // 2. Retorna el objeto de datos para el gráfico.
            return {
                labels: groupedData.map(item => item.M),
                datasets: [{
                    data: groupedData.map(item => item.C),
                    backgroundColor: Colors.getRainbowColors(tops, true, true, 1, 0.4)
                }]
            };
        }
    },
    topBrandsAcc: {
        chart: null,
        create: async (registrationList, ctx) => {
            return new Promise((resolve) => {
                let methods = Ranking.topBrandsAcc;
                const config = {
                    type: 'line',
                    data: methods.groupData(registrationList),
                    options: Commons.line.options(),
                    plugins: [ChartDataLabels, Ranking.watermark(80, 40, 80)]
                };
                
                // Custom.
                config.options.plugins.datalabels.display = function (ctx) {
                    const index = ctx.dataIndex;
                    const total = ctx.dataset.data.length;
                    // Mostrar cada 4, o el último siempre
                    return index % 4 === 0 || index === total - 1;
                }

                methods.chart = new Chart(ctx, config);
                resolve();
            });
        },
        update: async (registrationList) => {
            return new Promise((resolve) => {
                let methods = Ranking.topBrandsAcc;
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
        groupData: (registrationList, top = 5) => {
            // 1. Agrupar por marca y por fecha
            const datasetsByBrand = registrationList.reduce((acc, { brandId, registrationDate, count }) => {
                const date = new Date(registrationDate);
                const dateKey = date.toISOString().split("T")[0]; // YYYY-MM-DD

                if (!acc[brandId]) {
                    acc[brandId] = { 
                        label: SharedUtils.getBrandDescription2(brandId), 
                        data: {}, 
                        total: 0 
                    };
                }

                acc[brandId].data[dateKey] = (acc[brandId].data[dateKey] || 0) + count;
                acc[brandId].total += count;

                return acc;
            }, {});

            // 2. Obtener todas las fechas únicas y ordenarlas
            const allDates = [
                ...new Set(
                    registrationList.map(r => new Date(r.registrationDate).toISOString().split("T")[0])
                )
            ].sort((a, b) => new Date(a) - new Date(b));

            // 3. Seleccionar las TOP marcas
            const topBrands = Object.entries(datasetsByBrand)
                .sort(([, a], [, b]) => b.total - a.total) // ordenar por total descendente
                .slice(0, top);

            // 1. Agrupar por Marca y fecha y quedarse con los top.
            var groupedData = DataUtils.registrations.group(["B", "DT"], "DT", false, 5); 

            // 4. Construir datasets acumulados solo para las TOP marcas
            const datasets = topBrands.map(([brandId, brandData], index) => {
                let cumulative = 0;

                const values = allDates.map(dateKey => {
                    cumulative += brandData.data[dateKey] || 0;
                    return cumulative;
                });

                return {
                    label: brandData.label,
                    data: values,
                    borderColor: Colors.getIndexColor(index % 8, 0.7),
                    backgroundColor: Colors.getIndexColor(index % 8, 1),
                    borderWidth: 2,
                    fill: false,
                    tension: 0.2,
                };
            });

            // 5. Retorno listo para Chart.js
            return {
                labels: allDates,
                datasets: datasets
            };
        }

    },
    topModelsAcc: {
        chart: null,
        create: async (registrationList, ctx) => {
            return new Promise((resolve) => {
                let methods = Ranking.topModelsAcc;
                const config = {
                    type: 'line',
                    data: methods.groupData(registrationList),
                    options: Commons.line.options(),
                    plugins: [ChartDataLabels, Ranking.watermark(80, 40, 80)]
                };
                
                // Custom.
                config.options.plugins.datalabels.display = function (ctx) {
                    const index = ctx.dataIndex;
                    const total = ctx.dataset.data.length;
                    // Mostrar cada 4, o el último siempre
                    return index % 4 === 0 || index === total - 1;
                }
                
                methods.chart = new Chart(ctx, config);
                resolve();
            });
        },
        update: async (registrationList) => {
            return new Promise((resolve) => {
                let methods = Ranking.topModelsAcc;
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
        groupData: (registrationList, top = 5) => {
            // 1. Agrupar por modelo y por fecha
            const datasetsByModel = registrationList.reduce((acc, { modelId, registrationDate, count }) => {
                const date = new Date(registrationDate);
                const dateKey = date.toISOString().split("T")[0]; // YYYY-MM-DD

                if (!acc[modelId]) {
                    acc[modelId] = { 
                        label: SharedUtils.getModelDescription(modelId, false), 
                        data: {}, 
                        total: 0 
                    };
                }

                acc[modelId].data[dateKey] = (acc[modelId].data[dateKey] || 0) + count;
                acc[modelId].total += count;

                return acc;
            }, {});

            // 2. Obtener todas las fechas únicas y ordenarlas
            const allDates = [
                ...new Set(
                    registrationList.map(r => new Date(r.registrationDate).toISOString().split("T")[0])
                )
            ].sort((a, b) => new Date(a) - new Date(b));

            // 3. Seleccionar las TOP marcas
            const topModels = Object.entries(datasetsByModel)
                .sort(([, a], [, b]) => b.total - a.total) // ordenar por total descendente
                .slice(0, top);

            // 4. Construir datasets acumulados solo para las TOP marcas
            const datasets = topModels.map(([modelId, modelData], index) => {
                let cumulative = 0;

                const values = allDates.map(dateKey => {
                    cumulative += modelData.data[dateKey] || 0;
                    return cumulative;
                });

                return {
                    label: modelData.label,
                    data: values,
                    borderColor: Colors.getIndexColor(index % 8, 0.7),
                    backgroundColor: Colors.getIndexColor(index % 8, 1),
                    borderWidth: 2,
                    fill: false,
                    tension: 0.2,
                };
            });

            // 5. Retorno listo para Chart.js
            return {
                labels: allDates,
                datasets: datasets
            };
        }
    }
}

export default Ranking;