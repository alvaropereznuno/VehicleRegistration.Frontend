import SharedUtils from '../sharedUtils.js';

const Home = {
    leadershipRanking: {
        grid: null,
        create: async (registrationList, ctx) => {
            return new Promise((resolve) => {
                const methods = Home.leadershipRanking;

                if (!ctx) return resolve(); // sin contenedor no hacemos nada

                // Limpia el contenedor
                ctx.innerHTML = "";

                if (!methods.grid) {
                    // Crear el grid
                    methods.grid = new gridjs.Grid(methods.groupData(registrationList));
                }

                // Renderiza siempre en el contenedor actual
                methods.grid.render(ctx);

                resolve();
            });
        },
        update: async (registrationList) => {
            return new Promise((resolve) => {
                let methods = Home.leadershipRanking;

                methods.grid.updateConfig(methods.groupData(registrationList)).forceRender();
                resolve();

                if (!methods.grid) {
                    return resolve();
                }

                methods.grid.updateConfig(methods.groupData(registrationList)).forceRender();
            });
        },
        groupData: (registrationList) => {
            const currentYear = new Date().getFullYear();
            const prevYear = currentYear - 1;
            const currentMonth = new Date().getMonth(); // 0-based (enero = 0)

            // --- 1. Agrupar matriculaciones por marca y año ---
            const aggregateByYear = (year, untilMonth = 11) => {
                return registrationList
                    .filter(r => {
                        const d = new Date(r.registrationDate);
                        return d.getFullYear() === year && d.getMonth() <= untilMonth;
                    })
                    .reduce((acc, r) => {
                        const brandId = r.brandId;
                        acc[brandId] = (acc[brandId] || 0) + r.count;
                        return acc;
                    }, {});
            };

            const totalsCurrentYear = aggregateByYear(currentYear, currentMonth);
            const totalsPrevYear = aggregateByYear(prevYear, currentMonth);

            // --- 2. Unificar todas las marcas presentes ---
            const allBrandIds = [
                ...new Set([...Object.keys(totalsCurrentYear), ...Object.keys(totalsPrevYear)])
            ];

            // --- 3. Calcular crecimiento ---
            let data = allBrandIds.map(brandId => {
                const totalActual = totalsCurrentYear[brandId] || 0;
                const totalAnterior = totalsPrevYear[brandId] || 0;

                let crecimiento = 0;
                if (totalAnterior === 0 && totalActual > 0) crecimiento = 100;
                else if (totalAnterior > 0) crecimiento = ((totalActual - totalAnterior) / totalAnterior) * 100;

                return {
                    brandId,
                    marca: SharedUtils.getBrandDescription2(brandId),
                    totalActual,
                    totalAnterior,
                    crecimiento
                };
            });

            // --- 4. Rankings ---
            const rank = (arr, key) => {
                return arr
                    .slice()
                    .sort((a, b) => b[key] - a[key])
                    .map((item, index) => ({ brandId: item.brandId, pos: index + 1 }));
            };

            const rankingActual = rank(data, "totalActual");
            const rankingAnterior = rank(data, "totalAnterior");

            const rankPrevMap = Object.fromEntries(rankingAnterior.map(r => [r.brandId, r.pos]));
            const rankCurrentMap = Object.fromEntries(rankingActual.map(r => [r.brandId, r.pos]));

            // --- 5. Añadir posiciones y escalada ---
            data = data.map(d => {
                const posActual = rankCurrentMap[d.brandId] || null;
                const posAnterior = rankPrevMap[d.brandId] || null;
                const escalada = (posAnterior && posActual) ? posAnterior - posActual : 0;

                // --- Crecimiento visual ---
                const crecimientoColor = d.crecimiento > 0 ? 'green' : d.crecimiento < 0 ? 'red' : 'gray';
                const crecimientoArrow = d.crecimiento > 0 ? '▲' : d.crecimiento < 0 ? '▼' : '—';
                const crecimientoHtml = `<span style="color:${crecimientoColor};font-weight:bold;">${crecimientoArrow} ${d.crecimiento.toFixed(1)}%</span>`;

                // --- Escalada visual ---
                const escaladaColor = escalada > 0 ? 'green' : escalada < 0 ? 'red' : 'gray';
                const escaladaArrow = escalada > 0 ? '▲' : escalada < 0 ? '▼' : '—';
                const escaladaHtml = `<span style="color:${escaladaColor};font-weight:bold;">${escaladaArrow} ${Math.abs(escalada)}</span>`;

                return {
                    marca: d.marca,
                    totalActual: d.totalActual,
                    totalAnterior: d.totalAnterior,
                    crecimiento: { value: d.crecimiento, html: crecimientoHtml },
                    posActual,
                    escalada: { value: escalada, html: escaladaHtml }
                };
            });

            // --- 6. Orden por ranking actual ---
            data.sort((a, b) => a.posActual - b.posActual);

            // --- 7. Configuración para Grid.js ---
            const columns = [
                { id: 'marca', name: 'Marca' },
                { id: 'totalActual', name: 'Año actual', sort: true },
                { id: 'totalAnterior', name: 'Año anterior', sort: true },
                {
                    id: 'crecimiento',
                    name: 'Crecimiento',
                    sort: {
                        compare: (a, b) => a.value - b.value
                    },
                    formatter: cell => gridjs.html(cell.html)
                },
                { id: 'posActual', name: 'Posición actual', sort: true },
                {
                    id: 'escalada',
                    name: 'Escalada posición',
                    sort: {
                        compare: (a, b) => a.value - b.value
                    },
                    formatter: cell => gridjs.html(cell.html)
                }
            ];

            // --- 8. Mapeo de datos ---
            const gridData = data.map(d => ({
                marca: d.marca,
                totalActual: d.totalActual,
                totalAnterior: d.totalAnterior,
                crecimiento: d.crecimiento,
                posActual: d.posActual,
                escalada: d.escalada
            }));

            return {
                columns,
                data: gridData,
                pagination: true,
                sort: true,
                search: true,
                language: {
                    search: { placeholder: "Buscar..." },
                    pagination: {
                        previous: "Anterior",
                        next: "Siguiente",
                        showing: "Mostrando desde el",
                        to: "al",
                        of: "de",
                        results: () => "resultados"
                    },
                    noRecordsFound: "No se encontraron registros.",
                    loading: "Cargando..."
                }
            };
        }
    },

    winnersAndLoosers: {
        grid: null,
        create: async (registrationList, ctx) => {
            return new Promise((resolve) => {
                const methods = Home.winnersAndLoosers;

                if (!ctx) return resolve(); // sin contenedor no hacemos nada

                // Limpia el contenedor
                ctx.innerHTML = "";

                if (!methods.grid) {
                    // Crear el grid
                    methods.grid = new gridjs.Grid(methods.groupData(registrationList));
                }

                // Renderiza siempre en el contenedor actual
                methods.grid.render(ctx);

                resolve();
            });
        },
        update: async (registrationList) => {
            return new Promise((resolve) => {
                let methods = Home.winnersAndLoosers;

                methods.grid.updateConfig(methods.groupData(registrationList)).forceRender();
                resolve();

                if (!methods.grid) {
                    return resolve();
                }

                methods.grid.updateConfig(methods.groupData(registrationList)).forceRender();
            });
        },
        groupData: (registrationList) => {
            const currentYear = new Date().getFullYear();
            const prevYear = currentYear - 1;
            const currentMonth = new Date().getMonth(); // 0-based

            // --- 1. Agrupar matriculaciones por marca y año ---
            const aggregateByYear = (year, untilMonth = 11) => {
                return registrationList
                    .filter(r => {
                        const d = new Date(r.registrationDate);
                        return d.getFullYear() === year && d.getMonth() <= untilMonth;
                    })
                    .reduce((acc, r) => {
                        const brandId = r.brandId;
                        acc[brandId] = (acc[brandId] || 0) + r.count;
                        return acc;
                    }, {});
            };

            const totalsCurrentYear = aggregateByYear(currentYear, currentMonth);
            const totalsPrevYear = aggregateByYear(prevYear, currentMonth);

            // --- 2. Totales generales por año ---
            const sumCurrent = Object.values(totalsCurrentYear).reduce((a, b) => a + b, 0);
            const sumPrev = Object.values(totalsPrevYear).reduce((a, b) => a + b, 0);

            // --- 3. Unificar todas las marcas ---
            const allBrandIds = [
                ...new Set([...Object.keys(totalsCurrentYear), ...Object.keys(totalsPrevYear)])
            ];

            // --- 4. Calcular cuotas y diferencias ---
            let data = allBrandIds.map(brandId => {
                const totalActual = totalsCurrentYear[brandId] || 0;
                const totalAnterior = totalsPrevYear[brandId] || 0;

                const cuotaActual = sumCurrent > 0 ? (totalActual / sumCurrent) * 100 : 0;
                const cuotaAnterior = sumPrev > 0 ? (totalAnterior / sumPrev) * 100 : 0;
                const diferencia = cuotaActual - cuotaAnterior;

                return {
                    brandId,
                    marca: SharedUtils.getBrandDescription2(brandId),
                    cuotaActual,
                    cuotaAnterior,
                    diferencia
                };
            });

            // --- 5. Ordenar por cuota actual ---
            data.sort((a, b) => b.cuotaActual - a.cuotaActual);

            // --- 6. Preparar valores visuales ---
            data = data.map(d => {
                const difColor = d.diferencia > 0 ? 'green' : d.diferencia < 0 ? 'red' : 'gray';
                const difArrow = d.diferencia > 0 ? '▲' : d.diferencia < 0 ? '▼' : '—';
                const difHtml = `<span style="color:${difColor};font-weight:bold;">${difArrow} ${d.diferencia.toFixed(1)}%</span>`;

                return {
                    marca: d.marca,
                    cuotaActual: `${d.cuotaActual.toFixed(1)}%`,
                    cuotaAnterior: `${d.cuotaAnterior.toFixed(1)}%`,
                    diferencia: { value: d.diferencia, html: difHtml }
                };
            });

            // --- 7. Definir columnas Grid.js ---
            const columns = [
                { id: 'marca', name: 'Marca', sort: true },
                { id: 'cuotaActual', name: 'Cuota año actual', sort: true },
                { id: 'cuotaAnterior', name: 'Cuota año anterior', sort: true },
                {
                    id: 'diferencia',
                    name: 'Diferencia',
                    sort: {
                        compare: (a, b) => a.value - b.value
                    },
                    formatter: cell => gridjs.html(cell.html)
                }
            ];

            // --- 8. Generar data compatible con Grid.js ---
            const gridData = data.map(d => ({
                marca: d.marca,
                cuotaActual: d.cuotaActual,
                cuotaAnterior: d.cuotaAnterior,
                diferencia: d.diferencia
            }));

            // --- 9. Configuración final ---
            return {
                columns,
                data: gridData,
                pagination: true,
                sort: true,
                search: true,
                language: {
                    search: { placeholder: "Buscar..." },
                    pagination: {
                        previous: "Anterior",
                        next: "Siguiente",
                        showing: "Mostrando desde el",
                        to: "al",
                        of: "de",
                        results: () => "resultados"
                    },
                    noRecordsFound: "No se encontraron registros.",
                    loading: "Cargando..."
                }
            };
        }
    }
}

export default Home;