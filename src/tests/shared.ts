import { BleMessage } from "~/app/shared/models/ble-message.model";
import { BleDevice } from "~/app/shared/models/ble-device.model";
import { HexHelper } from "~/app/shared/helpers/hex-helper";

describe("Shared suite ", () => {
    let bleMessage: BleMessage;
    let bleDevice: BleDevice;

    beforeEach(() => {
        bleMessage = new BleMessage(null);
        bleDevice = new BleDevice(null, null, null);
    });

    it("Should initialize all the properties of the Bluetooth Message object", () => {
        // * GIVEN - A  dummy Message data
        const exampleMessage = {
            peripheralUUID: "11",
            serviceUUID: "ffe5",
            characteristicUUID: "ffe9",
            value: "value",
        };
        // * WHEN - A Message is initialized
        bleMessage = new BleMessage(exampleMessage);

        // * THEN - The properties should match
        expect(bleMessage.characteristicUUID).toEqual(
            exampleMessage.characteristicUUID
        );
        expect(bleMessage.peripheralUUID).toEqual(
            exampleMessage.peripheralUUID
        );
        expect(bleMessage.serviceUUID).toEqual(exampleMessage.serviceUUID);
        expect(bleMessage.value).toEqual(exampleMessage.value);
    });

    it("Should initialize all the properties of the Bluetooth Device object", () => {
        // * GIVEN - A  dummy device data
        const exampleDevice = {
            UUID: "1222",
            name: "testName",
            state: "static",
        };
        // * WHEN - A device  is initialized
        bleDevice = new BleDevice(
            exampleDevice.UUID,
            exampleDevice.name,
            exampleDevice.state
        );

        // * THEN - The properties should match
        expect(bleDevice.UUID).toEqual(exampleDevice.UUID);
        expect(bleDevice.name).toEqual(exampleDevice.name);
        expect(bleDevice.state).toEqual(exampleDevice.state);
    });

    it("Should return the string value from hex", () => {
        // * GIVEN - The 'test' value
        const hexVal = "74657374";
        // * WHEN - hex2A  is called
        const str = HexHelper.hex2a(hexVal);

        // * THEN - The properties should match
        expect(str).toEqual("test");
    });

    it("Should return the hex value from string", () => {
        // * GIVEN - The '74657374' value
        const strVal = "test";
        // * WHEN - a2Hex  is called
        const hex = HexHelper.a2hex(strVal);

        // * THEN - The properties should match
        expect(hex).toEqual("74657374");
    });
});
