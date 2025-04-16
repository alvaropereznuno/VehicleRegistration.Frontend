// registrationModel.js

class RegistrationModel {
    constructor(modelId, motorTypeId, vehicleTypeId, provinceId, registrationDate, count){
        this.modelId = modelId;
        this.motorTypeId = motorTypeId;
        this.vehicleTypeId = vehicleTypeId;
        this.provinceId = provinceId;
        this.registrationDate = registrationDate;
        this.count = count;
    }
}

export default RegistrationModel;