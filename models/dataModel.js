class DataModel {
    constructor(date, brandId, brandName, modelId, modelName, provinceId, provinceName, type, typeName, count){
        this.date = date;
        this.brandId = brandId;
        this.brandName = brandName;
        this.modelId = modelId;
        this.modelName = modelName;
        this.provinceId = provinceId;
        this.provinceName = provinceName;
        this.type = type;
        this.typeName = typeName;
        this.count = count;
    }
}

export default DataModel;