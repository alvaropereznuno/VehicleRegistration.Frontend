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
    }
}

export default Propulsion;