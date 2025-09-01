// registrationModel.js
import SharedUtils from "../utils/sharedUtils.js"

class RegistrationModel {
    constructor(modelId, motorTypeId, serviceTypeId, provinceId, registrationDate, count){
        this.modelId = modelId;
        this.modelDs = SharedUtils.getBrandDescription(modelId);
        this.brandId = SharedUtils.getBrandId(modelId);
        this.brandDs = SharedUtils.getBrandDescription(modelId);
        this.motorTypeId = motorTypeId;
        this.motorTypeDs = SharedUtils.getMotorTypeDescription(motorTypeId);
        this.serviceTypeId = serviceTypeId;
        this.serviceTypeDs = SharedUtils.getServiceTypeDescription(serviceTypeId);
        this.provinceId = provinceId;
        this.provinceDs = SharedUtils.getProvinceDescription(provinceId);
        this.registrationDate = registrationDate;
        this.count = count;
    }
}

export default RegistrationModel;