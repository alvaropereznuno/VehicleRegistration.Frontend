import Colors from '../colorsUtils.js';
import Commons from './chartCommonsUtils.js';
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
        dataDom: null
    },
    brandGrowthMoM: {
        create: async (registrationList, ctx) => {
            return new Promise((resolve) => {
                let methods = Trends.brandGrowthMoM;
                const config = {
                    type: 'bar',
                    data: methods.groupData(registrationList),
                    options: Commons.bar.options('y', false),
                    plugins: [ChartDataLabels, Trends.watermark(80, 50, 50)] // Registra el plugin
                };
                
                // Custom.
                config.options.plugins.datalabels.formatter = function (value) {
                    return `${value.toFixed(2)}%`;
                }
                config.options.plugins.tooltip.callbacks = {
                    label: function(context) {
                        const value = context.raw;
                        return `${value.toFixed(2)}%`;
                    }
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
                return d.growth >= 0
                    ? Colors.type_3(0.4 + 0.6 * (d.growth / maxPositive))
                    : Colors.type_4(0.4 + 0.6 * (d.growth / minNegative))
            });

            const borderColor = brandGrowth.map(d => {
                return d.growth >= 0
                    ? Colors.type_3(0.7 + 0.3 * (d.growth / maxPositive))
                    : Colors.type_4(0.7 + 0.3 * (d.growth / minNegative))
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
                    options: Commons.bar.options('y', false),
                    plugins: [ChartDataLabels, Trends.watermark(80, 50, 50)] // Registra el plugin
                };
                
                // Custom.
                config.options.plugins.datalabels.formatter = function (value) {
                    return `${value.toFixed(2)}%`;
                }
                config.options.plugins.tooltip.callbacks = {
                    label: function(context) {
                        const value = context.raw;
                        return `${value.toFixed(2)}%`;
                    }
                }
            
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
                return d.growth >= 0
                    ? Colors.type_3(0.4 + 0.6 * (d.growth / maxPositive))
                    : Colors.type_4(0.4 + 0.6 * (d.growth / minNegative))
            });

            const borderColor = brandGrowth.map(d => {
                return d.growth >= 0
                    ? Colors.type_3(0.7 + 0.3 * (d.growth / maxPositive))
                    : Colors.type_4(0.7 + 0.3 * (d.growth / minNegative))
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
    brandDomination: {
        create: async (registrationList, ctx) => {
            return new Promise((resolve) => {
                let methods = Trends.brandDomination;

                const config = {
                    type: 'doughnut',
                    data: methods.groupData(registrationList),
                    options: Commons.doughnut.options(),
                    plugins: [ChartDataLabels, Trends.watermark(80, 20, 20)] // Registra el plugin
                };
            
                methods.chart = new Chart(ctx, config);
                resolve();
            });
        },
        update: async (registrationList) => {
            return new Promise((resolve) => {
                let methods = Trends.brandDomination;
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
            
            const data = Trends.data;

            // 1. Agrupar por marca y obtener sumatorios totales
            const groupedData = Object.entries(
                registrationList.reduce((acc, curr) => {
                    acc[curr.brandId] = (acc[curr.brandId] || 0) + curr.count;
                    return acc;
                }, {})
            ).sort((a, b) => b[1] - a[1]);

            // 2. Obtener los top brands y parsearlos a int
            const topBrands = groupedData.slice(0, tops).map(b => parseInt(b[0]));
            topBrands.push(0);

            // 3. Determinar último mes disponible
            const latestDate = registrationList.reduce((latest, curr) => 
                curr.registrationDate > latest ? curr.registrationDate : latest, '0000-00-00');
            const latestYear = parseInt(latestDate.slice(0, 4));
            const latestMonth = parseInt(latestDate.slice(5, 7)); // 1-12
            const prevYear = latestYear - 1;

            const brandValues = {};
            registrationList.forEach(({ brandId, registrationDate, count }) => {
                let brandIdC = topBrands.includes(brandId) ? brandId : 0;
                
                if (!brandValues[brandIdC]) brandValues[brandIdC] = { current: 0, previous: 0 };
                const [year, month] = registrationDate.split('-').map(Number);
                if (year === latestYear && month <= latestMonth) {
                    brandValues[brandIdC].current += count;
                }
                if (year === prevYear && month <= latestMonth) {
                    brandValues[brandIdC].previous += count;
                }
            });

            // 4. Por cada marca se calcula el dominio de mercado que tiene en el mismo año respecto a las demás marcas.
            const totalCurrent = Object.values(brandValues).reduce((sum, v) => sum + v.current, 0);
            const totalPrevious = Object.values(brandValues).reduce((sum, v) => sum + v.previous, 0);

            Object.keys(brandValues).forEach(brandId => {
                brandValues[brandId].dominationCurrent = totalCurrent > 0 ? (brandValues[brandId].current / totalCurrent) * 100 : 0;
                brandValues[brandId].dominationPrevious = totalPrevious > 0 ? (brandValues[brandId].previous / totalPrevious) * 100 : 0;
            });

            // 5. Se guarda en variable
            data.dataDom = brandValues;

            // 6. Construir labels y data ORDENADOS (id=0 siempre al final)
            const sorted = Object.entries(brandValues)
                .map(([brandId, values]) => ({
                    brandId: parseInt(brandId),
                    dominationCurrent: values.dominationCurrent,
                    dominationPrevious: values.dominationPrevious
                }))
                .sort((a, b) => {
                    if (a.brandId === 0) return 1;   // "Otros" siempre al final
                    if (b.brandId === 0) return -1;  
                    return b.dominationCurrent - a.dominationCurrent;
                });

            const labels = sorted.map(item => SharedUtils.getBrandDescription2(item.brandId));
            const dataCurrent = sorted.map(item => item.dominationCurrent);
            const dataPrevious = sorted.map(item => item.dominationPrevious);

            // Colores iguales para ambas capas
            const backgroundColor = sorted.map((item, index) =>
                item.brandId === 0 ? "rgba(150,150,150,0.6)" : Colors.getIndexColor(index % 8)
            );
            const borderColor = backgroundColor;

            // 7. Retornar objeto listo para Chart.js
            return {
                labels: labels,
                datasets: [
                    {
                        label: "Actual",
                        data: dataCurrent,
                        backgroundColor: backgroundColor,
                        borderColor: borderColor,
                        borderWidth: 1,
                        radius: "100%",   // capa exterior
                        cutout: "0%"
                    },
                    {
                        label: "Anterior",
                        data: dataPrevious,
                        backgroundColor: backgroundColor.map(c => c.replace("0.6", "0.3")), // más tenue
                        borderColor: borderColor,
                        borderWidth: 1,
                        radius: "70%",    // capa interior
                        cutout: "30%"
                    }
                ]
            };

        }
    },
    brandDominationGrowth: {
        create: async (registrationList, ctx) => {
            return new Promise((resolve) => {
                let methods = Trends.brandDominationGrowth;

                const config = {
                    type: 'bar',
                    data: methods.groupData(registrationList),
                    options: Commons.bar.options('y', false),
                    plugins: [ChartDataLabels, Trends.watermark(80, 50, 80)] // Registra el plugin
                };
                
                // Custom.
                config.options.plugins.datalabels.formatter = function (value) {
                    return `${value.toFixed(2)}%`;
                }
                config.options.plugins.tooltip.callbacks = {
                    label: function(context) {
                        const value = context.raw;
                        return `${value.toFixed(2)}%`;
                    }
                }
            
                methods.chart = new Chart(ctx, config);
                resolve();
            });
        },
        update: async (registrationList) => {
            return new Promise((resolve) => {
                let methods = Trends.brandDominationGrowth;
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
            
            const data = Trends.data;
            const brandValues = JSON.parse(JSON.stringify(data.dataDom));
            
            let cosa = 1;

            // 6. Construir labels y data ORDENADOS (id=0 siempre al final)
            const sorted = Object.entries(brandValues)
                .map(([brandId, values]) => ({
                    brandId: parseInt(brandId),
                    dominationCurrent: values.dominationCurrent,
                    dominationPrevious: values.dominationPrevious
                }))
                .sort((a, b) => {
                    if (a.brandId === 0) return 1;   // "Otros" siempre al final
                    if (b.brandId === 0) return -1;  
                    return (b.dominationCurrent - b.dominationPrevious) - (a.dominationCurrent - a.dominationPrevious);
                });

            const labels = sorted.map(item => SharedUtils.getBrandDescription2(item.brandId));
            const dataGrowth = sorted.map(item => item.dominationCurrent - item.dominationPrevious);

            // Colores verde/rojo con degradado alpha según magnitud
            const maxPositive = Math.max(...dataGrowth.filter(v => v > 0), 1);
            const minNegative = Math.min(...dataGrowth.filter(v => v < 0), -1);

            const backgroundColor = dataGrowth.map(v => {
                return v >= 0
                    ? Colors.type_3(0.4 + 0.6 * (v / maxPositive))
                    : Colors.type_4(0.4 + 0.6 * (v / minNegative))
            });

            const borderColor = dataGrowth.map(v => {
                return v >= 0
                    ? Colors.type_3(0.7 + 0.3 * (v / maxPositive))
                    : Colors.type_4(0.7 + 0.3 * (v / minNegative))
            });

            // 7. Retornar objeto listo para Chart.js
            return {
                labels: labels,
                datasets: [
                    {
                        data: dataGrowth,
                        backgroundColor: backgroundColor,
                        borderColor: borderColor,
                        borderWidth: 1,
                    }
                ]
            };

        }
    }
}

export default Trends;