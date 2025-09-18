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
        create: async (registrationList, ctx) => {
            return new Promise((resolve) => {
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
                                color: Colors.black(0.6),
                                font: { size: 12 },
                                formatter: (value) => value.toLocaleString()
                            }
                        }
                    },
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
        create: async (registrationList, ctx) => {
            return new Promise((resolve) => {
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
                                color: Colors.black(0.6),
                                font: { size: 12 },
                                formatter: (value) => value.toLocaleString()
                            }
                        }
                    },
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
    },
    topBrandsAcc: {
        chart: null,
        create: async (registrationList, ctx) => {
            return new Promise((resolve) => {
                let methods = Ranking.topBrandsAcc;
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
                                display: (ctx) => {
                                    const index = ctx.dataIndex;
                                    const total = ctx.dataset.data.length;
                                    // Mostrar cada 4, o el último siempre
                                    return index % 4 === 0 || index === total - 1;
                                },
                                anchor: 'end',
                                align: 'end',
                                color: Colors.black(0.6),
                                font: { size: 12 },
                                formatter: (value) => value.toLocaleString()
                            }
                        }
                    },
                    plugins: [ChartDataLabels, Ranking.watermark(80, 40, 80)]
                };

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
                                display: (ctx) => {
                                    const index = ctx.dataIndex;
                                    const total = ctx.dataset.data.length;
                                    // Mostrar cada 4, o el último siempre
                                    return index % 4 === 0 || index === total - 1;
                                },
                                anchor: 'end',
                                align: 'end',
                                color: Colors.black(0.6),
                                font: { size: 12 },
                                formatter: (value) => value.toLocaleString()
                            }
                        }
                    },
                    plugins: [ChartDataLabels, Ranking.watermark(80, 40, 80)]
                };

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