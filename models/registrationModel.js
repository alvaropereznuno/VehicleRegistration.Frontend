// registrationModel.js
import SharedUtils from "../utils/sharedUtils.js"

class RegistrationModel {
    constructor(modelId, motorTypeId, serviceTypeId, provinceId, registrationDate, count){
        this.modelId = modelId;
        this.brandId = SharedUtils.getBrandId(modelId);
        this.motorTypeId = motorTypeId;
        this.serviceTypeId = serviceTypeId;
        this.provinceId = provinceId;
        this.registrationDate = registrationDate;
        this.count = count;
    }
}

export default RegistrationModel;