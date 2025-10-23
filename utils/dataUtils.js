const dataForge = window.dataForge;

const DataUtils = {
    data: {
        original: null,
        filtered: null
    },
    createDataFrame: function (registrationList) {
        if (!dataForge) {
            console.error("Data-Forge no está cargado.");
            return null;
        }

        const dataFrame = new dataForge.DataFrame({
            columnNames: registrationList.columnNames,
            columns: registrationList.parameters
        });

        this.data.original = dataFrame;
        return dataFrame;
    },
    filterData: function (dataFilter) {
        if (!DataUtils.data.original || DataUtils.data.original.length == 0){
            console.error("Se debe de inicializar el DataFrame.");
            return null;
        }
        
        let filteredFrame = this.data.original;
   
        // Filtro de fecha Desde
        if (dataFilter && dataFilter.dateFrom) {
            const dateFromMs = dataFilter.dateFrom.getTime() / 1000;
            filteredFrame = filteredFrame.where(row => row.DT >= dateFromMs);
        }

        // Filtro de fecha Hasta
        if (dataFilter && dataFilter.dateTo) {
            const dateToMs = dataFilter.dateFrom.getTime() / 1000;
            filteredFrame = filteredFrame.where(row => row.DT <= dateToMs);
        }

        // Filto por Marca
        if (dataFilter && dataFilter.brandIdList && dataFilter.brandIdList.length > 0) {
            const listSet = new Set(dataFilter.brandIdList);
            filteredFrame = filteredFrame.where(row => listSet.has(row.B));
        }

        // Filto por Modelo
        if (dataFilter && dataFilter.modelIdList && dataFilter.modelIdList.length > 0) {
            const listSet = new Set(dataFilter.modelIdList);
            filteredFrame = filteredFrame.where(row => listSet.has(row.M));
            
        }
        
        // Filto por Tipo de motor
        if (dataFilter && dataFilter.motorTypeIdList && dataFilter.motorTypeIdList.length > 0) {
            const listSet = new Set(dataFilter.motorTypeIdList);
            filteredFrame = filteredFrame.where(row => listSet.has(row.MT));
        }

        // Filto por Tipo de servicio
        if (dataFilter && dataFilter.serviceTypeIdList && dataFilter.serviceTypeIdList.length > 0) {
            const listSet = new Set(dataFilter.serviceTypeIdList);
            filteredFrame = filteredFrame.where(row => listSet.has(row.ST));
        }

        // Filto por CCAA
        if (dataFilter && dataFilter.communityIdList && dataFilter.communityIdList.length > 0) {
            const listSet = new Set(dataFilter.communityIdList);
            filteredFrame = filteredFrame.where(row => listSet.has(row.CO));
        }

        this.data.filtered = filteredFrame;
        return filteredFrame;
    },
    groupData: function (byColumns) {
        const dataToGroup = this.data.filtered || this.data.original;

        if (!dataToGroup) {
            console.error("No hay datos disponibles para agrupar. Inicialice el DataFrame.");
            return null;
        }

        if (!byColumns || byColumns.length === 0) {
             console.error("Se debe especificar al menos una columna para agrupar.");
             return dataToGroup;
        }

        const groupedData = dataToGroup.groupBy(row => {
            const keyParts = [];
            for (const col of byColumns) {
                keyParts.push(row[col]);
            }
            return keyParts.join('|');
        });

        const aggregatedData = groupedData
        .select(group => {
            const firstRow = group.first(); 
            const result = {};

            for (const col of byColumns) {
                result[col] = firstRow[col];
            }

            result['C'] = group.getSeries('C').sum(); 

            return result;
        });
    
        return aggregatedData;
    }
}

export default DataUtils;