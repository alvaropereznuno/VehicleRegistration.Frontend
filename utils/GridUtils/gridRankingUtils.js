import SharedUtils from '../sharedUtils.js';

const Ranking = {
    topResults: {
        grid: null,
        create: async (registrationList, ctx) => {
            return new Promise((resolve) => {
                let methods = Ranking.topResults;

                methods.grid = new gridjs.Grid(methods.groupData(registrationList)).render(ctx);
                resolve();
            });
        },
        update: async (registrationList) => {
            return new Promise((resolve) => {
                let methods = Ranking.topResults;

                methods.grid.updateConfig(methods.groupData(registrationList)).forceRender();
                resolve();
            });
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
    }
}

export default Ranking;