import Colors from '../colorsUtils.js';
import SharedUtils from '../sharedUtils.js';

const Propulsion = {
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
            // 1. Agrupa los registros por fecha, y por cada fecha agrupa por tipo de motor, y suma las matriculaciones.
            const groupedData = registrationList.reduce((acc, curr) => {
                const date = curr.registrationDate.substring(7,0);
                const motorTypeId = curr.motorTypeId; // SharedUtils.getMotorTypeDescription(curr.motorTypeId);

                if (!acc[date]) {
                    acc[date] = [];
                };
                if (!acc[date][motorTypeId]) {
                    acc[date][motorTypeId] = 0;
                }
                acc[date][motorTypeId] += curr.count; // Sumar matriculaciones al mes correspondiente
                return acc;
            }, {});

            // Ordena groupedData por fecha
            const sortedGroupedData = Object.entries(groupedData).sort((a, b) => new Date(a[0]) - new Date(b[0]));

            // 2. Crear un dataset para cada tipo de motor, con sus respectivos meses y matriculaciones en orden ascendente por mes.
            const datasets = sortedGroupedData.reduce((acc, curr) => {
                const date = curr[0];
                const data = curr[1];

                Object.entries(data).forEach(([motorTypeId, count]) => {
                    if (!acc[motorTypeId]) {
                        acc[motorTypeId] = { 
                            data: []
                        };
                    };
                    acc[motorTypeId].data.push(count); // Sumar matriculaciones al mes correspondiente
                });

                return acc;
            }, {});

            // 2.1. Por cada mes, sumar las matriculaciones de todos los meses anteriores de cada tipo de motor.
            Object.entries(datasets).forEach((item) => {
                const motorTypeId = item[0];
                const data = item[1].data;
                for (let i = 1; i < data.length; i++) {
                    data[i] += data[i - 1] || 0;
                }
            });

            const data = {
                labels: Object.entries(sortedGroupedData).map((item, index) => item[1][0]),
                datasets: Object.entries(datasets).map((item, index) => {
                    return {
                        label: SharedUtils.getMotorTypeDescription(item[0]),
                        data: item[1].data,
                        backgroundColor: Colors.getPropulsionColor(item[0], 1),
                        borderColor: Colors.getPropulsionColor(item[0], 0.6),
                        borderWidth: 3,
                        fill: true
                    }
                })
            };

            return data;
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