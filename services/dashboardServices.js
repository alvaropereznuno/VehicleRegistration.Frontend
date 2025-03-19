import COLORS from "../models/constants/colors.js"

export const vehiclesSoldType = {
    chart: null,
    create: (dataList, ctx) => {
        const config = {
            type: 'bar',
            data: vehiclesSoldType.groupData(dataList),
            options: {
                plugins: {
                    title: {
                        display: true,
                        text: 'Vehículos vendidos por tipo'
                    },
                },
                responsive: true,
                scales: {
                    x: { stacked: true, },
                    y: { stacked: true }
                }
            }
        };
    
        vehiclesSoldType.chart = new Chart(ctx, config);
    },
    update: (dataList) => {
        if (vehiclesSoldType.chart) {
            // Actualiza la data del Chart usando el método update
            vehiclesSoldType.chart.data = vehiclesSoldType.groupData(dataList);
            vehiclesSoldType.chart.update();
        } else {
            console.error('El gráfico no ha sido creado aún. Llame primero a create().');
        }
    },
    groupData: (dataList) => {
        // 1. Extraer todas las fechas únicas en el formato mm/yyyy
        const labels = [...new Set(dataList.map(item => formatDate(item.date)))]
        .sort((a, b) => {
            const [monthA, yearA] = a.split('/').map(Number);
            const [monthB, yearB] = b.split('/').map(Number);
            return yearA - yearB || monthA - monthB;
        });

        // 2. Agrupar por: typeName. Se identifican los groups a realizar.
        const typeGroups = {};
        dataList.forEach(item => {
            if (!typeGroups[item.typeName]) {
                typeGroups[item.typeName] = { typeName: item.typeName, data: {} };
            }

            const formattedDate = formatDate(item.date);
            typeGroups[item.typeName].data[formattedDate] = (typeGroups[item.typeName].data[formattedDate] || 0) + item.count;
        });

        // 3. Crear datasets en el formato deseado
        const datasets = Object.keys(typeGroups).map((key, index) => {
            const colors = [COLORS.FILLED.RED, COLORS.FILLED.BLUE, COLORS.FILLED.YELLOW, COLORS.FILLED.GREEN, COLORS.FILLED.ORANGE];
            const borderColors = [COLORS.BORDER.RED, COLORS.BORDER.BLUE, COLORS.BORDER.YELLOW, COLORS.BORDER.GREEN, COLORS.BORDER.ORANGE];

            const group = typeGroups[key];
            return {
                label: group.typeName,
                data: labels.map(label => group.data[label] || 0),
                backgroundColor: colors[index % colors.length],
                borderColor: borderColors[index % borderColors.length],
                borderWidth: 1
            };
        });

        // 4. Retornar la estructura final
        return {
            labels: labels,
            datasets: datasets
        };
    }
}

export const vehiclesSoldStackedType = {
    chart: null,
    create: (dataList, ctx) => {
        const config = {
            type: 'line',
            data: vehiclesSoldStackedType.groupData(dataList),
            options: {
              responsive: true,
              plugins: {
                title: {
                  display: true,
                  text: (ctx) => 'Matriculaciones acumuladas por tipo'
                },
                tooltip: { mode: 'index' },
              },
              interaction: {
                mode: 'nearest',
                axis: 'x',
                intersect: false
              },
              scales: {
                  x: { stacked: false, },
                  y: { stacked: false }
              }
            }
          };
    
          vehiclesSoldStackedType.chart = new Chart(ctx, config);
    },
    update: (dataList) => {
        if (vehiclesSoldStackedType.chart) {
            // Actualiza la data del Chart usando el método update
            vehiclesSoldStackedType.chart.data = vehiclesSoldStackedType.groupData(dataList);
            vehiclesSoldStackedType.chart.update();
        } else {
            console.error('El gráfico no ha sido creado aún. Llame primero a create().');
        }
    },
    groupData: (dataList) => {
        // 1. Extraer todas las fechas únicas en el formato mm/yyyy
        const labels = [...new Set(dataList.map(item => formatDate(item.date)))]
            .sort((a, b) => {
                const [monthA, yearA] = a.split('/').map(Number);
                const [monthB, yearB] = b.split('/').map(Number);
                return yearA - yearB || monthA - monthB;
            });
    
        // 2. Agrupar por typeName e inicializar datos acumulativos
        const typeGroups = {};
        dataList.forEach(item => {
            if (!typeGroups[item.typeName]) {
                typeGroups[item.typeName] = { typeName: item.typeName, data: {} };
            }
    
            const formattedDate = formatDate(item.date);
            typeGroups[item.typeName].data[formattedDate] = (typeGroups[item.typeName].data[formattedDate] || 0) + item.count;
        });
    
        // 3. Crear datasets en el formato deseado, añadiendo acumulación progresiva
        const datasets = Object.keys(typeGroups).map((key, index) => {
            const colors = [COLORS.FILLED.RED, COLORS.FILLED.BLUE, COLORS.FILLED.YELLOW, COLORS.FILLED.GREEN, COLORS.FILLED.ORANGE];
            const borderColors = [COLORS.BORDER.RED, COLORS.BORDER.BLUE, COLORS.BORDER.YELLOW, COLORS.BORDER.GREEN, COLORS.BORDER.ORANGE];
    
            const group = typeGroups[key];
            let cumulativeSum = 0; // Variable para llevar el acumulado
    
            return {
                label: group.typeName,
                data: labels.map(label => {
                    cumulativeSum += group.data[label] || 0; // Sumar acumulativamente
                    return cumulativeSum;
                }),
                backgroundColor: colors[index % colors.length],
                borderColor: borderColors[index % borderColors.length],
                borderWidth: 1
            };
        });
    
        // 4. Retornar la estructura final
        return {
            labels: labels,
            datasets: datasets
        };
    }
}

function formatDate(date){
    const d = new Date(date);
    return `${String(d.getMonth() + 1).padStart(2, '0')}/${d.getFullYear()}`;
};