//filterModels
export async function filterModels(modelList, brandId) {
    const result = modelList.filter(m => m.brandId == brandId);
    return result;
}

//filterData
export async function filterData(dataList, registrationDateFrom, registrationDateTo, brandId, modelId, provinceId, type) {
    // Filtrar los datos y devolver un nuevo array
    const filteredDataList = dataList.filter(data => {

        // Validar cada condición, ignorando filtros vacíos
        const matchDateFrom = registrationDateFrom && registrationDateFrom !== '' ? new Date(data.date).setHours(0, 0, 0, 0) >= new Date(registrationDateFrom).setHours(0, 0, 0, 0) : true;
        const matchDateTo = registrationDateTo && registrationDateTo !== '' ? new Date(data.date).setHours(0, 0, 0, 0) <= new Date(registrationDateTo).setHours(0, 0, 0, 0) : true;
        const matchesBrand = brandId && brandId !== '' ? data.brandId == brandId : true;
        const matchesModel = modelId && modelId !== '' ? data.modelId == modelId : true;
        const matchesProvince = provinceId && provinceId !== '' ? data.provinceId == provinceId : true;
        const matchesType = type && type !== '' ? data.type == type : true;

        // Retornar true si todas las condiciones son válidas
        return matchDateFrom && matchDateTo && matchesBrand && matchesModel && matchesProvince && matchesType;
    });

    return filteredDataList; // Retornar el nuevo dataList con los resultados
}

