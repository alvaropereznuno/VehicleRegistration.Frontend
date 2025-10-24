import DICT from '../configurations/dict.js';
import { getIndexedData, setIndexedData } from '../utils/indexedUtils.js';
import VehiclesService from '../services/vehiclesService.js';

const dataForge = window.dataForge;

const DataUtils = {
    data: {
        brandList: [],
        modelList: [],

        original: null,
        filtered: null
    },
    brands: {
        load: async function (force = false) {
            try {
                let data = await getIndexedData('brandList');

                if (force || data == null) {
                    data = await VehiclesService.getBrands();
                    setIndexedData('brandList', data);
                }
                
                DataUtils.data.brandList = data;
            } catch (error) {
                console.error("Error fetching brands:", error);
                return [];
            }
        }
    },
    models: {
        load: async function (force = false) {
            try {
                let data = await getIndexedData('modelList');

                if (force || data == null) {
                    data = await VehiclesService.getModels();
                    setIndexedData('modelList', data);
                }
                
                DataUtils.data.modelList = data;
            } catch (error) {
                console.error("Error fetching models:", error);
                return [];
            }
        }
    },
    registrations: {
        load: async function (registrationDateFrom, registrationDateTo = null, force = false) {
            try {
                let data = await getIndexedData('registrationListC');

                if (force || data == null) {
                    data = await VehiclesService.getRegistrationsList(registrationDateFrom);
                    setIndexedData('registrationListC', data);
                }
                
                DataUtils.registrations.createDataFrame(data);
            } catch (error) {
                console.error("Error fetching registrationsList:", error);
                return [];
            }
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

            DataUtils.data.original = dataFrame;
            return dataFrame;
        },
        filter: function (dataFilter) {
            if (!DataUtils.data.original || DataUtils.data.original.length == 0){
                console.error("Se debe de inicializar el DataFrame.");
                return null;
            }
            
            let filteredFrame = DataUtils.data.original;
    
            // Filtro de fecha Desde
            if (dataFilter && dataFilter.dateFrom) {
                const dateFromMs = dataFilter.dateFrom.getTime() / 1000;
                filteredFrame = filteredFrame.where(row => row.DT >= dateFromMs);
            }

            // Filtro de fecha Hasta
            if (dataFilter && dataFilter.dateTo) {
                const dateToMs = dataFilter.dateTo.getTime() / 1000;
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

            DataUtils.data.filtered = filteredFrame;
            return filteredFrame;
        },
        group: function (byColumns, orderBy, desc = false, top) {
            const dataToGroup = DataUtils.data.filtered || DataUtils.data.original;

            if (!dataToGroup) {
                console.error("No hay datos disponibles para agrupar. Inicialice el DataFrame.");
                return null;
            }

            if (!byColumns || byColumns.length === 0) {
                console.error("Se debe especificar al menos una columna para agrupar.");
                return dataToGroup;
            }

            // 1. Agrupación.
            const groupedData = dataToGroup.groupBy(row => {
                const keyParts = [];
                for (const col of byColumns) {
                    keyParts.push(row[col]);
                }
                return keyParts.join('|');
            });

            // 2. Agregación.
            let aggregatedData = groupedData
                .select(group => {
                    const firstRow = group.first(); 
                    const result = {};

                    for (const col of byColumns) {
                        result[col] = firstRow[col];
                    }

                    result['C'] = group.getSeries('C').sum(); 

                    return result;
                });

            // 3. Ordenación.
            if (orderBy) {
                const columnToSort = Array.isArray(orderBy) ? orderBy[0] : orderBy;
                
                if (typeof columnToSort === 'string') {
                    const sortDirection = desc ? 'DESC' : 'ASC';
                    if (sortDirection === 'DESC') {
                        aggregatedData = aggregatedData.orderBy(row => row[columnToSort] * -1, 'ASC');
                    } else {
                        aggregatedData = aggregatedData.orderBy(row => row[columnToSort], 'ASC');
                    }
                }
            }

            // 4. Top Elementos.
            if (top && typeof top === 'number' && top > 0) {
                aggregatedData = aggregatedData.take(top);
            }
        
            return DataUtils.registrations.toData(aggregatedData);
        },
        toData: function (groupedFrame) {
            const groupedArray = groupedFrame.toArray();
            const descriptorMap = {
                'B': DataUtils.descriptions.brandDs,
                'M': DataUtils.descriptions.modelDs,
                'CO': DataUtils.descriptions.communityDs,
                'MT': DataUtils.descriptions.motorTypeDs,
                'ST': DataUtils.descriptions.serviceTypeDs
            };

            const columnsToReplace = Object.keys(descriptorMap);

            const groupedData = groupedArray.map(item => {
                let newItem = { ...item };

                for (const column of columnsToReplace) {
                    if (newItem.hasOwnProperty(column)) {
                        const id = newItem[column];
                        const descriptorFunction = descriptorMap[column];
                        
                        newItem[column] = descriptorFunction(id);
                    }
                }
                
                return newItem;
            });

            return groupedData;
        }
    },
    descriptions: {
        modelDs: function (modelId, withBrand = true) {
            const model = DataUtils.data.modelList.find(model => model.id == modelId);

            if (model != null && withBrand){
                const brandds = DataUtils.data.brandList.find(brand => brand.id == model.brandId).description;
                return model.description.toLowerCase().includes(brandds.toLowerCase()) ? model.description : `${brandds} ${model.description}`;
            }

            return model ? model.description : 'OTROS';
        },
        brandDs: function (brandId) {
            const brand = DataUtils.data.brandList.find(brand => brand.id == brandId);
            return brand ? brand.description : 'OTROS';
        },
        communityDs: function (communityId) {
            const community = DICT.COMMUNITIES.find(community => community.id == communityId);
            return community ? community.description : null;
        },
        motorTypeDs: function (motorTypeId) {
            const motorType = DICT.MOTOR_TYPES.find(motorType => motorType.id == motorTypeId);
            return motorType ? motorType.description : null;
        },
        serviceTypeDs: function (serviceTypeId) {
            const serviceType = DICT.SERVICE_TYPES.find(serviceType => serviceType.id == serviceTypeId);
            return serviceType ? serviceType.description : null;
        }
    }
}

export default DataUtils;