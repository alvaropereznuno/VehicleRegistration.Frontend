import Colors from '../colorsUtils.js';
import SharedUtils from '../sharedUtils.js';

const Propulsion = {
    data: {
        dataNor: null
    },
    motorTypesAcc: {
        chart: null,
        create: (registrationList, ctx) => {
            let methods = Propulsion.motorTypesAcc;
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
            let methods = Propulsion.motorTypesAcc;
            if (methods.chart) {
                // Actualiza la data del Chart usando el método update
                methods.chart.data = methods.groupData(registrationList);
                methods.chart.update();
            } else {
                console.error('El gráfico no ha sido creado aún. Llame primero a create().');
            }
        },
        groupData: (registrationList) => {
            const data = Propulsion.data;

            // 1. Agrupamos matriculaciones por fecha y tipo de motor
            const groupedData = {};
            for (const { registrationDate, motorTypeId, count } of registrationList) {
                const date = registrationDate.slice(0, 7); // YYYY-MM
                if (!groupedData[date]) groupedData[date] = {};
                groupedData[date][motorTypeId] = (groupedData[date][motorTypeId] || 0) + count;
            }

            // 2. Ordenamos por fecha (al ser YYYY-MM, string sort funciona bien)
            const sortedDates = Object.keys(groupedData).sort();

            // 3. Construimos datasets acumulativos
            const datasets = {};
            for (const date of sortedDates) {
                const motors = groupedData[date];
                for (const motorTypeId in motors) {
                    if (!datasets[motorTypeId]) datasets[motorTypeId] = [];
                    datasets[motorTypeId].push(motors[motorTypeId]);
                }
                // Si algún motor no aparece en esta fecha, rellenamos con 0 para mantener alineación
                for (const motorTypeId in datasets) {
                    if (datasets[motorTypeId].length < sortedDates.indexOf(date) + 1) {
                        datasets[motorTypeId].push(0);
                    }
                }
            }

            // 4. Convertimos cada dataset en acumulativo
            for (const motorTypeId in datasets) {
                datasets[motorTypeId] = datasets[motorTypeId].reduce((acc, val, i) => {
                    acc[i] = (acc[i - 1] || 0) + val;
                    return acc;
                }, []);
            }

            // 5. Construimos objeto final
            data.dataNor = {
                labels: sortedDates,
                datasets: Object.entries(datasets).map(([motorTypeId, data]) => ({
                    label: SharedUtils.getMotorTypeDescription(motorTypeId),
                    data,
                    backgroundColor: Colors.getPropulsionColor(motorTypeId, 1),
                    borderColor: Colors.getPropulsionColor(motorTypeId, 0.6),
                    borderWidth: 3,
                    fill: true
                }))
            };
            return data.dataNor
        }
    },
    motorTypesAcc100: {
        chart: null,
        create: (registrationList, ctx) => {
            let methods = Propulsion.motorTypesAcc100;
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
            let methods = Propulsion.motorTypesAcc100;
            if (methods.chart) {
                // Actualiza la data del Chart usando el método update
                methods.chart.data = methods.groupData(registrationList);
                methods.chart.update();
            } else {
                console.error('El gráfico no ha sido creado aún. Llame primero a create().');
            }
        },
        groupData: (registrationList) => {
            const data = Propulsion.data;

            // 1. Obtenemos el resultado normal, que son los datos del método anterior almacenados en una variable.
            const result = JSON.parse(JSON.stringify(data.dataNor));

            // 2. Recorremos cada mes (índice de labels)
            result.labels.forEach((_, monthIndex) => {
                // 2.1. Sacamos todos los valores de ese mes (por motorType)
                const monthValues = result.datasets.map(ds => ds.data[monthIndex] || 0);
                const total = monthValues.reduce((a, b) => a + b, 0);

                if (total > 0) {
                    // 2.2. Normalizamos los valores de cada dataset a porcentaje
                    result.datasets.forEach((ds, i) => {
                        ds.data[monthIndex] = Math.round((monthValues[i] / total) * 100);
                    });

                    // 2.3. Ajuste fino para garantizar que sumen 100 (corrección por redondeo)
                    const diff = 100 - result.datasets.reduce((sum, ds) => sum + ds.data[monthIndex], 0);
                    if (diff !== 0) {
                        // le sumamos la diferencia al dataset más grande de ese mes
                        const maxIdx = result.datasets
                            .map(ds => ds.data[monthIndex])
                            .reduce((maxI, val, i, arr) => val > arr[maxI] ? i : maxI, 0);
                        result.datasets[maxIdx].data[monthIndex] += diff;
                    }
                } else {
                    // Si no hay datos ese mes, dejamos undefined o 0 según lo que prefieras
                    result.datasets.forEach(ds => {
                        ds.data[monthIndex] = 0;
                    });
                }
            });

            return result;
        }
    },
    motorTypesPie: {
        chart: null,
        create: (registrationList, ctx) => {
            let methods = Propulsion.motorTypesPie;
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
            let methods = Propulsion.motorTypesPie;
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
    },
    motorTypesAnnualDiff: {
        chart: null,
        create: (registrationList, ctx) => {
            let methods = Propulsion.motorTypesAnnualDiff;
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
            let methods = Propulsion.motorTypesAnnualDiff;
            if (methods.chart) {
                // Actualiza la data del Chart usando el método update
                methods.chart.data = methods.groupData(registrationList);
                methods.chart.update();
            } else {
                console.error('El gráfico no ha sido creado aún. Llame primero a create().');
            }
        },
        groupData: (registrationList) => {
            const data = Propulsion.data;

            // 1. Obtenemos los datos “normales” ya procesados
            const baseData = JSON.parse(JSON.stringify(data.dataNor));

            // 2. Inicializamos estructura para totales anuales por motor
            const annualGrouped = {};

            // 3. Recorremos las fechas y acumulamos por año
            for (let i = 0; i < baseData.labels.length; i++) {
                const monthLabel = baseData.labels[i]; // "YYYY-MM"
                const year = monthLabel.slice(0, 4);

                baseData.datasets.forEach(ds => {
                    const motorLabel = ds.label;
                    const value = ds.data[i];

                    if (!annualGrouped[motorLabel]) annualGrouped[motorLabel] = {};
                    if (!annualGrouped[motorLabel][year]) annualGrouped[motorLabel][year] = 0;

                    const prevMonthValue = ds.data[i - 1] || 0;
                    const delta = value - prevMonthValue; // solo matriculaciones de este mes
                    annualGrouped[motorLabel][year] += delta;
                });
            }

            // 4. Obtenemos todos los años y motores
            const motorLabels = Object.keys(annualGrouped);
            const allYears = [...new Set(baseData.labels.map(l => l.slice(0, 4)))].sort();

            // 5. Construimos datasets, un dataset por año
            
            const datasets = allYears.map(year => ({
                label: year,
                data: motorLabels.map(motor => annualGrouped[motor][year] || 0),
                backgroundColor: Colors.accent(1), // Colors.getPropulsionColor(year, 0.7),
                borderColor: Colors.accent(0.7),
                borderWidth: 3,
                fill: true
            }));

            // Se colorean adecuadamente
            var alphaIncremental = allYears.length > 1 ? (1 - 0.4) / (allYears.length - 1) : 1;

            datasets.forEach((dataset, index) => {
                let alpha = alphaIncremental * (allYears.length - 1 - index); // degradado por año
                dataset.backgroundColor = motorLabels.map(motor => Colors.getPropulsionColor(motor, 1 - alpha));
                dataset.borderColor = motorLabels.map(motor => Colors.getPropulsionColor(motor, 0.7 - alpha));
            });

            // 6. Construimos objeto final para Chart.js
            data.dataAnnual = {
                labels: motorLabels, // eje X: tipos de motor
                datasets
            };

            return data.dataAnnual;
        }
    },
    motorTypesAnnualDiff100: {
        chart: null,
        create: (registrationList, ctx) => {
            let methods = Propulsion.motorTypesAnnualDiff100;
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
            let methods = Propulsion.motorTypesAnnualDiff100;
            if (methods.chart) {
                // Actualiza la data del Chart usando el método update
                methods.chart.data = methods.groupData(registrationList);
                methods.chart.update();
            } else {
                console.error('El gráfico no ha sido creado aún. Llame primero a create().');
            }
        },
        groupData: (registrationList) => {
            const data = Propulsion.data;

            // 1. Obtenemos los datos “normales” ya procesados
            const baseData = JSON.parse(JSON.stringify(data.dataNor));

            // 2. Inicializamos estructura para totales anuales por motor
            const annualGrouped = {};

            // 3. Recorremos las fechas y acumulamos por año
            for (let i = 0; i < baseData.labels.length; i++) {
                const monthLabel = baseData.labels[i]; // "YYYY-MM"
                const year = monthLabel.slice(0, 4);

                baseData.datasets.forEach(ds => {
                    const motorLabel = ds.label;
                    const value = ds.data[i];

                    if (!annualGrouped[motorLabel]) annualGrouped[motorLabel] = {};
                    if (!annualGrouped[motorLabel][year]) annualGrouped[motorLabel][year] = 0;

                    const prevMonthValue = ds.data[i - 1] || 0;
                    const delta = value - prevMonthValue; // solo matriculaciones de este mes
                    annualGrouped[motorLabel][year] += delta;
                });
            }

            // 4. Obtenemos todos los años y motores
            const motorLabels = Object.keys(annualGrouped);
            const allYears = [...new Set(baseData.labels.map(l => l.slice(0, 4)))].sort();

            // 5. Calculamos los porcentajes anuales y ajustamos a 100%
            const percentGrouped = {};
            allYears.forEach(year => {
                let yearTotal = 0;
                motorLabels.forEach(motor => {
                    yearTotal += annualGrouped[motor][year] || 0;
                });

                // Primer cálculo en porcentaje (decimal)
                motorLabels.forEach(motor => {
                    if (!percentGrouped[motor]) percentGrouped[motor] = {};
                    percentGrouped[motor][year] = yearTotal > 0 ? (annualGrouped[motor][year] || 0) * 100 / yearTotal : 0;
                });

                // Ajuste fino para que la suma sea exactamente 100
                let sumPercent = motorLabels.reduce((sum, motor) => sum + percentGrouped[motor][year], 0);
                let diff = 100 - sumPercent;

                if (diff !== 0) {
                    // Ajustamos el motor con mayor porcentaje
                    let maxMotor = motorLabels.reduce((a, b) =>
                        (percentGrouped[a][year] > percentGrouped[b][year] ? a : b)
                    );
                    percentGrouped[maxMotor][year] += diff;
                }
            });

            // 6. Construimos datasets para Chart.js con degradado por año
            const datasets = allYears.map((year, index) => {
                let alpha = allYears.length > 1 ? (1 - 0.4) / (allYears.length - 1) * (allYears.length - 1 - index) : 1;
                return {
                    label: year,
                    data: motorLabels.map(motor => percentGrouped[motor][year]),
                    backgroundColor: motorLabels.map(motor => Colors.getPropulsionColor(motor, 1 - alpha)),
                    borderColor: motorLabels.map(motor => Colors.getPropulsionColor(motor, 0.7 - alpha)),
                    borderWidth: 3,
                    fill: true
                };
            });

            // 7. Construimos objeto final para Chart.js
            data.dataAnnualPercent = {
                labels: motorLabels,
                datasets
            };

            return data.dataAnnualPercent;
        }

    }
}

export default Propulsion;