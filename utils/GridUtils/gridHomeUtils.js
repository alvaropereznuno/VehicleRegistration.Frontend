import SharedUtils from '../sharedUtils.js';

const Home = {
    leadershipRanking: {
        grid: null,
        create: async (registrationList, ctx) => {
            return new Promise((resolve) => {
                const methods = Home.leadershipRanking;

                if (!ctx) return resolve();

                // Destruye el grid previo si existía
                if (methods.grid) {
                    try { methods.grid.destroy(); } catch (e) { console.warn(e); }
                    methods.grid = null;
                }

                // Limpia el contenedor
                ctx.innerHTML = "";

                // Crear nuevo grid con datos actualizados
                methods.grid = new gridjs.Grid(methods.groupData(registrationList));
                methods.grid.render(ctx);

                resolve();
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
                { id: 'totalActual', name: 'Matriculaciones ' + currentYear, sort: true },
                { id: 'totalAnterior', name: 'Matriculaciones ' + prevYear, sort: true },
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

                if (!ctx) return resolve();

                // Destruye el grid previo si existía
                if (methods.grid) {
                    try { methods.grid.destroy(); } catch (e) { console.warn(e); }
                    methods.grid = null;
                }

                // Limpia el contenedor
                ctx.innerHTML = "";

                // Crear nuevo grid con datos actualizados
                methods.grid = new gridjs.Grid(methods.groupData(registrationList));
                methods.grid.render(ctx);

                resolve();
            });
        },
        groupData: (registrationList) => {
            const currentYear = new Date().getFullYear();
            const prevYear = currentYear - 1;
            const currentMonth = new Date().getMonth(); 

            // --- 1. Funciones de ayuda (Market Totals y Aggregate) ---
            const getYearlyMarketTotals = (year, untilMonth) => {
                // ... (Tu lógica de filtrado y suma)
                return registrationList
                    .filter(r => {
                        const d = new Date(r.registrationDate);
                        return d.getFullYear() === year && d.getMonth() <= untilMonth;
                    })
                    .reduce((total, r) => total + r.count, 0);
            };

            const aggregateByYear = (year, untilMonth = 11) => {
                // ... (Tu lógica de filtrado y reducción por brandId)
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

            const marketTotalCurrent = getYearlyMarketTotals(currentYear, currentMonth);
            const marketTotalPrev = getYearlyMarketTotals(prevYear, currentMonth);

            const totalsCurrentYear = aggregateByYear(currentYear, currentMonth);
            const totalsPrevYear = aggregateByYear(prevYear, currentMonth);

            const allBrandIds = [
                ...new Set([...Object.keys(totalsCurrentYear), ...Object.keys(totalsPrevYear)])
            ];

            // --- 3. Calcular Cuotas de Mercado y Diferencia (Creando un objeto temporal) ---
            let data = allBrandIds.map(brandId => {
                const totalActual = totalsCurrentYear[brandId] || 0;
                const totalAnterior = totalsPrevYear[brandId] || 0;

                const shareCurrent = marketTotalCurrent > 0 ? (totalActual / marketTotalCurrent) * 100 : 0;
                const sharePrev = marketTotalPrev > 0 ? (totalAnterior / marketTotalPrev) * 100 : 0;

                const shareDifference = shareCurrent - sharePrev;

                return {
                    brandId,
                    marca: SharedUtils.getBrandDescription2(brandId),
                    cuotaActual: shareCurrent,
                    cuotaAnterior: sharePrev,
                    // Guardamos el valor numérico directamente en el objeto temporal 'data'
                    diferencia: shareDifference 
                };
            });

            // --- 4. Ordenar por Cuota de Mercado Actual (Descending) ---
            data.sort((a, b) => b.cuotaActual - a.cuotaActual);

            // --- 5. Configuración para Grid.js (Ajustamos 'diferencia' para leer el número) ---
            const columns = [
                { id: 'marca', name: 'Marca' },
                { 
                    id: 'cuotaActual', 
                    name: 'Cuota ' + currentYear, 
                    sort: true,
                    formatter: cell => `${cell.toFixed(2)}%`
                },
                { 
                    id: 'cuotaAnterior', 
                    name: 'Cuota ' + prevYear, 
                    sort: true,
                    formatter: cell => `${cell.toFixed(2)}%`
                },
                {
                    id: 'diferencia',
                    name: 'Diferencia',
                    sort: true, // Grid.js usará ordenación numérica por defecto
                    // El formatter recibe ahora el valor NUMÉRICO directamente (cell = shareDifference)
                    formatter: cell => {
                        const shareDifference = cell; // Es el número!
                        const diffColor = shareDifference > 0 ? 'green' : shareDifference < 0 ? 'red' : 'gray';
                        const diffArrow = shareDifference > 0 ? '▲' : shareDifference < 0 ? '▼' : '—';
                        const diffValueFormatted = shareDifference.toFixed(2); 
                        const diffHtml = `<span style="color:${diffColor};font-weight:bold;">${diffArrow} ${diffValueFormatted}%</span>`;
                        
                        return gridjs.html(diffHtml);
                    }
                }
            ];

            // --- 6. Mapeo de datos para Grid.js (Pasando el valor numérico directamente) ---
            const gridData = data.map(d => ({
                marca: d.marca,
                cuotaActual: d.cuotaActual,
                cuotaAnterior: d.cuotaAnterior,
                // *** CAMBIO CLAVE: Pasamos el número directamente ***
                diferencia: d.diferencia 
            }));

            // --- 7. Devolver configuración completa para Grid.js ---
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
    newPromises: {
        grid: null,
        create: async (registrationList, ctx) => {
            return new Promise((resolve) => {
                const methods = Home.newPromises;

                if (!ctx) return resolve();

                // Destruye el grid previo si existía
                if (methods.grid) {
                    try { methods.grid.destroy(); } catch (e) { console.warn(e); }
                    methods.grid = null;
                }

                // Limpia el contenedor
                ctx.innerHTML = "";

                // Crear nuevo grid con datos actualizados
                methods.grid = new gridjs.Grid(methods.groupData(registrationList));
                methods.grid.render(ctx);

                resolve();
            });
        },
        groupData: (registrationList) => {
            const currentYear = new Date().getFullYear();
            const prevYear = currentYear - 1;
            const currentMonth = new Date().getMonth(); 
            
            // --- Criterios de filtro (Flexibilizados ligeramente para evitar problemas de float) ---
            // Criterio de 'Irrupción' (menos del 0.1% a más del 1.0%)
            const MIN_PREV_SHARE_THRESHOLD = 0.1;
            const MIN_CURRENT_SHARE_THRESHOLD = 1.0;
            // Criterio de 'Crecimiento Explosivo' (1.0 punto porcentual de ganancia)
            const MIN_SHARE_GAIN_THRESHOLD = 1.0; 

            // --- 1. Funciones de ayuda y cálculos de agregación ---
            const getYearlyMarketTotals = (year, untilMonth) => {
                return registrationList
                    .filter(r => {
                        const d = new Date(r.registrationDate);
                        // Filtra por año y mes (YTD)
                        return d.getFullYear() === year && d.getMonth() <= untilMonth;
                    })
                    .reduce((total, r) => total + r.count, 0);
            };

            const aggregateByYear = (year, untilMonth = 11) => {
                return registrationList
                    .filter(r => {
                        const d = new Date(r.registrationDate);
                        // Filtra por año y mes (YTD)
                        return d.getFullYear() === year && d.getMonth() <= untilMonth;
                    })
                    .reduce((acc, r) => {
                        const brandId = r.brandId;
                        acc[brandId] = (acc[brandId] || 0) + r.count;
                        return acc;
                    }, {});
            };

            const marketTotalCurrent = getYearlyMarketTotals(currentYear, currentMonth);
            const marketTotalPrev = getYearlyMarketTotals(prevYear, currentMonth);
            const totalsCurrentYear = aggregateByYear(currentYear, currentMonth);
            const totalsPrevYear = aggregateByYear(prevYear, currentMonth);

            // --- Recogida de TODAS las Brand IDs (Recuperado) ---
            const allBrandIds = [
                ...new Set([...Object.keys(totalsCurrentYear), ...Object.keys(totalsPrevYear)])
            ];

            // --- 2. Calcular Cuotas de Mercado y Aplicar Filtro ---
            let data = allBrandIds.map(brandId => {
                const totalActual = totalsCurrentYear[brandId] || 0;
                const totalAnterior = totalsPrevYear[brandId] || 0;
                
                // Cálculo de cuotas (porcentaje)
                const shareCurrent = marketTotalCurrent > 0 ? (totalActual / marketTotalCurrent) * 100 : 0;
                const sharePrev = marketTotalPrev > 0 ? (totalAnterior / marketTotalPrev) * 100 : 0;
                
                // Diferencia de cuota (puntos porcentuales)
                const shareDifference = shareCurrent - sharePrev; 

                // --- Crecimiento cuota visual ---
                const diffColor = shareDifference > 0 ? 'green' : shareDifference < 0 ? 'red' : 'gray';
                const diffArrow = shareDifference > 0 ? '▲' : shareDifference < 0 ? '▼' : '—';
                const diffValueFormatted = shareDifference.toFixed(2); 
                const diffHtml = `<span style="color:${diffColor};font-weight:bold;">${diffArrow} ${diffValueFormatted}%</span>`;

                return {
                    brandId,
                    marca: SharedUtils.getBrandDescription2(brandId),
                    matriculaciones: totalActual,
                    cuotaActual: shareCurrent,
                    crecimientoCuota: shareDifference,
                    crecimientoCuotaHtml: diffHtml,
                    cuotaAnterior: sharePrev, 
                };
            }).filter(d => {
                // Criterio 1: Irrupción de mercado
                const isNewMarketEntry = (d.cuotaAnterior < MIN_PREV_SHARE_THRESHOLD && d.cuotaActual >= MIN_CURRENT_SHARE_THRESHOLD);
                
                // Criterio 2: Crecimiento explosivo (ganancia >= 1.0 p.p.)
                const hasExplosiveGrowth = (d.crecimientoCuota >= MIN_SHARE_GAIN_THRESHOLD);
                
                // Retornar solo si cumple AL MENOS UN criterio
                return isNewMarketEntry || hasExplosiveGrowth;
            });

            // --- 3. Manejo de resultados y ordenación inicial ---
            // Si no hay resultados, devolvemos una configuración vacía y un mensaje de advertencia
            if (data.length === 0) {
                console.warn("groupDataEmergingBrands: No se encontraron marcas emergentes con los criterios de filtro.");
                return { columns: [], data: [], pagination: true, sort: true, search: true, language: { /* ... */ } };
            }
            
            // Ordenar por defecto por 'Crecimiento cuota' (descendente)
            data.sort((a, b) => b.crecimientoCuota - a.crecimientoCuota);

            // --- 4. Definición de Columnas para Grid.js ---
            const columns = [
                { id: 'marca', name: 'Marca' },                   // Índice 0
                { id: 'matriculaciones', name: 'Matriculaciones ' + currentYear, sort: true }, // Índice 1
                { id: 'cuotaActual', name: 'Cuota ' + currentYear, sort: true, formatter: cell => `${cell.toFixed(2)}%` }, // Índice 2
                {
                    id: 'crecimientoCuota',
                    name: 'Crecimiento cuota',
                    sort: true, 
                    formatter: (cell, row) => {
                        // *** ACCESO POR ÍNDICE CORREGIDO Y SEGURO (Índice 4) ***
                        // row.cells es un array que contiene la data en el orden de 'columns'
                        const htmlData = row.cells[4] ? row.cells[4].data : null; 
                        
                        // Retorna el HTML si existe, o el valor formateado si falla
                        return htmlData ? gridjs.html(htmlData) : cell.toFixed(2) + '%'; 
                    }
                },
                // Columna auxiliar OCULTA (Índice 4) para el HTML de las flechas.
                { id: 'crecimientoCuotaHtml', name: '', hidden: true } 
            ];

            // --- 5. Mapeo de datos para Grid.js (Incluye ambos campos para el sorting y el formatter) ---
            const gridData = data.map(d => ({
                marca: d.marca,
                matriculaciones: d.matriculaciones,
                cuotaActual: d.cuotaActual,
                crecimientoCuota: d.crecimientoCuota,
                crecimientoCuotaHtml: d.crecimientoCuotaHtml 
            }));

            // --- 6. Devolver configuración completa para Grid.js ---
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