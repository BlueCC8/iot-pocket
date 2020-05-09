export class BleMessage {
    peripheralUUID = "";
    serviceUUID = "";
    characteristicUUID = "";
    value = "";

    constructor(jsonObj) {
        if (jsonObj) {
            Object.assign(this, {
                peripheralUUID: jsonObj.peripheralUUID,
                serviceUUID: jsonObj.serviceUUID,
                characteristicUUID: jsonObj.characteristicUUID,
                value: jsonObj.value
            });
        }
    }
}
