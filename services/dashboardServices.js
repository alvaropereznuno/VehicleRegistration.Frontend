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
                        text: 'Matriculaciones por tipo'
                    },
                },
                responsive: true,
                maintainAspectRatio: false,
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
              maintainAspectRatio: false,
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

export const vehiclesBrands = {
    chart: null,
    create: (dataList, ctx) => {
        const config = {
            type: 'doughnut',
            data: vehiclesBrands.groupData(dataList),
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'top',
                    },
                    title: {
                        display: true,
                        text: 'Matriculaciones por marcas'
                    }
                }
            },
        };
    
        vehiclesBrands.chart = new Chart(ctx, config);
    },
    update: (dataList) => {
        if (vehiclesBrands.chart) {
            // Actualiza la data del Chart usando el método update
            vehiclesBrands.chart.data = vehiclesBrands.groupData(dataList);
            vehiclesBrands.chart.update();
        } else {
            console.error('El gráfico no ha sido creado aún. Llame primero a create().');
        }
    },
    groupData: (dataList) => {
        // 1. Agrupar por brandName y calcular los totales
        const brandGroups = {};
        dataList.forEach(item => {
            if (!brandGroups[item.brandName]) {
                brandGroups[item.brandName] = 0; // Inicializar contador
            }
            brandGroups[item.brandName] += item.count; // Sumar el valor actual
        });
    
        // 2. Ordenar las marcas por total (de mayor a menor) y extraer las 6 principales
        const sortedBrands = Object.keys(brandGroups).sort((a, b) => brandGroups[b] - brandGroups[a]);
        const topBrands = sortedBrands.slice(0, 8); // Las 6 marcas principales
        const otherBrands = sortedBrands.slice(8); // El resto de marcas
    
        // 3. Crear un nuevo agrupado para las 8 marcas principales y el "resto"
        const aggregatedData = {};
        topBrands.forEach(brand => {
            aggregatedData[brand] = brandGroups[brand];
        });
    
        // Agrupar el "resto" en una sola entrada
        const otherTotal = otherBrands.reduce((sum, brand) => sum + brandGroups[brand], 0);
        if (otherTotal > 0) {
            aggregatedData["Resto"] = otherTotal;
        }
    
        // 4. Crear el array de labels (8 marcas principales + "resto" si aplica)
        const labels = Object.keys(aggregatedData);
    
        // 5. Crear el array de datos (totales en el mismo orden que los labels)
        const data = labels.map(brand => aggregatedData[brand]);
    
        // 6. Crear el array de colores para cada marca
        const colors = labels.map((_, index) => {
            const colorOptions = [COLORS.FILLED.RED, COLORS.FILLED.BLUE, COLORS.FILLED.YELLOW, COLORS.FILLED.GREEN, COLORS.FILLED.ORANGE, COLORS.FILLED.PURPLE, COLORS.FILLED.CYAN, COLORS.FILLED.PINK, COLORS.FILLED.BLACK];
            return colorOptions[index % colorOptions.length]; // Ciclar colores si hay más de 6
        });

        const bordersColors = labels.map((_, index) => {
            const colorOptions = [COLORS.BORDER.RED, COLORS.BORDER.BLUE, COLORS.BORDER.YELLOW, COLORS.BORDER.GREEN, COLORS.BORDER.ORANGE, COLORS.FILLED.PURPLE, COLORS.FILLED.CYAN, COLORS.FILLED.PINK, COLORS.FILLED.BLACK];
            return colorOptions[index % colorOptions.length]; // Ciclar colores
        });
    
        // 7. Retornar el objeto en el formato solicitado
        return {
            labels: labels,
            datasets: [
                {
                    label: '',
                    data: data,
                    backgroundColor: colors,
                    borderColor: bordersColors,
                    borderWidth: 1
                }
            ]
        }
    }
}

export const vehiclesStackedBrands = {
    chart: null,
    create: (dataList, ctx) => {
        const config = {
            type: 'line',
            data: vehiclesStackedBrands.groupData(dataList),
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                title: {
                    display: true,
                    text: (ctx) => 'Matriculaciones acumuladas por marca'
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
    
            vehiclesStackedBrands.chart = new Chart(ctx, config);
    },
    update: (dataList) => {
        if (vehiclesStackedBrands.chart) {
            // Actualiza la data del Chart usando el método update
            vehiclesStackedBrands.chart.data = vehiclesStackedBrands.groupData(dataList);
            vehiclesStackedBrands.chart.update();
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
    
        // 2. Agrupar por brandName e inicializar datos acumulativos
        const typeGroups = {};
        dataList.forEach(item => {
            if (!typeGroups[item.brandName]) {
                typeGroups[item.brandName] = { brandName: item.brandName, data: {}, total: 0 };
            }
    
            const formattedDate = formatDate(item.date);
            const count = item.count || 0;
            typeGroups[item.brandName].data[formattedDate] = (typeGroups[item.brandName].data[formattedDate] || 0) + count;
            typeGroups[item.brandName].total += count; // Acumular el total para este brandName
        });
    
        // 3. Ordenar los grupos por el total acumulado y seleccionar los 8 primeros
        const topTypeGroups = Object.values(typeGroups)
            .sort((a, b) => b.total - a.total) // Ordenar de mayor a menor por el total acumulado
            .slice(0, 8); // Seleccionar los primeros 8
    
        // 4. Crear datasets en el formato deseado
        const colors = [COLORS.FILLED.RED, COLORS.FILLED.BLUE, COLORS.FILLED.YELLOW, COLORS.FILLED.GREEN, COLORS.FILLED.ORANGE, COLORS.FILLED.PURPLE, COLORS.FILLED.CYAN, COLORS.FILLED.PINK, COLORS.FILLED.BLACK];
        const borderColors = [COLORS.BORDER.RED, COLORS.BORDER.BLUE, COLORS.BORDER.YELLOW, COLORS.BORDER.GREEN, COLORS.BORDER.ORANGE, COLORS.BORDER.PURPLE, COLORS.BORDER.CYAN, COLORS.BORDER.PINK, COLORS.BORDER.BLACK];
    
        const datasets = topTypeGroups.map((group, index) => {
            let cumulativeSum = 0; // Variable para llevar el acumulado
    
            return {
                label: group.brandName,
                data: labels.map(label => {
                    cumulativeSum += group.data[label] || 0; // Sumar acumulativamente
                    return cumulativeSum;
                }),
                backgroundColor: colors[index % colors.length],
                borderColor: borderColors[index % borderColors.length],
                borderWidth: 1
            };
        });
    
        // 5. Retornar la estructura final
        return {
            labels: labels,
            datasets: datasets
        };
    }    
}

export const vehiclesModels = {
    chart: null,
    create: (dataList, ctx) => {
        const config = {
            type: 'bar',
            data: vehiclesModels.groupData(dataList),
            options: {
              indexAxis: 'y',
              // Elements options apply to all of the options unless overridden in a dataset
              // In this case, we are setting the border of each horizontal bar to be 2px wide
              elements: {
                bar: {
                  borderWidth: 2,
                }
              },
              responsive: true,
              maintainAspectRatio: false,
              plugins: {
                legend: {
                  display: false,
                },
                title: {
                  display: true,
                  text: 'Matriculaciones por modelos (Top populares)'
                }
              }
            },
          };
    
        vehiclesModels.chart = new Chart(ctx, config);
    },
    update: (dataList) => {
        if (vehiclesModels.chart) {
            // Actualiza la data del Chart usando el método update
            vehiclesModels.chart.data = vehiclesModels.groupData(dataList);
            vehiclesModels.chart.update();
        } else {
            console.error('El gráfico no ha sido creado aún. Llame primero a create().');
        }
    },
    groupData: (dataList) => {
        // 1. Agrupar por modelName y calcular los totales
        const modelGroups = {};
        dataList.forEach(item => {
            if (!modelGroups[item.modelName]) {
                modelGroups[item.modelName] = { modelName: item.modelName, total: 0 };
            }
            modelGroups[item.modelName].total += item.count; // Sumar el valor total
        });
    
        // 2. Seleccionar los 8 modelos con mayor valor total, ordenados de mayor a menor
        const sortedModels = Object.values(modelGroups)
            .sort((a, b) => b.total - a.total) // Ordenar por total descendente
            .slice(0, 12); // Tomar los 12 primeros modelos
    
        // 3. Crear labels y datasets en el formato deseado
        const labels = sortedModels.map(group => group.modelName); // Los nombres de los modelos
        const data = sortedModels.map(group => group.total); // Los totales correspondientes
    
        const colors = labels.map((_, index) => {
            const colorOptions = [COLORS.FILLED.RED, COLORS.FILLED.BLUE, COLORS.FILLED.YELLOW, COLORS.FILLED.GREEN, COLORS.FILLED.ORANGE, COLORS.FILLED.PURPLE, COLORS.FILLED.CYAN, COLORS.FILLED.PINK, COLORS.FILLED.BLACK, COLORS.FILLED.GRAY, COLORS.FILLED.LIME];
            return colorOptions[index % colorOptions.length]; // Ciclar colores
        });

        const bordersColors = labels.map((_, index) => {
            const colorOptions = [COLORS.BORDER.RED, COLORS.BORDER.BLUE, COLORS.BORDER.YELLOW, COLORS.BORDER.GREEN, COLORS.BORDER.ORANGE, COLORS.FILLED.PURPLE, COLORS.FILLED.CYAN, COLORS.FILLED.PINK, COLORS.FILLED.BLACK, COLORS.FILLED.GRAY, COLORS.FILLED.LIME];
            return colorOptions[index % colorOptions.length]; // Ciclar colores
        });
    
        // 4. Retornar la estructura final
        return {
            labels: labels,
            datasets: [
                {
                    label: '', // Texto personalizado
                    data: data, // Totales por modelo
                    backgroundColor: colors,
                    borderColor: bordersColors,
                    borderWidth: 1
                }
            ]
        };
    }
}

export const vehiclesStackedModels = {
    chart: null,
    create: (dataList, ctx) => {
        const config = {
            type: 'line',
            data: vehiclesStackedModels.groupData(dataList),
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                title: {
                    display: true,
                    text: (ctx) => 'Matriculaciones acumuladas por modelo (Top populares)'
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
    
            vehiclesStackedModels.chart = new Chart(ctx, config);
    },
    update: (dataList) => {
        if (vehiclesStackedModels.chart) {
            // Actualiza la data del Chart usando el método update
            vehiclesStackedModels.chart.data = vehiclesStackedModels.groupData(dataList);
            vehiclesStackedModels.chart.update();
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
    
        // 2. Agrupar por modelName e inicializar datos acumulativos
        const typeGroups = {};
        dataList.forEach(item => {
            if (!typeGroups[item.modelName]) {
                typeGroups[item.modelName] = { modelName: item.modelName, data: {}, total: 0 };
            }
    
            const formattedDate = formatDate(item.date);
            const count = item.count || 0;
            typeGroups[item.modelName].data[formattedDate] = (typeGroups[item.modelName].data[formattedDate] || 0) + count;
            typeGroups[item.modelName].total += count; // Acumular el total para este modelName
        });
    
        // 3. Ordenar los grupos por el total acumulado y seleccionar los 8 primeros
        const topTypeGroups = Object.values(typeGroups)
            .sort((a, b) => b.total - a.total) // Ordenar de mayor a menor por el total acumulado
            .slice(0, 8); // Seleccionar los primeros 8
    
        // 4. Crear datasets en el formato deseado
        const colors = [COLORS.FILLED.RED, COLORS.FILLED.BLUE, COLORS.FILLED.YELLOW, COLORS.FILLED.GREEN, COLORS.FILLED.ORANGE, COLORS.FILLED.PURPLE, COLORS.FILLED.CYAN, COLORS.FILLED.PINK, COLORS.FILLED.BLACK];
        const borderColors = [COLORS.BORDER.RED, COLORS.BORDER.BLUE, COLORS.BORDER.YELLOW, COLORS.BORDER.GREEN, COLORS.BORDER.ORANGE, COLORS.BORDER.PURPLE, COLORS.BORDER.CYAN, COLORS.BORDER.PINK, COLORS.BORDER.BLACK];
    
        const datasets = topTypeGroups.map((group, index) => {
            let cumulativeSum = 0; // Variable para llevar el acumulado
    
            return {
                label: group.modelName,
                data: labels.map(label => {
                    cumulativeSum += group.data[label] || 0; // Sumar acumulativamente
                    return cumulativeSum;
                }),
                backgroundColor: colors[index % colors.length],
                borderColor: borderColors[index % borderColors.length],
                borderWidth: 1
            };
        });
    
        // 5. Retornar la estructura final
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