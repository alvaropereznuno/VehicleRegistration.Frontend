class ModelModel {
    constructor(id, name, brandId, relatedBrandId){
        this.id = id;
        this.name = name;
        this.brandId = relatedBrandId == 0 ? 0 : brandId;
    }
}

export default ModelModel;