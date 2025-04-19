import SharedUtils from './sharedUtils.js';

const ChartUtils = {
    ranking: {
        topResults: {
            grid: null,
            create: (registrationList, ctx) => {
                let methods = ChartUtils.ranking.topResults;

                methods.grid = new gridjs.Grid(methods.groupData(registrationList))
                    .render(ctx);
            },
            update: (registrationList) => {
                let methods = ChartUtils.ranking.topResults;

                methods.grid.updateConfig(methods.groupData(registrationList)).forceRender();
            },
            groupData: (registrationList) => {
                // 1. Agrupar RegistrationList por Marca y obtener sumatorios y se ordenan de mayor a menor cantidad.
                const groupedData = Object.entries(
                    registrationList.reduce((acc, curr) => {
                        const brandId = curr.modelId;
                        acc[brandId] = (acc[brandId] || 0) + curr.count;
                        return acc;
                    }, {}));

                // 2. Representar los datos en un formato adecuado para Grid.js.
                var columns = ['Marca', 'Modelo', 'Total matriculaciones'];
                var data = groupedData.map(m => [SharedUtils.getBrandDescription(m[0]), SharedUtils.getModelDescription(m[0]), m[1]])
                    .sort((a, b) => b[2] - a[2]);

                return {
                    columns: columns,
                    data: data,
                    pagination: true,
                    sort: true,
                    search: true,
                    language: {
                        search: { placeholder: "Buscar..." },
                        pagination: {
                            previous: "Anterior", // Texto para el botón de navegación previa
                            next: "Siguiente", // Texto para el botón de navegación siguiente
                            showing: "Mostrando desde el", // Texto inicial de la paginación
                            to: "al",
                            of: "de",
                            results: () => "resultados" // Texto para los resultados
                        },
                        noRecordsFound: "No se encontraron registros.", // Mensaje cuando no hay datos
                        loading: "Cargando..." // Mensaje mientras se cargan los datos
                    }
                };
            }
        },
    },
    annuals: {
        annualSellings: {
            grid: null,
            create: (registrationList, ctx) => {
                let methods = ChartUtils.annuals.annualSellings;

                methods.grid = new gridjs.Grid(methods.groupData(registrationList))
                    .render(ctx);
            },
            update: (registrationList) => {
                let methods = ChartUtils.annuals.annualSellings;

                methods.grid.updateConfig(methods.groupData(registrationList)).forceRender();
            },
            groupData: (registrationList) => {
                // 1. Agrupar RegistrationList por Marca y obtener sumatorios y se ordenan de mayor a menor cantidad.
                // 1. Agrupar los registros por fecha, y sumar las matriculaciones.
                const groupedData = registrationList.reduce((acc, curr) => {
                    acc[curr.registrationDate] = (acc[curr.registrationDate] || 0) + curr.count;
                    return acc;
                }
                , {});

                // 2. Crear un dataset para cada año, con sus respectivos meses y matriculaciones en orden ascendente por mes.
                const datasets = Object.entries(groupedData).reduce((acc, curr) => {
                    const year = new Date(curr[0]).getFullYear();
                    const month = new Date(curr[0]).getMonth();

                    if (!acc[year]) {
                        acc[year] = [year];
                    };
                    acc[year][month+1] = curr[1]; // Sumar matriculaciones al mes correspondiente

                    return acc;
                }, {});

                // 2. Representar los datos en un formato adecuado para Grid.js.
                var columns = ['-', 'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];
                var data = Object.entries(datasets).map(m => m[1]);

                return {
                    columns: columns,
                    data: data,
                    pagination: false,
                    sort: false,
                    search: false,
                    language: {
                        search: { placeholder: "Buscar..." },
                        pagination: {
                            previous: "Anterior", // Texto para el botón de navegación previa
                            next: "Siguiente", // Texto para el botón de navegación siguiente
                            showing: "Mostrando desde el", // Texto inicial de la paginación
                            to: "al",
                            of: "de",
                            results: () => "resultados" // Texto para los resultados
                        },
                        noRecordsFound: "No se encontraron registros.", // Mensaje cuando no hay datos
                        loading: "Cargando..." // Mensaje mientras se cargan los datos
                    }
                };
            }
        }
    }
}

export default ChartUtils;