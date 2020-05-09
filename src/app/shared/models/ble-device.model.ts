export class BleDevice {
    UUID = "";
    name = "";
    state = "";
    constructor(UUID, name, state) {
        Object.assign(this, {
            UUID,
            name,
            state
        });
    }
}
