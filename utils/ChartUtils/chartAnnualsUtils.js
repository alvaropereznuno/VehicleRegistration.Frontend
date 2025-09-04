import Colors from '../colorsUtils.js';

const Annuals = {
    watermark: function(maxWidth, marginLeft, marginRight){
        const img = new Image();
        img.src = '/Images/metricars_es.svg';

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
        minDate: null,
        maxDate: null,
        dataNor: null,
        dataAcc: null
    },
    annualSellings: {
        chart: null,
        data: null,
        create: (registrationList, ctx) => {
            let methods = Annuals.annualSellings;
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
                plugins: [ChartDataLabels, Annuals.watermark(80, 30, 70)] // Registra el plugin
            };
        
            methods.chart = new Chart(ctx, config);
        },
        update: (registrationList) => {
            let methods = Annuals.annualSellings;
            if (methods.chart) {
                // Actualiza la data del Chart usando el método update
                methods.chart.data = methods.groupData(registrationList);
                methods.chart.update();
            } else {
                console.error('El gráfico no ha sido creado aún. Llame primero a create().');
            }
        },
        groupData: (registrationList) => {
            let data = Annuals.data;

            // 1. Agrupar los registros por fecha y año, y sumar las matriculaciones.
            const datasets = registrationList.reduce((acc, { registrationDate, count }) => {
                const date = new Date(registrationDate);
                const year = date.getFullYear();
                const month = date.getMonth();

                if (!acc[year]) acc[year] = { yearList: Array(12).fill(undefined) };

                acc[year].yearList[month] = (acc[year].yearList[month] || 0) + count;

                if (!data.minDate || date < data.minDate) data.minDate = date;
                if (!data.maxDate || date > data.maxDate) data.maxDate = date;

                return acc;
            }, {});

            // 2. Rellenamos con ceros los huecos.
            Object.entries(datasets).forEach(([yearStr, { yearList }]) => {
                const year = Number(yearStr);

                yearList.forEach((value, monthIndex) => {
                    const monthStart = new Date(year, monthIndex, 1);
                    const monthEnd = new Date(year, monthIndex + 1, 0);

                    if (value === undefined && monthEnd >= data.minDate && monthStart <= data.maxDate) {
                        yearList[monthIndex] = 0;
                    }
                });
            });

            // 3. Colores por año
            const yearKeys = Object.keys(datasets);
            const alphaIncremental = yearKeys.length > 1 ? (1 - 0.4) / (yearKeys.length - 1) : 1;

            // 4. Construimos datasets con colores y degradado de alpha
            data.dataNor = {
                labels: ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"],
                datasets: yearKeys.map((year, index) => {
                    const alphaBg = 1 - alphaIncremental * (yearKeys.length - 1 - index);
                    const alphaBorder = 0.7 - alphaIncremental * (yearKeys.length - 1 - index);

                    return {
                        label: year,
                        data: datasets[year].yearList,
                        backgroundColor: Colors.getIndexColor(index % 8, alphaBg),
                        borderColor: Colors.getIndexColor(index % 8, alphaBorder),
                        borderWidth: 3,
                    };
                })
            };

            return data.dataNor;
        }
    },
    annualSellingsDiff: {
        chart: null,
        create: (registrationList, ctx) => {
            let methods = Annuals.annualSellingsDiff;
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
            let methods = Annuals.annualSellingsDiff;
            if (methods.chart) {
                // Actualiza la data del Chart usando el método update
                methods.chart.data = methods.groupData(registrationList);
                methods.chart.update();
            } else {
                console.error('El gráfico no ha sido creado aún. Llame primero a create().');
            }
        },
        groupData: (registrationList) => {
            const data = Annuals.data;

            // 1. Obtenemos los datos “normales” ya procesados
            const baseData = JSON.parse(JSON.stringify(data.dataNor));
            const result = JSON.parse(JSON.stringify(data.dataNor));

            // 2. Calculamos el diferencial por año/mes usando baseData como referencia
            result.datasets.forEach((dataset, yearIndex) => {
                if (yearIndex === 0) return; // primer año no tiene diferencial

                const prevDataset = baseData.datasets[yearIndex - 1]; // referencia al valor real
                const year = Number(dataset.label);

                dataset.data = dataset.data.map((value, monthIndex) => {
                    const monthStart = new Date(year, monthIndex, 1);
                    const monthEnd = new Date(year, monthIndex + 1, 0);

                    // Si el mes actual está fuera del rango global o el año anterior no tiene valor → undefined
                    if (data.minDate > new Date(year-1, monthIndex, 1) || data.maxDate < new Date(year, monthIndex, 1))
                        return undefined;
                    const prevValue = prevDataset.data[monthIndex];
                    if (prevValue === undefined) return undefined;

                    return value - prevValue;
                });
            });

            // 3. Eliminamos el primer año de la salida
            result.datasets = result.datasets.slice(1);
            return result;
        }
    },
    annualSellingsAcc: {
        chart: null,
        create: (registrationList, ctx) => {
            let methods = Annuals.annualSellingsAcc;
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
                plugins: [ChartDataLabels, Annuals.watermark(80, 30, 70)] // Registra el plugin
            };
        
            methods.chart = new Chart(ctx, config);
        },
        update: (registrationList) => {
            let methods = Annuals.annualSellingsAcc;
            if (methods.chart) {
                // Actualiza la data del Chart usando el método update
                methods.chart.data = methods.groupData(registrationList);
                methods.chart.update();
            } else {
                console.error('El gráfico no ha sido creado aún. Llame primero a create().');
            }
        },
        groupData: (registrationList) => {
            let data = Annuals.data;

            // 1. Obtenemos el resultado normal
            const result = JSON.parse(JSON.stringify(data.dataNor));

            // 2. Acumulamos los resultados
            result.datasets.forEach(dataset => {
                let runningTotal = 0;
                const year = Number(dataset.label);

                dataset.data = dataset.data.map((value, monthIndex) => {
                    const monthStart = new Date(year, monthIndex, 1);
                    const monthEnd = new Date(year, monthIndex + 1, 0);

                    // Si está fuera del rango global, dejamos undefined
                    if (monthEnd < data.minDate || monthStart > data.maxDate) return undefined;

                    // Acumulamos solo si hay valor (0 incluido)
                    runningTotal += value || 0;
                    return runningTotal;
                });
            });

            // 3. Devolvemos el resultado acumulativo
            data.dataAcc = result;
            return result;
        }
    },
    annualSellingsAccDiff: {
        chart: null,
        create: (registrationList, ctx) => {
            let methods = Annuals.annualSellingsAccDiff;
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
            let methods = Annuals.annualSellingsAccDiff;
            if (methods.chart) {
                // Actualiza la data del Chart usando el método update
                methods.chart.data = methods.groupData(registrationList);
                methods.chart.update();
            } else {
                console.error('El gráfico no ha sido creado aún. Llame primero a create().');
            }
        },
        groupData: (registrationList) => {
            const data = Annuals.data;

            // 1. Obtenemos los datos “normales” ya procesados
            const baseData = JSON.parse(JSON.stringify(data.dataAcc));
            const result = JSON.parse(JSON.stringify(data.dataAcc));

            // 2. Calculamos el diferencial por año/mes usando baseData como referencia
            result.datasets.forEach((dataset, yearIndex) => {
                if (yearIndex === 0) return; // primer año no tiene diferencial

                const prevDataset = baseData.datasets[yearIndex - 1]; // referencia al valor real
                const year = Number(dataset.label);

                dataset.data = dataset.data.map((value, monthIndex) => {
                    // Si el mes actual está fuera del rango global o el año anterior no tiene valor → undefined
                    if (data.minDate > new Date(year-1, monthIndex, 1) || data.maxDate < new Date(year, monthIndex, 1))
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
}

export default Annuals;